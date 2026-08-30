'use client';

import { useEffect, useState } from 'react';
import { color } from '@/config/tokens';

/** Delay between two cells "completing". */
const STEP_MS = 200;
/** Pause on a full grid before restarting. */
const RESET_MS = 1800;

const ROWS = 5;
const COLUMNS = 5;
const CELL_COUNT = ROWS * COLUMNS;

/** Cells that swell as they complete, so the grid reads as rhythm not wallpaper. */
const ACCENT_CELLS = new Set(['0-1', '0-2', '1-0', '1-4', '2-1', '3-0', '3-3', '4-0', '4-4']);

interface DotGridProps {
  readonly width: number;
  readonly height: number;
}

/**
 * "Delivered in 4 days or less" illustration.
 *
 * A 5×5 grid fills in one cell at a time — dots turn brand red and nine of them
 * swell — then resets, suggesting steady, repeating delivery.
 */
export function DotGrid({ width, height }: DotGridProps) {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFilled((count) => (count >= CELL_COUNT ? count : count + 1));
    }, STEP_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (filled < CELL_COUNT) return;
    const timer = setTimeout(() => setFilled(0), RESET_MS);
    return () => clearTimeout(timer);
  }, [filled]);

  const insetX = width * 0.13;
  const insetY = height * 0.13;
  const stepX = (width - insetX * 2) / (COLUMNS - 1);
  const stepY = (height - insetY * 2) / (ROWS - 1);
  const dotRadius = Math.max(1, Math.round(width * 0.016));
  const accentRadius = Math.max(2, Math.round(width * 0.034));

  return (
    <svg
      width={Math.max(1, width)}
      height={Math.max(1, height)}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      {Array.from({ length: ROWS }, (_row, rowIndex) =>
        Array.from({ length: COLUMNS }, (_column, columnIndex) => {
          const key = `${rowIndex}-${columnIndex}`;
          const isFilled = rowIndex * COLUMNS + columnIndex < filled;
          const isAccent = isFilled && ACCENT_CELLS.has(key);

          return (
            <circle
              key={key}
              cx={insetX + columnIndex * stepX}
              cy={insetY + rowIndex * stepY}
              r={isAccent ? accentRadius : dotRadius}
              fill={isFilled ? color.brand : color.tan}
              style={{
                transition: 'fill 0.15s ease, r 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          );
        }),
      )}
    </svg>
  );
}
