'use client';

import { useEffect, useRef, useState } from 'react';
import { CloudScene } from '@/components/features/how-it-works/CloudScene';
import { DotGrid } from '@/components/features/how-it-works/DotGrid';
import { FeatureCard } from '@/components/features/how-it-works/FeatureCard';
import { ToolStack } from '@/components/features/how-it-works/ToolStack';
import { cardAccents, color } from '@/config/tokens';
import { features } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { clamp } from '@/utils/scroll';

/** Gap between cards in the horizontal track. */
const CARD_GAP = 33;
/** Share of the pin used for horizontal travel; the rest drives the zoom. */
const TRAVEL_RATIO = 4 / 5;
/** Cards that carry a generative illustration rather than video footage. */
const ILLUSTRATED_CARDS = new Set([2, 3, 4]);

/**
 * Measures the viewport, re-reading on resize.
 *
 * Falls back to the last good size if the browser momentarily reports zero
 * (hidden tabs and some embedded panes do), so downstream card and canvas
 * dimensions never go negative.
 */
function useViewport(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const sync = (): void => {
      setSize((previous) => ({
        width: window.innerWidth > 0 ? window.innerWidth : previous.width,
        height: window.innerHeight > 0 ? window.innerHeight : previous.height,
      }));
    };
    sync();
    window.addEventListener('resize', sync, { passive: true });
    return () => window.removeEventListener('resize', sync);
  }, []);

  return size;
}

/**
 * The pinned "How it works" section.
 *
 * A 500vh track pins one viewport while five cards translate horizontally.
 * The first four fifths of the scroll drive that travel; the last fifth zooms
 * the final card until it fills the screen and its background mixes to ink —
 * which is how the page transitions into the dark client-stories section.
 *
 * On mobile the pin is replaced by a plain vertical stack, and horizontal
 * swipes inside the pinned area are translated into scroll.
 */
