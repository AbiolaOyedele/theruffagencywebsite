import { supabaseAdmin } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContentOverrideRow } from '@/lib/supabase/types';
import { TABLES } from '@/lib/supabase/tables';

/**
 * Content override queries.
 *
 * Reads run through the service-role client because the public site renders
 * with no session at all. That is safe — this data is the site's own published
 * copy, and the key never leaves the server — and it means the tables can stay
 * default-deny rather than carrying a public read policy.
 *
 * Writes take the caller's client, so an admin's own policies still apply.
 */

export async function readContentOverrides(): Promise<readonly ContentOverrideRow[]> {
  const { data, error } = await supabaseAdmin().from(TABLES.contentOverrides).select('*');
  if (error) throw error;
  return (data ?? []) as ContentOverrideRow[];
}

export async function readContentOverride(key: string): Promise<ContentOverrideRow | null> {
  const { data, error } = await supabaseAdmin()
    .from(TABLES.contentOverrides)
    .select('*')
    .eq('key', key)
    .maybeSingle();
  if (error) throw error;
  return (data as ContentOverrideRow | null) ?? null;
}

export async function upsertContentOverride(
  client: SupabaseClient,
  key: string,
  value: unknown,
  actorId: string,
): Promise<void> {
  const { error } = await client
    .from(TABLES.contentOverrides)
    .upsert({ key, value, updated_by: actorId, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** Drops an override, which restores whatever `content/site.ts` says. */
export async function deleteContentOverride(
  client: SupabaseClient,
  key: string,
): Promise<void> {
  const { error } = await client.from(TABLES.contentOverrides).delete().eq('key', key);
  if (error) throw error;
}
