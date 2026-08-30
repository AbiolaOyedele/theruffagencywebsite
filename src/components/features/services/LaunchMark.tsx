'use client';

import type { CSSProperties, RefObject } from 'react';
import { LOGO_ASPECT, RuffLogo } from '@/components/ui/RuffLogo';

/**
 * How much larger than its on-screen size the mark is laid out, so it survives
 * the pinned zoom without going soft. Matches the zoom's fill scale.
 */
const SUPERSAMPLE = 4;

interface LaunchMarkProps {
  readonly width: number;
  readonly height: number;
  /** Shared so the parent can fade the mark out at the end of the zoom. */
  readonly markRef: RefObject<SVGSVGElement | null>;
}

/**
 * "Delivered, ready to launch" — the last card's art, and the transition into
 * the dark client-stories section.
 *
 * The wordmark sits alone on the card and grows with it as the section zooms
 * to fill the screen, then fades as the dark section takes over.
 */
export function LaunchMark({ width, height, markRef }: LaunchMarkProps) {
  const markSize = Math.min(width, height) * 0.62;

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
    </div>
  );
}
