'use client';

import { LOGO_ASPECT, RuffLogo } from '@/components/ui/RuffLogo';
import { brand } from '@/content/site';

interface LogoProps {
  /** Rendered height of the wordmark in pixels. */
  readonly height?: number;
  readonly onClick?: (() => void) | undefined;
}

/**
 * The wordmark as it appears in the navbar and case-study header.
 *
 * When `onClick` is supplied it becomes a real button back to the top of the
 * page; otherwise it renders as a labelled image.
 */
export function Logo({ height = 32, onClick }: LogoProps) {
  const style = { height, width: height * LOGO_ASPECT.wordmark, display: 'block' } as const;

  if (!onClick) {
    return <RuffLogo title={brand.name} style={style} />;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${brand.name} — back to top`}
      style={{
        background: 'none',
        border: 'none',
        padding: 4,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <RuffLogo style={style} />
    </button>
  );
}
