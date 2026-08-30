/**
 * Design tokens — Ruff brand system.
 *
 * The site is animation-led: several sections compute style values per
 * animation frame (horizontal pin, scroll-scrubbed text reveal, footer
 * reveal). Those values cannot live in class names, so they are applied as
 * inline styles that read from this single typed source of truth. Static
 * layout still uses Tailwind utilities.
 */

/**
 * Three-tier type system, per the brand guidelines.
 *
 * `display` is the heavy geometric sans that carries the big claims;
 * `accent` is the Didone italic used for a single word inside a headline;
 * `body` is Noir Pro for reading copy. `sans` is the UI cut — Milligram —
 * used for labels, buttons and anything that needs weight, because Noir Pro
 * ships in Light only and faking a bold smears it.
 */
export const font = {
  display: `'Milligram', system-ui, -apple-system, sans-serif`,
  accent: `'Awesome Serif', Georgia, 'Times New Roman', serif`,
  body: `'Noir Pro', 'Milligram', system-ui, -apple-system, sans-serif`,
  sans: `'Milligram', system-ui, -apple-system, sans-serif`,
} as const;

/**
 * Weights the brand faces actually ship.
 *
 * Noir Pro is Light only. Milligram has no upright 400 or 600 cut, so UI text
 * sets at 500 and steps straight to 700+ for emphasis. Asking for a weight
 * that does not exist lets the browser synthesise one, which smears the
 * geometric letterforms.
 */
export const weight = {
  /** Body copy and long-form paragraphs (Noir Pro Light). */
  light: 300,
  /** UI labels, nav links, captions. */
  medium: 500,
  /** Buttons, emphasis, card titles. */
  bold: 700,
  /** Section headings. */
  extrabold: 800,
  /** The biggest display moments and stat numbers. */
  black: 900,
} as const;

export const color = {
  /* Brand red — reserved for buttons and interactive states, never a ground. */
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


/**
 * Comic-book shape language: a hard keyline with a solid offset shadow that
 * collapses on press, instead of a soft blur.
 */
export const shape = {
  keyline: `2.5px solid ${color.ink}`,
  hardShadow: `6px 6px 0 ${color.ink}`,
  hardShadowSmall: `4px 4px 0 ${color.ink}`,
  hardShadowPressed: `2px 2px 0 ${color.ink}`,
  softShadow: '0 8px 24px rgba(37, 2, 0, 0.14)',
} as const;

export const radius = {
  nav: 55,
  cta: 999,
  pill: 999,
  card: 28,
  section: 40,
  media: 28,
  panel: 20,
  chip: 16,
  sm: 12,
  xs: 8,
} as const;

/** Single source of truth for the mobile breakpoint (matches Tailwind `md`). */
export const MOBILE_MAX_WIDTH = 768;

/**
 * Where a side-by-side panel layout stops paying for itself.
 *
 * Between the mobile breakpoint and this one there is enough width for two
 * columns on paper but not in practice: the panels reserve 300px for the rail
 * beside the form, which squeezes paired form fields down to about 110px.
 * Panels stack below this width instead. (Matches Tailwind `lg`.)
 */
export const COMPACT_MAX_WIDTH = 1024;

/** Number of cards in the pinned Services section. */
export const SERVICE_STEPS = 5;

/**
 * The one primary-button treatment.
 *
 * Red ground, ink keyline, hard offset shadow, full pill. Every call to action
 * on the site spreads this and overrides only its padding and font size, so the
 * buttons cannot drift apart again.
 */
export const primaryButton = {
  background: color.brand,
  color: color.white,
  border: shape.keyline,
  borderRadius: radius.pill,
  boxShadow: shape.hardShadowSmall,
  fontFamily: font.sans,
  fontWeight: weight.bold,
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  transition: 'background 0.2s ease, box-shadow 0.18s ease, transform 0.18s ease',
} as const;

/** Pressed state: the shadow collapses under the button. */
export const primaryButtonPressed = {
  background: color.brandDeep,
  boxShadow: shape.hardShadowPressed,
  transform: 'translate(2px, 2px)',
} as const;
