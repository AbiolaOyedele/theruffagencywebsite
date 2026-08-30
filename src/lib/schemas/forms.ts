/**
 * The contact form's rules. This is the single source of truth: the API route
 * validates against it server-side, and nothing the client does is trusted.
 */
import { z } from 'zod';
import {
  BUDGET_BANDS,
  HONEYPOT_FIELD,
  LIMITS,
  SERVICE_TYPES,
  TIMELINES,
} from '@/lib/schemas/form-constants';

export * from '@/lib/schemas/form-constants';

const honeypot = z.string().max(0, 'Rejected.').optional();

/**
 * A required field. The message is given to the type check as well as the
 * length check, so a field that is missing entirely reads the same as one left
 * blank — Zod's own "expected string, received undefined" is exactly the
 * jargon a person should never be shown.
 */
const requiredText = (label: string, max: number) =>
  z
    .string({ message: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

const optionalText = (label: string, max: number) =>
  z
    .string({ message: `${label} is not valid.` })
    .trim()
    .max(max, `${label} is too long.`)
    .optional()
    .or(z.literal(''));

export const contactSchema = z.object({
  name: requiredText('Your name', LIMITS.name),
  email: z
    .string({ message: 'An email address is required.' })
    .trim()
    .min(1, 'An email address is required.')
    .email('Enter a valid email address.')
    .max(LIMITS.email, 'That email address is too long.'),
  company: optionalText('Company', LIMITS.company),
  phone: optionalText('Phone', LIMITS.phone),
  projectDetails: requiredText('A short description of your project', LIMITS.projectDetails),
  referralSource: optionalText('That answer', LIMITS.referralSource),
  // Closed sets, so a hand-rolled POST cannot drop arbitrary text into them.
  service: z.enum(SERVICE_TYPES).optional().or(z.literal('')),
  timeline: z.enum(TIMELINES).optional().or(z.literal('')),
  budget: z.enum(BUDGET_BANDS).optional().or(z.literal('')),
  [HONEYPOT_FIELD]: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;
