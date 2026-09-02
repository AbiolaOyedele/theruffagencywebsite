import { unstable_cache } from 'next/cache';
import * as defaults from '@/content/site';
import { hasSupabase } from '@/config/env';
import { readContentOverrides } from '@/repositories/content';
import { deepMerge } from '@/lib/content/merge';

/**
 * The site's copy, as it should render right now.
 *
 * Server-only. The typed defaults in `content/site` are the source of truth
 * and the fallback; the database carries only what the studio has changed
 * since. With no database configured — or with one that is unreachable — this
 * returns the defaults unchanged, which is the site exactly as it ships.
 *
 * Cached under one tag so the whole of the public site is one invalidation,
 * and `updateTag(CONTENT_TAG)` in a save action makes an edit visible on the
 * next request rather than at the next deploy.
 */

export type SiteContent = typeof defaults;

/** The keys an override row may address. One row per top-level content group. */
export type ContentKey = keyof SiteContent;

export const CONTENT_TAG = 'site-content';

/** Only what has been changed, keyed by content group. Usually empty. */
export type OverrideMap = Readonly<Record<string, unknown>>;

async function resolve(): Promise<OverrideMap> {
  if (!hasSupabase()) return {};

  try {
    const rows = await readContentOverrides();
    const map: Record<string, unknown> = {};
    for (const row of rows) {
      // A key the code no longer has is ignored rather than merged into
      // nothing.
      if (row.key in defaults) map[row.key] = row.value;
    }
    return map;
  } catch (error) {
    // A marketing page must not 500 because an override could not be read.
    console.error('Falling back to default content:', error);
    return {};
  }
}

const cached = unstable_cache(resolve, ['site-content'], { tags: [CONTENT_TAG] });

/**
 * The overrides alone.
 *
 * This is what crosses to the browser, rather than the whole content tree:
 * the defaults are already in the bundle because components import them, so
 * sending them again would put roughly sixty kilobytes of JSON into every
 * page to say nothing had changed.
 */
export async function getContentOverrides(): Promise<OverrideMap> {
  return cached();
}

/** Defaults with overrides applied. For server components and metadata. */
export function applyOverrides(overrides: OverrideMap): SiteContent {
  const keys = Object.keys(overrides);
  if (keys.length === 0) return defaults;

  const merged: Record<string, unknown> = { ...defaults };
  for (const key of keys) {
    merged[key] = deepMerge((defaults as Record<string, unknown>)[key], overrides[key]);
  }
  return merged as SiteContent;
}

/** The resolved content. Safe to call from any server component or route. */
export async function getContent(): Promise<SiteContent> {
  return applyOverrides(await cached());
}

/** The untouched defaults, for the panel to show beside what was changed. */
export const contentDefaults: SiteContent = defaults;
