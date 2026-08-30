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
 * Where the panel should grow from, and where closing it should go back to.
 *
 * Both belong to the act of opening rather than to any component: a card in
 * the archive panel is not rendered by the component that owns the route, so
 * it has nowhere to hand them to. They live here instead, set as the story
 * opens and read as the panel mounts.
 */
let pendingOrigin: DOMRect | null = null;
let pendingReturn: string | null = null;

interface OpenOptions {
  /** The box the panel expands out of. Omitted, the panel fades in instead. */
  readonly fromRect?: DOMRect | null;
  /**
   * The hash to restore on close — the archive panel, when the story was
   * opened from it. Omitted, closing returns to the page itself.
   */
  readonly returnTo?: string | null;
}

/**
 * Puts a story in the URL and tells everything watching.
 *
 * Exported on its own because the archive panel opens posts from outside the
 * component that owns the route — and `replaceState` fires no `hashchange`,
 * so setting the hash by hand is not enough on its own.
 */
export function openStory(hash: string, options: OpenOptions = {}): void {
  pendingOrigin = options.fromRect ?? null;
  pendingReturn = options.returnTo ?? null;
  window.history.replaceState(null, '', `#${hash}`);
  refresh();
  refreshHash();
}

/** The box the open story should grow from, if it was opened from one. */
export function storyOrigin(): DOMRect | null {
  return pendingOrigin;
}

interface StoryRoute {
  /** Hash of the open story, or null when the marketing page is showing. */
  readonly slug: string | null;
  readonly open: (slug: string, fromRect?: DOMRect) => void;
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

  const open = useCallback(
    (next: string, fromRect?: DOMRect) => openStory(next, { fromRect: fromRect ?? null }),
    [],
  );

  /**
   * Closing goes back where the story was opened from — the archive panel if
   * that is where the card was, and otherwise the page itself.
   */
  const close = useCallback(() => {
    const back = pendingReturn;
    pendingOrigin = null;
    pendingReturn = null;

    window.history.replaceState(
      null,
      '',
      back ? `#${back}` : window.location.pathname + window.location.search,
    );
    refresh();
    refreshHash();
  }, []);

  return { slug, open, close };
}
