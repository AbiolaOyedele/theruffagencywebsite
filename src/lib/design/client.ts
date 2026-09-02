'use client';

import { cssVarName } from '@/config/designTokens';

/**
 * A token's actual value, in the browser.
 *
 * Tokens are `var(...)` strings, which is what CSS wants and what JavaScript
 * cannot do arithmetic on. The two places that need a real value — recolouring
 * a Lottie file, which stores RGB as numbers — resolve it through here, so an
 * override made in the panel is honoured rather than bypassed.
 *
 * Returns the fallback during server rendering, where there is no computed
 * style to read.
 */
export function resolvedToken(id: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVarName(id))
    .trim();
  return value || fallback;
}
