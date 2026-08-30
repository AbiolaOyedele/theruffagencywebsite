import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArchiveView } from '@/components/features/blog/ArchiveView';
import { blogPosts, blogSection, brand } from '@/content/site';
import { pageCount } from '@/types/content';

/**
 * Page two onward. Page one is `/blog`, so it is deliberately not generated
 * here — two URLs for the same posts is the kind of thing that splits a page's
 * ranking between them.
 */
export function generateStaticParams(): { number: string }[] {
  const total = pageCount(blogPosts.length);
  return Array.from({ length: Math.max(0, total - 1) }, (_, index) => ({
    number: String(index + 2),
  }));
}

function parsePage(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const page = Number(value);
  return page >= 2 && page <= pageCount(blogPosts.length) ? page : null;
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/page/[number]'>): Promise<Metadata> {
  const { number } = await params;
  const page = parsePage(number);
  if (page === null) return {};

  const title = `${blogSection.indexTitle}, page ${page} | ${brand.name}`;

  return {
    title,
    description: blogSection.indexIntro,
    alternates: { canonical: `/blog/page/${page}` },
    openGraph: { type: 'website', url: `/blog/page/${page}`, title, siteName: brand.name },
  };
}

export default async function BlogArchivePage({ params }: PageProps<'/blog/page/[number]'>) {
  const { number } = await params;
  const page = parsePage(number);
  if (page === null) notFound();

  return <ArchiveView page={page} />;
}
