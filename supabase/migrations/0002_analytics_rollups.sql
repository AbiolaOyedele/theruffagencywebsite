-- Traffic rollups.
--
-- Aggregation belongs in the database, not in a loop over rows pulled across
-- the wire: the dashboard asks for a fortnight of totals, not a fortnight of
-- page views. All three are security-definer and gated on agency_is_admin(), so an
-- anon key still cannot read them.

create or replace function agency_analytics_summary(from_ts timestamptz, to_ts timestamptz)
  returns table (views bigint, visitors bigint, pages bigint)
  language sql stable security definer set search_path = public
as $fn$
  select
    count(*)::bigint,
    count(distinct session_hash)::bigint,
    count(distinct path)::bigint
  from agency_analytics_events
  where agency_is_admin() and occurred_at >= from_ts and occurred_at < to_ts
$fn$;

create or replace function agency_analytics_by_day(from_ts timestamptz, to_ts timestamptz)
  returns table (day date, views bigint, visitors bigint)
  language sql stable security definer set search_path = public
as $fn$
  select
    occurred_at::date,
    count(*)::bigint,
    count(distinct session_hash)::bigint
  from agency_analytics_events
  where agency_is_admin() and occurred_at >= from_ts and occurred_at < to_ts
  group by 1
  order by 1
$fn$;

-- One function rather than five near-identical ones. `dimension` is checked
-- against a fixed list and then used to pick a column, so no caller-supplied
-- text ever reaches the query as an identifier.
create or replace function agency_analytics_top(
  from_ts timestamptz,
  to_ts timestamptz,
  dimension text,
  max_rows integer default 10
)
  returns table (label text, views bigint, visitors bigint)
  language plpgsql stable security definer set search_path = public
as $fn$
begin
  if not agency_is_admin() then
    return;
  end if;

  if dimension not in ('path', 'referrer_host', 'country', 'device', 'browser',
                       'utm_source', 'utm_medium', 'utm_campaign') then
    raise exception 'unknown dimension %', dimension;
  end if;

  return query execute format($q$
    select coalesce(%I, 'direct')::text, count(*)::bigint, count(distinct session_hash)::bigint
    from agency_analytics_events
    where occurred_at >= $1 and occurred_at < $2
    group by 1
    order by 2 desc
    limit $3
  $q$, dimension)
  using from_ts, to_ts, max_rows;
end
$fn$;
