'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StoryCard, type StoryCardLayout } from '@/components/features/work/StoryCard';
import { AccentWord } from '@/components/ui/AccentWord';
import { color, font, shape, weight } from '@/config/tokens';
import { useCountUp } from '@/hooks/useCountUp';
import { useIsMobile } from '@/hooks/useIsMobile';
import { hasStory } from '@/types/content';
import { hideNavForHandover } from '@/utils/overlayChrome';
import { clamp } from '@/utils/scroll';
import { useContent } from '@/components/providers/ContentProvider';

/** How far the stage flies into the clicked card before the panel takes over. */
const ZOOM_SCALE = 12;
/** Zoom runs for 0.7s; the panel is handed the card at 0.5s, mid-flight. */
const HANDOVER_MS = 500;

/** Stage of the card-to-panel handover. */
type ZoomPhase = 'idle' | 'zooming' | 'done';

interface WorkProps {
  readonly onOpenCaseStudy: (slug: string, fromRect: DOMRect) => void;
  /** Slug of the open panel, or null. Returning to null unwinds the zoom. */
  readonly activeSlug: string | null;
}

/**
 * "Real work, real results" — a pinned dark section.
 *
 * The headline sits behind three client cards that deal themselves in as you
 * scroll, fading the headline back as they arrive. Below `md` the fan is
 * replaced by a readable vertical list.
 */
export function Work({ onOpenCaseStudy, activeSlug }: WorkProps) {
  const { caseStudies, storyCardLayouts, work } = useContent();
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [zoomPhase, setZoomPhase] = useState<ZoomPhase>('idle');
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [progress, setProgress] = useState(0);
  const { ref: counterRef, value: campaigns } = useCountUp<HTMLSpanElement>(work.campaignCount);

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

  /**
   * Flies the whole stage into the card that was clicked, so the panel that
   * opens on top of it reads as the card itself expanding rather than as a
   * separate screen arriving.
   */
  const openStudy = useCallback(
    (slug: string, fromRect: DOMRect) => {
      // Hidden for the half-second the stage is flying into the card, before
      // the panel exists to claim the chrome itself. Handing it back is the
      // panel's job — `claimOverlayChrome` counts the panels stacked up, and
      // restoring it here would uncover the nav under a panel still open.
      hideNavForHandover();

      const stage = stageRef.current;
      if (stage) {
        const bounds = stage.getBoundingClientRect();
        setZoomOrigin(
          `${fromRect.left + fromRect.width / 2 - bounds.left}px ${fromRect.top + fromRect.height / 2 - bounds.top}px`,
        );
      }

      // A frame between origin and scale, or the origin change animates too.
      requestAnimationFrame(() => setZoomPhase('zooming'));
      setTimeout(() => {
        setZoomPhase('done');
        onOpenCaseStudy(slug, fromRect);
      }, HANDOVER_MS);
    },
    [onOpenCaseStudy],
  );

  // With no panel open the stage is always at rest, whatever the last
  // handover left behind — so closing drops it back to size on its own.
  const phase: ZoomPhase = activeSlug === null ? 'idle' : zoomPhase;

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
          fontWeight: weight.black,
          fontSize: isMobile ? 42 : 'clamp(56px, 8vw, 120px)',
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          color: color.white,
          margin: 0,
          textAlign: 'center',
        }}
      >
        {work.headline[0]}
        <br />
        real <AccentWord>results.</AccentWord>
      </h2>
      <p
        style={{
          fontFamily: font.body,
          fontWeight: weight.light,
          fontSize: isMobile ? 15 : 18,
          color: color.white,
          lineHeight: '28px',
          margin: '24px 0 0',
          textAlign: 'center',
          maxWidth: 560,
        }}
      >
        {work.subheadBefore}
        <span ref={counterRef} style={{ fontFamily: font.sans, fontWeight: weight.bold }}>
          {campaigns >= work.campaignCount ? `${work.campaignCount}+` : campaigns}
        </span>
        {work.subheadAfter}
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <section
        id="work"
        data-section="work"
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
          {caseStudies.map((study) => {
            const openable = hasStory(study);
            const inner = (
              <>
                <p
                  style={{
                    fontFamily: font.display,
                    fontWeight: weight.black,
                    fontSize: 32,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: color.ink,
                    margin: 0,
                  }}
                >
                  {study.client}
                </p>
                {study.title ? (
                  <p
                    style={{
                      fontFamily: font.body,
                      fontWeight: weight.light,
                      fontSize: 15,
                      color: color.ink,
                      margin: 0,
                      opacity: 0.8,
                    }}
                  >
                    {study.title}
                  </p>
                ) : null}
                {openable ? (
                  <span
                    style={{
                      background: color.ink,
                      borderRadius: 999,
                      padding: '14px 0',
                      fontFamily: font.sans,
                      fontWeight: weight.bold,
                      fontSize: 14,
                      color: color.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {work.cardCta}
                  </span>
                ) : null}
              </>
            );

            const cardStyle = {
              background: study.accent,
              borderRadius: 24,
              border: shape.keyline,
              boxShadow: shape.hardShadow,
              padding: 24,
              textAlign: 'left' as const,
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 14,
              minHeight: 200,
              justifyContent: 'flex-end' as const,
            };

            return openable ? (
              <button
                key={study.slug}
                type="button"
                onClick={(event) =>
                  onOpenCaseStudy(study.slug, event.currentTarget.getBoundingClientRect())
                }
                style={{ ...cardStyle, cursor: 'pointer' }}
              >
                {inner}
              </button>
            ) : (
              <div key={study.slug} style={cardStyle}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      data-section="work"
      ref={trackRef}
      style={{ position: 'relative', height: '250vh', background: color.ink }}
    >
      <div
        ref={stageRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: zoomOrigin,
          transform: phase === 'idle' ? 'scale(1)' : `scale(${ZOOM_SCALE})`,
          opacity: phase === 'done' ? 0 : 1,
          // Idle only transitions opacity, so closing snaps the scale back
          // while the stage fades in — no giant card flying across the screen.
          transition:
            phase === 'zooming'
              ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'opacity 0.35s ease',
          pointerEvents: phase === 'idle' ? undefined : 'none',
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
              onOpen={(fromRect) => openStudy(study.slug, fromRect)}
            />
          );
        })}
      </div>
    </section>
  );
}
