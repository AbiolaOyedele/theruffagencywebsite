'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { color } from '@/config/tokens';
import { toolStackLogos } from '@/content/site';

/** How much of a bounce a chip keeps after hitting a wall. */
const RESTITUTION = 0.42;
const GRAVITY = 0.28;
/** How strongly scroll velocity pushes the pile sideways. */
const SCROLL_PUSH = 0.1;

interface Chip {
  readonly image: HTMLImageElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ToolStackProps {
  readonly width: number;
  readonly height: number;
  /** Live scroll velocity, so the pile sloshes as you scrub the section. */
  readonly velocityRef: RefObject<number>;
}

/** Traces a rounded rectangle onto the 2D context. */
function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  cornerRadius: number,
): void {
  context.beginPath();
  context.moveTo(x + cornerRadius, y);
  context.lineTo(x + size - cornerRadius, y);
  context.arcTo(x + size, y, x + size, y + cornerRadius, cornerRadius);
  context.lineTo(x + size, y + size - cornerRadius);
  context.arcTo(x + size, y + size, x + size - cornerRadius, y + size, cornerRadius);
  context.lineTo(x + cornerRadius, y + size);
  context.arcTo(x, y + size, x, y + size - cornerRadius, cornerRadius);
  context.lineTo(x, y + cornerRadius);
  context.arcTo(x, y, x + cornerRadius, y, cornerRadius);
  context.closePath();
}

/**
 * "Embedded in your workflow" illustration.
 *
 * Tool logos drop in as rounded chips and settle into a physical pile with
 * gravity, wall bounces and chip-to-chip collisions, nudged by scroll velocity.
 */
export function ToolStack({ width, height, velocityRef }: ToolStackProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.scale(dpr, dpr);

    const chipSize = Math.round(width * 0.165);
    const cornerRadius = chipSize * 0.24;
    const padding = chipSize * 0.13;
    const perRow = Math.max(1, Math.floor(width / (chipSize + 8)));

    const chips: Chip[] = toolStackLogos.map((source, index) => {
      const image = new Image();
      image.src = source;
      return {
        image,
        x:
          chipSize / 2 +
          8 +
          (index % perRow) * ((width - chipSize - 16) / Math.max(perRow - 1, 1)),
        y: -chipSize * 1.4 - Math.floor(index / perRow) * (chipSize + 6),
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0.5 + Math.random() * 1.5,
      };
    });

    let frame = 0;

    const render = (): void => {
      context.clearRect(0, 0, width, height);
      const scrollVelocity = velocityRef.current ?? 0;
      const half = chipSize / 2;

      for (const chip of chips) {
        chip.vy += GRAVITY;
        chip.vx -= scrollVelocity * SCROLL_PUSH;
        chip.vx *= 0.94;
        chip.vy *= 0.988;
        chip.x += chip.vx;
        chip.y += chip.vy;

        if (chip.x - half < 0) {
          chip.x = half;
          chip.vx = Math.abs(chip.vx) * RESTITUTION;
        }
        if (chip.x + half > width) {
          chip.x = width - half;
          chip.vx = -Math.abs(chip.vx) * RESTITUTION;
        }
        if (chip.y - half < 0) {
          chip.y = half;
          chip.vy = Math.abs(chip.vy) * RESTITUTION;
        }
        if (chip.y + half > height) {
          chip.y = height - half;
          chip.vy = -Math.abs(chip.vy) * RESTITUTION;
        }
      }

      // Separate overlapping chips and exchange momentum along the contact normal.
      for (let a = 0; a < chips.length; a += 1) {
        for (let b = a + 1; b < chips.length; b += 1) {
          const first = chips[a];
          const second = chips[b];
          if (!first || !second) continue;

          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= chipSize || distance <= 0.001) continue;

          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = chipSize - distance;

          first.x -= (nx * overlap) / 2;
          first.y -= (ny * overlap) / 2;
          second.x += (nx * overlap) / 2;
          second.y += (ny * overlap) / 2;

          const approach = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
          if (approach >= 0) continue;

          const impulse = (approach * (1 + RESTITUTION)) / 2;
          first.vx += impulse * nx;
          first.vy += impulse * ny;
          second.vx -= impulse * nx;
          second.vy -= impulse * ny;
        }
      }

      for (const chip of chips) {
        const x = chip.x - half;
        const y = chip.y - half;

        roundedRect(context, x, y, chipSize, cornerRadius);
        context.fillStyle = color.white;
        context.fill();

        if (chip.image.complete && chip.image.naturalWidth) {
          context.save();
          roundedRect(context, x, y, chipSize, cornerRadius);
          context.clip();
          context.drawImage(
            chip.image,
            x + padding,
            y + padding,
            chipSize - padding * 2,
            chipSize - padding * 2,
          );
          context.restore();
        }
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [width, height, velocityRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width, height }}
    />
  );
}
