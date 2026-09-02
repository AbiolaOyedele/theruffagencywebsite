import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CampaignEditor } from '@/components/features/admin/CampaignEditor';
import { PageHeader } from '@/components/features/admin/ui';
import { requireAdmin } from '@/services/admin/auth';
import { listRecipients, readCampaign } from '@/repositories/campaigns';
import { countSendable } from '@/repositories/contacts';
import { getContent } from '@/lib/content/resolve';

export default async function CampaignPage({ params }: PageProps<'/admin/marketing/campaigns/[id]'>) {
  const { id } = await params;
  const isNew = id === 'new';

  const { client } = await requireAdmin();
  const { brand } = await getContent();

  const campaign = isNew ? null : await readCampaign(client, id);
  if (!isNew && !campaign) notFound();

  const [reachable, recipients] = await Promise.all([
    countSendable(client, campaign?.segment ?? {}),
    campaign ? listRecipients(client, campaign.id) : Promise.resolve([]),
  ]);

  const sent = recipients.filter((r) => r.status === 'sent').length;
  const failed = recipients.filter((r) => r.status === 'failed').length;

  return (
    <>
      <p className="mb-3 text-sm">
        <Link href="/admin/marketing/campaigns" className="text-[#6b5a55] underline">
          ← Campaigns
        </Link>
      </p>

      <PageHeader
        title={isNew ? 'New campaign' : (campaign?.name ?? 'Campaign')}
        description={
          isNew
            ? 'Save it as a draft first. Nothing is sent until you press send, and then only to people who are still reachable.'
            : `${sent} sent, ${failed} failed, ${reachable} currently in this segment.`
        }
      />

      <CampaignEditor
        campaign={campaign}
        reachable={reachable}
        defaultFromName={brand.name}
        defaultFromEmail={brand.email}
      />
    </>
  );
}
