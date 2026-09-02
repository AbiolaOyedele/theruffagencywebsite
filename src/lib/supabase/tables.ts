/**
 * Every database object this project owns, in one place.
 *
 * The Supabase project is **shared** with other Ruff work — the archived Vite
 * site already keeps `ruff_projects`, `ruff_settings`, `ruff_testimonials` and
 * others in the same `public` schema. So nothing here may take a bare, generic
 * name: a table called `settings` or `contacts`, or a function called
 * `is_admin`, would sooner or later collide with another project's.
 *
 * Everything this site creates is therefore prefixed `agency_`, and nothing
 * outside this file writes a table name as a literal. That way the prefix is
 * one edit, and a query cannot quietly reach a table belonging to something
 * else.
 *
 * `auth.users` is genuinely shared and is not ours to prefix — which is why
 * being a user is not enough to reach anything here. `agency_admin_profiles`
 * is the allowlist, and every policy is written in terms of it.
 */

export const TABLES = {
  adminProfiles: 'agency_admin_profiles',
  contentOverrides: 'agency_content_overrides',
  designTokens: 'agency_design_tokens',
  settings: 'agency_settings',
  analyticsEvents: 'agency_analytics_events',
  enquiries: 'agency_enquiries',
  contacts: 'agency_contacts',
  suppressions: 'agency_suppressions',
  campaigns: 'agency_campaigns',
  campaignRecipients: 'agency_campaign_recipients',
  auditLog: 'agency_audit_log',
  /** A view over `contacts`, excluding anyone unsubscribed or suppressed. */
  sendableContacts: 'agency_sendable_contacts',
} as const;

export const FUNCTIONS = {
  isAdmin: 'agency_is_admin',
  analyticsSummary: 'agency_analytics_summary',
  analyticsByDay: 'agency_analytics_by_day',
  analyticsTop: 'agency_analytics_top',
} as const;