export function HowItWorks() {
  const isMobile = useIsMobile();
  const viewport = useViewport();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardShellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRevealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const revealed = useRef<boolean[]>(features.map(() => false));
  const lastRevealAt = useRef(0);
  const finalMediaRef = useRef<HTMLDivElement | null>(null);
  const finalMarkRef = useRef<SVGSVGElement | null>(null);
  const scrollVelocity = useRef(0);
  const zoomProgress = useRef(0);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  const cardWidth = isMobile ? Math.max(240, Math.min(320, viewport.width - 32)) : 487;
  const railPadding = isMobile ? 20 : 80;
  const desktopMediaHeight = Math.max(240, Math.min(694, viewport.height - 112 - 260));
  const mediaHeight = isMobile ? Math.round(cardWidth * 1.35) : desktopMediaHeight;

  // Horizontal pin, card entrances, and the final zoom-to-dark transition.
  useEffect(() => {
    if (isMobile) return;

    const DAMPING = 0.8;
    let skew = 0;
    let previousScrolled = 0;
    let frame = 0;

    const render = (): void => {
      const track = trackRef.current;
      const rail = railRef.current;
      const stage = stageRef.current;

      if (!track || !rail) {
        frame = requestAnimationFrame(render);
        return;
      }

      // clientWidth, not innerWidth: on platforms with classic (space-taking)
      // scrollbars innerWidth includes the scrollbar, which would centre every
      // card half a scrollbar off and leave a sliver uncovered by the zoom.
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      const pinLength = track.offsetHeight - viewportHeight;
      const travelLength = pinLength * TRAVEL_RATIO;
      const zoomLength = pinLength / 5;
      const scrolled = Math.max(0, -track.getBoundingClientRect().top);

      const delta = scrolled - previousScrolled;
      previousScrolled = scrolled;
      scrollVelocity.current = delta;

      // Cards lag behind the rail slightly, proportional to scroll speed.
      skew =
        scrolled <= travelLength
          ? Math.max(-28, Math.min(28, skew * DAMPING + delta * 0.3))
          : skew * DAMPING;

      // Translate the rail so the first card starts centred and the last ends centred.
      const firstCentre = railPadding + cardWidth / 2;
      const lastCentre =
        railPadding + (features.length - 1) * (cardWidth + CARD_GAP) + cardWidth / 2;
      const startOffset = viewportWidth / 2 - firstCentre;
      const endOffset = viewportWidth / 2 - lastCentre;
      const railOffset =
        startOffset + clamp(scrolled / travelLength) * (endOffset - startOffset);

      rail.style.transform = `translateX(${railOffset}px)`;
      cardShellRefs.current.forEach((shell, index) => {
        if (shell) shell.style.transform = `translateX(${skew * (index + 1)}px)`;
      });

      // Stagger each card in as it crosses into view.
      const now = performance.now();
      cardRevealRefs.current.forEach((card, index) => {
        if (!card || revealed.current[index]) return;
        if (card.getBoundingClientRect().left >= viewportWidth * 0.75) return;
        if (now < lastRevealAt.current) return;

        revealed.current[index] = true;
        lastRevealAt.current = now + 350;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0px) skewY(0deg)';
        cardVideoRefs.current[index]?.style.setProperty('transform', 'scale(1)');
      });

      if (!stage) {
        frame = requestAnimationFrame(render);
        return;
      }

      // Final fifth: blow the last card up to fill the viewport and go dark.
      const zoom = clamp((scrolled - travelLength) / zoomLength);
      zoomProgress.current = zoom;

      const eased = 1 - (1 - zoom) ** 3;
      // A hair over full coverage, so sub-pixel rounding can never leave a
      // sliver of the panel behind showing at an edge.
      const fillScale =
        Math.max(viewportWidth / cardWidth, viewportHeight / Math.max(1, desktopMediaHeight)) *
        1.02;

      // Where the final card sits, derived from layout rather than measured off
      // a live rect — by the time the zoom starts the rail has finished its
      // travel, which centres the last card horizontally. Reading a
      // getBoundingClientRect() here would fold in the transform we are about
      // to set and drift the origin off-screen.
      const originX = viewportWidth / 2;
      let originY = viewportHeight / 2;

      const media = finalMediaRef.current;
      if (media) {
        // offsetTop is pre-transform, so this survives the stage being scaled.
        let offset = 0;
        let node: HTMLElement | null = media;
        while (node && node !== stickyRef.current) {
          offset += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        originY = offset + desktopMediaHeight / 2;
      }

      // Scale about that point, then glide it to the middle of the viewport so
      // the logo lands centred at full size.
      const driftX = (viewportWidth / 2 - originX) * eased;
      const driftY = (viewportHeight / 2 - originY) * eased;

      stage.style.transformOrigin = `${originX}px ${originY}px`;
      stage.style.transform = `translate(${driftX}px, ${driftY}px) scale(${1 + (fillScale - 1) * eased})`;

      // Fade the final card's panel from cream to ink so the section lands
      // on the same near-black the client-stories section starts from.
      if (media) {
        const darkness = 1 - (1 - clamp((zoom - 0.4) / 0.6)) ** 3;
        const from = cardAccents[features.length - 1] ?? color.cream;
        media.style.background = `color-mix(in srgb, ${color.ink} ${Math.round(darkness * 100)}%, ${from})`;
      }

      const mark = finalMarkRef.current;
      if (mark) {
        const size = Math.min(cardWidth, desktopMediaHeight) * 0.45;
        mark.style.width = `${size}px`;
        mark.style.height = `${size * 1.18}px`;
        mark.style.transform = 'translate(-50%, -50%)';
        // Fade the monogram out as the section scrolls past the pin.
        mark.style.opacity = `${1 - clamp((scrolled - pinLength) / (viewportHeight * 0.5))}`;
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [isMobile, cardWidth, railPadding, desktopMediaHeight]);

  // Translate horizontal swipes inside the pin into vertical scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isMobile) return;

    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let axis: 'unknown' | 'horizontal' | 'vertical' = 'unknown';

    const onTouchStart = (event: TouchEvent): void => {
      const touch = event.touches[0];
      if (!touch) return;
      const pinLength = (track.offsetHeight - window.innerHeight) * TRAVEL_RATIO;
      const scrolled = Math.max(0, -track.getBoundingClientRect().top);
      if (scrolled <= 0 || scrolled >= pinLength) return;

      startX = touch.clientX;
      startY = touch.clientY;
      startScroll = window.scrollY;
      axis = 'unknown';
    };

    const onTouchMove = (event: TouchEvent): void => {
      const touch = event.touches[0];
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (axis === 'unknown' && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }
      if (axis !== 'horizontal') return;
      if (event.cancelable) event.preventDefault();

      const pinLength = (track.offsetHeight - window.innerHeight) * TRAVEL_RATIO;
      const pixelsPerCard = pinLength / Math.max(1, features.length - 1);
      const ratio = pixelsPerCard / (window.innerWidth * 0.7);
      window.scrollTo({ top: startScroll - dx * ratio });
    };

    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchmove', onTouchMove);
    };
  }, [isMobile]);

  const renderIllustration = (index: number) => {
    if (index === 2) return <DotGrid width={cardWidth} height={mediaHeight} />;
    if (index === 3) {
      return <ToolStack width={cardWidth} height={mediaHeight} velocityRef={scrollVelocity} />;
    }
    if (index === 4) {
      return (
        <CloudScene
          width={cardWidth}
          height={mediaHeight}
          zoomProgressRef={zoomProgress}
          velocityRef={scrollVelocity}
          markRef={finalMarkRef}
        />
      );
    }
    return null;
  };

  // Mobile: a plain vertical stack — no pin, no zoom, no horizontal scroll.
  if (isMobile) {
    return (
      <section
        id="how-it-works"
        data-section="how-it-works"
        style={{ background: color.white, padding: '64px 16px 80px' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              {...(feature.video ? { video: feature.video } : {})}
              cardWidth={cardWidth}
              mediaHeight={mediaHeight}
              {...(ILLUSTRATED_CARDS.has(index)
                ? { background: cardAccents[index] ?? color.cream }
                : {})}
            >
              {renderIllustration(index)}
            </FeatureCard>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div
      id="how-it-works"
      data-section="how-it-works"
      ref={trackRef}
      style={{ position: 'relative', height: '500vh', background: color.paper }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: color.white,
        }}
      >
        <div ref={stageRef} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              perspective: '1400px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            <div
              ref={railRef}
              style={{
                display: 'flex',
                gap: CARD_GAP,
                paddingLeft: railPadding,
                paddingRight: railPadding,
                willChange: 'transform',
              }}
            >
              {features.map((feature, index) => {
                const isFinal = index === features.length - 1;

                return (
                  <div
                    key={feature.title}
                    ref={(element) => {
                      cardShellRefs.current[index] = element;
                    }}
                    style={{ flexShrink: 0 }}
                  >
                    <div
                      ref={(element) => {
                        cardRevealRefs.current[index] = element;
                      }}
                      style={{
                        opacity: 0,
                        transform: 'translateY(80px) skewY(3deg)',
                        transition:
                          'opacity 0.6s ease, transform 1.2s cubic-bezier(.165,.84,.44,1)',
                        willChange: 'transform, opacity',
                      }}
                    >
                      <FeatureCard
                        title={feature.title}
                        description={feature.description}
                        icon={feature.icon}
                        {...(feature.video ? { video: feature.video } : {})}
                        cardWidth={cardWidth}
                        mediaHeight={mediaHeight}
                        {...(ILLUSTRATED_CARDS.has(index)
                          ? { background: cardAccents[index] ?? color.cream }
                          : {})}
                        videoRef={(element) => {
                          cardVideoRefs.current[index] = element;
                        }}
                        {...(isFinal ? { mediaRef: finalMediaRef } : {})}
                      >
                        {renderIllustration(index)}
                      </FeatureCard>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
