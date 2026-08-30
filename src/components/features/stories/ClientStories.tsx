'use client';

import { useEffect, useRef, useState } from 'react';
import { StoryCard, type StoryCardLayout } from '@/components/features/stories/StoryCard';
import { AccentWord } from '@/components/ui/AccentWord';
import { AutoplayVideo } from '@/components/ui/AutoplayVideo';
import { color, font } from '@/config/tokens';
import { caseStudies, clientStories, storyCardLayouts } from '@/content/site';
import { useCountUp } from '@/hooks/useCountUp';
import { useIsMobile } from '@/hooks/useIsMobile';
import { clamp } from '@/utils/scroll';

interface ClientStoriesProps {
  readonly onOpenCaseStudy: (slug: string) => void;
}

/**
 * "Stories of our clients" — a pinned dark section.
 *
 * The headline sits behind three case-study cards that deal themselves in as
 * you scroll, fading the headline back as the cards take over. Below `md` the
 * fan is replaced by a readable vertical list.
 */
export function ClientStories({ onOpenCaseStudy }: ClientStoriesProps) {
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const { ref: counterRef, value: startupCount } = useCountUp<HTMLSpanElement>(
    clientStories.startupCount,
  );

  useEffect(() => {
    if (isMobile) return;

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
  }, [isMobile]);

  const headlineOpacity = isMobile ? 1 : Math.max(0.5, 1 - progress * 2);

  const heading = (
    <div
      style={{
        position: isMobile ? 'relative' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: isMobile ? 'auto' : 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        pointerEvents: 'none',
        opacity: headlineOpacity,
        transition: 'opacity 0.1s linear',
        padding: isMobile ? '0 20px' : '0',
      }}
    >
      <h2
        style={{
          fontFamily: font.display,
          fontWeight: 900,
          fontSize: isMobile ? 42 : 'clamp(56px, 8vw, 120px)',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          color: color.white,
          margin: 0,
          textAlign: 'center',
        }}
      >
        {clientStories.headline[0]}
        <br />
        our <AccentWord>clients.</AccentWord>
      </h2>
      <p
        style={{
          fontFamily: font.body,
          fontWeight: 300,
          fontSize: isMobile ? 15 : 18,
          color: color.white,
          lineHeight: '28px',
          margin: '24px 0 0',
          textAlign: 'center',
          maxWidth: 560,
        }}
      >
        {clientStories.subheadBefore}
        <span ref={counterRef} style={{ fontWeight: 700, fontFamily: font.sans }}>
          {startupCount >= clientStories.startupCount
            ? `${clientStories.startupCount}+`
            : startupCount}
        </span>
        {clientStories.subheadAfter}
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <section
        id="clientstories"
        data-section="clientstories"
        style={{ position: 'relative', background: color.ink, padding: '80px 0' }}
      >
        {heading}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: '48px 20px 0',
            width: '100%',
          }}
        >
          {caseStudies.map((study) => (
            <button
              key={study.slug}
              type="button"
              onClick={() => onOpenCaseStudy(study.slug)}
              style={{
                background: color.surfaceDark,
                borderRadius: 20,
                border: 'none',
                padding: 20,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                cursor: 'pointer',
              }}
            >
              <AutoplayVideo
                src={study.video}
                preload="metadata"
                style={{
                  width: '100%',
                  aspectRatio: '280 / 220',
                  objectFit: 'cover',
                  borderRadius: 14,
                }}
              />

              <p
                style={{
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: 20,
                  color: color.white,
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {study.title}
              </p>

              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { value: study.months, label: 'Months' },
                  { value: study.tasks, label: 'Tasks delivered' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      style={{
                        fontFamily: font.sans,
                        fontWeight: 900,
                        fontSize: 24,
                        color: color.white,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontFamily: font.body,
                        fontWeight: 500,
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.5)',
                        margin: '4px 0 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <span
                style={{
                  background: color.brand,
                  borderRadius: 12,
                  padding: '14px 0',
                  fontFamily: font.body,
                  fontWeight: 700,
                  fontSize: 14,
                  color: color.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                Read use case
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="clientstories"
      data-section="clientstories"
      ref={trackRef}
      style={{ position: 'relative', height: '250vh', background: color.ink }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {heading}
        {caseStudies.map((study, index) => {
          const layout = storyCardLayouts[index];
          if (!layout) return null;

          return (
            <StoryCard
              key={study.slug}
              study={study}
              layout={layout as StoryCardLayout}
              progress={progress}
              stackIndex={index}
              onOpen={() => onOpenCaseStudy(study.slug)}
            />
          );
        })}
      </div>
    </section>
  );
}
