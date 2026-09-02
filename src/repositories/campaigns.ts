import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  CampaignRecipientRow,
  CampaignRow,
  CampaignSegment,
  CampaignStatus,
  RecipientStatus,
} from '@/lib/supabase/types';
import { TABLES } from '@/lib/supabase/tables';

/** Campaigns and their per-recipient outcomes. */

export interface CampaignInput {
  readonly name: string;
  readonly subject: string;
  readonly preheader?: string | null | undefined;
  readonly bodyMarkdown: string;
  readonly fromName: string;
  readonly fromEmail: string;
  readonly replyTo?: string | null | undefined;
  readonly segment: CampaignSegment;
}

function toRow(input: CampaignInput): Record<string, unknown> {
  return {
    name: input.name,
    subject: input.subject,
    preheader: input.preheader ?? null,
    body_markdown: input.bodyMarkdown,
    from_name: input.fromName,
    from_email: input.fromEmail,
    reply_to: input.replyTo ?? null,
    segment: input.segment,
  };
}

export async function listCampaigns(client: SupabaseClient): Promise<readonly CampaignRow[]> {
  const { data, error } = await client
    .from(TABLES.campaigns)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as CampaignRow[];
}

export async function readCampaign(
  client: SupabaseClient,
  id: string,
): Promise<CampaignRow | null> {
  const { data, error } = await client.from(TABLES.campaigns).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as CampaignRow | null) ?? null;
}

export async function createCampaign(
  client: SupabaseClient,
  input: CampaignInput,
  actorId: string,
): Promise<string> {
  const { data, error } = await client
    .from(TABLES.campaigns)
    .insert({ ...toRow(input), created_by: actorId })
    .select('id')
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function updateCampaign(
  client: SupabaseClient,
  id: string,
  input: CampaignInput,
): Promise<void> {
  const { error } = await client.from(TABLES.campaigns).update(toRow(input)).eq('id', id);
  if (error) throw error;
}

export async function setCampaignStatus(
  client: SupabaseClient,
  id: string,
  status: CampaignStatus,
  stamps: { startedAt?: Date; sentAt?: Date; scheduledAt?: Date | null } = {},
): Promise<void> {
  const patch: Record<string, unknown> = { status };
  if (stamps.startedAt) patch.started_at = stamps.startedAt.toISOString();
  if (stamps.sentAt) patch.sent_at = stamps.sentAt.toISOString();
  if (stamps.scheduledAt !== undefined) {
    patch.scheduled_at = stamps.scheduledAt ? stamps.scheduledAt.toISOString() : null;
  }

  const { error } = await client.from(TABLES.campaigns).update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteCampaign(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from(TABLES.campaigns).delete().eq('id', id);
  if (error) throw error;
}

/* ---- Recipients ---------------------------------------------------- */

export async function seedRecipients(
  client: SupabaseClient,
  campaignId: string,
  contactIds: readonly string[],
): Promise<void> {
  if (contactIds.length === 0) return;
  const { error } = await client.from(TABLES.campaignRecipients).upsert(
    contactIds.map((contact_id) => ({ campaign_id: campaignId, contact_id })),
    { onConflict: 'campaign_id,contact_id', ignoreDuplicates: true },
  );
  if (error) throw error;
}

export async function markRecipient(
  client: SupabaseClient,
  campaignId: string,
  contactId: string,
  status: RecipientStatus,
  detail: { messageId?: string; error?: string; skipReason?: string } = {},
): Promise<void> {
  const { error } = await client
    .from(TABLES.campaignRecipients)
    .update({
      status,
      provider_message_id: detail.messageId ?? null,
      error: detail.error ?? null,
      skip_reason: detail.skipReason ?? null,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    })
    .eq('campaign_id', campaignId)
    .eq('contact_id', contactId);
  if (error) throw error;
}

export async function listRecipients(
  client: SupabaseClient,
  campaignId: string,
): Promise<readonly CampaignRecipientRow[]> {
  const { data, error } = await client
    .from(TABLES.campaignRecipients)
    .select('*')
    .eq('campaign_id', campaignId);
  if (error) throw error;
  return (data ?? []) as CampaignRecipientRow[];
}
