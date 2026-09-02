import { cache } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import { AppError } from '@/lib/errors';
import type { AdminProfile } from '@/lib/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { TABLES } from '@/lib/supabase/tables';

/**
 * Who is signed in, and whether they are allowed in here.
 *
 * Being authenticated is not enough: a row in `admin_profiles` is what makes
 * someone an admin, and every policy in the schema is written in terms of it.
 * So a Supabase account that exists but is not on the roster gets nothing —
 * which is what stops a public sign-up, if one were ever enabled, becoming a
 * way in.
 */

export interface AdminSession {
  readonly client: SupabaseClient;
  readonly profile: AdminProfile;
}

/** The session for this request, or null. Memoised per request. */
export const currentAdmin = cache(async (): Promise<AdminSession | null> => {
  let client: SupabaseClient;
  try {
    client = await supabaseServer();
  } catch {
    return null; // No database configured — nobody is signed in.
  }

  const { data: auth } = await client.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await client
    .from(TABLES.adminProfiles)
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle();

  if (error || !data) return null;
  return { client, profile: data as AdminProfile };
});

/** @throws {AppError} 401 when nobody is signed in, or they are not an admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await currentAdmin();
  if (!session) {
    throw new AppError(401, 'Please sign in to continue.', 'ADMIN_NOT_AUTHENTICATED');
  }
  return session;
}

/** @throws {AppError} 403 for an editor attempting something only an owner may do. */
export async function requireOwner(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (session.profile.role !== 'owner') {
    throw new AppError(403, 'Only an owner can do that.', 'ADMIN_NOT_OWNER');
  }
  return session;
}
