/**
 * Constants shared between the server-side schema and the client form.
 *
 * This module deliberately imports nothing. The form needs these values for its
 * markup, and importing them from the schema would pull Zod into the browser
 * bundle for no benefit — client-side validation here is UX only.
 */

/**
 * Honeypot field name. Rendered hidden and deliberately plausible so bots fill
 * it and people never see it. Any non-empty value rejects the submission.
 */
export const HONEYPOT_FIELD = 'company_fax';

/** How the enquirer found us. Free text is allowed; these are just prompts. */
export const REFERRAL_SOURCES = [
  'A referral',
  'Search',
  'Instagram',
  'LinkedIn',
  'Saw our work somewhere',
] as const;

export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  projectDetails: 5_000,
  referralSource: 200,
} as const;
