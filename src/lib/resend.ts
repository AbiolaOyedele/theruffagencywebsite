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
