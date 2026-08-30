/**
 * The talent form's rules. The API route validates against this; nothing the
 * client does is trusted.
 */
import { z } from 'zod';
import { HONEYPOT_FIELD } from '@/lib/schemas/form-constants';
import {
  ALL_ROLES,
  AVAILABILITY_OPTIONS,
  TALENT_LIMITS,
} from '@/lib/schemas/talent-constants';

export * from '@/lib/schemas/talent-constants';

/**
 * Deliberately permissive: applicants are international, so any mix of digits,
 * spaces and common grouping characters after an optional country prefix is
 * accepted. This checks the value is plausibly a phone number, not that it is
 * dialable.
 */
const PHONE_PATTERN = /^\+?\d[\d\s().-]*$/;

const required = (label: string, max: number) =>
  z
    .string({ message: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

export const talentSchema = z.object({
  fullName: required('Your name', TALENT_LIMITS.fullName),
  email: z
    .string({ message: 'An email address is required.' })
    .trim()
    .toLowerCase()
    .min(1, 'An email address is required.')
    .email('Enter a valid email address.')
    .max(TALENT_LIMITS.email),
  phone: z
    .string({ message: 'A phone number is required.' })
    .trim()
    .min(7, 'That phone number looks too short.')
    .max(TALENT_LIMITS.phone, 'That phone number looks too long.')
    .regex(PHONE_PATTERN, 'Enter a phone number we can reach you on.'),
  yearsExperience: required('Years of experience', TALENT_LIMITS.yearsExperience),
  availability: z.enum(AVAILABILITY_OPTIONS, { message: 'Pick your availability.' }),
  expectedRate: required('An expected rate', TALENT_LIMITS.expectedRate),
  portfolioLink: z
    .union([z.literal(''), z.string().trim().url('Enter a full link, starting with https://')])
    .optional(),
  note: z.string().trim().max(TALENT_LIMITS.note).optional().or(z.literal('')),
  /**
   * Arrives as a comma-separated list from the form. Every entry has to be a
   * role we actually offer, so a hand-rolled POST cannot invent one.
   */
  rolesInterested: z
    // The message belongs on the type check as well as the array rule below:
    // a body with no roles field at all would otherwise answer with Zod's own
    // "expected string, received undefined".
    .string({ message: 'Select at least one role.' })
    .transform((value) =>
      value
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string())
        .min(1, 'Select at least one role.')
        .max(ALL_ROLES.length)
        .refine((roles) => roles.every((role) => ALL_ROLES.includes(role)), {
          message: 'Unknown role selected.',
        }),
    ),
  [HONEYPOT_FIELD]: z.string().max(0, 'Rejected.').optional(),
});

export type TalentInput = z.infer<typeof talentSchema>;
