import type { Metadata } from 'next';
import { CareersContent } from '@/components/features/careers/CareersContent';
import { StandalonePage } from '@/components/features/overlays/StandalonePage';
import { getContent } from '@/lib/content/resolve';

export async function generateMetadata(): Promise<Metadata> {
  const { brand, careersPage } = await getContent();

  return {
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
}

/**
 * `/careers` — the openings notice and the talent pool as a page.
 *
 * Same component the `#careers` panel opens, so someone who finds this through
 * a search reads exactly what someone who found it through the footer reads.
 */
export default async function CareersPage() {
  const { careersPage } = await getContent();

  return (
    <StandalonePage eyebrow={careersPage.eyebrow} title={careersPage.panelTitle}>
      <CareersContent />
    </StandalonePage>
  );
}
