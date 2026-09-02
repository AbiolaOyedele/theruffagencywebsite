import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * The panel is a tool, not a page of the site: it opts out of search entirely
 * and sets its own plain ground. Authentication is not here — the login and
 * setup screens live under `/admin` too — but in the `(panel)` group beneath.
 */
export const metadata: Metadata = {
  title: 'Studio',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { readonly children: ReactNode }) {
  return <div className="min-h-screen bg-[#f6f1ee] text-[#250200] antialiased">{children}</div>;
}
