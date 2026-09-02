'use client';

import { useState } from 'react';

/**
 * An editor for any shape the content file holds.
 *
 * Written once, recursively, rather than as one hand-built form per section.
 * There are twenty-odd content groups and they nest several levels deep; a
 * bespoke form for each would be thousands of lines that fall out of step with
 * `content/site.ts` the first time a field is added. This walks the value it
 * is given, so a new field in the content file appears here on the next
 * deploy with no work at all.
 *
 * The trade is that it knows shapes, not meanings: it can tell a paragraph
 * from a heading by length, but it cannot know that `slug` should be
 * lowercase. That belongs in the content file's own types, which still hold.
 */

type Json = unknown;

/** A copy of `root` with `path` set to `value`. Never mutates. */
export function setAtPath(root: Json, path: readonly (string | number)[], value: Json): Json {
  if (path.length === 0) return value;

  const [head, ...rest] = path;

  if (typeof head === 'number') {
    const list = Array.isArray(root) ? [...root] : [];
    list[head] = setAtPath(list[head], rest, value);
    return list;
  }

  const object = typeof root === 'object' && root !== null ? { ...(root as object) } : {};
  const record = object as Record<string, Json>;
  record[head as string] = setAtPath(record[head as string], rest, value);
  return record;
}

/** Removes index `at` from the array at `path`. */
export function removeAt(root: Json, path: readonly (string | number)[], at: number): Json {
  const list = valueAtPath(root, path);
  if (!Array.isArray(list)) return root;
  return setAtPath(root, path, list.filter((_item, index) => index !== at));
}

/** Moves index `from` by `delta`, clamped. */
export function moveAt(
  root: Json,
  path: readonly (string | number)[],
  from: number,
  delta: number,
): Json {
  const list = valueAtPath(root, path);
  if (!Array.isArray(list)) return root;

  const to = from + delta;
  if (to < 0 || to >= list.length) return root;

  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return setAtPath(root, path, next);
}

/** Appends an empty item shaped like the ones already there. */
export function appendAt(root: Json, path: readonly (string | number)[]): Json {
  const list = valueAtPath(root, path);
  if (!Array.isArray(list)) return root;
  return setAtPath(root, path, [...list, blankLike(list[0])]);
}

function valueAtPath(root: Json, path: readonly (string | number)[]): Json {
  let cursor: Json = root;
  for (const step of path) {
    if (cursor === null || typeof cursor !== 'object') return undefined;
    cursor = (cursor as Record<string | number, Json>)[step];
  }
  return cursor;
}

/**
 * An empty value with the same shape as `sample`.
 *
 * Adding to a list of objects should give the same fields the others have,
 * blank — not an empty object the editor cannot render.
 */
function blankLike(sample: Json): Json {
  if (typeof sample === 'string') return '';
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') {
    return Object.fromEntries(
      Object.entries(sample as Record<string, Json>).map(([key, value]) => [key, blankLike(value)]),
    );
  }
  return '';
}

/** `authorRole` -> `Author role`. */
function humanise(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
}

const inputClass =
  'w-full rounded-xl border-2 border-[#250200] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e92038]';

export interface FieldEditorProps {
  readonly value: Json;
  readonly path: readonly (string | number)[];
  readonly label?: string | undefined;
  readonly onChange: (path: readonly (string | number)[], value: Json) => void;
  readonly onRemove?: ((path: readonly (string | number)[], index: number) => void) | undefined;
  readonly onMove?: ((path: readonly (string | number)[], index: number, delta: number) => void) | undefined;
  readonly onAppend?: ((path: readonly (string | number)[]) => void) | undefined;
  readonly depth?: number | undefined;
}

