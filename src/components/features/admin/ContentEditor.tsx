'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  FieldEditor,
  appendAt,
  moveAt,
  removeAt,
  setAtPath,
} from '@/components/features/admin/FieldEditor';
import { Notice } from '@/components/features/admin/ui';
import { revertContentAction, saveContentAction } from '@/app/admin/actions';

/**
 * One content group, editable.
 *
 * Holds a working copy and only writes on save, so a half-finished edit never
 * reaches the site. The save bar stays out of the way until something is
 * actually different — comparing serialised values rather than tracking dirty
 * flags per field, which is cheap at these sizes and cannot get out of step.
 */
export function ContentEditor({
  contentKey,
  initial,
  original,
  isOverridden,
}: {
  readonly contentKey: string;
  readonly initial: unknown;
  readonly original: unknown;
  readonly isOverridden: boolean;
}) {
  const [value, setValue] = useState<unknown>(initial);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(initial),
    [value, initial],
  );
  const differsFromRepo = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(original),
    [value, original],
  );

  function save(): void {
    setResult(null);
    startTransition(async () => {
      setResult(await saveContentAction(contentKey, JSON.stringify(value)));
    });
  }

  function revert(): void {
    setResult(null);
    startTransition(async () => {
      const outcome = await revertContentAction(contentKey);
      setResult(outcome);
      if (outcome.ok) setValue(original);
    });
  }

  return (
    <div className="space-y-5">
      {result ? <Notice tone={result.ok ? 'info' : 'error'}>{result.message}</Notice> : null}

      {isOverridden && !dirty ? (
        <Notice>
          This section has been edited. The site is showing what is below, not what is in the
          repository.
        </Notice>
      ) : null}

      <div className="rounded-2xl border-2 border-[#250200] bg-white p-5">
        <FieldEditor
          value={value}
          path={[]}
          onChange={(path, next) => setValue((was: unknown) => setAtPath(was, path, next))}
          onRemove={(path, index) => setValue((was: unknown) => removeAt(was, path, index))}
          onMove={(path, index, delta) => setValue((was: unknown) => moveAt(was, path, index, delta))}
          onAppend={(path) => setValue((was: unknown) => appendAt(was, path))}
        />
      </div>

      {/* Sticky so the save is reachable from the bottom of a long section. */}
      <div className="sticky bottom-0 -mx-5 border-t-2 border-[#250200] bg-white px-5 py-3 sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#6b5a55]">
            {dirty ? 'Unsaved changes.' : differsFromRepo ? 'Saved, and different from the repository.' : 'Matching the repository.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {isOverridden ? (
              <button
                type="button"
                onClick={revert}
                disabled={pending}
                className="min-h-11 rounded-full border-2 border-[#250200] px-4 text-sm font-bold disabled:opacity-60"
              >
                Reset to repository
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setValue(initial)}
              disabled={pending || !dirty}
              className="min-h-11 rounded-full border-2 border-black/20 px-4 text-sm font-bold disabled:opacity-40"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending || !dirty}
              className="min-h-11 rounded-full border-2 border-[#250200] bg-[#e92038] px-5 text-sm font-bold text-white shadow-[4px_4px_0_#250200] transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#250200] disabled:opacity-50 disabled:shadow-none"
            >
              {pending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
