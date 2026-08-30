'use client';

import type { CSSProperties, Ref } from 'react';
import { color, font } from '@/config/tokens';
import { AutoplayVideo } from '@/components/ui/AutoplayVideo';
import { NotificationHeader } from '@/components/ui/NotificationCard';

/** Intrinsic size of the mockup's coordinate space. */
export const PHONE_STAGE_WIDTH = 891;
export const PHONE_STAGE_HEIGHT = 634;

const STATUS_ICONS = [
  { src: '/assets/bbce9ed952a7420976ed2c9f616ed1df87bdb9aa.svg', width: 12 },
  { src: '/assets/c711fe9ebd777477bb6d7ed5d01bcceba139f212.svg', width: 11 },
  { src: '/assets/7b95b73d9de4dcf48f3ddcb20e754ae7f424ef4a.svg', width: 17 },
] as const;

interface PhoneMockupProps {
  /** Height of the white notification card. Collapses to the header row only. */
  readonly cardHeight?: number;
  /** Fades the notification card in; the intro reveals it before the chrome. */
  readonly cardVisible?: boolean;
  /** Hides the hand photo and status bar until the intro has revealed them. */
  readonly chromeVisible?: boolean;
  /** Transition applied to the notification card, for the intro sequence. */
  readonly cardTransition?: string;
  readonly chromeTransition?: string;
  /** Set false while the intro controls playback manually. */
  readonly autoPlay?: boolean;
  readonly videoRef?: Ref<HTMLVideoElement | null>;
  readonly style?: CSSProperties;
  readonly ref?: Ref<HTMLDivElement>;
}

/**
 * Hand-holding-a-phone composition with the in-app delivery notification.
 *
 * Rendered at a fixed 891×634 stage so every absolute offset stays exact;
 * callers scale or clip it to fit their section.
 */
export function PhoneMockup({
  cardHeight = 442,
  cardVisible = true,
  chromeVisible = true,
  cardTransition,
  chromeTransition,
  autoPlay = true,
  videoRef,
  style,
  ref,
}: PhoneMockupProps) {
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: PHONE_STAGE_WIDTH,
        height: PHONE_STAGE_HEIGHT,
        flexShrink: 0,
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size art board asset, sized by the stage not the layout */}
      <img
        src="/assets/105e7cd3a106296d90d081af3766923516632143.webp"
        alt=""
        fetchPriority="high"
        style={{
          position: 'absolute',
          top: -31,
          left: -85,
          width: 1061,
          height: 707,
          // The art board is a fixed coordinate space: the notification card is
          // positioned against these exact pixels, so the global responsive
          // `max-width: 100%` must not shrink the photo out from under it.
          maxWidth: 'none',
          pointerEvents: 'none',
          opacity: chromeVisible ? 1 : 0,
          transition: chromeTransition,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 321,
          top: 54,
          width: 249,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 15px',
          opacity: chromeVisible ? 1 : 0,
          transition: chromeTransition,
        }}
      >
        <span style={{ fontFamily: font.body, fontWeight: 700, fontSize: 10.5, color: color.ink }}>
          9:41
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {STATUS_ICONS.map((icon) => (
            /* eslint-disable-next-line @next/next/no-img-element -- tiny inline status glyph */
            <img key={icon.src} src={icon.src} alt="" style={{ width: icon.width, height: 8 }} />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 340,
          top: 115,
          width: 211,
          height: cardHeight,
          background: color.white,
          borderRadius: 17,
          // The card sits on a white hero now, so it needs its own edge.
          border: `1.5px solid ${color.ink}`,
          padding: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
          overflow: 'hidden',
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: cardTransition,
        }}
      >
        <NotificationHeader />

        <AutoplayVideo
          ref={videoRef}
          src="/notif.mp4"
          playOnMount={autoPlay}
          style={{ flex: 1, width: '100%', borderRadius: 10, objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
