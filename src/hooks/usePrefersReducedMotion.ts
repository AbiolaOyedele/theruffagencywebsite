'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
