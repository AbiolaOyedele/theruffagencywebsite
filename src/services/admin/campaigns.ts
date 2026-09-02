import { publicEnv } from '@/config/env';
import { AppError } from '@/lib/errors';
import { renderCampaignEmail } from '@/lib/email/campaign';
import { sendCampaignEmail } from '@/lib/resend';
import { getContent } from '@/lib/content/resolve';
import {
  listRecipients,
  markRecipient,
  readCampaign,
  seedRecipients,
  setCampaignStatus,
} from '@/repositories/campaigns';
import { listSendable } from '@/repositories/contacts';
import { writeAudit } from '@/repositories/audit';
import type { AdminSession } from '@/services/admin/auth';
import type { ContactRow } from '@/lib/supabase/types';

/**
 * Sending a campaign.
 *
 * Two properties matter more than throughput here. The recipient list comes
 * from `sendable_contacts`, a view that already excludes anyone unsubscribed
 * or suppressed, so there is no query in this file that could accidentally
 * include them. And every message is rendered through `renderCampaignEmail`,
 * which always carries the unsubscribe link and the sender's identity.
 *
 * Throughput is deliberately modest: a small concurrency, and a cap per run.
 * A serverless invocation that tries to send ten thousand messages hits its
 * own timeout somewhere in the middle, and the honest design is to send a
 * bounded batch, record exactly who was reached, and let the next run continue.
 */

const CONCURRENCY = 5;
const MAX_PER_RUN = 500;

export interface SendResult {
  readonly sent: number;
  readonly failed: number;
  readonly remaining: number;
}

export async function sendCampaign(
  session: AdminSession,
  campaignId: string,
): Promise<SendResult> {
  const campaign = await readCampaign(session.client, campaignId);
  if (!campaign) throw new AppError(404, 'That campaign no longer exists.', 'CAMPAIGN_NOT_FOUND');

  if (campaign.status === 'sending') {
    throw new AppError(409, 'That campaign is already going out.', 'CAMPAIGN_ALREADY_SENDING');
  }
  if (campaign.status === 'sent') {
    throw new AppError(409, 'That campaign has already been sent.', 'CAMPAIGN_ALREADY_SENT');
  }

  const audience = await listSendable(session.client, campaign.segment);
  if (audience.length === 0) {
    throw new AppError(
      422,
      'Nobody matches that audience, so there is nothing to send.',
      'CAMPAIGN_EMPTY_AUDIENCE',
    );
  }

  await setCampaignStatus(session.client, campaignId, 'sending', { startedAt: new Date() });
  await seedRecipients(session.client, campaignId, audience.map((c) => c.id));

  // Anyone already reached on an earlier run is skipped, so a resumed send
  // cannot mail the same person twice.
  const already = await listRecipients(session.client, campaignId);
  const done = new Set(already.filter((r) => r.status !== 'pending').map((r) => r.contact_id));
  const queue = audience.filter((c) => !done.has(c.id)).slice(0, MAX_PER_RUN);

  const { brand } = await getContent();
  const site = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < queue.length; i += CONCURRENCY) {
    const batch = queue.slice(i, i + CONCURRENCY);
    const outcomes = await Promise.all(
      batch.map((contact) => deliver(campaign, contact, brand, site)),
    );

    for (let n = 0; n < batch.length; n += 1) {
      const contact = batch[n] as ContactRow;
      const outcome = outcomes[n];
      if (!outcome) continue;

      if (outcome.ok) {
        sent += 1;
        await markRecipient(session.client, campaignId, contact.id, 'sent', {
          messageId: outcome.id,
        });
      } else {
        failed += 1;
        await markRecipient(session.client, campaignId, contact.id, 'failed', {
          error: outcome.error.slice(0, 500),
        });
      }
    }
  }

  const remaining = audience.length - done.size - queue.length;
  await setCampaignStatus(
    session.client,
    campaignId,
    remaining > 0 ? 'paused' : 'sent',
    remaining > 0 ? {} : { sentAt: new Date() },
  );

  await writeAudit(session.client, {
    actorId: session.profile.id,
    actorEmail: session.profile.email,
    action: 'campaign.send',
    entity: 'campaign',
    entityId: campaignId,
    after: { sent, failed, remaining },
  });

  return { sent, failed, remaining };
}

async function deliver(
  campaign: Awaited<ReturnType<typeof readCampaign>>,
  contact: ContactRow,
  brand: { name: string; basedIn: readonly string[] },
  site: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!campaign) return { ok: false, error: 'Campaign vanished mid-send.' };

  const unsubscribeUrl = `${site}/unsubscribe/${contact.unsubscribe_token}`;

  const { html, text } = renderCampaignEmail({
    bodyMarkdown: campaign.body_markdown,
    preheader: campaign.preheader,
    recipientName: contact.name,
    recipientEmail: contact.email,
    unsubscribeUrl,
    studioName: brand.name,
    studioAddress: brand.basedIn.join(', '),
  });

  return sendCampaignEmail({
    to: contact.email,
    subject: campaign.subject,
    html,
    text,
    fromName: campaign.from_name,
    fromEmail: campaign.from_email,
    replyTo: campaign.reply_to ?? undefined,
    unsubscribeUrl,
  });
}
