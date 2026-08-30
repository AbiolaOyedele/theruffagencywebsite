'use client';

import { color, font, weight } from '@/config/tokens';
import { logoStrip } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import type { ClientLogo } from '@/types/content';

/** Seconds one full pass of the list takes. Longer list, proportionally longer. */
const SECONDS_PER_NAME = 3.2;

/**
 * Marquee of client marks.
 *
 * The list is rendered twice and the track slides exactly one copy's width
 * before looping, so the seam never shows. A client with no logo file yet is
 * set as a wordmark rather than left out or stood in for by someone else's
 * mark; supplying `src` on the entry swaps in the real logo with no other
 * change.
 *
 * The strip pauses on hover and holds still entirely for anyone who has asked
 * for reduced motion — see `.marquee-track` in globals.css.
 */
export function LogoStrip() {
  const isMobile = useIsMobile();
  const still = usePrefersReducedMotion();
  const { ref, style } = useRevealOnScroll<HTMLDivElement>();

  const duration = logoStrip.logos.length * SECONDS_PER_NAME;
  // One copy, wrapped, when the strip is not allowed to move. The sliding
  // layout is `width: max-content` by necessity, which no stylesheet rule can
  // wrap — so the choice is made here rather than in a media query.
  const passes = still ? [0] : [0, 1];

  return (
    <section
      style={{
        background: color.white,
        display: 'flex',
        justifyContent: 'center',
        padding: isMobile ? '56px 0' : '96px 0',
        overflow: 'hidden',
      }}
    >
      <div
        ref={ref}
        style={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <p
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 16,
            color: color.muted,
            lineHeight: '24px',
            textAlign: 'center',
            margin: 0,
            padding: '0 32px',
          }}
        >
          {logoStrip.label}
        </p>

        {/* Faded at both ends so names enter and leave rather than being cut. */}
        <div
          className="marquee"
          style={{
            width: '100%',
            overflow: 'hidden',
            // A mask, not a gradient overlay: the hero behind this is white but
            // the section's own ground should not have to be repeated here.
            ...(still
              ? {}
              : {
                  maskImage:
                    'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
                }),
          }}
        >
          <ul
            className="marquee-track"
            style={{
              display: 'flex',
              width: still ? '100%' : 'max-content',
              justifyContent: 'center',
              alignItems: 'center',
              // No gap between the two copies: each carries half the spacing as
              // its own padding, so one copy's width is exactly the -50% the
              // animation slides — anything else and the loop jumps.
              gap: 0,
              margin: 0,
              padding: 0,
              listStyle: 'none',
              animationDuration: `${duration}s`,
            }}
          >
            {/* Two passes of the same list. The second is hidden from screen
                readers and from tab order — it exists only to fill the gap the
                first leaves as it slides away. */}
            {passes.map((pass) => (
              <li
                key={pass}
                aria-hidden={pass === 1 ? true : undefined}
                style={{ margin: 0, ...(still ? { width: '100%' } : {}) }}
              >
                <ul
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isMobile ? 36 : 88,
                    margin: 0,
                    padding: `0 ${isMobile ? 18 : 44}px`,
                    listStyle: 'none',
                    ...(still ? { flexWrap: 'wrap' as const, rowGap: 24 } : {}),
                  }}
                >
                  {logoStrip.logos.map((logo) => (
                    <li key={logo.name} style={{ margin: 0 }}>
                      <LogoMark logo={logo} isMobile={isMobile} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

interface LogoMarkProps {
  readonly logo: ClientLogo;
  readonly isMobile: boolean;
}

/** One client's mark: their logo where we have it, their name where we don't. */
function LogoMark({ logo, isMobile }: LogoMarkProps) {
  if (logo.src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- client marks vary in intrinsic size */
      <img
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        loading="lazy"
        style={{
          width: isMobile ? Math.round((logo.width ?? 120) * 0.66) : logo.width,
          height: isMobile ? Math.round((logo.height ?? 40) * 0.66) : logo.height,
          objectFit: 'contain',
          filter: 'grayscale(1)',
        }}
      />
    );
  }

  return (
    <span
      style={{
        fontFamily: font.display,
        fontWeight: weight.extrabold,
        fontSize: isMobile ? 22 : 30,
        letterSpacing: '-0.03em',
        color: color.ink,
        opacity: 0.62,
        whiteSpace: 'nowrap',
      }}
    >
      {logo.name}
    </span>
  );
}
