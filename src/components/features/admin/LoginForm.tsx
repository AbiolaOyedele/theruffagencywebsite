'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

/**
 * Sign-in.
 *
 * The only place in the panel that talks to Supabase from the browser — every
 * read and write afterwards goes through a server action. Failures are
 * reported in one plain sentence: telling someone whether it was the address
 * or the password that was wrong tells that to anyone guessing, too.
 */
export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setPending(true);
    setError(null);

    const { error: failure } = await supabaseBrowser().auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (failure) {
      setError('That email and password do not match an account here.');
      setPending(false);
      return;
    }

    router.replace(next.startsWith('/admin') ? next : '/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide">Email</span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border-2 border-[#250200] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e92038]"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border-2 border-[#250200] bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e92038]"
        />
      </label>

      {error ? (
        <p role="alert" className="text-sm font-medium text-[#c81a2f]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-full border-2 border-[#250200] bg-[#e92038] px-5 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_#250200] transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#250200] disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
