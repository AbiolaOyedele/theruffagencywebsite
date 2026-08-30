'use client';

import { MOBILE_MAX_WIDTH } from '@/config/tokens';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Whether the viewport is at or below the mobile breakpoint.
 *
 * Reports `false` during server rendering and on the first client paint, then
 * corrects — so components that branch on it must render the desktop layout
 * as their server-safe default.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
}
