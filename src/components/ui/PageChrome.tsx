import Link from 'next/link';
import { RuffLogo } from '@/components/ui/RuffLogo';
import { color, font, primaryButton, radius, shape, weight } from '@/config/tokens';
import { brand } from '@/content/site';

interface PageChromeProps {
  readonly children: React.ReactNode;
}

/**
 * The site's furniture, for the pages that are not the home page.
 *
 * The home page's navigation is a client component tied to the intro handover
 * and the pinned Services section — none of which exists here. This is the
 * same pill, standing still: the mark on the left, the one call to action on
 * the right, and a closing strip at the foot. Server-rendered, so a crawler
 * reads the page without waiting for anything.
 */
export function PageChrome({ children }: PageChromeProps) {
  return (
    <div style={{ background: color.paperAlt, minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          padding: '16px 20px 8px',
          // Lets the pill sit over the page without a hard edge behind it.
          background: `linear-gradient(${color.paperAlt} 60%, transparent)`,
        }}
      >
        <nav
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            background: color.navPill,
            border: shape.keyline,
            borderRadius: radius.nav,
            boxShadow: shape.hardShadowSmall,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '10px 12px 10px 22px',
            minHeight: 64,
          }}
        >
          <Link
            href="/"
            aria-label={brand.name}
            style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44 }}
          >
            <RuffLogo title={brand.name} style={{ height: 30, width: 'auto', display: 'block' }} />
          </Link>

          <Link
            href={brand.ctaHref}
            style={{ ...primaryButton, padding: '13px 22px', fontSize: 14 }}
          >
            {brand.ctaLabel}
          </Link>
        </nav>
      </header>

      {children}

      <footer
        style={{
          borderTop: shape.keyline,
          background: color.paper,
          padding: '28px 20px',
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 13,
              color: color.muted,
              margin: 0,
            }}
          >
            {brand.copyright}
          </p>
          <Link
            href="/"
            style={{
              fontFamily: font.sans,
              fontWeight: weight.bold,
              fontSize: 14,
              color: color.ink,
              textDecoration: 'underline',
              textUnderlineOffset: 4,
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
            }}
          >
            Back to the site
          </Link>
        </div>
      </footer>
    </div>
  );
}
