import type { MetadataRoute } from 'next';
import { publicEnv } from '@/config/env';

/**
 * Crawling rules.
 *
 * Everything public is open, to search engines and AI crawlers alike — the
 * only closed doors are the form endpoints, which have nothing to read and
 * would only waste a crawler's budget.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${publicEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
