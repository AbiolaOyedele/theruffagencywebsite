'use client';

import { useEffect, useRef, useState } from 'react';
import { AccentWord } from '@/components/ui/AccentWord';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { color, font } from '@/config/tokens';
import {
  HERO_PHONE_SCALE,
  NOTIFICATION_CARD,
  heroCopyColumn,
  heroHeadlineStyle,
  heroPhoneColumn,
  heroStage,
  heroSubheadStyle,
} from '@/config/heroLayout';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useContent } from '@/components/providers/ContentProvider';

/**
 * Two free-floating notifications land first, one after the other, before the
 * third arrives inside the phone.
 */
const CARD_AT = [250, 900] as const;

/**
 * Beat timings, in milliseconds from mount.
 *  1 — the loose cards clear and the phone's own notification takes over
 *  2 — the backdrop settles to white and the phone pulls back to real size
 *  3 — the headline slides up, the card expands, the nav is handed over
 *  4 — the overlay retires and the real page takes over
 */
const STAGE_AT = [1700, 2600, 3900, 6100] as const;

/** The subheadline follows the headline in. */
const SUBHEAD_AT = 4500;

/** Painted size of a loose notification, relative to the base card. */
const LOOSE_CARD_SCALE = 2.2;
const LOOSE_CARD_SCALE_MOBILE = 1.5;

/**
 * The third card is a fixed box inside the phone while the loose pair sizes to
 * its own text, and the same string measures proportionally wider at the small
 * type size the phone lays out at. This trims the difference so all three read
 * as one card rather than the last one arriving larger.
 */
const THIRD_CARD_TRIM = 0.94;

/** Where each loose card sits, as a share of the viewport. */
const LOOSE_CARDS = [
  { top: '25%', left: '13%', mobileTop: '17%', mobileLeft: '5%' },
  { top: '58%', left: '23%', mobileTop: '43%', mobileLeft: '16%' },
] as const;

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
  const { hero } = useContent();
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [stage, setStage] = useState(0);
  const [cardsIn, setCardsIn] = useState(0);
  const [subheadIn, setSubheadIn] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

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
    CARD_AT.forEach((delay, index) => {
      timers.push(setTimeout(() => setCardsIn(index + 1), delay));
    });
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
  }, [subheadIn, hero.rotatingWords.length]);

  const pulledBack = stage >= 2;
  const cardVisible = stage >= 1;
  const cardExpanded = stage >= 3;
  const headlineUp = stage >= 3;
  const looseCardScale = isMobile ? LOOSE_CARD_SCALE_MOBILE : LOOSE_CARD_SCALE;
  // The third notification arrives at the size of the two before it. The phone
  // is already scaled by HERO_PHONE_SCALE on the way out, so that has to be
  // backed out of the zoom or the card lands larger than its pair.
  const zoomScale =
    (looseCardScale * THIRD_CARD_TRIM) / (isMobile ? 1 : HERO_PHONE_SCALE);

  /** Splits a line into words that slide up from a clipped mask. */
  const renderLine = (words: readonly string[], delays: readonly number[]) => (
    <span style={{ display: 'block' }}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
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
              {word === hero.headlineAccent ? <AccentWord>{word}</AccentWord> : word}
            </span>
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden="true"
      // Mirrors the hero's stage exactly, so the phone and the copy hand over
      // without jumping.
      style={{
        ...heroStage(isMobile),
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        // Deliberately no `bottom`: pinning all four edges caps the overlay at
        // the viewport, and where the composition is taller than that — narrow
        // screens — it centres the overflow while the hero underneath grows to
        // fit. Letting it size to its content is what keeps the two aligned.
        zIndex: 9999,
        background: pulledBack ? color.white : color.paper,
        transition: pulledBack ? 'background 1.3s ease' : 'none',
      }}
    >
      {/* The two loose notifications, dealt out before the phone arrives.
          They clear as soon as the phone's own card takes over at stage 1. */}
      {LOOSE_CARDS.map((card, index) => {
        const shown = cardsIn > index && stage < 1;
        return (
          <NotificationCard
            key={card.left}
            scale={looseCardScale}
            style={{
              position: 'absolute',
              top: isMobile ? card.mobileTop : card.top,
              left: isMobile ? card.mobileLeft : card.left,
              opacity: shown ? 1 : 0,
              transform: `translateY(${shown ? 0 : 18}px) scale(${shown ? 1 : 0.96})`,
              transition:
                'opacity 0.32s ease, transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      <div style={heroCopyColumn(isMobile)}>
        <h1 style={heroHeadlineStyle(isMobile)}>
          {/* Split from the shared headline so the intro can never drift out of
              sync with the hero it hands over to. */}
          {hero.headline.map((line, lineIndex) => (
            <span key={line} style={{ display: 'block' }}>
              {renderLine(
                line.split(' '),
                line.split(' ').map((_word, wordIndex) => lineIndex * 140 + wordIndex * 90),
              )}
            </span>
          ))}
        </h1>

        <p
          style={{
            ...heroSubheadStyle(isMobile),
            opacity: subheadIn ? 1 : 0,
            transform: subheadIn ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {hero.subheadBefore}
          <strong style={{ fontFamily: font.sans, fontWeight: 700, color: color.brand }}>
            <span style={{ opacity: wordVisible ? 1 : 0, transition: 'opacity 0.25s ease' }}>
              {hero.rotatingWords[wordIndex]}
            </span>
          </strong>
          {hero.subheadAfter}
          <span style={{ whiteSpace: 'nowrap' }}>{hero.subheadTail}</span>
        </p>
      </div>

      {/* Same crop window as the hero, so the phone hands over in place. */}
      <div style={{ ...heroPhoneColumn(isMobile), flexShrink: 0 }}>
        {/* Same static scale wrapper as the hero, so the phone is already at
            its final size when the overlay hands over. */}
        <div
          style={{
            transform: isMobile ? 'none' : `scale(${HERO_PHONE_SCALE})`,
            transformOrigin: 'bottom center',
          }}
        >
          <PhoneMockup
            videoRef={videoRef}
            autoPlay={false}
            cardVisible={cardVisible}
            chromeVisible={pulledBack}
            chromeTransition={pulledBack ? 'opacity 0.9s ease 0.25s' : 'none'}
            cardHeight={
              cardExpanded
                ? NOTIFICATION_CARD.expandedHeight
                : NOTIFICATION_CARD.collapsedHeight
            }
            cardTransition={
              cardExpanded
                ? 'height 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.45s ease, transform 0.45s ease'
                : 'opacity 0.45s ease, transform 0.45s ease'
            }
            style={{
              transform: pulledBack ? 'scale(1)' : `scale(${zoomScale})`,
              transformOrigin: ZOOM_ORIGIN,
              transition: pulledBack
                ? 'transform 1.3s cubic-bezier(0.25,0.46,0.45,0.94)'
                : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
