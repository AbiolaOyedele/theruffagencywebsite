import Link from 'next/link';
import { Card, Notice, PageHeader } from '@/components/features/admin/ui';

/**
 * Shown when there is no database configured.
 *
 * Reached by a rewrite from middleware rather than a redirect, so the URL the
 * person typed is still the URL they see. The public site is unaffected by
 * any of this — it renders its own typed defaults — so this is a notice, not
 * an error.
 */
export default function SetupPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader
        title="The panel is not connected yet"
        description="Everything is built and wired. It needs a database before it can hold anything."
      />

      <div className="space-y-5">
        <Notice tone="warn">
          The public site is unaffected and is serving the content and design in the repository.
          Nothing below changes what visitors see until you start editing.
        </Notice>

        <Card title="What is needed" description="Three steps, in this order.">
          <ol className="list-decimal space-y-4 pl-5 text-sm leading-relaxed">
            <li>
              <strong>Point it at the existing database.</strong> Ruff already has a Supabase
              project, shared with the archived Vite site. Put its URL, anon key and service role
              key in <code className="rounded bg-black/5 px-1 text-xs">.env.local</code>, plus an{' '}
              <code className="rounded bg-black/5 px-1 text-xs">ANALYTICS_SALT</code> — any long
              random string.
            </li>
            <li>
              <strong>Run the migrations</strong> in{' '}
              <code className="rounded bg-black/5 px-1 text-xs">supabase/migrations</code>, in
              order. Every object they create is prefixed{' '}
              <code className="rounded bg-black/5 px-1 text-xs">agency_</code> so nothing collides
              with the <code className="rounded bg-black/5 px-1 text-xs">ruff_</code> tables
              already in that project. Nothing is dropped or altered.
            </li>
            <li>
              <strong>Add yourself to</strong>{' '}
              <code className="rounded bg-black/5 px-1 text-xs">agency_admin_profiles</code>. An
              account in the shared project is not enough on its own — a row there is what makes
              someone an admin here. The SQL is in{' '}
              <code className="rounded bg-black/5 px-1 text-xs">docs/admin-panel.md</code>.
            </li>
          </ol>
        </Card>

        <p className="text-sm text-[#6b5a55]">
          <Link href="/" className="underline">
            Back to the site
          </Link>
        </p>
      </div>
    </main>
  );
}
