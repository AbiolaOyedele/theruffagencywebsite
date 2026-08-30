'use client';

import { useState, type Ref } from 'react';
import { LOGO_ASPECT, RuffLogo } from '@/components/ui/RuffLogo';
import { CopyEmailWatermark } from '@/components/features/footer/CopyEmailWatermark';
import { color, font, primaryButton, shape } from '@/config/tokens';
import { brand, footerLinks } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { scrollToSection } from '@/utils/scroll';
import type { OverlayKey } from '@/types/content';

interface FooterLinkProps {
  readonly label: string;
  readonly href: string;
  readonly onClick: () => void;
}

function FooterLink({ label, href, onClick }: FooterLinkProps) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: font.body,
        fontWeight: 700,
        fontSize: isMobile ? 15 : 17,
        color: hovered ? color.brand : color.ink,
        textDecoration: 'none',
        lineHeight: 1.6,
        transition: 'color 0.2s ease',
        // Keeps the row at the 44px minimum tap target on touch.
        padding: isMobile ? '10px 0' : '4px 0',
      }}
    >
      {label}
    </a>
  );
}

interface FooterProps {
  readonly onOpenOverlay: (key: OverlayKey) => void;
  readonly ref?: Ref<HTMLElement>;
}

/**
 * Two-block footer.
 *
 * It sits fixed behind the page content, so the last scroll of the page slides
 * the ink FAQ panel up and off it — the reveal is coordinated by <SiteRoot />.
 */
export function Footer({ onOpenOverlay, ref }: FooterProps) {
  const isMobile = useIsMobile();

  const columnHeadingStyle = {
    fontFamily: font.sans,
    fontWeight: 500,
    fontSize: 13,
    color: color.muted,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    margin: '0 0 16px',
  };

  return (
    <footer
      ref={ref}
      style={{
        background: color.paperAlt,
        padding: isMobile ? '24px 16px 32px' : '40px 40px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 16 : 24,
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            flex: isMobile ? '1 1 auto' : '0 0 380px',
            background: color.white,
            borderRadius: 28,
            border: shape.keyline,
            boxShadow: shape.hardShadow,
            padding: isMobile ? '28px 24px' : '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: isMobile ? 40 : 0,
            minHeight: isMobile ? 200 : 320,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <RuffLogo
            title={brand.name}
            style={{ height: 46, width: 46 * LOGO_ASPECT.wordmark, display: 'block' }}
          />

          <div>
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 700,
                fontSize: 18,
                color: color.ink,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {brand.tagline[0]}
            </p>
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: 18,
                color: color.muted,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {brand.tagline[1]}
            </p>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: color.white,
            borderRadius: 28,
            border: shape.keyline,
            boxShadow: shape.hardShadow,
            padding: isMobile ? '28px 24px' : 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: isMobile ? 32 : 0,
            position: 'relative',
            overflow: 'hidden',
            minHeight: isMobile ? 'auto' : 320,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
              width: 96,
              height: 96,
              background: color.accentPink,
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(12deg)',
              boxShadow: shape.hardShadowSmall,
            }}
          >
            <RuffLogo style={{ width: 68, height: 68 / LOGO_ASPECT.wordmark }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: isMobile ? 40 : 64 }}>
            <div>
              <p style={columnHeadingStyle}>Links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {footerLinks.links.map((link) => (
                  <FooterLink
                    key={link.targetId}
                    label={link.label}
                    href={`#${link.targetId}`}
                    onClick={() => scrollToSection(link.targetId)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p style={columnHeadingStyle}>Company</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {footerLinks.company.map((link) => (
                  <FooterLink
                    key={link.label}
                    label={link.label}
                    href="#"
                    onClick={() => onOpenOverlay(link.overlay)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: 13,
                color: color.muted,
                margin: 0,
              }}
            >
              {brand.copyright}
            </p>
            <a
              href={brand.bookACallUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...primaryButton, padding: '14px 28px', fontSize: 14 }}
            >
              Book a call
            </a>
          </div>
        </div>
      </div>

      <CopyEmailWatermark />
    </footer>
  );
}
