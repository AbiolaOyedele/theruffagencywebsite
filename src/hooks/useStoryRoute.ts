'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { blogPosts, caseStudies } from '@/content/site';
import { postHash } from '@/types/content';

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * Every hash that opens the reading panel.
 *
 * Client stories keep their bare slug — those URLs are already in the wild —
 * and posts are namespaced under `writing/`, so a client and a post can never
 * collide on a name.
 */
function panelHashes(): ReadonlySet<string> {
  return new Set([
    ...caseStudies.map((study) => study.slug),
    ...blogPosts.map((post) => postHash(post.slug)),
  ]);
}

/** Reads the hash currently in the URL, if it names something the panel opens. */
function readSlugFromHash(): string | null {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  return panelHashes().has(hash) ? hash : null;
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

interface StoryRoute {
  /** Hash of the open story, or null when the marketing page is showing. */
  readonly slug: string | null;
  readonly open: (slug: string) => void;
  readonly close: () => void;
}

/**
 * Keeps the open story — a client's or a post's — in the URL hash.
 *
 * The hash is the source of truth, so a deep link opens the right one on first
 * paint and the browser's back button behaves sensibly. Reads go through
 * `useSyncExternalStore` rather than being copied into state by an effect.
 */
export function useStoryRoute(): StoryRoute {
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
