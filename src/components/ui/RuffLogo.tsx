import type { CSSProperties, Ref } from 'react';
import { LOGO_MARK_VIEWBOX, LOGO_PATHS, LOGO_VIEWBOX } from '@/content/logo';

/**
 * Fallback accessible name.
 *
 * This component renders in both the server and the client tree, so it cannot
 * read the content context. Callers that hold resolved content pass `title`;
 * this is what is left when nobody does.
 */
const DEFAULT_TITLE = 'The Ruff Agency';

type LogoVariant = 'wordmark' | 'mark';

interface RuffLogoProps {
  /** `wordmark` is the full "Ruff" lockup; `mark` crops to the initial R. */
  readonly variant?: LogoVariant;
  readonly className?: string | undefined;
  readonly style?: CSSProperties | undefined;
  /** Set when the logo carries meaning rather than decorating a labelled control. */
  readonly title?: string | undefined;
  readonly ref?: Ref<SVGSVGElement> | undefined;
}

/**
 * The Ruff Agency logo.
 *
 * Rendered inline so it stays crisp at every scale, from the 20px notification
 * chip to the full-viewport reveal. The artwork ships its own colours — a black
 * shadow under white letterforms — and is deliberately never recoloured.
 */
export function RuffLogo({
  variant = 'wordmark',
  className,
  style,
  title,
  ref,
}: RuffLogoProps) {
  const labelled = typeof title === 'string';

  return (
    <svg
      ref={ref}
      viewBox={variant === 'mark' ? LOGO_MARK_VIEWBOX : LOGO_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={style}
      role={labelled ? 'img' : 'presentation'}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {labelled ? <title>{title ?? DEFAULT_TITLE}</title> : null}
      {LOGO_PATHS.map((path) => (
        <path key={path.d.slice(0, 32)} d={path.d} fill={path.fill} fillRule="evenodd" />
      ))}
    </svg>
  );
}

/** Aspect ratios, so callers can size from a single dimension. */
export const LOGO_ASPECT = { wordmark: 1125.47 / 766.18, mark: 300 / 400 } as const;
