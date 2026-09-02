import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { hasSupabase, publicEnv, serverEnv } from '@/config/env';
import { AppError } from '@/lib/errors';

/**
 * The service-role client. Bypasses row-level security entirely.
 *
 * Server-only, and used for exactly two things: writing analytics for visitors
 * who are not signed in, and the campaign sender, which has to read contacts
 * while running outside any admin's session. Everything an admin does in the
 * panel goes through `supabaseServer` so their policies still apply.
 */

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  if (!hasSupabase()) {
    throw new AppError(
      503,
      'The admin database is not connected yet.',
      'ADMIN_DB_NOT_CONFIGURED',
    );
  }

  cached = createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL as string,
    serverEnv().SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  return cached;
}
