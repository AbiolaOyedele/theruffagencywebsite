/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

/** Linear interpolation between `from` and `to`. */
export function lerp(from: number, to: number, amount: number): number {
  return (1 - amount) * from + amount * to;
}

/** Cubic ease-out, the site's default deceleration curve. */
export function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

/**
 * Smoothly scrolls the page to the top of the section with the given id.
 * No-ops when the section is not in the document.
 */
export function scrollToSection(sectionId: string): void {
  const target = document.querySelector<HTMLElement>(
    `[data-section="${sectionId}"], #${sectionId}`,
  );
  if (!target) return;
  window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
}

/** Locks or unlocks page scrolling (used by the intro overlay and modals). */
export function setScrollLocked(locked: boolean): void {
  if (locked) {
    document.body.setAttribute('data-scroll-locked', 'true');
  } else {
    document.body.removeAttribute('data-scroll-locked');
  }
}
