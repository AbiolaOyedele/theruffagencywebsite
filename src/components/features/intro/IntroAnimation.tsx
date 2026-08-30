'use client';

import { useEffect, useRef, useState } from 'react';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { color, font } from '@/config/tokens';
import { hero } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * Beat timings, in milliseconds from mount.
 *  1 — the notification card fades in, still collapsed
 *  2 — the paper backdrop turns brand red and the phone pulls back to real size
 *  3 — the headline slides up, the card expands, the nav is handed over
 *  4 — the overlay retires and the real page takes over
 */
const STAGE_AT = [400, 1800, 3200, 5400] as const;

/** The subheadline follows the headline in. */
const SUBHEAD_AT = 3800;

/** Where the opening zoom is centred on the phone. */
const ZOOM_ORIGIN = '50% 23.7%';

/** Word-rotation cadence once the subheadline has arrived. */
const WORD_HOLD_MS = 1500;
const WORD_FADE_MS = 250;

interface IntroAnimationProps {
  readonly onNavReveal: () => void;
  readonly onComplete: () => void;
}

/**
 * The opening sequence.
 *
 * Starts zoomed into the delivery notification on a paper background, then
 * pulls back into the hero composition and hands the page over.
 */
export function IntroAnimation({ onNavReveal, onComplete }: IntroAnimationProps) {
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [stage, setStage] = useState(0);
  const [subheadIn, setSubheadIn] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  const [viewportWidth, setViewportWidth] = useState(1200);

  useEffect(() => {
    const sync = (): void => setViewportWidth(window.innerWidth);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // The whole sequence is one timeline: each beat fires from its own timer,
  // so nothing is set synchronously while the component is rendering.
  useEffect(() => {
    const timers = STAGE_AT.map((delay, index) =>
      setTimeout(() => {
        const next = index + 1;
        setStage(next);

        if (next === 3) {
          onNavReveal();
          void videoRef.current?.play().catch(() => {
            // Autoplay can be refused; the still frame is an acceptable fallback.
          });
        }
        if (next === 4) onComplete();
      }, delay),
    );

    timers.push(setTimeout(() => setSubheadIn(true), SUBHEAD_AT));
    return () => timers.forEach(clearTimeout);
  }, [onNavReveal, onComplete]);

  useEffect(() => {
    if (!subheadIn) return;
    const timer = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((current) => (current + 1) % hero.rotatingWords.length);
        setWordVisible(true);
      }, WORD_FADE_MS);
    }, WORD_HOLD_MS);
    return () => clearInterval(timer);
  }, [subheadIn]);

  const pulledBack = stage >= 2;
  const cardVisible = stage >= 1;
  const cardExpanded = stage >= 3;
  const headlineUp = stage >= 3;
  const zoomScale = isMobile ? Math.max(1, (viewportWidth - 32) / 211) : 2.5;

  /** Splits a line into words that slide up from a clipped mask. */
  const renderLine = (words: readonly string[], delays: readonly number[]) => (
    <span style={{ display: 'block' }}>
      {words.map((word, index) => (
        <span key={word}>
          {index > 0 ? ' ' : null}
          <span
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              paddingBottom: '0.2em',
              marginBottom: '-0.2em',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: headlineUp ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)',
                transitionDelay: `${delays[index] ?? 0}ms`,
              }}
            >
              {word}
            </span>
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: isMobile ? 0 : 42,
        background: pulledBack ? color.brand : color.paper,
        transition: pulledBack ? 'background 1.3s ease' : 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: isMobile ? '24px 20px 0' : '40px 32px 0',
          maxWidth: isMobile ? 440 : 700,
        }}
      >
        <h1
          style={{
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: isMobile ? 36 : 72,
            lineHeight: isMobile ? '44px' : '78px',
            letterSpacing: isMobile ? '-0.72px' : '-1.44px',
            color: color.inkHeading,
            margin: 0,
            WebkitFontSmoothing: 'antialiased',
            fontFeatureSettings: '"calt" 0, "liga" 0, "dlig" 0, "clig" 0',
          }}
        >
          {renderLine(['Pause', 'hiring,'], [0, 100])}
          {renderLine(['Start', 'designing.'], [220, 320])}
        </h1>

        <p
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: isMobile ? 18 : 24,
            lineHeight: isMobile ? '28px' : '32px',
            letterSpacing: '-0.24px',
            color: color.inkHeading,
            margin: '16px 0 0',
            whiteSpace: isMobile ? 'normal' : 'nowrap',
            opacity: subheadIn ? 1 : 0,
            transform: subheadIn ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          We design your{' '}
          <strong style={{ fontFamily: font.sans, fontWeight: 700 }}>
            <span style={{ opacity: wordVisible ? 1 : 0, transition: 'opacity 0.25s ease' }}>
              {hero.rotatingWords[wordIndex]}
            </span>
          </strong>{' '}
          without limits, for a fixed price.
        </p>
      </div>

      <div
        style={{
          display: isMobile ? 'contents' : 'block',
          flexShrink: 0,
          transform: isMobile ? 'none' : 'translateY(max(0px, calc(100vh - 1038px)))',
        }}
      >
        <PhoneMockup
          videoRef={videoRef}
          autoPlay={false}
          cardVisible={cardVisible}
          chromeVisible={pulledBack}
          chromeTransition={pulledBack ? 'opacity 0.9s ease 0.25s' : 'none'}
          cardHeight={cardExpanded ? 442 : 62}
          cardTransition={
            cardExpanded
              ? 'height 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.45s ease, transform 0.45s ease'
              : 'opacity 0.45s ease, transform 0.45s ease'
          }
          style={{
            marginTop: isMobile ? 'auto' : 40,
            transform: pulledBack ? 'scale(1)' : `scale(${zoomScale})`,
            transformOrigin: ZOOM_ORIGIN,
            transition: pulledBack
              ? 'transform 1.3s cubic-bezier(0.25,0.46,0.45,0.94)'
              : 'none',
          }}
        />
      </div>
    </div>
  );
}
