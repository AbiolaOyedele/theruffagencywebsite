import { setScrollLocked } from '@/utils/scroll';

/**
 * The page furniture a panel takes over while it is open: the page stops
 * scrolling behind it, and the floating nav gets out of the way.
 *
 * Counted rather than set, because panels stack — a post opens over the
 * writing archive. Without counting, closing the post would hand the page back
 * its scroll and its nav while the archive is still covering it.
 */
let depth = 0;

function apply(): void {
  setScrollLocked(true);
  const nav = document.querySelector<HTMLElement>('[data-main-nav]');
  if (nav) {
    nav.style.visibility = 'hidden';
    nav.style.pointerEvents = 'none';
  }
}

function restore(): void {
  setScrollLocked(false);
  const nav = document.querySelector<HTMLElement>('[data-main-nav]');
  if (nav) {
    nav.style.visibility = '';
    nav.style.pointerEvents = '';
  }
}

export interface OverlayChrome {
  /** True while nothing has opened on top of this panel — so Escape is its to answer. */
  readonly isTop: () => boolean;
  readonly release: () => void;
}

/**
 * Hides the nav ahead of a panel that has not mounted yet — the card zoom runs
 * for half a second before the panel exists. Uncounted on purpose: the panel
 * claims the chrome properly a moment later, and that claim is what restores
 * it.
 */
export function hideNavForHandover(): void {
  const nav = document.querySelector<HTMLElement>('[data-main-nav]');
  if (nav) {
    nav.style.visibility = 'hidden';
    nav.style.pointerEvents = 'none';
  }
}

/** Claims the chrome for one panel. Call the returned `release` on unmount. */
export function claimOverlayChrome(): OverlayChrome {
  depth += 1;
  const mine = depth;
  if (depth === 1) apply();

  return {
    isTop: () => depth === mine,
    release: () => {
      // Panels close innermost first, so this only ever steps back down.
      depth = Math.min(depth, mine - 1);
      if (depth === 0) restore();
    },
  };
}
