import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuditLogRow } from '@/lib/supabase/types';
import { TABLES } from '@/lib/supabase/tables';

/** The record of what was changed in the panel, and by whom. */

export interface AuditEntry {
  readonly actorId: string;
  readonly actorEmail: string;
  readonly action: string;
  readonly entity: string;
  readonly entityId?: string;
  readonly before?: unknown;
  readonly after?: unknown;
}

export async function writeAudit(client: SupabaseClient, entry: AuditEntry): Promise<void> {
  const { error } = await client.from(TABLES.auditLog).insert({
    actor_id: entry.actorId,
    actor_email: entry.actorEmail,
    action: entry.action,
    entity: entry.entity,
    entity_id: entry.entityId ?? null,
    before: entry.before ?? null,
    after: entry.after ?? null,
  });
  // An audit write must never take down the operation it is recording; the
  // caller has already made the change. Surface it in the log instead.
  if (error) console.error('Audit write failed:', error);
}

export async function readAudit(
  client: SupabaseClient,
  limit = 100,
): Promise<readonly AuditLogRow[]> {
  const { data, error } = await client
    .from(TABLES.auditLog)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AuditLogRow[];
}
