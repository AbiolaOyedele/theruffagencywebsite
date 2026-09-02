'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Reports a page view.
 *
 * Sets nothing on the visitor's device — no cookie, no identifier in storage —
 * so it needs no consent to run, and the server keeps only a salted daily
 * digest that cannot be traced back. See `services/admin/analytics`.
 *
 * The panels on this site are hashes rather than routes, so the hash is part
 * of what is reported: otherwise every enquiry, every story and the whole
 * archive would be recorded as another view of the home page.
 */
export function TrafficBeacon() {
  const pathname = usePathname();
  const search = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    const report = (): void => {
      const path = `${pathname}${window.location.hash}`;
      if (lastSent.current === path) return;
      lastSent.current = path;

      const body = JSON.stringify({
        path,
        referrer: document.referrer || null,
        utmSource: search.get('utm_source'),
        utmMedium: search.get('utm_medium'),
        utmCampaign: search.get('utm_campaign'),
      });

      // keepalive so a view still lands when the click that caused it is also
      // navigating away.
      void fetch('/api/v1/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // Analytics must never surface to a visitor.
      });
    };

    report();
    window.addEventListener('hashchange', report);
    return () => window.removeEventListener('hashchange', report);
  }, [pathname, search]);

  return null;
}
