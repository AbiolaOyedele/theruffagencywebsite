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
 * The kind of work. These are the services the studio actually sells — a
 * creative brief, not a product build — and the set ends with a way out so
 * nobody has to force their project into a box that does not fit.
 */
export const SERVICE_TYPES = [
  'Brand identity',
  'Brand strategy',
  'Campaign',
  'Content & motion',
  'Packaging',
  'Something else',
] as const;

/** When it is needed. Ends with a way out, like every closed question here. */
export const TIMELINES = [
  'As soon as possible',
  'Within a month',
  'This quarter',
  'Later this year',
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

export type ServiceType = (typeof SERVICE_TYPES)[number];
export type Timeline = (typeof TIMELINES)[number];
export type BudgetBand = (typeof BUDGET_BANDS)[number];

export const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  projectDetails: 5_000,
  referralSource: 200,
} as const;
