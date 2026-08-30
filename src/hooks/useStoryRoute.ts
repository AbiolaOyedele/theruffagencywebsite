'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { blogPosts, caseStudies } from '@/content/site';
import { refreshHash } from '@/hooks/useHash';
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

/**
 * Puts a story in the URL and tells everything watching.
 *
 * Exported on its own because the archive panel opens posts from outside the
 * component that owns the route — and `replaceState` fires no `hashchange`,
 * so setting the hash by hand is not enough on its own.
 */
export function openStory(hash: string): void {
  window.history.replaceState(null, '', `#${hash}`);
  refresh();
  refreshHash();
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

  const open = useCallback((next: string) => openStory(next), []);

  const close = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname);
    refresh();
    refreshHash();
  }, []);

  return { slug, open, close };
}
