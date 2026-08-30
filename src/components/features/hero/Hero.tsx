'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { RotatingWord } from '@/components/features/hero/RotatingWord';
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
    stageRef.current.style.transform = 'translateY(max(0px, calc(100vh - 1038px)))';
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

      stage.style.transformOrigin = narrow ? '50% 100%' : '50% 40%';
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
        background: color.brand,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: isMobile ? 0 : 42,
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
            fontWeight: 700,
            fontSize: isMobile ? 36 : 72,
            lineHeight: isMobile ? '44px' : '78px',
            letterSpacing: isMobile ? '-0.72px' : '-1.44px',
            color: color.inkHeading,
            margin: 0,
            WebkitFontSmoothing: 'antialiased',
            fontFeatureSettings: '"calt" 0, "liga" 0, "dlig" 0, "clig" 0',
          }}
        >
          {hero.headline[0]}
          <br />
          {hero.headline[1]}
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
          }}
        >
          We design your <RotatingWord words={hero.rotatingWords} /> without limits, for a fixed
          price.
        </p>
      </div>

      <PhoneMockup
        ref={stageRef}
        style={{
          marginTop: isMobile ? 'auto' : 40,
          transformOrigin: isMobile ? '50% 100%' : '50% 40%',
          willChange: 'transform',
        }}
      />
    </section>
  );
}
