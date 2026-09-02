import { deepMerge } from '@/lib/content/merge';
import { contentDefaults } from '@/lib/content/resolve';
import { contentSaveSchema } from '@/lib/schemas/admin';
import { AppError } from '@/lib/errors';
import {
  deleteContentOverride,
  readContentOverride,
  upsertContentOverride,
} from '@/repositories/content';
import { writeAudit } from '@/repositories/audit';
import type { AdminSession } from '@/services/admin/auth';

/**
 * Saving and reverting the site's copy.
 *
 * An override is stored whole per content group rather than as a diff: the
 * panel already knows the current value, the groups are small, and a stored
 * diff would have to be re-resolved against a default that may have moved
 * under it in a deploy.
 */

export async function saveContent(
  session: AdminSession,
  input: { key: string; value: unknown },
): Promise<void> {
  const parsed = contentSaveSchema.safeParse(input);
  if (!parsed.success) {
    throw new AppError(
      422,
      parsed.error.issues[0]?.message ?? 'That could not be saved.',
      'ADMIN_CONTENT_INVALID',
    );
  }

  const before = await readContentOverride(parsed.data.key);
  await upsertContentOverride(
    session.client,
    parsed.data.key,
    parsed.data.value,
    session.profile.id,
  );

  await writeAudit(session.client, {
    actorId: session.profile.id,
    actorEmail: session.profile.email,
    action: before ? 'content.update' : 'content.create',
    entity: 'content',
    entityId: parsed.data.key,
    before: before?.value ?? null,
    after: parsed.data.value,
  });
}

/** Drops the override, so the group renders whatever the repo says again. */
export async function revertContent(session: AdminSession, key: string): Promise<void> {
  if (!(key in contentDefaults)) {
    throw new AppError(400, 'There is no such section.', 'ADMIN_CONTENT_UNKNOWN_KEY');
  }

  const before = await readContentOverride(key);
  await deleteContentOverride(session.client, key);

  await writeAudit(session.client, {
    actorId: session.profile.id,
    actorEmail: session.profile.email,
    action: 'content.revert',
    entity: 'content',
    entityId: key,
    before: before?.value ?? null,
    after: null,
  });
}

/** The current value of one group: the override if there is one, else default. */
export async function currentValue(key: string): Promise<unknown> {
  const base = (contentDefaults as Record<string, unknown>)[key];
  const override = await readContentOverride(key);
  return override ? deepMerge(base, override.value) : base;
}
