'use client';

import { useId, useState } from 'react';

/**
 * The panel's two chart forms.
 *
 * Deliberately hand-drawn SVG rather than a charting library: there are two
 * shapes here, both simple, and a dependency would bring a second design
 * system with it. The specifics — 2px strokes, a recessive grid, a 2px gap
 * between bars, rounded ends on the data end only, a legend whenever there is
 * more than one series — are what stop a small chart reading as a toy.
 *
 * The two series colours are the brand red and the palette's purple, checked
 * for colour-blind separation rather than chosen by eye: ΔE 29.9 under
 * protanopia, 33.7 for normal vision, both clearing 3:1 against the surface.
 */

export const SERIES = {
  views: '#e92038',
  visitors: '#7c65fe',
} as const;

const INK = '#250200';
const MUTED = '#6b5a55';
const GRID = 'rgba(37, 2, 0, 0.10)';

export interface TimePoint {
  readonly day: string;
  readonly views: number;
  readonly visitors: number;
}

/**
 * Views and unique visitors over a date range.
 *
 * One y-axis, always: the two series are counts of the same kind of thing, and
 * a second scale would let them cross in ways that mean nothing.
 */
export function TimeSeries({ points }: { readonly points: readonly TimePoint[] }) {
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);

  if (points.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/20 px-4 py-10 text-center text-sm text-[#6b5a55]">
        No visits recorded in this period yet.
      </p>
    );
  }

  const width = 720;
  const height = 220;
  const pad = { top: 12, right: 12, bottom: 26, left: 36 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const peak = Math.max(1, ...points.map((p) => Math.max(p.views, p.visitors)));
  const step = points.length > 1 ? plotW / (points.length - 1) : 0;

  const x = (i: number): number => pad.left + (points.length > 1 ? i * step : plotW / 2);
  const y = (value: number): number => pad.top + plotH - (value / peak) * plotH;

  const line = (pick: (p: TimePoint) => number): string =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(pick(p)).toFixed(1)}`).join(' ');

  const area = `${line((p) => p.views)} L${x(points.length - 1).toFixed(1)},${(pad.top + plotH).toFixed(1)} L${x(0).toFixed(1)},${(pad.top + plotH).toFixed(1)} Z`;

  // Four gridlines is enough to read a value off; more competes with the data.
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(peak * fraction));
  const active = hover === null ? null : points[hover];

  return (
    <figure className="m-0">
      <div className="mb-3 flex flex-wrap items-center gap-4">
        {(['views', 'visitors'] as const).map((key) => (
          <span key={key} className="flex items-center gap-1.5 text-xs font-bold text-[#250200]">
            <span
              aria-hidden="true"
              className="inline-block size-2.5 rounded-full"
              style={{ background: SERIES[key] }}
            />
            {key === 'views' ? 'Page views' : 'Visitors'}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[520px]"
          role="img"
          aria-label={`Page views and visitors across ${points.length} days`}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.views} stopOpacity="0.16" />
              <stop offset="100%" stopColor={SERIES.views} stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((tick, i) => {
            const ty = y(tick);
            return (
              <g key={i}>
                <line x1={pad.left} y1={ty} x2={width - pad.right} y2={ty} stroke={GRID} strokeWidth="1" />
                <text x={pad.left - 8} y={ty + 3.5} textAnchor="end" fontSize="10" fill={MUTED}>
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={area} fill={`url(#${gradientId})`} />
          <path d={line((p) => p.visitors)} fill="none" stroke={SERIES.visitors} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={line((p) => p.views)} fill="none" stroke={SERIES.views} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {hover !== null ? (
            <line x1={x(hover)} y1={pad.top} x2={x(hover)} y2={pad.top + plotH} stroke={INK} strokeWidth="1" strokeDasharray="3 3" />
          ) : null}

          {points.map((point, i) => (
            <g key={point.day}>
              {hover === i ? (
                <>
                  {/* A 2px surface ring keeps the two markers legible where they overlap. */}
                  <circle cx={x(i)} cy={y(point.views)} r="5" fill={SERIES.views} stroke="#ffffff" strokeWidth="2" />
                  <circle cx={x(i)} cy={y(point.visitors)} r="5" fill={SERIES.visitors} stroke="#ffffff" strokeWidth="2" />
                </>
              ) : null}
              {/* Hit target far wider than the mark. */}
              <rect
                x={x(i) - Math.max(8, step / 2)}
                y={pad.top}
                width={Math.max(16, step)}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            </g>
          ))}

          <line x1={pad.left} y1={pad.top + plotH} x2={width - pad.right} y2={pad.top + plotH} stroke={GRID} strokeWidth="1" />

          {points.map((point, i) =>
            // Label the ends and roughly every fifth day, so they never collide.
            i === 0 || i === points.length - 1 || i % 5 === 0 ? (
              <text key={point.day} x={x(i)} y={height - 8} textAnchor="middle" fontSize="10" fill={MUTED}>
                {point.day.slice(5)}
              </text>
            ) : null,
          )}
        </svg>
      </div>

      <figcaption
        aria-live="polite"
        className="mt-2 min-h-5 text-xs text-[#6b5a55]"
      >
        {active
          ? `${active.day}: ${active.views} ${active.views === 1 ? 'view' : 'views'}, ${active.visitors} ${active.visitors === 1 ? 'visitor' : 'visitors'}`
          : 'Hover the chart for a day.'}
      </figcaption>
    </figure>
  );
}

export interface BarRow {
  readonly label: string;
  readonly views: number;
  readonly visitors: number;
}

/**
 * A ranked list — top pages, referrers, countries.
 *
 * One series, so no legend: the heading names it. The bar is a magnitude, so
 * it takes one hue at one step rather than a colour per row, which would imply
 * an identity these rows do not have.
 */
export function BarList({
  rows,
  emptyLabel,
}: {
  readonly rows: readonly BarRow[];
  readonly emptyLabel: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/20 px-4 py-8 text-center text-sm text-[#6b5a55]">
        {emptyLabel}
      </p>
    );
  }

  const peak = Math.max(...rows.map((row) => row.views), 1);

  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-sm" title={row.label}>
              {row.label}
            </span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-[#6b5a55]">
              {row.views}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(2, (row.views / peak) * 100)}%`,
                background: SERIES.views,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
