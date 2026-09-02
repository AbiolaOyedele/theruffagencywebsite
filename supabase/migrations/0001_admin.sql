-- The Ruff Agency — admin panel schema.
--
-- SHARED DATABASE. This Supabase project is not ours alone: other Ruff work
-- already keeps `ruff_projects`, `ruff_settings`, `ruff_testimonials` and more
-- in the same `public` schema. Every object below is therefore prefixed
-- `agency_`, including indexes and functions, which share that namespace too.
-- Nothing here drops, alters or reads anything it did not create.
--
-- `auth.users` is the one shared thing we do touch, and only by reference —
-- it is the project's single pool of accounts. Being in it grants nothing:
-- `agency_admin_profiles` is the allowlist, and every policy is written in
-- terms of it, so a user belonging to another Ruff app reaches none of this.
--
-- Three things live here, and they are deliberately separate:
--
--   1. Overrides for the site's own content and design tokens. The typed
--      defaults still live in src/content/site.ts and src/config/tokens.ts;
--      these tables only carry what the studio has changed, so an empty
--      database renders exactly the site that ships in the repo.
--   2. What the site observes — page views and agency_enquiries.
--   3. Who the studio talks to — agency_contacts, agency_campaigns, and the suppression
--      list that outranks both.
--
-- Every table is row-level-secured and default-deny. The anon key can read
-- nothing. Only a signed-in admin, or the server's service role, gets through.

create extension if not exists citext;
create extension if not exists pgcrypto;

/* ------------------------------------------------------------------ */
/* Who is allowed in                                                   */
/* ------------------------------------------------------------------ */

