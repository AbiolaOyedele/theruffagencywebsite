'use client';

import { useEffect, useRef, useState } from 'react';
import { color } from '@/config/tokens';

/** Lottie stores colour as 0–1 RGB, so a hex has to be converted. */
function hexToLottieRgb(hex: string): readonly number[] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ];
}

function isWhite(value: unknown): value is number[] {
  return Array.isArray(value) && value.length === 3 && value.every((part) => part === 1);
}

/** Walks the animation, swapping every white shape colour for `rgb`. */
function recolour(node: unknown, rgb: readonly number[]): unknown {
  if (Array.isArray(node)) return node.map((item) => recolour(item, rgb));

  if (node && typeof node === 'object') {
    const entries = Object.entries(node as Record<string, unknown>).map(([key, value]) => {
      if (key === 'c' && value && typeof value === 'object' && isWhite((value as { k?: unknown }).k)) {
        return [key, { ...(value as object), k: rgb }] as const;
      }
      return [key, recolour(value, rgb)] as const;
    });
    return Object.fromEntries(entries);
  }

  return node;
}

interface ScrollPromptProps {
  /** The element being scrolled. The prompt watches it and hides at the end. */
  readonly scroller: HTMLElement | null;
}

/** Hide once the reader is this close to the bottom — the prompt has done its job. */
const SETTLED_PX = 120;

/**
 * The studio's looping arrow, in the corner of a panel that scrolls.
 *
 * It is the ScrollPrompt animation the Ruff sites have used since the first
 * one, recoloured at mount from the brand red rather than shipping the white
 * baked into the file — it has to catch the eye against paper to do its job.
 *
 * It appears only when there is somewhere to scroll to, and fades once the
 * reader is near the bottom — a prompt that stays after you have taken it is
 * just decoration. `lottie-web` is imported on demand so the ~250kB player is
 * fetched when a panel first opens rather than on first paint, and reduced
 * motion skips it entirely.
 */
export function ScrollPrompt({ scroller }: ScrollPromptProps) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Follow the scroller: is there room to scroll, and has it been used?
  useEffect(() => {
    if (!scroller) return;

    const update = (): void => {
      const room = scroller.scrollHeight - scroller.clientHeight;
      const left = room - scroller.scrollTop;
      setVisible(room > SETTLED_PX * 2 && left > SETTLED_PX);
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });

    const observer = new ResizeObserver(update);
    observer.observe(scroller);

    return () => {
      scroller.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [scroller]);

  // Load the player once there is something to show, and keep it — hiding is
  // a matter of opacity, not of tearing the animation down and rebuilding it
  // every time the reader scrolls past the threshold.
  const [wanted, setWanted] = useState(false);
  if (visible && !wanted) setWanted(true);

  useEffect(() => {
    if (!wanted) return;

    const holder = holderRef.current;
    if (!holder || holder.childElementCount > 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animation: { destroy: () => void } | null = null;
    let cancelled = false;

    void (async () => {
      const [{ default: lottie }, { default: data }] = await Promise.all([
        import('lottie-web'),
        import('@/lib/animations/ScrollPrompt.json'),
      ]);
      if (cancelled) return;

      animation = lottie.loadAnimation({
        container: holder,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: recolour(data, hexToLottieRgb(color.brand)) as object,
      });
    })();

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [wanted]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 20,
        bottom: 16,
        width: 54,
        height: 71,
        zIndex: 4,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <div ref={holderRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
