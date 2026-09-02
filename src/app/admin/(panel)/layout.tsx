import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/features/admin/AdminSidebar';
import { Notice } from '@/components/features/admin/ui';
import { adminState } from '@/services/admin/auth';
import { NotAnAdmin } from '@/components/features/admin/NotAnAdmin';
import { configured } from '@/config/env';

/**
 * Everything behind the sign-in.
 *
 * Middleware has already turned away anyone without a session, but that check
 * is only that a session exists. This is where being an *admin* is decided,
 * and it runs on every page in the group — with row-level security beneath it
 * as the last word, so a missed check here still reads nothing.
 */
/**
 * Nothing in the panel is static: every page reads who is asking. Without
 * this, a build with no database reachable prerenders them as though nobody
 * were signed in, which is not a page anyone should ever be served.
 */
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { readonly children: ReactNode }) {
  const state = await adminState();

  // Only a genuine absence of session goes back to sign-in. An account that is
  // simply not on the roster is told so — sending it to a sign-in page that the
  // proxy immediately redirects back is the loop this used to be.
  if (state.kind === 'anonymous') redirect('/admin/login');
  if (state.kind === 'not-admin') return <NotAnAdmin email={state.email} />;

  const session = state.session;

  return (
    <div className="lg:flex">
      <AdminSidebar email={session.profile.email} role={session.profile.role} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Signing in only needs the anon key, so the panel opens perfectly
              well without the service role one — and then fails at the first
              save. Say so up front rather than at the moment it breaks. */}
          {!configured.serviceRole() ? (
            <div className="mb-6">
              <Notice tone="warn">
                <strong>The service role key is not set.</strong> You can look around, but saving
                content or design, recording traffic and sending campaigns will all fail. Copy it
                from Supabase under Project Settings → API into{' '}
                <code>SUPABASE_SERVICE_ROLE_KEY</code>.
              </Notice>
            </div>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}
