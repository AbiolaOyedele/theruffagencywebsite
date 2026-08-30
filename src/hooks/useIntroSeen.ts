'use client';

import { useSyncExternalStore } from 'react';

/**
 * Whether the opening animation has already played this visit.
 *
 * The intro belongs to arriving at the site, not to arriving at the home page.
 * Without this, every trip back from /blog, /contact or a post replays it —
 * you close a page and land in the opening sequence instead of where you were.
 *
 * Kept in `sessionStorage`, so it resets when the tab closes and a genuinely
 * new visit still gets the intro. Read through `useSyncExternalStore` rather
 * than synced into state from an effect, and reported as `false` on the server
 * so the markup matches the first client paint.
 */
const KEY = 'ruff:intro-seen';

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    // Private browsing and blocked storage both throw. Showing the intro
    // again is the harmless outcome.
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

/** Records that the intro has run, and tells anything listening. */
export function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(KEY, '1');
  } catch {
    // Nothing to do — the intro simply plays again next time.
  }
  for (const listener of listeners) listener();
}

export function useIntroSeen(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
