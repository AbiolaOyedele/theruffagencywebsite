'use client';

import { useState, type Ref } from 'react';
import { RuffLogo } from '@/components/ui/RuffLogo';
import { CopyEmailWatermark } from '@/components/features/footer/CopyEmailWatermark';
import {
  InstagramMark,
  LinkedInMark,
  ThreadsMark,
  TikTokMark,
  XMark,
} from '@/components/ui/SocialMarks';
import { color, font, primaryButton, shape } from '@/config/tokens';
import { useIsMobile } from '@/hooks/useIsMobile';
import { scrollToSection } from '@/utils/scroll';
import type { OverlayKey } from '@/types/content';
import { useContent } from '@/components/providers/ContentProvider';

/** Heading above each footer column. */
const columnHeadingStyle = {
  fontFamily: font.sans,
  fontWeight: 500,
  fontSize: 13,
  color: color.muted,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  margin: '0 0 16px',
} as const;

/**
 * The studio's accounts, as icons.
 *
 * Only accounts with a URL are rendered, so the column simply does not appear
 * until there is something to link to — no dead icons in the meantime.
 */
function SocialColumn() {
  const { socialLinks } = useContent();
  const isMobile = useIsMobile();
  const live = socialLinks.filter((link) => link.url.length > 0);
  if (live.length === 0) return null;

  return (
    // On a phone there is not enough width for a third column beside the two
    // link lists, so this one takes a full row of its own and the icons stay
    // in a line rather than stacking.
    <div style={{ flexBasis: isMobile ? '100%' : 'auto' }}>
      <p style={columnHeadingStyle}>Follow</p>
      <ul
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {live.map((link) => (
          <li key={link.platform} style={{ margin: 0 }}>
            <SocialIcon platform={link.platform} label={link.label} url={link.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOCIAL_MARKS = {
  linkedin: LinkedInMark,
  instagram: InstagramMark,
  tiktok: TikTokMark,
  threads: ThreadsMark,
  x: XMark,
} as const;

interface SocialIconProps {
  readonly platform: keyof typeof SOCIAL_MARKS;
  readonly label: string;
  readonly url: string;
}

function SocialIcon({ platform, label, url }: SocialIconProps) {
  const [hovered, setHovered] = useState(false);
  const Mark = SOCIAL_MARKS[platform];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 12,
        color: hovered ? color.white : color.ink,
        background: hovered ? color.ink : 'transparent',
        border: `2px solid ${hovered ? color.ink : color.border}`,
        transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
      }}
    >
      <Mark size={18} />
    </a>
  );
}

interface FooterLinkProps {
  readonly label: string;
  readonly href: string;
  /** Given for the panels that open over the page; omitted for real routes. */
  readonly onClick?: (() => void) | undefined;
}

function FooterLink({ label, href, onClick }: FooterLinkProps) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={(event) => {
        if (!onClick) return;
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
  const { brand, footerLinks } = useContent();
  const isMobile = useIsMobile();

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
        {/* No card, no strapline — the mark stands on the footer's own ground
            at the same height as the links panel beside it. It carries its own
            black shadow, so it reads on the paper without a white ground. */}
        <div
          style={{
            // Proportional, not fixed: the mark takes 40% of the row up to its
            // full size, so the links panel beside it keeps its three columns
            // all the way down to the mobile breakpoint.
            flex: isMobile ? '1 1 auto' : '0 1 40%',
            maxWidth: isMobile ? 420 : 480,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <RuffLogo
            title={brand.name}
            style={{ width: '100%', maxWidth: 480, height: 'auto', display: 'block' }}
          />
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
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: isMobile ? '28px 32px' : 64,
            }}
          >
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
                    href={`#${link.overlay}`}
                    onClick={() => onOpenOverlay(link.overlay)}
                  />
                ))}
              </div>
            </div>

            <SocialColumn />
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
              href={brand.ctaHref}
              style={{ ...primaryButton, padding: '14px 28px', fontSize: 14 }}
            >
              {brand.ctaLabel}
            </a>
          </div>
        </div>
      </div>

      <CopyEmailWatermark />
    </footer>
  );
}
