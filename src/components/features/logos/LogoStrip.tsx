'use client';

import { color, font, weight } from '@/config/tokens';
import { logoStrip } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

/**
 * Row of client marks.
 *
 * A client with no logo file yet is set as a wordmark rather than left out or
 * stood in for by someone else's mark. Supplying `src` on the entry swaps the
 * wordmark for the real logo with no other change.
 */
export function LogoStrip() {
  const isMobile = useIsMobile();
  const { ref, style } = useRevealOnScroll<HTMLDivElement>();

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
          maxWidth: 1280,
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

        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '28px 36px' : '32px 88px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '0 32px',
            listStyle: 'none',
          }}
        >
          {logoStrip.logos.map((logo) => (
            <li key={logo.name}>
              {logo.src ? (
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
              ) : (
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
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
