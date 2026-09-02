import { z } from 'zod';

/**
 * Environment access. Nothing else in the codebase reads `process.env`.
 *
 * The public schema is validated on import — those values are needed to render
 * and a missing one is a build-time mistake worth failing on. The mail and
 * database credentials are validated on first use instead: the site is a
 * marketing page that builds and runs perfectly well without them, and only
 * the endpoints that need them should fail when they are absent, rather than
 * taking the whole site down.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://theruff.agency'),
  /**
   * Cloudinary's cloud name. Optional: until it is set, image sources are
   * served from `public/` exactly as they are written. It is in every delivery
   * URL Cloudinary produces, so it is public by definition and carries the
   * NEXT_PUBLIC_ prefix — the key and secret never reach the browser.
   */
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  /**
   * Supabase, which backs the admin panel. Both optional, and deliberately so:
   * with no database the site renders its typed defaults exactly as they ship
   * in the repo, and the admin panel says it is not connected rather than
   * erroring. The anon key is safe in the browser — every table is
   * row-level-secured and default-deny.
   */
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const publicParsed = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  // An empty variable is an unset one.
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || undefined,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
});

if (!publicParsed.success) {
  console.error('Invalid public environment variables:', publicParsed.error.flatten());
  throw new Error('Environment validation failed. App cannot start.');
}

export const publicEnv = publicParsed.data;

/** True once both halves of the Supabase connection are present. */
export function hasSupabase(): boolean {
  return Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

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

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is not set.'),
  /**
   * Rotated salt for the visitor digest. Analytics never stores an address;
   * it stores a hash of one, and this is what stops that hash being a lookup
   * table anybody could rebuild.
   */
  ANALYTICS_SALT: z.string().min(16, 'ANALYTICS_SALT must be at least 16 characters.'),
});

export interface ServerEnv {
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly ANALYTICS_SALT: string;
}

let serverCache: ServerEnv | null = null;

/**
 * Credentials that must never reach the browser.
 *
 * @throws {Error} when either is missing.
 */
export function serverEnv(): ServerEnv {
  if (serverCache) return serverCache;

  const parsed = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANALYTICS_SALT: process.env.ANALYTICS_SALT,
  });

  if (!parsed.success) {
    console.error('Invalid server environment variables:', parsed.error.flatten());
    throw new Error('Server environment validation failed.');
  }

  serverCache = parsed.data;
  return serverCache;
}

/**
 * What this deployment is wired to.
 *
 * Presence only — never a value. The panel shows these so a missing key is
 * visible before someone tries to use the thing that needs it, and they live
 * here because this file is the only one allowed to read the environment.
 */
export const configured = {
  supabase: hasSupabase,
  serviceRole: (): boolean => Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  mail: (): boolean =>
    Boolean(
      process.env.RESEND_API_KEY &&
        process.env.CONTACT_TO_EMAIL &&
        process.env.CONTACT_FROM_EMAIL,
    ),
  analyticsSalt: (): boolean => Boolean((process.env.ANALYTICS_SALT ?? '').length >= 16),
  cloudinary: (): boolean => Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
} as const;
