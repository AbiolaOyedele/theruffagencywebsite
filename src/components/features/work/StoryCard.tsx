'use client';

import { useState } from 'react';
import { AutoplayVideo } from '@/components/ui/AutoplayVideo';
import { imageUrl } from '@/lib/images';
import { color, font, primaryButton, shape, weight } from '@/config/tokens';
import { work } from '@/content/site';
import type { CaseStudy } from '@/types/content';
import { clamp, easeOutCubic } from '@/utils/scroll';

/** Position and entrance timing for one fanned card. */
export interface StoryCardLayout {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly from: 'left' | 'right';
  readonly enterAt: number;
}

interface StoryCardProps {
  readonly study: CaseStudy;
  readonly layout: StoryCardLayout;
  /** Scroll progress through the pinned work section, 0 → 1. */
  readonly progress: number;
  readonly stackIndex: number;
  /** Receives the card's on-screen box so the panel can grow out of it. */
  readonly onOpen: (fromRect: DOMRect) => void;
}

/**
 * One card in the fanned "hand of cards" gallery.
 *
 * Deals itself in from the side as the section scrolls, straightens and lifts
 * on hover. Hovering dims the footage and brings the client's name forward.
 * Stat tiles fly out beside it, but only for stats that actually exist — a
 * client whose numbers have not come back yet simply shows none.
 */
export function StoryCard({ study, layout, progress, stackIndex, onOpen }: StoryCardProps) {
  const [hovered, setHovered] = useState(false);

  const dealt = clamp((progress - layout.enterAt) / 0.18);
  const eased = easeOutCubic(dealt);
  const left = layout.x + (1 - eased) * (layout.from === 'left' ? -15 : 15);
  const top = 120 + (layout.y - 120) * eased;
  const rotation = 25 + (layout.rotation - 25) * eased;
  const opacity = Math.min(1, dealt * 3);

  // A study still waiting on its write-up shows nothing under the client's
  // name. The placeholder headline reads as a real claim on a card, and the
  // card is in the HTML a crawler indexes.
  const cardLine = study.placeholder ? undefined : study.title;

  const stats: readonly { label: string; value: string }[] = (
    [
      { label: work.statLabels.duration, value: study.duration },
      { label: work.statLabels.deliverables, value: study.deliverables },
      // The placeholder impact line reads as a real claim on a card, and the
      // card is in the HTML a crawler reads. It stays inside the panel, which
      // carries the banner saying the write-up is not final.
      { label: work.statLabels.impact, value: study.placeholder ? undefined : study.impact },
    ] as { label: string; value?: string }[]
  ).flatMap((stat) => (stat.value ? [{ label: stat.label, value: stat.value }] : []));

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        width: 280,
        height: 370,
        opacity,
        zIndex: hovered ? 20 : 10 + stackIndex,
      }}
    >
      <button
        type="button"
        aria-label={`Read the ${study.client} story`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={(event) => onOpen(event.currentTarget.getBoundingClientRect())}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          border: 'none',
          background: 'none',
          borderRadius: 20,
          boxShadow: hovered ? shape.hardShadowPressed : shape.hardShadow,
          transform: `rotate(${hovered ? 0 : rotation}deg) scale(${hovered ? 1.06 : 1})`,
          transition: hovered
            ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease'
            : 'transform 0.4s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          display: 'block',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            background: study.accent,
            border: shape.keyline,
            position: 'relative',
          }}
        >
          {study.video ? (
            <AutoplayVideo
              src={study.video}
              preload="metadata"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(37, 2, 0, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px 24px 16px',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          >
            <div>
              {study.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element -- client mark, optically sized */
                <img
                  src={imageUrl(study.logo, 240)}
                  alt=""
                  style={{
                    height: study.logoHeight ?? 24,
                    width: 'auto',
                    marginBottom: 12,
                    display: 'block',
                    objectFit: 'contain',
                  }}
                />
              ) : null}
              <p
                style={{
                  fontFamily: font.display,
                  fontWeight: weight.black,
                  fontSize: 26,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: color.white,
                  margin: 0,
                }}
              >
                {study.client}
              </p>
              {cardLine ? (
                <p
                  style={{
                    fontFamily: font.body,
                    fontWeight: weight.light,
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.4,
                    margin: '10px 0 0',
                  }}
                >
                  {cardLine}
                </p>
              ) : null}
            </div>
          </div>

          <span
            style={{
              ...primaryButton,
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              padding: '12px 0',
              fontSize: 13,
              pointerEvents: 'none',
            }}
          >
            {work.cardCta}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </button>

      {stats.map((stat, index) => (
        <div
          key={stat.label}
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -180,
            top: index * 90 + 20,
            width: 160,
            background: color.white,
            borderRadius: 14,
            padding: '14px 16px',
            border: shape.keyline,
            boxShadow: shape.hardShadowSmall,
            opacity: hovered ? 1 : 0,
            transform: hovered
              ? 'translateY(0) scale(1)'
              : `translateY(${40 + index * 20}px) scale(0.85)`,
            transition: `opacity 0.3s ease ${index * 0.07}s, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.07}s`,
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              fontFamily: font.sans,
              fontWeight: weight.black,
              fontSize: stat.value.length > 12 ? 13 : 26,
              color: color.ink,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              fontFamily: font.sans,
              fontWeight: weight.medium,
              fontSize: 11,
              color: color.muted,
              margin: '6px 0 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
