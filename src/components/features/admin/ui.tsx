import type { ReactNode } from 'react';

/**
 * The panel's small vocabulary of shapes.
 *
 * The public site is animation-led and styles itself inline from tokens; the
 * panel is a dense tool and uses Tailwind. Keeping its handful of primitives
 * here is what stops twenty pages inventing twenty slightly different cards.
 */

export function PageHeader({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-[#250200]">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#6b5a55]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function Card({
  title,
  description,
  children,
  footer,
}: {
  readonly title?: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border-2 border-[#250200] bg-white">
      {title ? (
        <div className="border-b border-black/10 px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#250200]">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[#6b5a55]">{description}</p> : null}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
      {footer ? <div className="border-t border-black/10 px-5 py-3">{footer}</div> : null}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  readonly label: string;
  readonly value: string | number;
  readonly hint?: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-[#250200] bg-white px-5 py-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">{label}</p>
      <p className="mt-1 text-3xl font-black tabular-nums text-[#250200]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#6b5a55]">{hint}</p> : null}
    </div>
  );
}

export function Empty({ children }: { readonly children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-black/20 px-4 py-8 text-center text-sm text-[#6b5a55]">
      {children}
    </p>
  );
}

export function Notice({
  tone = 'info',
  children,
}: {
  readonly tone?: 'info' | 'warn' | 'error';
  readonly children: ReactNode;
}) {
  const tones = {
    info: 'border-black/15 bg-[#f6f1ee] text-[#250200]',
    warn: 'border-[#fd7b33] bg-[#fff6ef] text-[#250200]',
    error: 'border-[#e92038] bg-[#fdeef0] text-[#250200]',
  } as const;

  return (
    <div className={`rounded-xl border-2 px-4 py-3 text-sm leading-relaxed ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function Badge({ children }: { readonly children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-black/20 bg-[#f6f1ee] px-2.5 py-0.5 text-xs font-bold text-[#250200]">
      {children}
    </span>
  );
}
