/**
 * Contact enquiry business logic.
 *
 * The API route is thin: it hands the request in here and formats whatever
 * comes back. Origin checking, spam rejection, validation and delivery all
 * happen in this module.
 */
import type { z } from 'zod';
import { publicEnv } from '@/config/env';
import { AppError } from '@/lib/errors';
import { sendNotification } from '@/lib/resend';
import { contactSchema, HONEYPOT_FIELD } from '@/lib/schemas/forms';

/**
 * Rejects cross-origin posts. The form is same-origin only — no wildcard CORS,
 * and no preflight is ever answered.
 *
 * @throws {AppError} 403 when the Origin header names anywhere else.
 */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  // Same-origin requests from some browsers omit Origin entirely; that is fine.
  if (origin === null) return;

  let expected: string;
  try {
    expected = new URL(publicEnv.NEXT_PUBLIC_SITE_URL).origin;
  } catch {
    throw new AppError(500, 'Server configuration problem.', 'CONFIG_SITE_URL_INVALID');
  }

  // A preview deployment serves itself on its own host, and localhost during
  // development, so accept the request's own origin as well as the canonical one.
  const host = request.headers.get('host');
  const own = host ? [`https://${host}`, `http://${host}`] : [];

  if (origin !== expected && !own.includes(origin)) {
    throw new AppError(403, 'This request was blocked.', 'REQUEST_ORIGIN_REJECTED');
  }
}

/** Reads a request body as either JSON or form data into a plain record. */
export async function readBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const parsed: unknown = await request.json();
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new AppError(400, 'We could not read that submission.', 'FORM_BODY_MALFORMED');
      }
      return parsed as Record<string, unknown>;
    }

    return Object.fromEntries((await request.formData()).entries());
  } catch (cause) {
    if (cause instanceof AppError) throw cause;
    throw new AppError(
      400,
      'We could not read that submission.',
      'FORM_BODY_UNREADABLE',
      cause,
    );
  }
}

/** @throws {AppError} 400 when the honeypot field carries any value. */
function assertNotBot(body: Record<string, unknown>): void {
  const trap = body[HONEYPOT_FIELD];
  if (typeof trap === 'string' && trap.trim().length > 0) {
    // Deliberately vague: a bot should not learn which field caught it.
    throw new AppError(400, 'This submission could not be accepted.', 'FORM_SUBMIT_REJECTED');
  }
}

/**
 * Runs the schema and turns a failure into a 422 carrying the first
 * user-facing message, with the per-field messages in `details` for the form to
 * render inline. Those are safe to send back because we wrote them.
 */
function parseOrThrow<S extends z.ZodType>(schema: S, input: unknown, code: string): z.infer<S> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.');
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }

  const first = result.error.issues[0]?.message ?? 'Please check the form and try again.';
  throw new AppError(422, first, code, fieldErrors);
}

/** Formats a label/value list into a readable plain-text email body. */
function asTextBody(rows: readonly (readonly [string, string | undefined])[]): string {
  return rows
    .filter((row): row is readonly [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

/** Validates an enquiry and delivers it to the studio's inbox. */
export async function submitContact(body: Record<string, unknown>): Promise<void> {
  assertNotBot(body);
  const data = parseOrThrow(contactSchema, body, 'FORM_CONTACT_INVALID_INPUT');

  await sendNotification({
    subject: `New enquiry: ${data.name}`,
    replyTo: data.email,
    text: asTextBody([
      ['Name', data.name],
      ['Email', data.email],
      ['Company', data.company || undefined],
      ['Phone', data.phone || undefined],
      ['Stage', data.stage || undefined],
      ['Budget', data.budget || undefined],
      ['Heard about us via', data.referralSource || undefined],
      ['Project', `\n${data.projectDetails}`],
    ]),
  });
}
