-- Who may lawfully be sent a campaign.
--
-- Deliberately a view rather than a filter in application code. The sender
-- reads from here and has no query that reaches `agency_contacts` directly, so an
-- unsubscribe or a bounce cannot be undone by a mistake in a WHERE clause
-- upstream. security_invoker keeps row-level security applying as the caller.

create or replace view agency_sendable_contacts
  with (security_invoker = true)
as
  select c.*
  from agency_contacts c
  where c.subscribed
    and not exists (select 1 from agency_suppressions s where s.email = c.email);
