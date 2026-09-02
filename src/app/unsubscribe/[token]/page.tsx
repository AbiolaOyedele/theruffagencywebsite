import type { Metadata } from 'next';
import { StandalonePage } from '@/components/features/overlays/StandalonePage';
import { getContent } from '@/lib/content/resolve';
import { hasSupabase } from '@/config/env';
import { unsubscribeByToken } from '@/repositories/contacts';

/**
 * One-click unsubscribe.
 *
 * A GET, deliberately: mail clients and their link scanners follow links, and
 * a person who has decided to leave should not have to find a button. The
 * token is single-purpose and identifies only the contact row.
 */

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UnsubscribePage({ params }: PageProps<'/unsubscribe/[token]'>) {
  const { token } = await params;
  const { brand } = await getContent();

  let outcome: 'done' | 'unknown' = 'unknown';
  if (hasSupabase()) {
    try {
      const email = await unsubscribeByToken(token);
      if (email) outcome = 'done';
    } catch (error) {
      console.error('Unsubscribe failed:', error);
    }
  }

  return (
    <StandalonePage
      eyebrow="Email"
      title={outcome === 'done' ? 'You are unsubscribed' : 'That link has expired'}
    >
      <p style={{ maxWidth: 560, lineHeight: 1.6 }}>
        {outcome === 'done'
          ? `You will not get any more email from ${brand.name}. If this was a mistake, or you would like to hear from us again later, write to ${brand.email}.`
          : `We could not find that subscription — it may already have been removed. If you are still getting email from us, write to ${brand.email} and we will stop it by hand.`}
      </p>
    </StandalonePage>
  );
}
