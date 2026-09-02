import { RuffLogo } from '@/components/ui/RuffLogo';
import { Notice } from '@/components/features/admin/ui';
import { SignOutButton } from '@/components/features/admin/SignOutButton';

/**
 * A valid account that is not on this site's roster.
 *
 * The accounts pool is shared across Ruff's projects, so this is a normal
 * thing to arrive at rather than an error: signing in works, and reaching
 * anything here is a separate question. It is also what a failed read of the
 * roster looks like from outside, so the copy covers both without guessing.
 */
export function NotAnAdmin({ email }: { readonly email: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <RuffLogo style={{ height: 28, width: 'auto', display: 'block', marginBottom: 28 }} />
      <h1 className="text-2xl font-bold tracking-tight">Not an admin here</h1>
      <p className="mt-1 mb-5 text-sm leading-relaxed text-[#6b5a55]">
        You are signed in as <strong>{email}</strong>, but that account is not on this site&rsquo;s
        roster. The Supabase project is shared with other Ruff work, so an account can be perfectly
        valid and still have no access to this panel.
      </p>

      <Notice>
        To grant access, insert a row into <code>agency_admin_profiles</code> for this account. If
        you believe there already is one, check the server log — a policy that cannot be read looks
        the same from here.
      </Notice>

      <div className="mt-5">
        <SignOutButton />
      </div>
    </main>
  );
}
