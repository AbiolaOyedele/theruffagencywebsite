'use client';

import { useState, type ReactNode } from 'react';
import { AccentWord } from '@/components/ui/AccentWord';
import { PhoneMockup } from '@/components/ui/PhoneMockup';
import { color, font, primaryButton, primaryButtonPressed, shape } from '@/config/tokens';
import { brand, pricing } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import type { PricingPlan } from '@/types/content';

interface PricingCardProps {
  readonly plan: PricingPlan;
  readonly visual: ReactNode;
}

/**
 * One plan card. The banner is greyscale until hover, when it blooms into
 * full colour and the price picks up the brand red.
 */
function PricingCard({ plan, visual }: PricingCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={brand.bookACallUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`${plan.name} — ${plan.price}. Book a call.`}
      style={{
        background: color.white,
        borderRadius: 28,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        border: shape.keyline,
        boxShadow: hovered ? shape.hardShadowPressed : shape.hardShadow,
        transform: hovered ? 'translate(4px, 4px)' : 'translate(0, 0)',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
      }}
    >
      <div style={{ filter: hovered ? 'grayscale(0)' : 'grayscale(1)', transition: 'filter 0.4s ease' }}>
        {visual}
      </div>

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <h3
            style={{
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 30,
              lineHeight: 1.2,
              color: color.ink,
              margin: 0,
            }}
          >
            {plan.name}
          </h3>
          <span
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: 26,
              color: hovered ? color.brand : color.ink,
              letterSpacing: '-0.3px',
              transition: 'color 0.4s ease',
            }}
          >
            {plan.price}
          </span>
        </div>

        <p
          style={{
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: 15,
            color: color.muted,
            lineHeight: '24px',
            margin: 0,
          }}
        >
          {plan.description}
        </p>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none' }}>
          {plan.features.map((feature) => (
            <li key={feature.label} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 20px inline icon */}
              <img
                src={feature.icon}
                alt=""
                width={20}
                height={20}
                style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: 14,
                  color: color.ink,
                  lineHeight: '20px',
                }}
              >
                {feature.label}
              </span>
            </li>
          ))}
        </ul>

        <span
          style={{
            ...primaryButton,
            ...(hovered ? primaryButtonPressed : {}),
            width: '100%',
            padding: '16px 24px',
            fontSize: 16,
            marginTop: 'auto',
          }}
        >
          Book a call
        </span>
      </div>
    </a>
  );
}

/** Two-plan pricing block on the dark background. */
export function Pricing() {
  const isMobile = useIsMobile();
  const { ref, style } = useRevealOnScroll<HTMLDivElement>();
  const bannerHeight = isMobile ? 220 : 300;

  return (
    <section
      id="pricing"
      data-section="pricing"
      style={{
        background: color.paperAlt,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '64px 16px' : '96px 32px',
      }}
    >
      <div
        ref={ref}
        style={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          width: '100%',
          maxWidth: 1060,
        }}
      >
        <h2
          style={{
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: isMobile ? 36 : 'clamp(42px, 5vw, 64px)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: color.ink,
            margin: '0 0 16px',
            textAlign: 'center',
          }}
        >
          Simple, <AccentWord>honest</AccentWord> pricing.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 16,
            width: '100%',
          }}
        >
          {pricing.plans[0] ? (
            <PricingCard
              plan={pricing.plans[0]}
              visual={
                <div
                  style={{
                    background: color.brand,
                    height: bannerHeight,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PhoneMockup
                    style={{
                      transform: isMobile
                        ? 'scale(0.35) translateX(-240px)'
                        : 'scale(0.45) translateX(-180px)',
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
              }
            />
          ) : null}

          {pricing.plans[1] ? (
            <PricingCard
              plan={pricing.plans[1]}
              visual={
                <div style={{ background: color.brand, height: bannerHeight, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed banner sized by its container */}
                  <img
                    src="/assets/mission-phone-brand.webp"
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              }
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
