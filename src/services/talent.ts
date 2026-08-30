/**
 * Talent-pool application logic.
 *
 * The API route is thin: it hands the request in here and formats whatever
 * comes back. Origin checking and body reading are shared with the enquiry
 * flow — there is one way into this site's forms, not two.
 */
import { mailEnv } from '@/config/env';
import { AppError } from '@/lib/errors';
import { sendNotification } from '@/lib/resend';
import { HONEYPOT_FIELD } from '@/lib/schemas/form-constants';
import { talentSchema } from '@/lib/schemas/talent';

/** @throws {AppError} 400 when the honeypot field carries any value. */
function assertNotBot(body: Record<string, unknown>): void {
  const trap = body[HONEYPOT_FIELD];
  if (typeof trap === 'string' && trap.trim().length > 0) {
    // Deliberately vague: a bot should not learn which field caught it.
    throw new AppError(400, 'This submission could not be accepted.', 'FORM_SUBMIT_REJECTED');
  }
}

/** Formats a label/value list into a readable plain-text email body. */
function asTextBody(rows: readonly (readonly [string, string | undefined])[]): string {
  return rows
    .filter((row): row is readonly [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

/** Validates an application and delivers it to the studio's inbox. */
export async function submitTalent(body: Record<string, unknown>): Promise<void> {
  assertNotBot(body);

  const result = talentSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    const first = result.error.issues[0]?.message ?? 'Please check the form and try again.';
    throw new AppError(422, first, 'FORM_TALENT_INVALID_INPUT', fieldErrors);
  }

  const data = result.data;

  await sendNotification({
    to: mailEnv().CAREERS_TO_EMAIL,
    subject: `Talent pool: ${data.fullName}`,
    replyTo: data.email,
    text: asTextBody([
      ['Name', data.fullName],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Years of experience', data.yearsExperience],
      ['Availability', data.availability],
      ['Expected rate', data.expectedRate],
      ['Portfolio / LinkedIn', data.portfolioLink || undefined],
      ['Roles', `\n- ${data.rolesInterested.join('\n- ')}`],
      ['Note', data.note ? `\n${data.note}` : undefined],
    ]),
  });
}
