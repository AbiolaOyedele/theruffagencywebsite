import type { Metadata } from 'next';
import { ArchiveView } from '@/components/features/blog/ArchiveView';
import { blogSection, brand } from '@/content/site';

export const metadata: Metadata = {
  title: `${blogSection.indexTitle} | ${brand.name}`,
  description: blogSection.indexIntro,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: `${blogSection.indexTitle} | ${brand.name}`,
    description: blogSection.indexIntro,
    siteName: brand.name,
  },
};

/** The first page of the archive. Later pages live at `/blog/page/<n>`. */
export default function BlogIndexPage() {
  return <ArchiveView page={1} />;
}
