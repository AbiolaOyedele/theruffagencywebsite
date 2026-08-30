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

/**
 * Where the work stands today. Every set ends with a way out — nobody should
 * be stuck on a question they cannot honestly answer.
 */
export const PROJECT_STAGES = [
  'Just an idea',
  'Early concept',
  'Building it now',
  'Already launched',
  'Needs a refresh',
  'Not sure yet',
] as const;

/** Budget in Naira. Bands rather than a figure — easier to answer honestly. */
export const BUDGET_BANDS = [
  'Under ₦150,000',
  '₦150,000 – ₦500,000',
  '₦500,000 – ₦1.5m',
  '₦1.5m – ₦5m',
  '₦5m+',
  'Not sure yet',
] as const;

export type ProjectStage = (typeof PROJECT_STAGES)[number];
export type BudgetBand = (typeof BUDGET_BANDS)[number];

export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  projectDetails: 5_000,
  referralSource: 200,
} as const;
