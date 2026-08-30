import { AppError } from '@/lib/errors';

/**
 * Fixed-window rate limiting, held in the process.
 *
 * Deliberately in-memory: this guards one public form on a marketing site, and
 * a serverless instance handling a burst is exactly the case worth stopping. It
 * is not a distributed limit — an attacker spread across many cold instances
 * gets more attempts — so treat it as a courtesy brake, not a security control.
 * Move it to a shared store if the site ever needs a real one.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
/** Stop the map growing without bound on a long-lived instance. */
const MAX_TRACKED_KEYS = 10_000;

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Best-effort client address, for keying the limit. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || request.headers.get('x-real-ip') || 'unknown';
}

/** @throws {AppError} 429 once the caller is over the limit for this window. */
export function enforceRateLimit(key: string): void {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      for (const [tracked, window] of windows) {
        if (now >= window.resetAt) windows.delete(tracked);
      }
    }
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  existing.count += 1;
  if (existing.count > MAX_PER_WINDOW) {
    throw new AppError(
      429,
      'That is a few too many messages in a row. Please wait a minute and try again.',
      'FORM_SUBMIT_RATE_LIMITED',
    );
  }
}
