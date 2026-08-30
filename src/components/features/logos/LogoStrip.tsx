'use client';

import { color, font } from '@/config/tokens';
import { logoStrip } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

/** Row of past-employer logos, greyscaled and evenly spread. */
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
            fontWeight: 500,
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

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? 32 : 113,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '0 32px',
          }}
        >
          {logoStrip.logos.map((logo) => (
            /* eslint-disable-next-line @next/next/no-img-element -- fixed intrinsic sizes, optically balanced per logo */
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              style={{
                width: isMobile ? Math.round(logo.width * 0.66) : logo.width,
                height: isMobile ? Math.round(logo.height * 0.66) : logo.height,
                objectFit: 'contain',
                filter: 'grayscale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
