import type { MetadataRoute } from 'next';
import { publicEnv } from '@/config/env';
import { blogPosts } from '@/content/site';

/**
 * Every address worth indexing.
 *
 * The panels — contact, careers, the client stories — are hashes on the home
 * page rather than pages, so they are not listed here: a sitemap entry for a
 * fragment is an entry for the home page. Posts are real pages, so each one
 * is listed with the date it was published.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = publicEnv.NEXT_PUBLIC_SITE_URL;
  const newest = blogPosts[0]?.publishedAt;

  return [
    { url: site, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${site}/blog`,
      ...(newest ? { lastModified: new Date(newest) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${site}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
