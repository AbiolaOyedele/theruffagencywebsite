# The admin panel

Everything on the site is editable at `/admin` — copy, colours, typefaces,
shape — alongside traffic, enquiries, an audience and campaign email.

The single most important thing to know: **the panel never edits the code.**
`src/content/site.ts` and `src/config/tokens.ts` remain the source of truth and
the fallback. The panel writes *overrides* to a database, and the site renders
the defaults with those overrides laid on top. So:

- with no database configured, the site renders exactly what is in the repo;
- if the database is unreachable, the site falls back rather than failing;
- any section can be put back to the committed version in one click;
- a deploy that changes `site.ts` still shows through everywhere untouched.

---

## Turning it on

### 1. Point it at the existing database

Ruff already has a Supabase project — `ajpzbntxooowpnwgkhcu` — shared with the
archived Vite site, which keeps its own `ruff_*` tables there. Reuse it rather
than provisioning a second: put its URL and keys in `.env.local`.

```
NEXT_PUBLIC_SUPABASE_URL=https://ajpzbntxooowpnwgkhcu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The anon key is in `TheRuff-Vite-Archive/.env.local`. The service role key is in
the Supabase dashboard under **Project Settings → API**; it must never reach the
browser, so keep it out of any `NEXT_PUBLIC_` name.

Add the salt that keeps the visitor digest from being reversible:

```bash
node -e "console.log('ANALYTICS_SALT=' + require('crypto').randomBytes(32).toString('hex'))" >> .env.local
```

Put the same four values in the Vercel project for production.

### 2. Run the migrations

In the Supabase SQL editor, in order:

1. `supabase/migrations/0001_admin.sql` — tables, row-level security
2. `supabase/migrations/0002_analytics_rollups.sql` — traffic aggregation
3. `supabase/migrations/0003_sendable_contacts.sql` — who may be emailed

They only ever create; nothing drops or alters an existing table.

### 3. Make yourself an admin

The project's accounts are shared, so you may already have one. If not, create
it in **Authentication → Users → Add user** (set a password, tick *Auto
Confirm*). Then:

```sql
insert into agency_admin_profiles (id, email, name, role)
select id, email, 'Your name', 'owner'
from auth.users
where email = 'you@theruff.agency';
```

Signing in needs both: an account *and* a row here. That is what stops a user
who belongs to another Ruff app reaching this one.

Go to `/admin`.

---

## Sharing the database

Everything this project creates is prefixed `agency_` — tables, indexes,
functions and the one view. The names live in `src/lib/supabase/tables.ts`, and
no query anywhere writes a table name as a literal, so the prefix is a single
edit and a query cannot reach another project's data by accident.

| This project | Already there |
|---|---|
| `agency_admin_profiles` | `ruff_client_logos` |
| `agency_content_overrides` | `ruff_projects` |
| `agency_design_tokens` | `ruff_scoops` |
| `agency_settings` | `ruff_settings` |
| `agency_analytics_events` | `ruff_testimonials` |
| `agency_enquiries` | |
| `agency_contacts` | |
| `agency_suppressions` | |
| `agency_campaigns` | |
| `agency_campaign_recipients` | |
| `agency_audit_log` | |
| `agency_sendable_contacts` (view) | |

Note `agency_settings` against the existing `ruff_settings` — unprefixed, those
would have been the same table.

---

## How it is arranged

| Section | What it holds |
|---|---|
| **Overview** | Traffic at a glance, unread enquiries, what has been changed away from the repo |
| **Content** | Every word on the site, grouped the way a person thinks about it |
| **Design** | Colours, typefaces, weights, shape — with live preview and contrast checks |
| **Traffic** | First-party analytics: views, visitors, pages, referrers, campaigns, countries, devices |
| **Enquiries** | Briefs and applications, with the full submission |
| **Audience** | Contacts, consent basis, import, and the suppression list |
| **Campaigns** | Write, preview, segment, send |
| **Account** | Who can sign in, and which integrations are wired |
| **Activity** | Every change, and who made it |

### Content

Editors are generated from the shape of the content itself rather than
hand-built per section, so a new field in `site.ts` appears in the panel on the
next deploy with no work. Lists can be reordered, added to and removed from.

Two things the panel cannot do, by design: it cannot add a *new* case study or
post that the code has never seen and have it deep-link before a rebuild (the
static pages come from `generateStaticParams`), and it does not upload images —
image fields take a Cloudinary public id or a `public/` path.

### Design

Every token is written into the page as a CSS custom property, with the repo's
value as the fallback. Two places in the codebase need a real value rather than
a `var()` — the Lottie scroll prompt, which parses a hex, and the step
indicator, which used to append an alpha suffix — and both were adapted rather
than left to break.

The contrast panel measures the pairings the site actually uses. It confirms
the one already recorded in the copy deck: white on `#e92038` is **4.44:1**,
just under the 4.5:1 AA asks for on body text. `#DC1B32` clears it.

### Traffic

First-party. The site posts a view to `/api/v1/track`; the server stores the
path, referrer host, UTM tags, country, device and browser, plus a **salted
daily digest** of the address — never the address. Nothing is written to the
visitor's device, which is why it needs no consent banner and why the cookie
notice still only covers what it covered before.

### Campaigns

Recipients come from `sendable_contacts`, a database view that already excludes
anyone unsubscribed or suppressed — there is no query in the application that
could include them by mistake. Every message carries an unsubscribe link, a
`List-Unsubscribe` header for one-click removal in Gmail and Outlook, and the
studio's name and location. None of that is optional in the template.

A send does up to **500 messages per run**, five at a time. Larger lists finish
across repeated runs; the panel says how many are left, and nobody is sent the
same campaign twice.

Consent basis is required on every contact, and an import must additionally say
where the list came from. That is the thing that has to be answerable later.

---

## Security

- Row-level security on every table, default-deny. The anon key reads nothing.
- Middleware is a coarse gate; `requireAdmin()` runs on every page and action;
  RLS is the last word beneath both.
- The service-role key is used in exactly two places — writing analytics for
  visitors with no session, and the campaign sender — and never leaves the server.
- All content and token writes are validated, size-capped, and audited.
- `/admin` is `noindex`, and the tracking endpoint is same-origin only and rate
  limited.
