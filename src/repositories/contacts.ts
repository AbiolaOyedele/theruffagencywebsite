import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type {
  ConsentBasis,
  ContactRow,
  ContactSource,
  SuppressionReason,
  SuppressionRow,
} from '@/lib/supabase/types';
import { TABLES } from '@/lib/supabase/tables';

/** The studio's audience, and the list that overrides it. */

export interface ContactInput {
  readonly email: string;
  readonly name?: string | null | undefined;
  readonly company?: string | null | undefined;
  readonly roleTitle?: string | null | undefined;
  readonly source: ContactSource;
  readonly consent: ConsentBasis;
  readonly consentNote?: string | null | undefined;
  readonly tags?: readonly string[] | undefined;
  readonly notes?: string | null | undefined;
}

function toRow(input: ContactInput): Record<string, unknown> {
  return {
    email: input.email.trim().toLowerCase(),
    name: input.name ?? null,
    company: input.company ?? null,
    role_title: input.roleTitle ?? null,
    source: input.source,
    consent: input.consent,
    consent_note: input.consentNote ?? null,
    tags: input.tags ?? [],
    notes: input.notes ?? null,
  };
}

export async function listContacts(
  client: SupabaseClient,
  options: { search?: string; tag?: string; limit?: number; offset?: number } = {},
): Promise<{ rows: readonly ContactRow[]; total: number }> {
  let query = client
    .from(TABLES.contacts)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (options.search) {
    const term = `%${options.search}%`;
    query = query.or(`email.ilike.${term},name.ilike.${term},company.ilike.${term}`);
  }
  if (options.tag) query = query.contains('tags', [options.tag]);

  const offset = options.offset ?? 0;
  const { data, error, count } = await query.range(offset, offset + (options.limit ?? 50) - 1);
  if (error) throw error;
  return { rows: (data ?? []) as ContactRow[], total: count ?? 0 };
}

export async function upsertContacts(
  client: SupabaseClient,
  inputs: readonly ContactInput[],
): Promise<number> {
  if (inputs.length === 0) return 0;
  const { data, error } = await client
    .from(TABLES.contacts)
    .upsert(inputs.map(toRow), { onConflict: 'email', ignoreDuplicates: false })
    .select('id');
  if (error) throw error;
  return (data ?? []).length;
}

/**
 * Records someone who filled in a form. Runs as the service role, because they
 * are not signed in — and never overwrites an existing row, so a later enquiry
 * cannot quietly reset an unsubscribe.
 */
export async function captureContact(input: ContactInput): Promise<void> {
  const { error } = await supabaseAdmin()
    .from(TABLES.contacts)
    .upsert(toRow(input), { onConflict: 'email', ignoreDuplicates: true });
  if (error) throw error;
}

export async function updateContact(
  client: SupabaseClient,
  id: string,
  patch: Partial<ContactInput>,
): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.company !== undefined) row.company = patch.company;
  if (patch.roleTitle !== undefined) row.role_title = patch.roleTitle;
  if (patch.consent !== undefined) row.consent = patch.consent;
  if (patch.consentNote !== undefined) row.consent_note = patch.consentNote;
  if (patch.tags !== undefined) row.tags = patch.tags;
  if (patch.notes !== undefined) row.notes = patch.notes;

  const { error } = await client.from(TABLES.contacts).update(row).eq('id', id);
  if (error) throw error;
}

export async function deleteContact(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from(TABLES.contacts).delete().eq('id', id);
  if (error) throw error;
}

/** Everyone a campaign may go to — the view, never the table. */
export async function listSendable(
  client: SupabaseClient,
  segment: {
    tags?: readonly string[] | undefined;
    sources?: readonly string[] | undefined;
    consent?: ConsentBasis | undefined;
  },
): Promise<readonly ContactRow[]> {
  let query = client.from(TABLES.sendableContacts).select('*');
  if (segment.tags?.length) query = query.overlaps('tags', segment.tags as string[]);
  if (segment.sources?.length) query = query.in('source', segment.sources as string[]);
  if (segment.consent) query = query.eq('consent', segment.consent);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ContactRow[];
}

export async function countSendable(
  client: SupabaseClient,
  segment: {
    tags?: readonly string[] | undefined;
    sources?: readonly string[] | undefined;
    consent?: ConsentBasis | undefined;
  },
): Promise<number> {
  return (await listSendable(client, segment)).length;
}

/* ---- Suppression -------------------------------------------------- */

export async function listSuppressions(
  client: SupabaseClient,
): Promise<readonly SuppressionRow[]> {
  const { data, error } = await client
    .from(TABLES.suppressions)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SuppressionRow[];
}

export async function suppress(
  client: SupabaseClient,
  email: string,
  reason: SuppressionReason,
): Promise<void> {
  const { error } = await client
    .from(TABLES.suppressions)
    .upsert({ email: email.trim().toLowerCase(), reason }, { onConflict: 'email' });
  if (error) throw error;
}

/** The unsubscribe link's landing. Runs unauthenticated, hence service role. */
export async function unsubscribeByToken(token: string): Promise<string | null> {
  const db = supabaseAdmin();

  const { data, error } = await db
    .from(TABLES.contacts)
    .select('id, email')
    .eq('unsubscribe_token', token)
    .maybeSingle();
  if (error) throw error;

  const contact = data as { id: string; email: string } | null;
  if (!contact) return null;

  await db
    .from(TABLES.contacts)
    .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
    .eq('id', contact.id);

  await db
    .from(TABLES.suppressions)
    .upsert({ email: contact.email, reason: 'unsubscribed' }, { onConflict: 'email' });

  return contact.email;
}
