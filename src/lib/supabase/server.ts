import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { hasSupabase, publicEnv } from '@/config/env';
import { AppError } from '@/lib/errors';

/**
 * The signed-in visitor's client, reading and writing the session cookie.
 *
 * Everything it touches is row-level-secured, so this client can only reach
 * what the person holding the session is allowed to reach. Queries that need
 * to see past a policy use the service-role client instead, deliberately and
 * on the server only.
 */
export async function supabaseServer(): Promise<SupabaseClient> {
  if (!hasSupabase()) {
    throw new AppError(
      503,
      'The admin database is not connected yet.',
      'ADMIN_DB_NOT_CONFIGURED',
    );
  }

  const store = await cookies();

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL as string,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          try {
            for (const { name, value, options } of list) store.set(name, value, options);
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // The middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}
