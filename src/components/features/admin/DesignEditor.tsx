'use client';

import { useMemo, useState, useTransition } from 'react';
import type { DesignToken, TokenGroup } from '@/config/designTokens';
import { contrastRatio, verdict } from '@/lib/design/contrast';
import { Badge, Notice } from '@/components/features/admin/ui';
import { revertDesignAction, saveDesignAction } from '@/app/admin/actions';

/**
 * The design system, editable.
 *
 * Two things this does that a plain list of colour inputs would not. It shows
 * the contrast of the pairings the site actually uses, so a colour that fails
 * WCAG says so here rather than in an audit months later. And it previews on
 * the real components — a button, a card, a heading — because a swatch tells
 * you very little about whether a red works as a button.
 */

/** The pairings the site genuinely puts together, checked on every change. */
const CONTRAST_PAIRS: readonly {
  readonly label: string;
  readonly fg: string;
  readonly bg: string;
  readonly note: string;
}[] = [
  { label: 'Button text', fg: 'color.white', bg: 'color.brand', note: 'Every call to action' },
  { label: 'Body text', fg: 'color.ink', bg: 'color.paper', note: 'Most of the page' },
  { label: 'Body on white', fg: 'color.ink', bg: 'color.white', note: 'Cards and panels' },
  { label: 'Muted text', fg: 'color.muted', bg: 'color.paperAlt', note: 'Captions and labels' },
  { label: 'Text on pink', fg: 'color.ink', bg: 'color.accentPink', note: 'Card grounds' },
  { label: 'Text on lime', fg: 'color.ink', bg: 'color.accentLime', note: 'Card grounds' },
  { label: 'Text on orange', fg: 'color.ink', bg: 'color.accentOrange', note: 'Card grounds' },
];

