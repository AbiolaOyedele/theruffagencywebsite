/**
 * Method:   POST
 * Path:     /api/v1/track
 * Auth:     none (public), same-origin only
 * Request:  application/json — { path, referrer?, utm* }
 * Response: 204, always
 *
 * Answers 204 whatever happens. A visitor's page must never be affected by
 * whether the studio's own analytics wrote a row, so a failure here is logged
 * and swallowed rather than returned.
 */
import { hasSupabase } from '@/config/env';
import { clientIp, enforceRateLimit } from '@/lib/rate-limit';
import { assertSameOrigin } from '@/services/contact';
import { track } from '@/services/admin/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_CONTENT = new Response(null, { status: 204 });

export async function POST(request: Request): Promise<Response> {
  if (!hasSupabase()) return NO_CONTENT;

  try {
    assertSameOrigin(request);
    enforceRateLimit(`track:${clientIp(request)}`);

    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null) return NO_CONTENT;
    const view = body as Record<string, unknown>;

    const path = typeof view.path === 'string' ? view.path : null;
    if (!path) return NO_CONTENT;

    const asText = (value: unknown): string | null =>
      typeof value === 'string' && value.length > 0 ? value : null;

    await track({
      path,
      referrer: asText(view.referrer),
      utmSource: asText(view.utmSource),
      utmMedium: asText(view.utmMedium),
      utmCampaign: asText(view.utmCampaign),
      ip: clientIp(request),
      userAgent: request.headers.get('user-agent') ?? '',
      // Set by Vercel's edge network; absent when running locally.
      country: request.headers.get('x-vercel-ip-country'),
      ownHost: new URL(request.url).hostname,
    });
  } catch (error) {
    console.error('Page view not recorded:', error);
  }

  return NO_CONTENT;
}
