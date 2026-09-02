import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { EnquiryKind, EnquiryRow, EnquiryStatus } from '@/lib/supabase/types';
import { TABLES } from '@/lib/supabase/tables';

/**
 * Enquiries and applications.
 *
 * The forms already email the studio; this keeps a copy so the panel has an
 * inbox and the marketing side has an audience. The insert runs as the service
 * role because the person filling the form is not signed in.
 */

export interface EnquiryInput {
  readonly kind: EnquiryKind;
  readonly name: string | null;
  readonly email: string | null;
  readonly company: string | null;
  readonly payload: Record<string, unknown>;
}

export async function insertEnquiry(input: EnquiryInput): Promise<void> {
  const { error } = await supabaseAdmin().from(TABLES.enquiries).insert({
    kind: input.kind,
    name: input.name,
    email: input.email,
    company: input.company,
    payload: input.payload,
  });
  if (error) throw error;
}

export async function listEnquiries(
  client: SupabaseClient,
  options: { kind?: EnquiryKind; status?: EnquiryStatus; limit?: number } = {},
): Promise<readonly EnquiryRow[]> {
  let query = client.from(TABLES.enquiries).select('*').order('created_at', { ascending: false });
  if (options.kind) query = query.eq('kind', options.kind);
  if (options.status) query = query.eq('status', options.status);

  const { data, error } = await query.limit(options.limit ?? 100);
  if (error) throw error;
  return (data ?? []) as EnquiryRow[];
}

export async function countNewEnquiries(client: SupabaseClient): Promise<number> {
  const { count, error } = await client
    .from(TABLES.enquiries)
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');
  if (error) throw error;
  return count ?? 0;
}

export async function setEnquiryStatus(
  client: SupabaseClient,
  id: string,
  status: EnquiryStatus,
): Promise<void> {
  const { error } = await client.from(TABLES.enquiries).update({ status }).eq('id', id);
  if (error) throw error;
}