export function DesignEditor({
  groups,
  effective,
  overriddenKeys,
}: {
  readonly groups: readonly TokenGroup[];
  readonly effective: Readonly<Record<string, string>>;
  readonly overriddenKeys: readonly string[];
}) {
  const [values, setValues] = useState<Record<string, string>>({ ...effective });
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const changed = useMemo(
    () => Object.keys(values).filter((key) => values[key] !== effective[key]),
    [values, effective],
  );

  function save(): void {
    setResult(null);
    startTransition(async () => {
      const entries = changed.map((key) => ({ key, value: values[key] as string }));
      setResult(await saveDesignAction(JSON.stringify(entries)));
    });
  }

  function resetAll(): void {
    setResult(null);
    startTransition(async () => {
      const outcome = await revertDesignAction(JSON.stringify(overriddenKeys));
      setResult(outcome);
    });
  }

  return (
    <div className="space-y-6">
      {result ? <Notice tone={result.ok ? 'info' : 'error'}>{result.message}</Notice> : null}

      <Preview values={values} />
      <ContrastPanel values={values} />

      {groups.map((group) => (
        <section key={group.id} className="rounded-2xl border-2 border-[#250200] bg-white">
          <div className="border-b border-black/10 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide">{group.title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-[#6b5a55]">{group.description}</p>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {group.tokens.map((token) => (
              <TokenField
                key={token.id}
                token={token}
                value={values[token.id] ?? token.fallback}
                overridden={overriddenKeys.includes(token.id)}
                onChange={(next) => setValues((was) => ({ ...was, [token.id]: next }))}
                onReset={() => setValues((was) => ({ ...was, [token.id]: token.fallback }))}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 -mx-5 border-t-2 border-[#250200] bg-white px-5 py-3 sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#6b5a55]">
            {changed.length === 0
              ? 'No unsaved changes.'
              : `${changed.length} ${changed.length === 1 ? 'token' : 'tokens'} changed.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {overriddenKeys.length > 0 ? (
              <button
                type="button"
                onClick={resetAll}
                disabled={pending}
                className="min-h-11 rounded-full border-2 border-[#250200] px-4 text-sm font-bold disabled:opacity-60"
              >
                Reset all to repository
              </button>
            ) : null}
            <button
              type="button"
              onClick={save}
              disabled={pending || changed.length === 0}
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

function TokenField({
  token,
  value,
  overridden,
  onChange,
  onReset,
}: {
  readonly token: DesignToken;
  readonly value: string;
  readonly overridden: boolean;
  readonly onChange: (value: string) => void;
  readonly onReset: () => void;
}) {
  const isColour = token.kind === 'colour';
  const pickable = isColour && /^#[0-9a-fA-F]{6}$/.test(value);

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">
          {token.label}
        </span>
        {overridden ? <Badge>Edited</Badge> : null}
      </div>

      <div className="flex items-center gap-2">
        {isColour ? (
          <input
            type="color"
            aria-label={`${token.label} colour picker`}
            value={pickable ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="size-11 shrink-0 cursor-pointer rounded-lg border-2 border-[#250200] bg-white p-1"
          />
        ) : null}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={token.label}
          className="min-w-0 flex-1 rounded-xl border-2 border-[#250200] bg-white px-3 py-2.5 font-mono text-xs outline-none focus:ring-2 focus:ring-[#e92038]"
        />
        <button
          type="button"
          onClick={onReset}
          title={`Reset to ${token.fallback}`}
          className="size-11 shrink-0 rounded-lg border-2 border-black/15 text-xs font-bold"
        >
          ↺
        </button>
      </div>

      {token.note ? <p className="mt-1 text-[11px] text-[#6b5a55]">{token.note}</p> : null}
    </div>
  );
}

/** The pairings, measured. */
function ContrastPanel({ values }: { readonly values: Record<string, string> }) {
  const rows = CONTRAST_PAIRS.map((pair) => {
    const fg = values[pair.fg] ?? '';
    const bg = values[pair.bg] ?? '';
    const ratio = contrastRatio(fg, bg);
    return { ...pair, fg, bg, ratio };
  });

  const failing = rows.filter((row) => row.ratio !== null && row.ratio < 4.5);

  return (
    <section className="rounded-2xl border-2 border-[#250200] bg-white">
      <div className="border-b border-black/10 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wide">Contrast</h2>
        <p className="mt-1 text-sm text-[#6b5a55]">
          WCAG AA asks for 4.5:1 on body text and 3:1 on large text. Measured on the pairings the
          site actually uses.
        </p>
      </div>

      <div className="p-5">
        {failing.length > 0 ? (
          <div className="mb-4">
            <Notice tone="warn">
              {failing.length === 1
                ? `${failing[0]?.label} is below AA.`
                : `${failing.length} pairings are below AA.`}{' '}
              Large or bold text can sit at 3:1; body text cannot.
            </Notice>
          </div>
        ) : null}

        <ul className="grid gap-2 sm:grid-cols-2">
          {rows.map((row) => {
            const label = row.ratio === null ? '—' : `${row.ratio.toFixed(2)}:1`;
            const grade = row.ratio === null ? 'Unknown' : verdict(row.ratio);
            const bad = row.ratio !== null && row.ratio < 4.5;

            return (
              <li
                key={row.label}
                className="flex items-center gap-3 rounded-xl border border-black/10 px-3 py-2"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-lg border border-black/20 text-xs font-bold"
                  style={{ background: row.bg, color: row.fg }}
                >
                  Aa
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{row.label}</span>
                  <span className="block text-[11px] text-[#6b5a55]">{row.note}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-xs tabular-nums">{label}</span>
                  <span className={`block text-[11px] font-bold ${bad ? 'text-[#c81a2f]' : 'text-[#2dc05e]'}`}>
                    {grade}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** The tokens on the shapes the site actually makes out of them. */
function Preview({ values }: { readonly values: Record<string, string> }) {
  const v = (id: string): string => values[id] ?? '';

  return (
    <section className="rounded-2xl border-2 border-[#250200] bg-white">
      <div className="border-b border-black/10 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wide">Preview</h2>
        <p className="mt-1 text-sm text-[#6b5a55]">Unsaved changes included.</p>
      </div>

      <div
        className="p-5"
        style={{ background: v('color.paperAlt'), fontFamily: v('font.body') }}
      >
        <div
          className="rounded-2xl p-5"
          style={{
            background: v('color.white'),
            border: `${v('shape.keylineWidth')} solid ${v('color.ink')}`,
            borderRadius: v('radius.card'),
            boxShadow: `${v('shape.shadowOffset')} ${v('shape.shadowOffset')} 0 ${v('color.ink')}`,
          }}
        >
          <p
            style={{
              fontFamily: v('font.display'),
              fontWeight: Number(v('weight.black')) || 900,
              fontSize: 30,
              lineHeight: 1.05,
              color: v('color.ink'),
              margin: 0,
            }}
          >
            Skip the guessing.{' '}
            <span style={{ fontFamily: v('font.accent'), fontStyle: 'italic', fontWeight: 500 }}>
              Build a brand.
            </span>
          </p>

          <p
            style={{
              marginTop: 12,
              marginBottom: 18,
              color: v('color.muted'),
              fontWeight: Number(v('weight.light')) || 300,
              fontSize: 15,
            }}
          >
            We turn your identity into a brand people remember.
          </p>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: v('color.brand'),
              color: v('color.white'),
              border: `${v('shape.keylineWidth')} solid ${v('color.ink')}`,
              borderRadius: 999,
              boxShadow: `4px 4px 0 ${v('color.ink')}`,
              fontFamily: v('font.sans'),
              fontWeight: Number(v('weight.bold')) || 700,
              padding: '10px 20px',
              fontSize: 14,
            }}
          >
            Work with us
          </span>

          <div className="mt-5 flex flex-wrap gap-2">
            {(['color.accentPink', 'color.accentLime', 'color.accentYellow', 'color.accentOrange'] as const).map(
              (id) => (
                <span
                  key={id}
                  className="grid h-14 w-24 place-items-center text-xs font-bold"
                  style={{
                    background: v(id),
                    color: v('color.ink'),
                    border: `2px solid ${v('color.ink')}`,
                    borderRadius: v('radius.chip'),
                    fontFamily: v('font.sans'),
                  }}
                >
                  Card
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
