'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await supabaseBrowser().auth.signOut();
          router.replace('/admin/login');
          router.refresh();
        })
      }
      className="min-h-11 rounded-full border-2 border-[#250200] px-5 text-sm font-bold disabled:opacity-60"
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
