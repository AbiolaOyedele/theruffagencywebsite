'use client';

import { useEffect, useRef } from 'react';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { RotatingWord } from '@/components/features/hero/RotatingWord';
import { AccentWord } from '@/components/ui/AccentWord';
import { color, font } from '@/config/tokens';
import {
  HERO_COLUMN_GAP,
  HERO_PADDING_LEFT,
  HERO_PADDING_TOP,
  HERO_PHONE_BOTTOM_LIFT,
  HERO_PHONE_SCALE,
  HERO_PHONE_WINDOW,
} from '@/config/heroLayout';
import { hero } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';

/** Scroll distance over which the hero tucks in its corners. */
const CORNER_SCROLL_RANGE = 150;

/**
 * Full-bleed white hero.
 *
 * As the page scrolls the block insets its sides and rounds its bottom
 * corners, while the phone drifts down and tilts on a slight perspective.
 *
 * The intro overlay leaves its phone at exactly this size and position (see
 * config/heroLayout), so there is nothing to animate on handover — the overlay
 * simply retires and this is already underneath it.
 */
export function Hero() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const handleScroll = (): void => {
      const scrolled = window.scrollY;
      const inset = Math.min(1, scrolled / CORNER_SCROLL_RANGE);

      section.style.marginLeft = `${inset * 10}px`;
      section.style.marginRight = `${inset * 10}px`;
      section.style.borderBottomLeftRadius = `${inset * 42}px`;
      section.style.borderBottomRightRadius = `${inset * 42}px`;

      const narrow = window.innerWidth <= 768;
      const drift = narrow ? scrolled * 0.1 : scrolled * 0.28;
      const tilt = narrow ? 0 : Math.min(7, scrolled * 0.018);

      stage.style.transformOrigin = narrow ? '50% 100%' : '50% 50%';
      stage.style.transform = `perspective(1100px) rotateX(${tilt}deg) translateY(${drift}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      style={{
        position: 'relative',
        background: color.white,
        overflow: 'hidden',
        display: 'flex',
        // Split layout on desktop — copy left, phone right. Stacked and
        // centred on mobile, where there is only room for one column.
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? 0 : HERO_COLUMN_GAP,
        minHeight: isMobile ? undefined : '100vh',
        paddingTop: isMobile ? 120 : HERO_PADDING_TOP,
        paddingBottom: 0,
        paddingLeft: isMobile ? 0 : HERO_PADDING_LEFT,
      }}
    >
      <div
        style={{
          textAlign: isMobile ? 'center' : 'left',
          padding: isMobile ? '24px 20px 0' : 0,
          maxWidth: isMobile ? 440 : 780,
          flex: isMobile ? undefined : '1 1 auto',
        }}
      >
        <h1
          style={{
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: isMobile ? 38 : 'clamp(52px, 6.6vw, 100px)',
            lineHeight: isMobile ? '44px' : 1.06,
            letterSpacing: isMobile ? '-0.72px' : '-0.02em',
            color: color.inkHeading,
            margin: 0,
            WebkitFontSmoothing: 'antialiased',
            fontFeatureSettings: '"calt" 0, "liga" 0, "dlig" 0, "clig" 0',
          }}
        >
          {hero.headline.map((line, lineIndex) => (
            <span key={line} style={{ display: 'block' }}>
              {line.split(' ').map((word, wordIndex) => (
                <span key={`${word}-${wordIndex}`}>
                  {wordIndex > 0 ? ' ' : null}
                  {word === hero.headlineAccent ? <AccentWord>{word}</AccentWord> : word}
                </span>
              ))}
              {lineIndex < hero.headline.length - 1 ? null : null}
            </span>
          ))}
        </h1>

        <p
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            // Scales with the column so the line never has to wrap.
            fontSize: isMobile ? 18 : 'clamp(15px, 1.45vw, 21px)',
            lineHeight: isMobile ? '28px' : 1.45,
            letterSpacing: '-0.24px',
            color: color.inkHeading,
            margin: '20px 0 0',
            // Strictly one line: a wrap here changes the block's height every
            // time the rotating word does, which shunts the whole section.
            whiteSpace: isMobile ? 'normal' : 'nowrap',
          }}
        >
          {hero.subheadBefore}
          <RotatingWord words={hero.rotatingWords} />
          {hero.subheadAfter}
        </p>
      </div>

      <div
        style={{
          flex: isMobile ? undefined : '0 0 auto',
          marginTop: isMobile ? 'auto' : 0,
          // The art board is 891px wide but the phone only occupies its middle
          // third, so the column is a narrower window that crops the hands and
          // centres the device. Without it the board starves the copy column
          // and the headline wraps.
          width: isMobile ? undefined : HERO_PHONE_WINDOW,
          display: 'flex',
          justifyContent: 'center',
          overflow: isMobile ? 'visible' : 'hidden',
          // Anchored near the bottom edge, lifted just enough that the hand
          // photo's overhang is not sliced off at the fold.
          alignSelf: isMobile ? 'auto' : 'flex-end',
          marginBottom: isMobile ? 0 : HERO_PHONE_BOTTOM_LIFT,
        }}
      >
        {/* Static scale sits on its own wrapper so the scroll-driven
            transform on the stage below stays untouched. */}
        <div
          style={{
            transform: isMobile ? 'none' : `scale(${HERO_PHONE_SCALE})`,
            transformOrigin: 'bottom center',
          }}
        >
          <PhoneMockup
            ref={stageRef}
            style={{
              transformOrigin: isMobile ? '50% 100%' : '50% 50%',
              willChange: 'transform',
            }}
          />
        </div>
      </div>
    </section>
  );
}
