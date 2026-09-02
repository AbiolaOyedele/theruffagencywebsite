import { Card, Empty, PageHeader } from '@/components/features/admin/ui';
import { requireAdmin } from '@/services/admin/auth';
import { readAudit } from '@/repositories/audit';

/**
 * The audit log.
 *
 * Every change made through the panel, with who made it and what it replaced.
 * Written on the way past by the services themselves, so nothing can be
 * changed without a line appearing here.
 */
export default async function ActivityPage() {
  const { client } = await requireAdmin();
  const entries = await readAudit(client, 200);

  return (
    <>
      <PageHeader
        title="Activity"
        description="Every change made in this panel, newest first."
      />

      <Card>
        {entries.length === 0 ? (
          <Empty>Nothing recorded yet.</Empty>
        ) : (
          <ul className="divide-y divide-black/10">
            {entries.map((entry) => (
              <li key={entry.id} className="py-3">
                <p className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span>
                    <span className="font-bold">{entry.action}</span>{' '}
                    <span className="text-[#6b5a55]">{entry.entity_id ?? entry.entity}</span>
                  </span>
                  <span className="text-xs text-[#6b5a55]">
                    {new Date(entry.created_at).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
                <p className="text-xs text-[#6b5a55]">{entry.actor_email ?? 'Unknown'}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
