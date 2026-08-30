/**
 * Design tokens — Ruff brand system.
 *
 * The site is animation-led: several sections compute style values per
 * animation frame (horizontal pin, scroll-scrubbed text reveal, cursor blob,
 * footer reveal). Those values cannot live in class names, so they are applied
 * as inline styles that read from this single typed source of truth. Static
 * layout still uses Tailwind utilities.
 */

export const font = {
  /** Display headlines. */
  display: `'Awesome Serif', Georgia, 'Times New Roman', serif`,
  /** Body and UI. */
  sans: `'Milligram', system-ui, -apple-system, sans-serif`,
  body: `'Milligram', system-ui, -apple-system, sans-serif`,
} as const;

/**
 * Weights the brand faces actually ship.
 *
 * Milligram has no upright 400 or 600 cut, so body copy sets in Light and
 * anything that needs emphasis steps straight to Bold. Asking for a weight
 * that does not exist would let the browser synthesise one, which smears the
 * geometric letterforms.
 */
export const weight = {
  /** Body copy and long-form paragraphs. */
  light: 300,
  /** UI labels, nav links, captions. */
  medium: 500,
  /** Buttons, emphasis, card titles. */
  bold: 700,
  /** Section headings in the body face. */
  extrabold: 800,
  /** Stat numbers and the biggest display moments. */
  black: 900,
} as const;

export const color = {
  /* Core pairing */
  brand: '#e92038',
  brandDeep: '#c81a2f',
  ink: '#250200',
  inkNavy: '#250200',
  inkHeading: '#250200',
  inkSoft: '#3a0d0a',

  /* Rotating accents */
  accentYellow: '#ffd741',
  accentOrange: '#fd7b33',
  accentGreen: '#2dc05e',
  accentLime: '#c3fb50',
  accentPink: '#feb3d2',
  accentPurple: '#7c65fe',

  /* Surfaces */
  surfaceDark: '#3a1512',
  paper: '#f0e9e5',
  paperAlt: '#f6f1ee',
  cream: '#efe6e0',
  tan: '#d3c2bb',
  navPill: '#f4efec',
  muted: '#6b5a55',
  border: 'rgba(37, 2, 0, 0.12)',
  white: '#ffffff',
} as const;

export const radius = {
  nav: 55,
  cta: 43,
  pill: 100,
  card: 24,
  section: 42,
  media: 31,
  panel: 20,
  chip: 17,
  sm: 12,
  xs: 8,
} as const;

/** Single source of truth for the mobile breakpoint (matches Tailwind `md`). */
export const MOBILE_MAX_WIDTH = 768;

/** Number of cards in the pinned "How it works" section. */
export const HOW_IT_WORKS_STEPS = 5;
