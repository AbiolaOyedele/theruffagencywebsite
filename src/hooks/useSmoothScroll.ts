'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Enables Lenis smooth scrolling on pointer devices.
 *
 * Skipped on touch devices (native momentum scrolling is better there) and
 * when the visitor prefers reduced motion.
 */
export function useSmoothScroll(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [enabled]);
}
