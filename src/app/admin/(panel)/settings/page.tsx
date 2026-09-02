import { Badge, Card, Empty, Notice, PageHeader } from '@/components/features/admin/ui';
import { requireAdmin } from '@/services/admin/auth';
import { configured } from '@/config/env';
import type { AdminProfile } from '@/lib/supabase/types';
import { TABLES } from '@/lib/supabase/tables';

/**
 * Account, roster and integrations.
 *
 * Adding an admin is deliberately not a button here. It is two steps in
 * Supabase — create the user, insert the profile row — and a panel that could
 * mint its own admins would be the softest target on the site.
 */
export default async function SettingsPage() {
  const { client, profile } = await requireAdmin();

  const { data } = await client
    .from(TABLES.adminProfiles)
    .select('*')
    .order('created_at', { ascending: true });
  const team = (data ?? []) as AdminProfile[];

  const integrations = [
    { name: 'Database and sign-in', detail: 'Supabase', ok: true },
    { name: 'Service role key', detail: 'Analytics writes and campaign sending', ok: configured.serviceRole() },
    { name: 'Email', detail: 'Resend — enquiry notifications and campaigns', ok: configured.mail() },
    { name: 'Analytics salt', detail: 'Rotates the visitor digest', ok: configured.analyticsSalt() },
    { name: 'Image hosting', detail: 'Cloudinary — optional', ok: configured.cloudinary() },
  ];

  return (
    <>
      <PageHeader title="Account" description="Who can sign in, and what this deployment is wired to." />

      <div className="space-y-6">
        <Card title="You">
          <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,8rem)_1fr]">
            <dt className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">Email</dt>
            <dd className="mb-2 text-sm sm:mb-0">{profile.email}</dd>
            <dt className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">Role</dt>
            <dd className="text-sm">{profile.role}</dd>
          </dl>
        </Card>

        <Card
          title="Who can sign in"
          description="An account alone is not enough — a row here is what makes someone an admin."
        >
          {team.length === 0 ? (
            <Empty>Nobody listed.</Empty>
          ) : (
            <ul className="divide-y divide-black/10">
              {team.map((member) => (
                <li key={member.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate text-sm">{member.email}</span>
                  <Badge>{member.role}</Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Notice>
              To add someone: create the user in Supabase Auth, then insert a row into{' '}
              <code>admin_profiles</code> with their id. The steps are in{' '}
              <code>docs/admin-panel.md</code>.
            </Notice>
          </div>
        </Card>

        <Card title="Integrations" description="Presence only — no key is ever shown here.">
          <ul className="divide-y divide-black/10">
            {integrations.map((row) => (
              <li key={row.name} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{row.name}</span>
                  <span className="block text-xs text-[#6b5a55]">{row.detail}</span>
                </span>
                <span
                  className={`shrink-0 text-xs font-bold ${row.ok ? 'text-[#2dc05e]' : 'text-[#c81a2f]'}`}
                >
                  {row.ok ? 'Connected' : 'Not set'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
