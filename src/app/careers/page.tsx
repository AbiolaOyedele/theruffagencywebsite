import type { Metadata } from 'next';
import { CareersContent } from '@/components/features/careers/CareersContent';
import { StandalonePage } from '@/components/features/overlays/StandalonePage';
import { brand, careersPage } from '@/content/site';

export const metadata: Metadata = {
  title: `Careers | ${brand.name}`,
  description: careersPage.intro,
  alternates: { canonical: '/careers' },
  openGraph: {
    type: 'website',
    url: '/careers',
    title: `Careers | ${brand.name}`,
    description: careersPage.intro,
    siteName: brand.name,
  },
};

/**
 * `/careers` — the openings notice and the talent pool as a page.
 *
 * Same component the `#careers` panel opens, so someone who finds this through
 * a search reads exactly what someone who found it through the footer reads.
 */
export default function CareersPage() {
  return (
    <StandalonePage eyebrow={careersPage.eyebrow} title={careersPage.panelTitle}>
      <CareersContent />
    </StandalonePage>
  );
}