export function FieldEditor(props: FieldEditorProps) {
  const { value, path, label, onChange, depth = 0 } = props;

  if (typeof value === 'boolean') {
    return (
      <label className="flex min-h-11 items-center gap-2.5">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(path, e.target.checked)}
          className="size-5 accent-[#e92038]"
        />
        <span className="text-sm font-medium">{label ?? 'Enabled'}</span>
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <Labelled label={label}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(path, Number(e.target.value))}
          className={inputClass}
        />
      </Labelled>
    );
  }

  if (typeof value === 'string') {
    // Long copy gets room to breathe; a label or a slug does not need it.
    const multiline = value.length > 90 || value.includes('\n');
    return (
      <Labelled label={label} hint={multiline ? `${value.trim().split(/\s+/).length} words` : undefined}>
        {multiline ? (
          <textarea
            value={value}
            rows={Math.min(14, Math.max(3, Math.ceil(value.length / 70)))}
            onChange={(e) => onChange(path, e.target.value)}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
            className={inputClass}
          />
        )}
      </Labelled>
    );
  }

  if (Array.isArray(value)) {
    return <ListEditor {...props} items={value} />;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, Json>);
    return (
      <div className={depth === 0 ? 'space-y-5' : 'space-y-4'}>
        {label && depth > 0 ? (
          <p className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">{label}</p>
        ) : null}
        <div className={depth > 0 ? 'space-y-4 border-l-2 border-black/10 pl-4' : 'space-y-5'}>
          {entries.map(([key, child]) => (
            <FieldEditor
              key={key}
              {...props}
              value={child}
              path={[...path, key]}
              label={humanise(key)}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  // null or undefined: nothing to edit, and inventing a type would guess wrong.
  return (
    <Labelled label={label}>
      <p className="text-sm text-[#6b5a55]">Not set.</p>
    </Labelled>
  );
}

function ListEditor(props: FieldEditorProps & { readonly items: readonly Json[] }) {
  const { items, path, label, onRemove, onMove, onAppend, depth = 0 } = props;
  const simple = items.every((item) => typeof item !== 'object' || item === null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">
          {label} <span className="font-medium normal-case">({items.length})</span>
        </p>
        {onAppend ? (
          <button
            type="button"
            onClick={() => onAppend(path)}
            className="min-h-11 rounded-full border-2 border-[#250200] px-3 text-xs font-bold hover:bg-[#f6f1ee]"
          >
            Add
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/20 px-3 py-4 text-sm text-[#6b5a55]">
          Empty.
        </p>
      ) : null}

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className={simple ? '' : 'rounded-xl border-2 border-black/15 bg-[#f6f1ee] p-4'}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                {simple ? (
                  <FieldEditor {...props} value={item} path={[...path, index]} label={undefined} depth={depth + 1} />
                ) : (
                  <Collapsible title={summarise(item, index)}>
                    <FieldEditor {...props} value={item} path={[...path, index]} label={undefined} depth={depth + 1} />
                  </Collapsible>
                )}
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                {onMove ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onMove(path, index, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${index + 1} up`}
                      className="size-11 rounded-lg border-2 border-black/15 text-xs font-bold disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(path, index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={`Move ${index + 1} down`}
                      className="size-11 rounded-lg border-2 border-black/15 text-xs font-bold disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </>
                ) : null}
                {onRemove ? (
                  <button
                    type="button"
                    onClick={() => onRemove(path, index)}
                    aria-label={`Remove ${index + 1}`}
                    className="size-11 rounded-lg border-2 border-black/15 text-xs font-bold text-[#c81a2f]"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The first readable string in an item, so a collapsed card says what it is. */
function summarise(item: Json, index: number): string {
  if (item && typeof item === 'object') {
    for (const key of ['title', 'name', 'question', 'label', 'heading', 'client', 'slug', 'platform']) {
      const value = (item as Record<string, Json>)[key];
      if (typeof value === 'string' && value.trim()) return value.slice(0, 80);
    }
  }
  return `Item ${index + 1}`;
}

function Collapsible({ title, children }: { readonly title: string; readonly children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center gap-2 text-left text-sm font-bold"
      >
        <span aria-hidden="true" className="text-[#6b5a55]">{open ? '▾' : '▸'}</span>
        <span className="min-w-0 flex-1 truncate">{title}</span>
      </button>
      {open ? <div className="mt-3 space-y-4">{children}</div> : null}
    </div>
  );
}

function Labelled({
  label,
  hint,
  children,
}: {
  readonly label?: string | undefined;
  readonly hint?: string | undefined;
  readonly children: React.ReactNode;
}) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1 flex items-baseline justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">{label}</span>
          {hint ? <span className="text-[11px] text-[#6b5a55]">{hint}</span> : null}
        </span>
      ) : null}
      {children}
    </label>
  );
}
