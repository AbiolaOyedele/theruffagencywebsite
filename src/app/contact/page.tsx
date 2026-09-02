import type { Metadata } from 'next';
import { ContactContent } from '@/components/features/contact/ContactContent';
import { StandalonePage } from '@/components/features/overlays/StandalonePage';
import { getContent } from '@/lib/content/resolve';

export async function generateMetadata(): Promise<Metadata> {
  const { brand, contactPage } = await getContent();

  return {
  title: `Contact | ${brand.name}`,
  description: contactPage.intro,
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: `Contact | ${brand.name}`,
    description: contactPage.intro,
      siteName: brand.name,
    },
  };
}

/**
 * `/contact` — the enquiry as a page rather than a panel.
 *
 * The home page opens the same component in an overlay at `#contact`; this is
 * the address a search result, an AI assistant or a business card can point
 * at. Both render `ContactContent`, so the two cannot drift.
 */
export default async function ContactPage() {
  const { contactPage } = await getContent();

  return (
    <StandalonePage eyebrow={contactPage.eyebrow} title={contactPage.panelTitle}>
      <ContactContent />
    </StandalonePage>
  );
}
