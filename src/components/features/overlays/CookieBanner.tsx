'use client';

import { useEffect, useState } from 'react';
import { color, font } from '@/config/tokens';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useContent } from '@/components/providers/ContentProvider';

const STORAGE_KEY = 'cookie-consent';
/** Let visitors settle into the page before asking. */
const APPEAR_DELAY_MS = 8000;

/**
 * Analytics consent prompt.
 *
 * Slides in from the bottom-right once, then remembers the choice in
 * localStorage. Analytics must not load until this returns "accepted".
 */
export function CookieBanner() {
  const { cookieBanner } = useContent();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage can be blocked; fall through and show the banner.
    }
    if (stored === 'accepted' || stored === 'rejected') return;

    const timer = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setTimeout(() => setShown(true), 50));
    }, APPEAR_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const resolve = (choice: 'accepted' | 'rejected'): void => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // A blocked write only means we ask again next visit.
    }
    setShown(false);
    setTimeout(() => setMounted(false), 400);
  };

  const buttonBase = {
    flex: 1,
    padding: '12px 16px',
    minHeight: 44,
    borderRadius: 10,
    border: 'none',
    fontFamily: font.body,
    fontWeight: 700,
    fontSize: 14,
    color: color.white,
    cursor: 'pointer',
  } as const;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: isMobile ? 32 : 20,
        zIndex: 9999,
        ...(isMobile
          ? { left: 20, right: 20, width: 'auto' }
          : { right: 20, maxWidth: 340, width: 'calc(100vw - 40px)' }),
        background: color.ink,
        borderRadius: 20,
        padding: '24px 24px 20px',
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateX(0)' : 'translateX(calc(100% + 20px))',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <p
        style={{
          fontFamily: font.body,
          fontWeight: 700,
          fontSize: 16,
          color: color.white,
          margin: '0 0 10px',
        }}
      >
        {cookieBanner.title}
      </p>
      <p
        style={{
          fontFamily: font.body,
          fontWeight: 300,
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: '20px',
          margin: '0 0 20px',
        }}
      >
        {cookieBanner.body}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={() => resolve('rejected')}
          style={{ ...buttonBase, background: 'rgba(255,255,255,0.08)' }}
        >
          {cookieBanner.reject}
        </button>
        <button
          type="button"
          onClick={() => resolve('accepted')}
          style={{ ...buttonBase, background: color.brand }}
        >
          {cookieBanner.accept}
        </button>
      </div>
    </div>
  );
}
