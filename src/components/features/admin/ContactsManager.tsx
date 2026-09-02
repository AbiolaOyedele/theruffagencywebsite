'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Badge, Card, Empty, Notice } from '@/components/features/admin/ui';
import {
  deleteContactAction,
  importContactsAction,
  saveContactAction,
  suppressAction,
} from '@/app/admin/actions';
import type { ContactRow, SuppressionRow } from '@/lib/supabase/types';

const field =
  'w-full rounded-xl border-2 border-[#250200] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e92038]';
const label = 'mb-1 block text-xs font-bold uppercase tracking-wide text-[#6b5a55]';

/**
 * The audience.
 *
 * The consent basis is a required field on every route into this table, not a
 * checkbox someone can skip: it is the thing that has to be answerable if a
 * recipient — or a regulator — ever asks why they were written to. An import
 * additionally has to say where the list came from.
 */
export function ContactsManager({
  contacts,
  total,
  suppressed,
  search,
}: {
  readonly contacts: readonly ContactRow[];
  readonly total: number;
  readonly suppressed: readonly SuppressionRow[];
  readonly search: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'list' | 'add' | 'import' | 'suppressed'>('list');
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(search);

  const suppressedSet = new Set(suppressed.map((row) => row.email));

  function submit(action: (form: FormData) => Promise<{ ok: boolean; message: string }>) {
    return (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const element = event.currentTarget;
      startTransition(async () => {
        const outcome = await action(form);
        setResult(outcome);
        if (outcome.ok) {
          element.reset();
          router.refresh();
        }
      });
    };
  }

  return (
    <div className="space-y-5">
      {result ? <Notice tone={result.ok ? 'info' : 'error'}>{result.message}</Notice> : null}

      <div className="flex flex-wrap gap-1.5">
        {([
          ['list', `Contacts (${total})`],
          ['add', 'Add one'],
          ['import', 'Import'],
          ['suppressed', `Suppressed (${suppressed.length})`],
        ] as const).map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`min-h-11 rounded-full border-2 px-3.5 text-xs font-bold ${
              tab === id ? 'border-[#250200] bg-[#250200] text-white' : 'border-black/20'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {tab === 'list' ? (
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/admin/marketing/contacts?q=${encodeURIComponent(query)}`);
            }}
            className="mb-4 flex gap-2"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or company"
              className={field}
            />
            <button type="submit" className="min-h-11 shrink-0 rounded-full border-2 border-[#250200] px-4 text-sm font-bold">
              Search
            </button>
          </form>

          {contacts.length === 0 ? (
            <Empty>No contacts{search ? ' matching that search' : ' yet'}.</Empty>
          ) : (
            <ul className="divide-y divide-black/10">
              {contacts.map((contact) => (
                <li key={contact.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
                      {contact.name ?? contact.email}
                      {!contact.subscribed || suppressedSet.has(contact.email) ? (
                        <Badge>Will not be sent</Badge>
                      ) : null}
                      {contact.consent === 'explicit' ? <Badge>Opted in</Badge> : null}
                    </p>
                    <p className="text-xs text-[#6b5a55]">
                      {contact.email}
                      {contact.company ? ` · ${contact.company}` : ''} · from{' '}
                      {contact.source.replace('_', ' ')}
                      {contact.tags.length > 0 ? ` · ${contact.tags.join(', ')}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      disabled={pending || suppressedSet.has(contact.email)}
                      onClick={() =>
                        startTransition(async () => {
                          setResult(await suppressAction(contact.email));
                          router.refresh();
                        })
                      }
                      className="min-h-11 rounded-full border-2 border-black/20 px-3 text-xs font-bold disabled:opacity-40"
                    >
                      Suppress
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          setResult(await deleteContactAction(contact.id));
                          router.refresh();
                        })
                      }
                      className="min-h-11 rounded-full border-2 border-black/20 px-3 text-xs font-bold text-[#c81a2f] disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      {tab === 'add' ? (
        <Card title="Add a contact">
          <form onSubmit={submit((form) => saveContactAction(null, form))} className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className={label}>Email</span><input name="email" type="email" required className={field} /></label>
            <label className="block"><span className={label}>Name</span><input name="name" className={field} /></label>
            <label className="block"><span className={label}>Company</span><input name="company" className={field} /></label>
            <label className="block"><span className={label}>Role</span><input name="roleTitle" className={field} /></label>
            <label className="block">
              <span className={label}>Why we may write to them</span>
              <select name="consent" required className={field} defaultValue="legitimate_interest">
                <option value="explicit">They asked to hear from us</option>
                <option value="legitimate_interest">Existing or prospective business contact</option>
              </select>
            </label>
            <label className="block"><span className={label}>Tags, comma separated</span><input name="tags" className={field} /></label>
            <label className="block sm:col-span-2"><span className={label}>Note on that basis</span><input name="consentNote" className={field} placeholder="Met at a conference, asked us to follow up" /></label>
            <label className="block sm:col-span-2"><span className={label}>Notes</span><textarea name="notes" rows={3} className={field} /></label>
            <div className="sm:col-span-2">
              <button type="submit" disabled={pending} className="min-h-11 rounded-full border-2 border-[#250200] bg-[#e92038] px-5 text-sm font-bold text-white shadow-[4px_4px_0_#250200] disabled:opacity-60">
                {pending ? 'Saving…' : 'Add contact'}
              </button>
            </div>
          </form>
        </Card>
      ) : null}

      {tab === 'import' ? (
        <Card
          title="Import a list"
          description="One per line: email, or email, name, company. Existing contacts are left as they are — an import cannot resubscribe someone who opted out."
        >
          <form onSubmit={submit(importContactsAction)} className="space-y-4">
            <label className="block">
              <span className={label}>Rows</span>
              <textarea name="rows" rows={8} required className={`${field} font-mono text-xs`} placeholder={'ada@example.com, Ada Lovelace, Analytical Engines\ngrace@example.com'} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Why we may write to them</span>
                <select name="consent" required className={field} defaultValue="legitimate_interest">
                  <option value="explicit">They asked to hear from us</option>
                  <option value="legitimate_interest">Existing or prospective business contact</option>
                </select>
              </label>
              <label className="block"><span className={label}>Tags, comma separated</span><input name="tags" className={field} /></label>
            </div>
            <label className="block">
              <span className={label}>Where this list came from — required</span>
              <input name="consentNote" required className={field} placeholder="Exported from the 2026 conference attendee list we sponsored" />
            </label>
            <Notice tone="warn">
              Only import people you have a defensible reason to email. Every message carries an
              unsubscribe link and the studio&rsquo;s address, and anyone who leaves is suppressed
              permanently.
            </Notice>
            <button type="submit" disabled={pending} className="min-h-11 rounded-full border-2 border-[#250200] bg-[#e92038] px-5 text-sm font-bold text-white shadow-[4px_4px_0_#250200] disabled:opacity-60">
              {pending ? 'Importing…' : 'Import'}
            </button>
          </form>
        </Card>
      ) : null}

      {tab === 'suppressed' ? (
        <Card title="Suppressed" description="Never written to again, whatever a segment says.">
          {suppressed.length === 0 ? (
            <Empty>Nobody is suppressed.</Empty>
          ) : (
            <ul className="divide-y divide-black/10">
              {suppressed.map((row) => (
                <li key={row.email} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 truncate text-sm">{row.email}</span>
                  <Badge>{row.reason}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}
    </div>
  );
}
