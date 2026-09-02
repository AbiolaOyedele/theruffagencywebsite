import { z } from 'zod';
import * as defaults from '@/content/site';
import { ALL_TOKENS, findToken } from '@/config/designTokens';

/** What the panel is allowed to save. */

const CONTENT_KEYS = Object.keys(defaults) as [string, ...string[]];

/** A content group that this build actually has. */
export const contentKeySchema = z.enum(CONTENT_KEYS);

/**
 * An override's payload.
 *
 * Not shape-checked against the content type — a Zod mirror of every group in
 * `content/site.ts` would be a second source of truth that drifts. The panel
 * edits typed fields, the caller is an authenticated admin, and this is the
 * backstop: valid JSON, and small enough that a paste accident cannot fill the
 * table.
 */
export const contentValueSchema = z
  .unknown()
  .refine((value) => value !== undefined, 'A value is required.')
  .refine(
    (value) => JSON.stringify(value ?? null).length <= 512_000,
    'That is too large to save. Split it across fewer changes.',
  );

export const contentSaveSchema = z.object({
  key: contentKeySchema,
  value: contentValueSchema,
});

/* ---- Design tokens -------------------------------------------------- */

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const RGBA = /^rgba?\(\s*[\d.\s,%/]+\)$/;
const LENGTH = /^-?\d+(?:\.\d+)?(?:px|rem|em|%)$/;
const WEIGHT = /^[1-9]00$/;
/** A font stack: names, quotes, commas and spaces. Nothing that ends a rule. */
const FONT_STACK = /^[\w\s'",.-]+$/;

/**
 * A token value, checked against what that token is.
 *
 * Kept strict on purpose. These strings are written into a `<style>` element,
 * and a colour that is really a font stack is a broken site rather than an
 * attack — but both are worth refusing.
 */
export const designTokenSchema = z
  .object({ key: z.string(), value: z.string().trim().min(1).max(200) })
  .superRefine((entry, ctx) => {
    const token = findToken(entry.key);
    if (!token) {
      ctx.addIssue({ code: 'custom', message: `Unknown token: ${entry.key}`, path: ['key'] });
      return;
    }

    const ok =
      token.kind === 'colour'
        ? HEX.test(entry.value) || RGBA.test(entry.value)
        : token.kind === 'weight'
          ? WEIGHT.test(entry.value)
          : token.kind === 'length'
            ? LENGTH.test(entry.value)
            : FONT_STACK.test(entry.value);

    if (!ok) {
      const expected: Record<string, string> = {
        colour: 'a hex colour like #e92038, or an rgba() value',
        weight: 'a font weight from 100 to 900',
        length: 'a length like 28px',
        font: 'a font stack like \'Milligram\', sans-serif',
      };
      ctx.addIssue({
        code: 'custom',
        message: `${token.label} needs ${expected[token.kind]}.`,
        path: ['value'],
      });
    }
  });

export const designSaveSchema = z.object({
  entries: z.array(designTokenSchema).max(ALL_TOKENS.length),
});

/* ---- Marketing ------------------------------------------------------ */

export const contactUpsertSchema = z.object({
  email: z.string().trim().toLowerCase().email('That is not a valid email address.'),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  roleTitle: z.string().trim().max(120).optional(),
  consent: z.enum(['explicit', 'legitimate_interest']),
  consentNote: z.string().trim().max(500).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  notes: z.string().trim().max(2000).optional(),
});

export const campaignSchema = z.object({
  name: z.string().trim().min(1, 'Give the campaign a name.').max(120),
  subject: z.string().trim().min(1, 'A subject line is required.').max(200),
  preheader: z.string().trim().max(200).optional(),
  bodyMarkdown: z.string().trim().min(1, 'The email needs a body.').max(50_000),
  fromName: z.string().trim().min(1).max(120),
  fromEmail: z.string().trim().toLowerCase().email(),
  replyTo: z.string().trim().toLowerCase().email().optional().or(z.literal('')),
  segment: z
    .object({
      tags: z.array(z.string()).optional(),
      sources: z.array(z.enum(['contact_form', 'talent_form', 'import', 'manual'])).optional(),
      consent: z.enum(['explicit', 'legitimate_interest']).optional(),
    })
    .default({}),
});

export type ContactUpsert = z.infer<typeof contactUpsertSchema>;
export type CampaignInputShape = z.infer<typeof campaignSchema>;
