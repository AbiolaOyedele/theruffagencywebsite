import { supabaseAdmin } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DesignTokenRow } from '@/lib/supabase/types';
import { TABLES } from '@/lib/supabase/tables';

/** Design token queries. Read on the server for every page; see `content.ts`. */

export async function readDesignTokens(): Promise<readonly DesignTokenRow[]> {
  const { data, error } = await supabaseAdmin().from(TABLES.designTokens).select('*');
  if (error) throw error;
  return (data ?? []) as DesignTokenRow[];
}

export async function upsertDesignTokens(
  client: SupabaseClient,
  entries: readonly { key: string; value: string }[],
  actorId: string,
): Promise<void> {
  if (entries.length === 0) return;
  const now = new Date().toISOString();
  const { error } = await client
    .from(TABLES.designTokens)
    .upsert(entries.map((e) => ({ ...e, updated_by: actorId, updated_at: now })));
  if (error) throw error;
}

/** Drops tokens, restoring the values in `config/tokens.ts`. */
export async function deleteDesignTokens(
  client: SupabaseClient,
  keys: readonly string[],
): Promise<void> {
  if (keys.length === 0) return;
  const { error } = await client.from(TABLES.designTokens).delete().in('key', keys);
  if (error) throw error;
}
