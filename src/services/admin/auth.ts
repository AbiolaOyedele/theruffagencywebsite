import { cache } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import { AppError } from '@/lib/errors';
import { TABLES } from '@/lib/supabase/tables';
import type { AdminProfile } from '@/lib/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Who is signed in, and whether they are allowed in here.
 *
 * Being authenticated is not enough. The Supabase project is shared with other
 * Ruff work, so its pool of accounts is shared too — a row in
 * `agency_admin_profiles` is what makes someone an admin *here*, and every
 * policy in the schema is written in terms of it.
 *
 * The three states are kept distinct on purpose. Collapsing "not signed in"
 * and "signed in but not an admin" into one is what caused a redirect loop:
 * the panel sent the second case to the sign-in page, and the proxy — seeing a
 * perfectly valid session — sent it straight back.
 */

export interface AdminSession {
  readonly client: SupabaseClient;
  readonly profile: AdminProfile;
}

export type AdminState =
  /** No session at all. Send them to sign in. */
  | { readonly kind: 'anonymous' }
  /** A valid account, but not one with access here. Say so; do not redirect. */
  | { readonly kind: 'not-admin'; readonly email: string }
  /** Signed in and on the roster. */
  | { readonly kind: 'admin'; readonly session: AdminSession };

export const adminState = cache(async (): Promise<AdminState> => {
  let client: SupabaseClient;
  try {
    client = await supabaseServer();
  } catch {
    return { kind: 'anonymous' }; // No database configured.
  }

  const { data: auth } = await client.auth.getUser();
  if (!auth.user) return { kind: 'anonymous' };

  const email = auth.user.email ?? 'this account';

  const { data, error } = await client
    .from(TABLES.adminProfiles)
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle();

  if (error) {
    // A failed read is not the same as "no such admin", and treating it as one
    // hides exactly the kind of fault that locks everybody out — a recursive
    // policy, a missing table, a revoked grant. Say so in the log.
    console.error('Could not read the admin roster:', error.message);
    return { kind: 'not-admin', email };
  }

  if (!data) return { kind: 'not-admin', email };

  return { kind: 'admin', session: { client, profile: data as AdminProfile } };
});

/** The session, or null. Kept for callers that only care about the happy path. */
export async function currentAdmin(): Promise<AdminSession | null> {
  const state = await adminState();
  return state.kind === 'admin' ? state.session : null;
}

/** @throws {AppError} 401 when nobody is signed in, or they are not an admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const state = await adminState();
  if (state.kind !== 'admin') {
    throw new AppError(401, 'Please sign in to continue.', 'ADMIN_NOT_AUTHENTICATED');
  }
  return state.session;
}

/** @throws {AppError} 403 for an editor attempting something only an owner may do. */
export async function requireOwner(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (session.profile.role !== 'owner') {
    throw new AppError(403, 'Only an owner can do that.', 'ADMIN_NOT_OWNER');
  }
  return session;
}
