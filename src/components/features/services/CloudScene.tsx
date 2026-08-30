'use client';

import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';
import { LOGO_ASPECT, RuffLogo } from '@/components/ui/RuffLogo';

/**
 * How much larger than its on-screen size the mark is laid out, so it survives
 * the pinned zoom without going soft. Matches the zoom's fill scale.
 */
const SUPERSAMPLE = 4;

interface CloudSceneProps {
  readonly width: number;
  readonly height: number;
  /** Zoom progress of the final card, 0 → 1, drives the clouds parting. */
  readonly zoomProgressRef: RefObject<number>;
  /** Live scroll velocity, for a little lateral sway. */
  readonly velocityRef: RefObject<number>;
  /** Shared so the parent can fade the monogram out at the end of the zoom. */
  readonly markRef: RefObject<SVGSVGElement | null>;
}

/**
 * "Flexible and predictable" illustration — and the transition into the dark
 * client-stories section.
 *
 * Two soft clouds sit over the monogram; as the card zooms to fill the screen
 * they slide apart to reveal it, swaying with scroll velocity.
 */
export function CloudScene({
  width,
  height,
  zoomProgressRef,
  velocityRef,
  markRef,
}: CloudSceneProps) {
  const leftCloudRef = useRef<HTMLImageElement | null>(null);
  const rightCloudRef = useRef<HTMLImageElement | null>(null);
  const sway = useRef(0);

  const markSize = Math.min(width, height) * 0.62;
  const cloudSize = Math.min(width, height) * 0.65;

  useEffect(() => {
    let frame = 0;

    const render = (): void => {
      const zoom = 1 - (1 - (zoomProgressRef.current ?? 0)) ** 2;
      const velocity = velocityRef.current ?? 0;

      sway.current = Math.max(-18, Math.min(18, sway.current * 0.92 + velocity * 0.12));
      const drift = sway.current;

      if (leftCloudRef.current) {
        leftCloudRef.current.style.transform = `translate(${-zoom * width * 0.55 + drift * 1.2}px, ${-zoom * height * 0.35 + drift * 0.4}px)`;
      }
      if (rightCloudRef.current) {
        rightCloudRef.current.style.transform = `translate(${zoom * width * 0.55 - drift * 0.8}px, ${zoom * height * 0.35 - drift * 0.3}px)`;
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [width, height, zoomProgressRef, velocityRef]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/*
        Laid out SUPERSAMPLE times larger and scaled back down. The card this
        sits in gets blown up ~4x by the pinned zoom, and the compositor
        stretches whatever bitmap it already rasterised rather than redrawing
        the vector — so the mark is rasterised at its final on-screen size up
        front. No will-change here for the same reason: promoting it to its own
        layer locks in the small raster.
      */}
      <RuffLogo
        ref={markRef}
        style={
          {
            position: 'absolute',
            left: '50%',
            top: '50%',
            '--mark-width': `${markSize}px`,
            width: `calc(var(--mark-width) * ${SUPERSAMPLE})`,
            height: `calc(var(--mark-width) * ${SUPERSAMPLE} / ${LOGO_ASPECT.wordmark})`,
            // The supersampled box is wider than its parent on purpose; the
            // global responsive `max-width: 100%` would clamp it back down.
            maxWidth: 'none',
            transform: `translate(-50%, -50%) scale(${1 / SUPERSAMPLE})`,
          } as CSSProperties
        }
      />

      {/* eslint-disable-next-line @next/next/no-img-element -- transform-animated decorative art */}
      <img
        ref={leftCloudRef}
        src="/assets/cloud1.webp"
        alt=""
        style={{
          position: 'absolute',
          width: cloudSize,
          height: 'auto',
          top: '8%',
          left: '-5%',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- transform-animated decorative art */}
      <img
        ref={rightCloudRef}
        src="/assets/cloud2.webp"
        alt=""
        style={{
          position: 'absolute',
          width: cloudSize,
          height: 'auto',
          bottom: '8%',
          right: '-5%',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
