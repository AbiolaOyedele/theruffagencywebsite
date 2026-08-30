'use client';

import { useState } from 'react';
import { AutoplayVideo } from '@/components/ui/AutoplayVideo';
import { color, font } from '@/config/tokens';
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
  /** Scroll progress through the pinned stories section, 0 → 1. */
  readonly progress: number;
  readonly stackIndex: number;
  readonly onOpen: () => void;
}

/**
 * One card in the fanned "hand of cards" gallery.
 *
 * Deals itself in from the side as the section scrolls, straightens and lifts
 * on hover, and reveals its engagement stats on cards that fly out beside it.
 */
export function StoryCard({ study, layout, progress, stackIndex, onOpen }: StoryCardProps) {
  const [hovered, setHovered] = useState(false);

  const dealt = clamp((progress - layout.enterAt) / 0.18);
  const eased = easeOutCubic(dealt);
  const left = layout.x + (1 - eased) * (layout.from === 'left' ? -15 : 15);
  const top = 120 + (layout.y - 120) * eased;
  const rotation = 25 + (layout.rotation - 25) * eased;
  const opacity = Math.min(1, dealt * 3);

  const stats = [
    { label: 'Months', value: `${study.months}` },
    { label: 'Tasks delivered', value: `${study.tasks}` },
    { label: 'Impact', value: study.impact },
  ] as const;

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
        aria-label={`Read the ${study.collaboration} use case`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={onOpen}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          border: 'none',
          background: 'none',
          borderRadius: 16,
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          transform: `rotate(${hovered ? 0 : rotation}deg) scale(${hovered ? 1.06 : 1})`,
          transition: hovered
            ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'transform 0.4s ease',
          cursor: 'pointer',
          display: 'block',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            background: color.surfaceDark,
            position: 'relative',
          }}
        >
          <AutoplayVideo
            src={study.video}
            preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10,13,18,0.9)',
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
              {/* eslint-disable-next-line @next/next/no-img-element -- client logo, optically sized per brand */}
              <img
                src={study.logo}
                alt=""
                style={{
                  height: study.logoHeight,
                  width: 'auto',
                  marginBottom: 12,
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
              <p
                style={{
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: 14,
                  color: color.white,
                  lineHeight: '21px',
                  margin: 0,
                }}
              >
                {study.title}
              </p>
            </div>
          </div>

          <span
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              background: color.brand,
              borderRadius: 12,
              padding: '12px 0',
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 13,
              color: color.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              pointerEvents: 'none',
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
            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
            opacity: hovered ? 1 : 0,
            transform: hovered
              ? 'translateY(0) rotate(0deg) scale(1)'
              : `translateY(${40 + index * 20}px) rotate(0deg) scale(0.85)`,
            transition: `opacity 0.3s ease ${index * 0.07}s, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.07}s`,
            pointerEvents: 'none',
          }}
        >
          {stat.label === 'Impact' ? (
            <>
              <span
                style={{
                  display: 'block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color.brand,
                  marginBottom: 8,
                }}
              />
              <p
                style={{
                  fontFamily: font.body,
                  fontWeight: 700,
                  fontSize: 12,
                  color: color.ink,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {stat.value}
              </p>
            </>
          ) : (
            <>
              <p
                style={{
                  fontFamily: font.sans,
                  fontWeight: 900,
                  fontSize: 26,
                  color: color.ink,
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
                  color: color.muted,
                  margin: '4px 0 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
