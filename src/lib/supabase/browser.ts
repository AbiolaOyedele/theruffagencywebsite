'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '@/config/env';

/**
 * The browser's client. Used only for signing in and out — every read and
 * write in the panel goes through a server action, so the anon key never
 * carries anything but the session.
 */

let cached: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (cached) return cached;

  cached = createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL as string,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );

  return cached;
}
