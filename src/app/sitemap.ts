import type { MetadataRoute } from 'next';
import { publicEnv } from '@/config/env';
import { getContent } from '@/lib/content/resolve';

/**
 * Every address worth indexing.
 *
 * The panels — the client stories, and the writing archive — are hashes on the
 * home page rather than pages, so they are not listed: a sitemap entry for a
 * fragment is an entry for the home page. `/blog` redirects into its panel and
 * is left out for the same reason. Individual posts are real pages and each
 * one is here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { blogPosts } = await getContent();
  const site = publicEnv.NEXT_PUBLIC_SITE_URL;
  return [
    { url: site, changeFrequency: 'monthly', priority: 1 },
    { url: `${site}/contact`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${site}/careers`, changeFrequency: 'monthly' as const, priority: 0.7 },
    ...blogPosts.map((post) => ({
      url: `${site}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
