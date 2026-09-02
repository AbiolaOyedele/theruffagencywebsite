import Link from 'next/link';
import { BarList, TimeSeries } from '@/components/features/admin/charts';
import { Card, Notice, PageHeader, Stat } from '@/components/features/admin/ui';
import { requireAdmin } from '@/services/admin/auth';
import { readByDay, readSummary, readTop } from '@/repositories/analytics';

/**
 * Traffic.
 *
 * First-party: the site reports its own views to `/api/v1/track` and they are
 * counted here. No third-party script, no cookie, and no identifier that
 * outlives the day — which is why there is no consent gate in front of it.
 */

const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
] as const;

export default async function TrafficPage({ searchParams }: PageProps<'/admin/marketing'>) {
  const { range } = await searchParams;
  const days = RANGES.find((r) => String(r.days) === range)?.days ?? 30;

  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

  const { client } = await requireAdmin();

  const [summary, byDay, pages, referrers, countries, devices, sources] = await Promise.all([
    readSummary(client, from, to),
    readByDay(client, from, to),
    readTop(client, from, to, 'path', 8),
    readTop(client, from, to, 'referrer_host', 8),
    readTop(client, from, to, 'country', 8),
    readTop(client, from, to, 'device', 3),
    readTop(client, from, to, 'utm_source', 8),
  ]);

  // The rollup returns only days that saw a visit; the chart wants every day,
  // or a quiet week reads as a straight line between two points.
  const filled = fillDays(from, to, byDay);

  return (
    <>
      <PageHeader
        title="Traffic"
        description="Counted on this site, stored in your own database. No third-party analytics, no cookie, and no identifier that survives the day."
        action={
          <div className="flex gap-1.5">
            {RANGES.map((r) => (
              <Link
                key={r.days}
                href={`/admin/marketing?range=${r.days}`}
                aria-current={r.days === days ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border-2 px-3.5 text-xs font-bold ${
                  r.days === days
                    ? 'border-[#250200] bg-[#250200] text-white'
                    : 'border-black/20 hover:bg-white'
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="space-y-6">
        {summary.views === 0 ? (
          <Notice>
            Nothing recorded yet. Views start arriving as soon as the site is deployed with the
            database connected — visits in local development count too.
          </Notice>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Page views" value={summary.views} hint={`Last ${days} days`} />
          <Stat label="Visitors" value={summary.visitors} hint="Distinct, per day" />
          <Stat label="Pages seen" value={summary.pages} hint="Including panels" />
        </div>

        <Card title="Over time">
          <TimeSeries points={filled} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Top pages" description="Panels count separately from the page beneath them.">
            <BarList rows={[...pages]} emptyLabel="No pages yet." />
          </Card>
          <Card title="Referrers" description="Where visitors arrived from.">
            <BarList rows={[...referrers]} emptyLabel="No referrals yet." />
          </Card>
          <Card title="Campaign sources" description="From utm_source on the link.">
            <BarList rows={[...sources]} emptyLabel="No tagged links yet." />
          </Card>
          <Card title="Countries">
            <BarList rows={[...countries]} emptyLabel="No locations yet." />
          </Card>
          <Card title="Devices">
            <BarList rows={[...devices]} emptyLabel="No devices yet." />
          </Card>
        </div>
      </div>
    </>
  );
}

/** Every day in the range, zero-filled where nothing was recorded. */
function fillDays(
  from: Date,
  to: Date,
  rows: readonly { day: string; views: number; visitors: number }[],
): { day: string; views: number; visitors: number }[] {
  const found = new Map(rows.map((row) => [row.day.slice(0, 10), row]));
  const out: { day: string; views: number; visitors: number }[] = [];

  for (let cursor = new Date(from); cursor <= to; cursor.setDate(cursor.getDate() + 1)) {
    const key = cursor.toISOString().slice(0, 10);
    const row = found.get(key);
    out.push({ day: key, views: row?.views ?? 0, visitors: row?.visitors ?? 0 });
  }

  return out;
}
