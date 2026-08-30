'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { caseStudies } from '@/content/site';

type Listener = () => void;

const listeners = new Set<Listener>();

/** Reads the slug currently encoded in the URL hash, if it names a case study. */
function readSlugFromHash(): string | null {
  const slug = window.location.hash.slice(1);
  return caseStudies.some((study) => study.slug === slug) ? slug : null;
}

let snapshot: string | null = null;
let initialised = false;

function refresh(): void {
  const next = readSlugFromHash();
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  if (!initialised) {
    initialised = true;
    snapshot = readSlugFromHash();
  }
  listeners.add(listener);
  window.addEventListener('hashchange', refresh);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('hashchange', refresh);
  };
}

function getSnapshot(): string | null {
  if (!initialised) {
    initialised = true;
    snapshot = readSlugFromHash();
  }
  return snapshot;
}

function getServerSnapshot(): string | null {
  return null;
}

interface CaseStudyRoute {
  /** Slug of the open case study, or null when the marketing page is showing. */
  readonly slug: string | null;
  readonly open: (slug: string) => void;
  readonly close: () => void;
}

/**
 * Keeps the open case study in the URL hash.
 *
 * The hash is the source of truth, so a deep link opens the right study on
 * first paint and the browser's back button behaves sensibly. Reads go through
 * `useSyncExternalStore` rather than being copied into state by an effect.
 */
export function useCaseStudyRoute(): CaseStudyRoute {
  const slug = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const open = useCallback((next: string) => {
    window.history.replaceState(null, '', `#${next}`);
    refresh();
  }, []);

  const close = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname);
    refresh();
  }, []);

  return { slug, open, close };
}
