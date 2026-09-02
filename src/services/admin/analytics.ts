import { createHash } from 'node:crypto';
import { serverEnv } from '@/config/env';
import { recordPageView } from '@/repositories/analytics';
import type { DeviceKind } from '@/lib/supabase/types';

/**
 * Recording a visit.
 *
 * No address is ever stored. The visitor's identity for the day is a digest of
 * their address, their user agent and a server-side salt, rotated daily — good
 * enough to tell one visitor from two, and worthless tomorrow. That is what
 * lets this run without a cookie, and so without needing consent for it.
 */

const BOTS =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pingdom|monitor|curl|wget|python-requests|axios/i;

export function isBot(userAgent: string): boolean {
  return BOTS.test(userAgent);
}

function dailySessionHash(ip: string, userAgent: string): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256')
    .update(`${serverEnv().ANALYTICS_SALT}:${day}:${ip}:${userAgent}`)
    .digest('hex')
    .slice(0, 32);
}

function deviceFrom(userAgent: string): DeviceKind {
  if (/iPad|Tablet/i.test(userAgent)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function browserFrom(userAgent: string): string {
  // Order matters: every one of these also claims to be Safari or Chrome.
  if (/Edg\//.test(userAgent)) return 'Edge';
  if (/OPR\//.test(userAgent)) return 'Opera';
  if (/Firefox\//.test(userAgent)) return 'Firefox';
  if (/Chrome\//.test(userAgent)) return 'Chrome';
  if (/Safari\//.test(userAgent)) return 'Safari';
  return 'Other';
}

function hostOf(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export interface TrackInput {
  readonly path: string;
  readonly referrer: string | null;
  readonly utmSource: string | null;
  readonly utmMedium: string | null;
  readonly utmCampaign: string | null;
  readonly ip: string;
  readonly userAgent: string;
  readonly country: string | null;
  readonly ownHost: string;
}

/** Records one page view. Silently ignores bots and self-referrals. */
export async function track(input: TrackInput): Promise<void> {
  if (isBot(input.userAgent)) return;

  const referrerHost = hostOf(input.referrer);

  await recordPageView({
    sessionHash: dailySessionHash(input.ip, input.userAgent),
    path: input.path.slice(0, 500),
    // A visitor moving between our own pages is not a referral.
    referrerHost: referrerHost === input.ownHost ? null : referrerHost,
    utmSource: input.utmSource?.slice(0, 120) ?? null,
    utmMedium: input.utmMedium?.slice(0, 120) ?? null,
    utmCampaign: input.utmCampaign?.slice(0, 120) ?? null,
    country: input.country?.slice(0, 2) ?? null,
    device: deviceFrom(input.userAgent),
    browser: browserFrom(input.userAgent),
  });
}
