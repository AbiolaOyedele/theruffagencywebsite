import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { DeviceKind } from '@/lib/supabase/types';
import { TABLES, FUNCTIONS } from '@/lib/supabase/tables';

/**
 * Traffic.
 *
 * Writes come from visitors who have no session, so they go through the
 * service-role client. Reads are rollups computed in the database — see
 * `0002_analytics_rollups.sql` — and run as the signed-in admin.
 */

export interface PageViewInput {
  readonly sessionHash: string;
  readonly path: string;
  readonly referrerHost: string | null;
  readonly utmSource: string | null;
  readonly utmMedium: string | null;
  readonly utmCampaign: string | null;
  readonly country: string | null;
  readonly device: DeviceKind | null;
  readonly browser: string | null;
}

export async function recordPageView(view: PageViewInput): Promise<void> {
  const { error } = await supabaseAdmin().from(TABLES.analyticsEvents).insert({
    session_hash: view.sessionHash,
    path: view.path,
    referrer_host: view.referrerHost,
    utm_source: view.utmSource,
    utm_medium: view.utmMedium,
    utm_campaign: view.utmCampaign,
    country: view.country,
    device: view.device,
    browser: view.browser,
  });
  if (error) throw error;
}

export interface TrafficSummary {
  readonly views: number;
  readonly visitors: number;
  readonly pages: number;
}

export interface DayPoint {
  readonly day: string;
  readonly views: number;
  readonly visitors: number;
}

export interface TopRow {
  readonly label: string;
  readonly views: number;
  readonly visitors: number;
}

export type TopDimension =
  | 'path'
  | 'referrer_host'
  | 'country'
  | 'device'
  | 'browser'
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign';

export async function readSummary(
  client: SupabaseClient,
  from: Date,
  to: Date,
): Promise<TrafficSummary> {
  const { data, error } = await client.rpc(FUNCTIONS.analyticsSummary, {
    from_ts: from.toISOString(),
    to_ts: to.toISOString(),
  });
  if (error) throw error;
  const row = (data as TrafficSummary[] | null)?.[0];
  return row ?? { views: 0, visitors: 0, pages: 0 };
}

export async function readByDay(
  client: SupabaseClient,
  from: Date,
  to: Date,
): Promise<readonly DayPoint[]> {
  const { data, error } = await client.rpc(FUNCTIONS.analyticsByDay, {
    from_ts: from.toISOString(),
    to_ts: to.toISOString(),
  });
  if (error) throw error;
  return (data ?? []) as DayPoint[];
}

export async function readTop(
  client: SupabaseClient,
  from: Date,
  to: Date,
  dimension: TopDimension,
  limit = 10,
): Promise<readonly TopRow[]> {
  const { data, error } = await client.rpc(FUNCTIONS.analyticsTop, {
    from_ts: from.toISOString(),
    to_ts: to.toISOString(),
    dimension,
    max_rows: limit,
  });
  if (error) throw error;
  return (data ?? []) as TopRow[];
}
