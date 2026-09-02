/**
 * The database, as TypeScript sees it.
 *
 * Hand-written rather than generated, because the schema is small and one
 * file that can be read start to finish beats a generated one that cannot.
 * It mirrors `supabase/migrations/0001_admin.sql` — change them together.
 */

export type AdminRole = 'owner' | 'editor';
export type EnquiryKind = 'contact' | 'talent';
export type EnquiryStatus = 'new' | 'read' | 'archived';
export type ContactSource = 'contact_form' | 'talent_form' | 'import' | 'manual';
export type ConsentBasis = 'explicit' | 'legitimate_interest';
export type SuppressionReason = 'unsubscribed' | 'bounced' | 'complained' | 'manual';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'failed';
export type RecipientStatus = 'pending' | 'sent' | 'failed' | 'skipped';
export type DeviceKind = 'mobile' | 'tablet' | 'desktop';

export interface AdminProfile {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly role: AdminRole;
  readonly created_at: string;
}

export interface ContentOverrideRow {
  readonly key: string;
  readonly value: unknown;
  readonly updated_at: string;
  readonly updated_by: string | null;
}

export interface DesignTokenRow {
  readonly key: string;
  readonly value: string;
  readonly updated_at: string;
  readonly updated_by: string | null;
}

export interface AnalyticsEventRow {
  readonly id: number;
  readonly occurred_at: string;
  readonly session_hash: string;
  readonly path: string;
  readonly referrer_host: string | null;
  readonly utm_source: string | null;
  readonly utm_medium: string | null;
  readonly utm_campaign: string | null;
  readonly country: string | null;
  readonly device: DeviceKind | null;
  readonly browser: string | null;
}

export interface EnquiryRow {
  readonly id: string;
  readonly kind: EnquiryKind;
  readonly name: string | null;
  readonly email: string | null;
  readonly company: string | null;
  readonly payload: Record<string, unknown>;
  readonly status: EnquiryStatus;
  readonly created_at: string;
}

export interface ContactRow {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly company: string | null;
  readonly role_title: string | null;
  readonly source: ContactSource;
  readonly consent: ConsentBasis;
  readonly consent_note: string | null;
  readonly subscribed: boolean;
  readonly unsubscribed_at: string | null;
  readonly unsubscribe_token: string;
  readonly tags: readonly string[];
  readonly notes: string | null;
  readonly created_at: string;
}

export interface SuppressionRow {
  readonly email: string;
  readonly reason: SuppressionReason;
  readonly created_at: string;
}

export interface CampaignRow {
  readonly id: string;
  readonly name: string;
  readonly subject: string;
  readonly preheader: string | null;
  readonly body_markdown: string;
  readonly from_name: string;
  readonly from_email: string;
  readonly reply_to: string | null;
  readonly status: CampaignStatus;
  readonly segment: CampaignSegment;
  readonly scheduled_at: string | null;
  readonly started_at: string | null;
  readonly sent_at: string | null;
  readonly created_at: string;
  readonly created_by: string | null;
}

/** Which contacts a campaign is aimed at. An empty segment means everyone. */
export interface CampaignSegment {
  readonly tags?: readonly string[] | undefined;
  readonly sources?: readonly ContactSource[] | undefined;
  readonly consent?: ConsentBasis | undefined;
}

export interface CampaignRecipientRow {
  readonly id: string;
  readonly campaign_id: string;
  readonly contact_id: string;
  readonly status: RecipientStatus;
  readonly skip_reason: string | null;
  readonly provider_message_id: string | null;
  readonly error: string | null;
  readonly sent_at: string | null;
  readonly opened_at: string | null;
  readonly clicked_at: string | null;
}

export interface AuditLogRow {
  readonly id: number;
  readonly actor_id: string | null;
  readonly actor_email: string | null;
  readonly action: string;
  readonly entity: string;
  readonly entity_id: string | null;
  readonly before: unknown;
  readonly after: unknown;
  readonly created_at: string;
}
