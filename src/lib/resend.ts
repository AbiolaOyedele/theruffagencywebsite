import { Resend } from 'resend';
import { mailEnv } from '@/config/env';
import { AppError } from '@/lib/errors';

/**
 * Outgoing mail. One notification per enquiry, to the studio's own inbox.
 *
 * The client is built on first use rather than at import, so the site builds
 * and runs without mail credentials — see `config/env`.
 */

let client: Resend | null = null;

function resend(): Resend {
  if (!client) client = new Resend(mailEnv().RESEND_API_KEY);
  return client;
}

export interface Notification {
  readonly subject: string;
  /** Which studio inbox this belongs in. Defaults to the general one. */
  readonly to?: string;
  /** Set so hitting reply in the inbox answers the enquirer directly. */
  readonly replyTo?: string;
  readonly text: string;
}

/** @throws {AppError} 502 when the provider rejects or the send fails. */
export async function sendNotification(notification: Notification): Promise<void> {
  const env = mailEnv();

  const { error } = await resend().emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: notification.to ?? env.CONTACT_TO_EMAIL,
    subject: notification.subject,
    text: notification.text,
    ...(notification.replyTo ? { replyTo: notification.replyTo } : {}),
  });

  if (error) {
    // The provider's message can name the account or the key; it stays in
    // `details`, which never reaches the client.
    throw new AppError(
      502,
      'We could not send that just now. Please try again, or email us directly.',
      'CONTACT_SEND_FAILED',
      error,
    );
  }
}

export interface CampaignSend {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
  readonly text: string;
  readonly fromName: string;
  readonly fromEmail: string;
  readonly replyTo?: string | undefined;
  /**
   * The unsubscribe URL, also sent as a header so a mail client can offer the
   * one-click control itself. Gmail and Outlook both surface it, and a list
   * that is easy to leave is a list that gets marked as spam less often.
   */
  readonly unsubscribeUrl: string;
}

/**
 * One campaign message.
 *
 * Returns the provider message id rather than throwing, so a single bad
 * address fails that recipient and the send carries on to the rest.
 */
export async function sendCampaignEmail(
  message: CampaignSend,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { data, error } = await resend().emails.send({
    from: `${message.fromName} <${message.fromEmail}>`,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    headers: {
      'List-Unsubscribe': `<${message.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    ...(message.replyTo ? { replyTo: message.replyTo } : {}),
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data?.id ?? '' };
}
