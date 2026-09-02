'use client';

import { useState, useTransition } from 'react';
import { Badge, Empty } from '@/components/features/admin/ui';
import { setEnquiryStatusAction } from '@/app/admin/actions';
import type { EnquiryRow } from '@/lib/supabase/types';

/**
 * Enquiries, newest first, with the whole submission behind a disclosure.
 *
 * The payload is rendered as label-and-value pairs rather than raw JSON: it is
 * the answers someone typed into a form, and the studio should be able to read
 * it without parsing braces.
 */
export function EnquiryList({ enquiries }: { readonly enquiries: readonly EnquiryRow[] }) {
  const [filter, setFilter] = useState<'all' | 'contact' | 'talent'>('all');
  const shown = enquiries.filter((e) => filter === 'all' || e.kind === filter);

  if (enquiries.length === 0) {
    return <Empty>No enquiries yet. They appear here as soon as someone uses a form.</Empty>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {(['all', 'contact', 'talent'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`min-h-11 rounded-full border-2 px-3.5 text-xs font-bold ${
              filter === option ? 'border-[#250200] bg-[#250200] text-white' : 'border-black/20'
            }`}
          >
            {option === 'all' ? 'Everything' : option === 'contact' ? 'Briefs' : 'Applications'}
            <span className="ml-1.5 font-medium opacity-70">
              {option === 'all'
                ? enquiries.length
                : enquiries.filter((e) => e.kind === option).length}
            </span>
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {shown.map((enquiry) => (
          <EnquiryCard key={enquiry.id} enquiry={enquiry} />
        ))}
      </ul>
    </div>
  );
}

function EnquiryCard({ enquiry }: { readonly enquiry: EnquiryRow }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(enquiry.status);
  const [pending, startTransition] = useTransition();

  function mark(next: 'read' | 'archived'): void {
    startTransition(async () => {
      const outcome = await setEnquiryStatusAction(enquiry.id, next);
      if (outcome.ok) setStatus(next);
    });
  }

  const when = new Date(enquiry.created_at).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <li
      className={`rounded-2xl border-2 bg-white ${
        status === 'new' ? 'border-[#250200]' : 'border-black/15'
      } ${status === 'archived' ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
            {enquiry.name ?? 'Someone'}
            {status === 'new' ? <Badge>New</Badge> : null}
            <Badge>{enquiry.kind === 'contact' ? 'Brief' : 'Application'}</Badge>
          </p>
          <p className="mt-0.5 text-xs text-[#6b5a55]">
            {enquiry.email ? (
              <a href={`mailto:${enquiry.email}`} className="underline">
                {enquiry.email}
              </a>
            ) : (
              'No address given'
            )}
            {enquiry.company ? ` · ${enquiry.company}` : ''} · {when}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setOpen((was) => !was)}
            aria-expanded={open}
            className="min-h-11 rounded-full border-2 border-black/20 px-3.5 text-xs font-bold"
          >
            {open ? 'Hide' : 'Read'}
          </button>
          {status !== 'archived' ? (
            <button
              type="button"
              onClick={() => mark(status === 'new' ? 'read' : 'archived')}
              disabled={pending}
              className="min-h-11 rounded-full border-2 border-black/20 px-3.5 text-xs font-bold disabled:opacity-50"
            >
              {status === 'new' ? 'Mark read' : 'Archive'}
            </button>
          ) : null}
        </div>
      </div>

      {open ? (
        <dl className="grid gap-x-4 gap-y-2 border-t border-black/10 p-4 sm:grid-cols-[minmax(0,10rem)_1fr]">
          {Object.entries(enquiry.payload).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-xs font-bold uppercase tracking-wide text-[#6b5a55]">
                {key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())}
              </dt>
              <dd className="mb-2 whitespace-pre-wrap text-sm sm:mb-0">
                {typeof value === 'string' || typeof value === 'number'
                  ? String(value)
                  : JSON.stringify(value)}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </li>
  );
}
