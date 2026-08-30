import Link from 'next/link';
import { Footer } from '@/components/features/footer/Footer';
import { NoiseOverlay } from '@/components/features/overlays/NoiseOverlay';
import { RuffLogo } from '@/components/ui/RuffLogo';
import { color, primaryButton, radius, shape } from '@/config/tokens';
import { brand } from '@/content/site';

interface PageChromeProps {
  readonly children: React.ReactNode;
}

/**
 * The site's furniture, for the pages that are not the home page.
 *
 * The home page's navigation is a client component tied to the intro handover
 * and the pinned Services section — none of which exists here. This is the
 * same pill, standing still: the mark on the left and the one call to action
 * on the right.
 *
 * Everything below it is the site's own furniture — the real footer, with the
 * mark, the columns, the accounts and the email watermark, and the grain that
 * runs over every other page. Without it these pages read as documents that
 * happen to share a typeface.
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

      {/* The footer takes no callback here: there is no page to open a panel
          over, so its panel links are ordinary links and the home page opens
          the panel named in the hash when it arrives. */}
      <Footer />

      <NoiseOverlay />
    </div>
  );
}
