'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV } from '@/components/features/admin/nav';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

/**
 * The panel's navigation.
 *
 * A column on a laptop, a collapsible bar on a phone — the studio should be
 * able to read an enquiry or check traffic from a phone, which is most of what
 * this gets used for away from a desk. Editing long content on a phone is
 * possible but not what the layout optimises for.
 */
export function AdminSidebar({
  email,
  role,
}: {
  readonly email: string;
  readonly role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut(): Promise<void> {
    await supabaseBrowser().auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <aside className="border-b-2 border-[#250200] bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r-2">
      <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block">
        <Link href="/admin" className="block">
          <span className="text-sm font-black uppercase tracking-widest">Studio</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((was) => !was)}
          aria-expanded={open}
          aria-controls="admin-nav"
          className="min-h-11 min-w-11 rounded-xl border-2 border-[#250200] px-3 text-sm font-bold lg:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <nav
        id="admin-nav"
        className={`${open ? 'block' : 'hidden'} px-3 pb-5 lg:block`}
        aria-label="Panel sections"
      >
        {NAV.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-widest text-[#6b5a55]">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                // `/admin` would otherwise mark itself active on every page.
                const active =
                  item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition ${
                        active
                          ? 'bg-[#250200] text-white'
                          : 'text-[#250200] hover:bg-[#f6f1ee]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mt-6 border-t border-black/10 px-2 pt-4">
          <p className="truncate text-xs text-[#6b5a55]" title={email}>
            {email}
          </p>
          <p className="mb-2 text-[11px] uppercase tracking-widest text-[#6b5a55]">{role}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-xs font-bold underline"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-11 items-center text-xs font-bold underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
