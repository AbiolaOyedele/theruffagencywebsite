-- Fixes a lock-out.
--
-- The owner policy on `agency_admin_profiles` had a USING clause that selected
-- from `agency_admin_profiles`. Postgres evaluates every permissive policy on a
-- table, so that one recursed and raised
--
--   infinite recursion detected in policy for relation "agency_admin_profiles"
--
-- on *any* read — including an admin reading their own row. The panel treats a
-- failed read as "not an admin", so a correctly-configured owner was bounced to
-- the sign-in page, which bounced them back, until the browser gave up.
--
-- The fix is the one already used by `agency_is_admin`: a security-definer
-- function, which is not subject to the policies of the table it reads.
--
-- Safe to run on a database where 0001 has already been applied.

create or replace function agency_is_owner() returns boolean
  language sql stable security definer set search_path = public
as $fn$
  select exists (
    select 1 from agency_admin_profiles
    where id = auth.uid() and role = 'owner'
  )
$fn$;

drop policy if exists admin_profiles_owner on agency_admin_profiles;
create policy admin_profiles_owner on agency_admin_profiles
  for all to authenticated
  using (agency_is_owner())
  with check (agency_is_owner());
