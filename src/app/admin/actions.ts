'use server';

import { updateTag } from 'next/cache';
import { CONTENT_TAG } from '@/lib/content/resolve';
import { DESIGN_TAG } from '@/lib/design/resolve';
import { isAppError } from '@/lib/errors';
import { requireAdmin } from '@/services/admin/auth';
import { revertContent, saveContent } from '@/services/admin/content';
import { revertTokens, saveTokens } from '@/services/admin/design';
import { sendCampaign } from '@/services/admin/campaigns';
import { contactUpsertSchema, campaignSchema } from '@/lib/schemas/admin';
import {
  deleteContact,
  suppress,
  updateContact,
  upsertContacts,
} from '@/repositories/contacts';
import { setEnquiryStatus } from '@/repositories/enquiries';
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from '@/repositories/campaigns';
import type { EnquiryStatus } from '@/lib/supabase/types';

/**
 * Everything the panel can change.
 *
 * Each one does the same four things in the same order: check who is asking,
 * hand the work to a service, invalidate what the public site has cached, and
 * report back in a sentence a person can read. `updateTag` rather than
 * `revalidateTag` because these run as Server Actions and the studio should
 * see the change on the very next request, not the one after.
 */

export interface ActionResult {
  readonly ok: boolean;
  readonly message: string;
}

async function run(work: () => Promise<string>): Promise<ActionResult> {
  try {
    return { ok: true, message: await work() };
  } catch (error) {
    if (isAppError(error)) return { ok: false, message: error.message };
    console.error('Admin action failed:', error);
    return { ok: false, message: 'That did not save. Please try again.' };
  }
}

/* ---- Content -------------------------------------------------------- */

export async function saveContentAction(key: string, valueJson: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    await saveContent(session, { key, value: JSON.parse(valueJson) as unknown });
    updateTag(CONTENT_TAG);
    return 'Saved. The site is showing it now.';
  });
}

export async function revertContentAction(key: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    await revertContent(session, key);
    updateTag(CONTENT_TAG);
    return 'Reverted to the version in the repository.';
  });
}

/* ---- Design --------------------------------------------------------- */

export async function saveDesignAction(entriesJson: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    const entries = JSON.parse(entriesJson) as { key: string; value: string }[];
    await saveTokens(session, entries);
    updateTag(DESIGN_TAG);
    return 'Saved. The site is using it now.';
  });
}

export async function revertDesignAction(keysJson: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    await revertTokens(session, JSON.parse(keysJson) as string[]);
    updateTag(DESIGN_TAG);
    return 'Reset to the values in the repository.';
  });
}

/* ---- Enquiries ------------------------------------------------------ */

export async function setEnquiryStatusAction(
  id: string,
  status: EnquiryStatus,
): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    await setEnquiryStatus(session.client, id, status);
    return status === 'archived' ? 'Archived.' : 'Marked as read.';
  });
}

/* ---- Audience ------------------------------------------------------- */

export async function saveContactAction(
  id: string | null,
  form: FormData,
): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();

    const parsed = contactUpsertSchema.safeParse({
      email: form.get('email'),
      name: form.get('name') || undefined,
      company: form.get('company') || undefined,
      roleTitle: form.get('roleTitle') || undefined,
      consent: form.get('consent'),
      consentNote: form.get('consentNote') || undefined,
      tags: String(form.get('tags') ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: form.get('notes') || undefined,
    });

    if (!parsed.success) throw parsed.error.issues[0] ?? new Error('Invalid contact.');

    if (id) {
      await updateContact(session.client, id, parsed.data);
      return 'Contact updated.';
    }

    await upsertContacts(session.client, [{ ...parsed.data, source: 'manual' }]);
    return 'Contact added.';
  });
}

export async function deleteContactAction(id: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    await deleteContact(session.client, id);
    return 'Contact deleted.';
  });
}

export async function suppressAction(email: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    await suppress(session.client, email, 'manual');
    return 'Added to the suppression list. They will not be sent anything again.';
  });
}

/**
 * Bulk import.
 *
 * One address per line, optionally `email, name, company`. Every imported
 * contact is recorded with the basis the importer chose and a note saying
 * where the list came from — the thing that has to be answerable later.
 */
export async function importContactsAction(form: FormData): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();

    const raw = String(form.get('rows') ?? '');
    const consent = form.get('consent') === 'explicit' ? 'explicit' : 'legitimate_interest';
    const note = String(form.get('consentNote') ?? '').trim();
    const tags = String(form.get('tags') ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!note) throw new Error('Say where the list came from.');

    const rows = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [email, name, company] = line.split(',').map((part) => part.trim());
        return { email: email ?? '', name: name || null, company: company || null };
      })
      .filter((row) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email));

    if (rows.length === 0) throw new Error('No valid email addresses in that list.');

    const added = await upsertContacts(
      session.client,
      rows.map((row) => ({
        ...row,
        source: 'import' as const,
        consent,
        consentNote: note,
        tags,
      })),
    );

    return `Imported ${added} ${added === 1 ? 'contact' : 'contacts'}.`;
  });
}

/* ---- Campaigns ------------------------------------------------------ */

export async function saveCampaignAction(
  id: string | null,
  form: FormData,
): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();

    const parsed = campaignSchema.safeParse({
      name: form.get('name'),
      subject: form.get('subject'),
      preheader: form.get('preheader') || undefined,
      bodyMarkdown: form.get('bodyMarkdown'),
      fromName: form.get('fromName'),
      fromEmail: form.get('fromEmail'),
      replyTo: form.get('replyTo') || undefined,
      segment: {
        tags: String(form.get('segmentTags') ?? '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        consent: form.get('segmentConsent') || undefined,
      },
    });

    if (!parsed.success) throw parsed.error.issues[0] ?? new Error('Invalid campaign.');

    const input = {
      ...parsed.data,
      replyTo: parsed.data.replyTo || null,
      preheader: parsed.data.preheader ?? null,
    };

    if (id) {
      await updateCampaign(session.client, id, input);
      return 'Campaign saved.';
    }

    await createCampaign(session.client, input, session.profile.id);
    return 'Campaign created.';
  });
}

export async function sendCampaignAction(id: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    const { sent, failed, remaining } = await sendCampaign(session, id);

    const parts = [`Sent ${sent}.`];
    if (failed > 0) parts.push(`${failed} failed.`);
    if (remaining > 0) parts.push(`${remaining} still queued — run it again to continue.`);
    return parts.join(' ');
  });
}

export async function deleteCampaignAction(id: string): Promise<ActionResult> {
  return run(async () => {
    const session = await requireAdmin();
    await deleteCampaign(session.client, id);
    return 'Campaign deleted.';
  });
}