create table if not exists agency_admin_profiles (
  id         uuid primary key references auth.users on delete cascade,
  email      citext not null unique,
  name       text,
  role       text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

-- Security-definer so it can read agency_admin_profiles without tripping the policy
-- that is itself defined in terms of this function.
create or replace function agency_is_admin() returns boolean
  language sql stable security definer set search_path = public
as $fn$
  select exists (select 1 from agency_admin_profiles where id = auth.uid())
$fn$;

/* ------------------------------------------------------------------ */
/* The site, as edited                                                 */
/* ------------------------------------------------------------------ */

-- One row per top-level content group ('brand', 'hero', 'pricing', ...).
-- The value is a deep partial merged over the default, so a row that changes
-- one headline carries one headline, not the whole group.
create table if not exists agency_content_overrides (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users
);

-- Flat, because that is what a CSS custom property is: 'color.brand' -> '#e92038'.
create table if not exists agency_design_tokens (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users
);

create table if not exists agency_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

/* ------------------------------------------------------------------ */
/* What the site sees                                                  */
/* ------------------------------------------------------------------ */

-- No IP address is stored. `session_hash` is a daily-salted digest, which is
-- enough to count a returning visitor within a day and useless afterwards.
create table if not exists agency_analytics_events (
  id            bigserial primary key,
  occurred_at   timestamptz not null default now(),
  session_hash  text not null,
  path          text not null,
  referrer_host text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  country       text,
  device        text check (device in ('mobile', 'tablet', 'desktop')),
  browser       text
);

create index if not exists agency_analytics_events_occurred_idx on agency_analytics_events (occurred_at desc);
create index if not exists agency_analytics_events_path_idx     on agency_analytics_events (path);
create index if not exists agency_analytics_events_session_idx  on agency_analytics_events (session_hash, occurred_at desc);

create table if not exists agency_enquiries (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('contact', 'talent')),
  name       text,
  email      citext,
  company    text,
  payload    jsonb not null,
  status     text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists agency_enquiries_created_idx on agency_enquiries (created_at desc);

/* ------------------------------------------------------------------ */
/* Who the studio writes to                                            */
/* ------------------------------------------------------------------ */

create table if not exists agency_contacts (
  id                 uuid primary key default gen_random_uuid(),
  email              citext not null unique,
  name               text,
  company            text,
  role_title         text,
  source             text not null check (source in ('contact_form', 'talent_form', 'import', 'manual')),
  -- Why we believe we may write to this person. Recorded per contact because
  -- it is the thing that has to be defensible later, not a global setting.
  consent            text not null default 'legitimate_interest'
                       check (consent in ('explicit', 'legitimate_interest')),
  consent_note       text,
  subscribed         boolean not null default true,
  unsubscribed_at    timestamptz,
  unsubscribe_token  uuid not null default gen_random_uuid() unique,
  tags               text[] not null default '{}',
  notes              text,
  created_at         timestamptz not null default now()
);

create index if not exists agency_contacts_created_idx on agency_contacts (created_at desc);
create index if not exists agency_contacts_tags_idx    on agency_contacts using gin (tags);

-- Outranks everything. A send checks this table last, after the segment has
-- already been built, so no query mistake upstream can put mail on the wire.
create table if not exists agency_suppressions (
  email      citext primary key,
  reason     text not null check (reason in ('unsubscribed', 'bounced', 'complained', 'manual')),
  created_at timestamptz not null default now()
);

create table if not exists agency_campaigns (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  subject        text not null,
  preheader      text,
  body_markdown  text not null default '',
  from_name      text not null,
  from_email     citext not null,
  reply_to       citext,
  status         text not null default 'draft'
                   check (status in ('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed')),
  segment        jsonb not null default '{}'::jsonb,
  scheduled_at   timestamptz,
  started_at     timestamptz,
  sent_at        timestamptz,
  created_at     timestamptz not null default now(),
  created_by     uuid references auth.users
);

create index if not exists agency_campaigns_created_idx on agency_campaigns (created_at desc);

create table if not exists agency_campaign_recipients (
  id                  uuid primary key default gen_random_uuid(),
  campaign_id         uuid not null references agency_campaigns on delete cascade,
  contact_id          uuid not null references agency_contacts on delete cascade,
  status              text not null default 'pending'
                        check (status in ('pending', 'sent', 'failed', 'skipped')),
  skip_reason         text,
  provider_message_id text,
  error               text,
  sent_at             timestamptz,
  opened_at           timestamptz,
  clicked_at          timestamptz,
  unique (campaign_id, contact_id)
);

create index if not exists agency_campaign_recipients_campaign_idx on agency_campaign_recipients (campaign_id, status);

/* ------------------------------------------------------------------ */
/* What was changed, and by whom                                       */
/* ------------------------------------------------------------------ */

create table if not exists agency_audit_log (
  id          bigserial primary key,
  actor_id    uuid references auth.users,
  actor_email citext,
  action      text not null,
  entity      text not null,
  entity_id   text,
  before      jsonb,
  after       jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists agency_audit_log_created_idx on agency_audit_log (created_at desc);

/* ------------------------------------------------------------------ */
/* Row-level security — default deny, admins only                      */
/* ------------------------------------------------------------------ */

alter table agency_admin_profiles      enable row level security;
alter table agency_content_overrides   enable row level security;
alter table agency_design_tokens       enable row level security;
alter table agency_settings            enable row level security;
alter table agency_analytics_events    enable row level security;
alter table agency_enquiries           enable row level security;
alter table agency_contacts            enable row level security;
alter table agency_suppressions        enable row level security;
alter table agency_campaigns           enable row level security;
alter table agency_campaign_recipients enable row level security;
alter table agency_audit_log           enable row level security;

-- An admin may read their own profile; only an owner may change the roster.
drop policy if exists admin_profiles_self on agency_admin_profiles;
create policy admin_profiles_self on agency_admin_profiles
  for select to authenticated using (id = auth.uid() or agency_is_admin());

drop policy if exists admin_profiles_owner on agency_admin_profiles;
create policy admin_profiles_owner on agency_admin_profiles
  for all to authenticated
  using (exists (select 1 from agency_admin_profiles p where p.id = auth.uid() and p.role = 'owner'))
  with check (exists (select 1 from agency_admin_profiles p where p.id = auth.uid() and p.role = 'owner'));

do $policies$
declare t text;
begin
  foreach t in array array[
    'agency_content_overrides', 'agency_design_tokens', 'agency_settings', 'agency_analytics_events',
    'agency_enquiries', 'agency_contacts', 'agency_suppressions', 'agency_campaigns',
    'agency_campaign_recipients', 'agency_audit_log'
  ] loop
    execute format('drop policy if exists admin_all on %I', t);
    execute format(
      'create policy admin_all on %I for all to authenticated using (agency_is_admin()) with check (agency_is_admin())',
      t
    );
  end loop;
end
$policies$;
