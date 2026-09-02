import Link from 'next/link';
import { Badge, Card, Empty, PageHeader } from '@/components/features/admin/ui';
import { requireAdmin } from '@/services/admin/auth';
import { listCampaigns } from '@/repositories/campaigns';
import { countSendable } from '@/repositories/contacts';

export default async function CampaignsPage() {
  const { client } = await requireAdmin();
  const [campaigns, reachable] = await Promise.all([
    listCampaigns(client),
    countSendable(client, {}),
  ]);

  return (
    <>
      <PageHeader
        title="Campaigns"
        description={`Write once, send to a segment. ${reachable} ${reachable === 1 ? 'person is' : 'people are'} currently reachable — everyone else has either unsubscribed or is suppressed.`}
        action={
          <Link
            href="/admin/marketing/campaigns/new"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-[#250200] bg-[#e92038] px-5 text-sm font-bold text-white shadow-[4px_4px_0_#250200]"
          >
            New campaign
          </Link>
        }
      />

      <Card>
        {campaigns.length === 0 ? (
          <Empty>No campaigns yet.</Empty>
        ) : (
          <ul className="divide-y divide-black/10">
            {campaigns.map((campaign) => (
              <li key={campaign.id}>
                <Link
                  href={`/admin/marketing/campaigns/${campaign.id}`}
                  className="flex min-h-14 flex-wrap items-center justify-between gap-3 py-3 hover:opacity-70"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{campaign.name}</span>
                    <span className="block truncate text-xs text-[#6b5a55]">{campaign.subject}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <Badge>{campaign.status}</Badge>
                    <span aria-hidden="true" className="text-[#6b5a55]">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
