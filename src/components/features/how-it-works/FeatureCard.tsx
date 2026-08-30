'use client';

import type { ReactNode, Ref } from 'react';
import { AutoplayVideo } from '@/components/ui/AutoplayVideo';
import { color, font, shape } from '@/config/tokens';
import { useIsMobile } from '@/hooks/useIsMobile';
import { scrollToSection } from '@/utils/scroll';

interface FeatureCardProps {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly video?: string;
  readonly cardWidth: number;
  readonly mediaHeight: number;
  /** Overrides the media panel's background (used by the cream/dark cards). */
  readonly background?: string;
  /** Generative illustration rendered inside the media panel. */
  readonly children?: ReactNode;
  readonly videoRef?: Ref<HTMLVideoElement | null>;
  readonly mediaRef?: Ref<HTMLDivElement>;
}

/**
 * One card in the "How it works" track: a tall media panel with the icon,
 * title and copy sitting underneath it. The whole card jumps to pricing.
 */
export function FeatureCard({
  title,
  description,
  icon,
  video,
  cardWidth,
  mediaHeight,
  background,
  children,
  videoRef,
  mediaRef,
}: FeatureCardProps) {
  const isMobile = useIsMobile();
  const cornerRadius = Math.round((mediaHeight / 694) * 37);

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${title} — see pricing`}
      onClick={() => scrollToSection('pricing')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          scrollToSection('pricing');
        }
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        width: cardWidth,
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      <div
        ref={mediaRef}
        style={{
          position: 'relative',
          borderRadius: cornerRadius,
          height: mediaHeight,
          overflow: 'hidden',
          flexShrink: 0,
          background: background ?? color.paper,
          border: shape.keyline,
          boxShadow: shape.hardShadow,
        }}
      >
        {video ? (
          <AutoplayVideo
            ref={videoRef}
            src={video}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.15)',
              transition: 'transform 1.8s cubic-bezier(.165,.84,.44,1)',
            }}
          />
        ) : null}
        {children}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 437 }}>
        <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 20px inline icon */}
          <img
            src={icon}
            alt=""
            width={20}
            height={20}
            style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
          />
          <h3
            style={{
              fontFamily: font.sans,
              fontWeight: 700,
              fontSize: isMobile ? 15 : 20,
              color: color.inkHeading,
              letterSpacing: '-0.2px',
              lineHeight: 'normal',
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>
        <p
          style={{
            fontFamily: font.sans,
            fontWeight: 500,
            fontSize: isMobile ? 13 : 18,
            color: color.inkHeading,
            letterSpacing: '-0.18px',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
