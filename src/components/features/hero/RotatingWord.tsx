'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { font, weight } from '@/config/tokens';

/** How long each word rests before swapping. */
const HOLD_MS = 1500;
/** Fade-out time before the next word mounts. */
const FADE_MS = 250;

interface RotatingWordProps {
  readonly words: readonly string[];
}

/**
 * Cycles through deliverable types inline in the hero subheadline.
 *
 * The wrapper animates its width to the measured word so the surrounding
 * sentence eases across instead of snapping. The measurement is re-taken
 * whenever the rendered word actually changes size — the brand webfonts land
 * after first paint, and a stale fallback-font measurement would clip the word.
 */
export function RotatingWord({ words }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const wordRef = useRef<HTMLElement | null>(null);

  const measure = (): void => {
    const element = wordRef.current;
    if (element) setWidth(element.offsetWidth);
  };

  useLayoutEffect(measure, [index]);

  // Re-measure when the word's own box changes — covers webfont swap-in,
  // viewport resizes and any reflow the first measurement missed.
  useEffect(() => {
    const element = wordRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setWidth(element.offsetWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((current) => (current + 1) % words.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);

    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span
      aria-live="polite"
      style={{
        display: 'inline-block',
        width,
        transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        verticalAlign: 'bottom',
        overflow: 'hidden',
      }}
    >
      <strong
        ref={wordRef}
        style={{
          fontFamily: font.sans,
          fontWeight: weight.bold,
          display: 'inline-block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.25s ease, transform 0.3s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {words[index]}
      </strong>
    </span>
  );
}
