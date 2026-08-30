'use client';

import { useEffect, useRef } from 'react';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { RotatingWord } from '@/components/features/hero/RotatingWord';
import { AccentWord } from '@/components/ui/AccentWord';
import { color } from '@/config/tokens';
import {
  HERO_PHONE_SCALE,
  heroCopyColumn,
  heroHeadlineStyle,
  heroPhoneColumn,
  heroStage,
  heroSubheadStyle,
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
      // Split layout on desktop — copy left, phone right. Stacked and centred
      // on mobile, where there is only room for one column.
      style={{ ...heroStage(isMobile), position: 'relative', background: color.white }}
    >
      <div style={heroCopyColumn(isMobile)}>
        <h1 style={heroHeadlineStyle(isMobile)}>
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

        <p style={heroSubheadStyle(isMobile)}>
          {hero.subheadBefore}
          <RotatingWord words={hero.rotatingWords} />
          {hero.subheadAfter}
        </p>
      </div>

      {/* The art board is 891px wide but the phone occupies only its middle
          third, so the column is a narrower window that crops the hands and
          centres the device. Without it the board starves the copy column and
          the headline wraps. */}
      <div style={heroPhoneColumn(isMobile)}>
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
