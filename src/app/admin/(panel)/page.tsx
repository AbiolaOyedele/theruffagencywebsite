import Link from 'next/link';
import { Badge, Card, Empty, Notice, PageHeader, Stat } from '@/components/features/admin/ui';
import { CONTENT_SECTIONS } from '@/components/features/admin/contentGroups';
import { requireAdmin } from '@/services/admin/auth';
import { getContentOverrides } from '@/lib/content/resolve';
import { getDesignTokens } from '@/lib/design/resolve';
import { readSummary } from '@/repositories/analytics';
import { countNewEnquiries } from '@/repositories/enquiries';
import { readAudit } from '@/repositories/audit';
import { countSendable } from '@/repositories/contacts';
import { configured } from '@/config/env';

export default async function OverviewPage() {
  const { client, profile } = await requireAdmin();

  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [traffic, newEnquiries, overrides, tokens, audience, activity] = await Promise.all([
    readSummary(client, from, to),
    countNewEnquiries(client),
    getContentOverrides(),
    getDesignTokens(),
    countSendable(client, {}),
    readAudit(client, 8),
  ]);

  const editedCount = Object.keys(overrides).length;
  const tokenCount = Object.keys(tokens).length;

  const edited = CONTENT_SECTIONS.flatMap((section) => section.entries).filter(
    (entry) => entry.key in overrides,
  );

  return (
    <>
      <PageHeader
        title={`Hello${profile.name ? `, ${profile.name}` : ''}`}
        description="What the site is doing, and what has been changed away from the repository."
      />

      <div className="space-y-6">
        {!configured.mail() ? (
          <Notice tone="warn">
            Mail is not configured, so enquiry notifications and campaigns cannot send. Set{' '}
            <code>RESEND_API_KEY</code> and the two address variables.
          </Notice>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Views" value={traffic.views} hint="Last 30 days" />
          <Stat label="Visitors" value={traffic.visitors} hint="Last 30 days" />
          <Stat label="New enquiries" value={newEnquiries} hint="Unread" />
          <Stat label="Reachable" value={audience} hint="Subscribed contacts" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            title="Changed from the repository"
            description="Everything else is rendering exactly what is in the code."
          >
            {editedCount === 0 && tokenCount === 0 ? (
              <Empty>Nothing has been changed here yet.</Empty>
            ) : (
              <ul className="space-y-2">
                {edited.map((entry) => (
                  <li key={entry.key}>
                    <Link
                      href={`/admin/content/${entry.key}`}
                      className="flex min-h-11 items-center justify-between gap-3 text-sm hover:opacity-70"
                    >
                      <span>{entry.label}</span>
                      <Badge>Edited</Badge>
                    </Link>
                  </li>
                ))}
                {tokenCount > 0 ? (
                  <li>
                    <Link
                      href="/admin/design"
                      className="flex min-h-11 items-center justify-between gap-3 text-sm hover:opacity-70"
                    >
                      <span>Design</span>
                      <Badge>
                        {tokenCount} {tokenCount === 1 ? 'token' : 'tokens'}
                      </Badge>
                    </Link>
                  </li>
                ) : null}
              </ul>
            )}
          </Card>

          <Card title="Recent activity">
            {activity.length === 0 ? (
              <Empty>No changes recorded yet.</Empty>
            ) : (
              <ul className="space-y-2 text-sm">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0">
                      <span className="font-bold">{entry.action}</span>{' '}
                      <span className="text-[#6b5a55]">{entry.entity_id ?? entry.entity}</span>
                    </span>
                    <span className="shrink-0 text-xs text-[#6b5a55]">
                      {new Date(entry.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
