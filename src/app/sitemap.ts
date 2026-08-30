import type { MetadataRoute } from 'next';
import { publicEnv } from '@/config/env';
import { blogPosts } from '@/content/site';

/**
 * Every address worth indexing.
 *
 * The client stories are still hashes on the home page rather than pages, so
 * they are not listed: a sitemap entry for a fragment is an entry for the home
 * page. Everything else here is a real, server-rendered URL.
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
