'use client';

import { COMPACT_MAX_WIDTH } from '@/config/tokens';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Whether the viewport is too narrow for a two-column panel.
 *
 * Wider than `useIsMobile`: a tablet or a half-width desktop window is not a
 * phone, but it still cannot carry a form and a sidebar side by side.
 *
 * Reports `false` during server rendering and on the first client paint, then
 * corrects — so components that branch on it must render the wide layout as
 * their server-safe default.
 */
export function useIsCompact(): boolean {
  return useMediaQuery(`(max-width: ${COMPACT_MAX_WIDTH}px)`);
}
