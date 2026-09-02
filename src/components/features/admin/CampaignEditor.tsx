'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Card, Notice } from '@/components/features/admin/ui';
import {
  deleteCampaignAction,
  saveCampaignAction,
  sendCampaignAction,
} from '@/app/admin/actions';
import { renderBody } from '@/lib/email/campaign';
import type { CampaignRow } from '@/lib/supabase/types';

const field =
  'w-full rounded-xl border-2 border-[#250200] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e92038]';
const label = 'mb-1 block text-xs font-bold uppercase tracking-wide text-[#6b5a55]';

/**
 * Writing and sending one campaign.
 *
 * Sending is behind a typed confirmation, because it is the one action in this
 * whole panel that cannot be undone: content and design changes can be reverted
 * in a click, but an email that has gone has gone.
 */
export function CampaignEditor({
  campaign,
  reachable,
  defaultFromName,
  defaultFromEmail,
}: {
  readonly campaign: CampaignRow | null;
  readonly reachable: number;
  readonly defaultFromName: string;
  readonly defaultFromEmail: string;
}) {
  const router = useRouter();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState(campaign?.body_markdown ?? '');
  const [confirm, setConfirm] = useState('');

  const sent = campaign?.status === 'sent';

  function onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const outcome = await saveCampaignAction(campaign?.id ?? null, form);
      setResult(outcome);
      if (outcome.ok && !campaign) router.push('/admin/marketing/campaigns');
      else router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {result ? <Notice tone={result.ok ? 'info' : 'error'}>{result.message}</Notice> : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <Card title="The email">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Campaign name — internal</span>
              <input name="name" required defaultValue={campaign?.name ?? ''} className={field} />
            </label>
            <label className="block">
              <span className={label}>Subject</span>
              <input name="subject" required defaultValue={campaign?.subject ?? ''} className={field} />
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Preheader — the grey line after the subject</span>
              <input name="preheader" defaultValue={campaign?.preheader ?? ''} className={field} />
            </label>
            <label className="block">
              <span className={label}>From name</span>
              <input name="fromName" required defaultValue={campaign?.from_name ?? defaultFromName} className={field} />
            </label>
            <label className="block">
              <span className={label}>From address</span>
              <input name="fromEmail" type="email" required defaultValue={campaign?.from_email ?? defaultFromEmail} className={field} />
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Reply-to — optional</span>
              <input name="replyTo" type="email" defaultValue={campaign?.reply_to ?? ''} className={field} />
            </label>
            <label className="block sm:col-span-2">
              <span className={label}>Body</span>
              <textarea
                name="bodyMarkdown"
                required
                rows={14}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`${field} font-mono text-xs leading-relaxed`}
                placeholder={'Hi {{name}},\n\nA short paragraph.\n\n**Bold**, *italic*, and [a link](https://theruff.agency).'}
              />
              <span className="mt-1 block text-[11px] text-[#6b5a55]">
                Headings, bold, italic and links. <code>{'{{name}}'}</code> and{' '}
                <code>{'{{email}}'}</code> are filled in per recipient.
              </span>
            </label>
          </div>
        </Card>

        <Card title="Who gets it" description="Leave both blank to reach everyone still subscribed.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Tags, comma separated</span>
              <input name="segmentTags" defaultValue={campaign?.segment.tags?.join(', ') ?? ''} className={field} />
            </label>
            <label className="block">
              <span className={label}>Consent basis</span>
              <select name="segmentConsent" defaultValue={campaign?.segment.consent ?? ''} className={field}>
                <option value="">Anyone reachable</option>
                <option value="explicit">Only people who asked to hear from us</option>
                <option value="legitimate_interest">Only business contacts</option>
              </select>
            </label>
          </div>
        </Card>

        <button
          type="submit"
          disabled={pending || sent}
          className="min-h-11 rounded-full border-2 border-[#250200] bg-[#e92038] px-5 text-sm font-bold text-white shadow-[4px_4px_0_#250200] disabled:opacity-50"
        >
          {pending ? 'Saving…' : campaign ? 'Save changes' : 'Create draft'}
        </button>
      </form>

      {body ? (
        <Card title="Preview" description="As the recipient sees it, before the footer is added.">
          <div
            className="prose-sm max-w-none rounded-xl border border-black/10 bg-white p-4"
            // Rendered by the same function the sender uses, which escapes the
            // body before applying any markup.
            dangerouslySetInnerHTML={{
              __html: renderBody(body, { name: 'Ada', email: 'ada@example.com' }),
            }}
          />
        </Card>
      ) : null}

      {campaign ? (
        <Card title="Send" description="Every message carries an unsubscribe link and the studio's address.">
          {sent ? (
            <Notice>This campaign has been sent. Create a new one rather than resending.</Notice>
          ) : (
            <div className="space-y-3">
              <Notice tone="warn">
                This will email <strong>{reachable}</strong>{' '}
                {reachable === 1 ? 'person' : 'people'}. It cannot be undone. Anyone unsubscribed
                or suppressed is excluded automatically, and nobody is sent the same campaign
                twice.
              </Notice>

              <label className="block max-w-xs">
                <span className={label}>Type SEND to confirm</span>
                <input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={field}
                  autoComplete="off"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pending || confirm !== 'SEND' || reachable === 0}
                  onClick={() =>
                    startTransition(async () => {
                      setResult(await sendCampaignAction(campaign.id));
                      setConfirm('');
                      router.refresh();
                    })
                  }
                  className="min-h-11 rounded-full border-2 border-[#250200] bg-[#e92038] px-5 text-sm font-bold text-white shadow-[4px_4px_0_#250200] disabled:opacity-40 disabled:shadow-none"
                >
                  {pending ? 'Sending…' : 'Send now'}
                </button>

                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const outcome = await deleteCampaignAction(campaign.id);
                      if (outcome.ok) router.push('/admin/marketing/campaigns');
                      else setResult(outcome);
                    })
                  }
                  className="min-h-11 rounded-full border-2 border-black/20 px-4 text-sm font-bold text-[#c81a2f] disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
