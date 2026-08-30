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
        paddingTop: 120,
        paddingBottom: isMobile ? 0 : 42,
        paddingLeft: isMobile ? 0 : 'clamp(24px, 5vw, 88px)',
      }}
    >
      <div
        style={{
          textAlign: isMobile ? 'center' : 'left',
          padding: isMobile ? '24px 20px 0' : 0,
          maxWidth: isMobile ? 440 : 700,
          flex: isMobile ? undefined : '1 1 auto',
        }}
      >
        <h1
          style={{
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: isMobile ? 36 : 'clamp(48px, 5.2vw, 72px)',
            lineHeight: isMobile ? '44px' : 1.06,
            letterSpacing: isMobile ? '-0.72px' : '-0.02em',
            color: color.inkHeading,
            margin: 0,
            WebkitFontSmoothing: 'antialiased',
            fontFeatureSettings: '"calt" 0, "liga" 0, "dlig" 0, "clig" 0',
          }}
        >
          {hero.headline[0]}
          <br />
          Build a <AccentWord>brand.</AccentWord>
        </h1>

        <p
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: isMobile ? 18 : 22,
            lineHeight: isMobile ? '28px' : '32px',
            letterSpacing: '-0.24px',
            color: color.inkHeading,
            margin: '20px 0 0',
            // The narrower column lets this wrap, so the one-line ceiling the
            // centred layout imposed no longer applies.
            maxWidth: isMobile ? undefined : 520,
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
          width: isMobile ? undefined : 'min(620px, 42vw)',
          display: 'flex',
          justifyContent: 'center',
          overflow: isMobile ? 'visible' : 'hidden',
          alignSelf: 'center',
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
    </section>
  );
}
