'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface CountUpResult<T extends HTMLElement> {
  readonly ref: RefObject<T | null>;
  readonly value: number;
}

/**
 * Counts from `from` up to `target` the first time the element scrolls into
 * view, easing out over `durationMs`.
 *
 * Starts at `target`, not at `from`: the server has no scroll and no observer,
 * so anything reading the HTML — a crawler, an AI, a browser with JavaScript
 * off — would otherwise be told the studio has run zero campaigns. The count
 * drops to `from` at the moment it actually begins.
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  durationMs = 1200,
  from = 0,
): CountUpResult<T> {
  const ref = useRef<T | null>(null);
  const hasRun = useRef(false);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasRun.current) return;
        hasRun.current = true;
        setValue(from);

        const start = performance.now();
        const step = (now: number): void => {
          const linear = Math.min(1, (now - start) / durationMs);
          const eased = 1 - (1 - linear) ** 3;
          setValue(Math.round(from + (target - from) * eased));
          if (linear < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs, from]);

  return { ref, value };
}
