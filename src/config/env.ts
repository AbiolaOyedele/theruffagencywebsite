import { z } from 'zod';

/**
 * Environment access. Nothing else in the codebase reads `process.env`.
 *
 * The public schema is validated on import — those values are needed to render
 * and a missing one is a build-time mistake worth failing on. The mail
 * credentials are validated on first use instead: the site is a marketing page
 * that builds and runs perfectly well without them, and only the contact
 * endpoint actually needs them, so a missing key should fail that request
 * loudly rather than take the whole site down.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://theruff.agency'),
});

const publicParsed = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!publicParsed.success) {
  console.error('Invalid public environment variables:', publicParsed.error.flatten());
  throw new Error('Environment validation failed. App cannot start.');
}

export const publicEnv = publicParsed.data;

const mailSchema = z.object({
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is not set.'),
  CONTACT_TO_EMAIL: z.string().email('CONTACT_TO_EMAIL is not a valid address.'),
  CONTACT_FROM_EMAIL: z.string().email('CONTACT_FROM_EMAIL is not a valid address.'),
  /** Talent-pool applications. Optional — falls back to the studio inbox. */
  CAREERS_TO_EMAIL: z.string().email('CAREERS_TO_EMAIL is not a valid address.').optional(),
});

/** Resolved credentials — the careers address is filled in, never absent. */
export interface MailEnv {
  readonly RESEND_API_KEY: string;
  readonly CONTACT_TO_EMAIL: string;
  readonly CONTACT_FROM_EMAIL: string;
  readonly CAREERS_TO_EMAIL: string;
}

let mailCache: MailEnv | null = null;

/**
 * Credentials for sending mail, validated on first call and memoised.
 *
 * @throws {Error} when any mail variable is missing or malformed.
 */
export function mailEnv(): MailEnv {
  if (mailCache) return mailCache;

  const parsed = mailSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    // An empty variable is an unset one, not a malformed address.
    CAREERS_TO_EMAIL: process.env.CAREERS_TO_EMAIL || undefined,
  });

  if (!parsed.success) {
    console.error('Invalid mail environment variables:', parsed.error.flatten());
    throw new Error('Mail environment validation failed.');
  }

  mailCache = {
    ...parsed.data,
    CAREERS_TO_EMAIL: parsed.data.CAREERS_TO_EMAIL ?? parsed.data.CONTACT_TO_EMAIL,
  };
  return mailCache;
}
