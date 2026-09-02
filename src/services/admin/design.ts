import { designSaveSchema } from '@/lib/schemas/admin';
import { AppError } from '@/lib/errors';
import { deleteDesignTokens, upsertDesignTokens } from '@/repositories/design';
import { writeAudit } from '@/repositories/audit';
import { getDesignTokens } from '@/lib/design/resolve';
import type { AdminSession } from '@/services/admin/auth';

/** Saving and reverting design tokens. */

export async function saveTokens(
  session: AdminSession,
  entries: readonly { key: string; value: string }[],
): Promise<void> {
  const parsed = designSaveSchema.safeParse({ entries });
  if (!parsed.success) {
    throw new AppError(
      422,
      parsed.error.issues[0]?.message ?? 'That value could not be saved.',
      'ADMIN_DESIGN_INVALID',
    );
  }

  const before = await getDesignTokens();
  await upsertDesignTokens(session.client, parsed.data.entries, session.profile.id);

  await writeAudit(session.client, {
    actorId: session.profile.id,
    actorEmail: session.profile.email,
    action: 'design.update',
    entity: 'design',
    entityId: parsed.data.entries.map((e) => e.key).join(', '),
    before,
    after: Object.fromEntries(parsed.data.entries.map((e) => [e.key, e.value])),
  });
}

export async function revertTokens(
  session: AdminSession,
  keys: readonly string[],
): Promise<void> {
  const before = await getDesignTokens();
  await deleteDesignTokens(session.client, keys);

  await writeAudit(session.client, {
    actorId: session.profile.id,
    actorEmail: session.profile.email,
    action: 'design.revert',
    entity: 'design',
    entityId: keys.join(', '),
    before,
    after: null,
  });
}
