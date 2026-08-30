'use client';

import { useSyncExternalStore } from 'react';

type Listener = () => void;

const listeners = new Set<Listener>();
let snapshot = '';
let initialised = false;

function read(): string {
  return window.location.hash.slice(1);
}

/** Re-reads the hash and wakes subscribers if it changed. */
export function refreshHash(): void {
  const next = read();
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  if (!initialised) {
    initialised = true;
    snapshot = read();
  }
  listeners.add(listener);
  window.addEventListener('hashchange', refreshHash);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('hashchange', refreshHash);
  };
}

function getSnapshot(): string {
  if (!initialised) {
    initialised = true;
    snapshot = read();
  }
  return snapshot;
}

/**
 * The current URL hash, without the `#`.
 *
 * Read through `useSyncExternalStore` rather than copied into state by an
 * effect, so the first render already has the right value — a deep link opens
 * what it names on the first paint instead of flashing the page first.
 */
export function useHash(): string {
  return useSyncExternalStore(subscribe, getSnapshot, () => '');
}
