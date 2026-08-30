'use client';

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';

interface RevealResult<T extends HTMLElement> {
  readonly ref: RefObject<T | null>;
  readonly visible: boolean;
  /** Fade-and-rise styles to spread onto the observed element. */
  readonly style: CSSProperties;
}

/**
 * Fades and lifts an element the first time it enters the viewport.
 *
 * @param threshold Fraction of the element that must be visible to trigger.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
): RevealResult<T> {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return {
    ref,
    visible,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.65s ease, transform 0.65s ease',
    },
  };
}
