'use client';

import { useEffect, useRef, useState } from 'react';
import { color, font } from '@/config/tokens';
import { statementWords } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { clamp } from '@/utils/scroll';

/** Colour of a word that has not been revealed yet — a warm ghost of the ink. */
const DIM = color.cream;

/**
 * Scroll-scrubbed statement.
 *
 * A 250vh track pins one line of copy while the words fill in from pale grey
 * to ink, word by word, in step with scroll position. Fully bidirectional —
 * scrolling back up un-reveals them.
 */
export function ScrollStatement() {
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = (): void => {
      const track = trackRef.current;
      if (!track) return;
      const travel = track.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      setProgress(clamp(-track.getBoundingClientRect().top / travel));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={trackRef} style={{ position: 'relative', height: '250vh', background: color.white }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ padding: isMobile ? '0 24px' : '0 112px', width: '100%', maxWidth: 1440 }}>
          <p
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: isMobile ? 24 : 36,
              lineHeight: isMobile ? '34px' : '44px',
              margin: 0,
              letterSpacing: '-0.72px',
              maxWidth: isMobile ? '100%' : 695,
            }}
          >
            {statementWords.map((word, index) => {
              const start = index / statementWords.length;
              const end = (index + 1) / statementWords.length;
              const filled = clamp((progress - start * 0.85) / (end - start + 0.04));

              return (
                <span
                  key={`${word}-${index}`}
                  style={{
                    color:
                      filled >= 1
                        ? color.ink
                        : filled <= 0
                          ? DIM
                          : `color-mix(in srgb, ${color.ink} ${Math.round(filled * 100)}%, ${DIM})`,
                    transition: 'color 0.15s ease',
                  }}
                >
                  {word}{' '}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
