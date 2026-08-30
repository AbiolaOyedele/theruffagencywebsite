'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { RotatingWord } from '@/components/features/hero/RotatingWord';
import { AccentWord } from '@/components/ui/AccentWord';
import { color, font } from '@/config/tokens';
import { hero } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';

/** Scroll distance over which the hero tucks in its corners. */
const CORNER_SCROLL_RANGE = 150;

/**
 * How much larger than its art board the phone renders in the hero, so the
 * composition reaches the top of the screen instead of floating mid-section.
 */
export const HERO_PHONE_SCALE = 1.2;

interface HeroProps {
  /** True while the intro overlay still covers the page. */
  readonly introActive: boolean;
}

/**
 * Full-bleed brand-red hero.
 *
 * As the page scrolls the block insets its sides and rounds its bottom
 * corners, while the phone drifts down and tilts on a slight perspective.
 * When the intro overlay hands over, the phone rises into place once.
 */
export function Hero({ introActive }: HeroProps) {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const hasSeeded = useRef(false);
  const isHandingOver = useRef(false);
  const [handoverDone, setHandoverDone] = useState(false);

  // Park the phone offscreen so the intro's phone appears to fly into it.
  useLayoutEffect(() => {
    if (introActive || hasSeeded.current || !stageRef.current) return;
    stageRef.current.style.transition = 'none';
    stageRef.current.style.transform = 'translateY(24px)';
    hasSeeded.current = true;
    isHandingOver.current = true;
  }, [introActive]);

  // Then release it into its resting position.
  useEffect(() => {
    if (introActive || !isHandingOver.current) return;
    const stage = stageRef.current;
    if (!stage) return;

    const start = setTimeout(() => {
      stage.style.transition = 'transform 0.8s cubic-bezier(0, 0, 0.2, 1)';
      stage.style.transform = 'translateY(0)';
    }, 150);

    const finish = setTimeout(() => {
      isHandingOver.current = false;
      setHandoverDone(true);
      stageRef.current?.style.setProperty('transition', '');
      window.dispatchEvent(new Event('scroll'));
    }, 950);

    return () => {
      clearTimeout(start);
      clearTimeout(finish);
    };
  }, [introActive]);

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

      // Leave the phone alone until the intro handover finishes.
      if (isHandingOver.current) return;

      const narrow = window.innerWidth <= 768;
      const drift = narrow ? scrolled * 0.1 : scrolled * 0.28;
      const tilt = narrow ? 0 : Math.min(7, scrolled * 0.018);

      stage.style.transformOrigin = narrow ? '50% 100%' : '50% 50%';
      stage.style.transform = `perspective(1100px) rotateX(${tilt}deg) translateY(${drift}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handoverDone]);

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
        gap: isMobile ? 0 : 24,
        minHeight: isMobile ? undefined : '100vh',
        paddingTop: isMobile ? 120 : 104,
        paddingBottom: 0,
        paddingLeft: isMobile ? 0 : 'clamp(24px, 5vw, 88px)',
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
          width: isMobile ? undefined : 'min(720px, 42vw)',
          display: 'flex',
          justifyContent: 'center',
          overflow: isMobile ? 'visible' : 'hidden',
          // Anchored to the bottom edge so the art board bleeds off it rather
          // than leaving a band of empty white underneath.
          alignSelf: isMobile ? 'auto' : 'flex-end',
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
