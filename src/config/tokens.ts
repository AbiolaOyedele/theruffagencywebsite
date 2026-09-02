import { cssVar } from '@/config/designTokens';

/**
 * Design tokens — Ruff brand system.
 *
 * The site is animation-led: several sections compute style values per
 * animation frame (horizontal pin, scroll-scrubbed text reveal, footer
 * reveal). Those values cannot live in class names, so they are applied as
 * inline styles that read from this single typed source of truth. Static
 * layout still uses Tailwind utilities.
 *
 * Every value below resolves through a CSS custom property with the repo's own
 * value written in behind it, so the studio can change a colour or a typeface
 * in the panel without a deploy, and a site with no database — or a stylesheet
 * that failed to load — still renders exactly what ships here. What may be
 * changed, and what it is called, lives in `config/designTokens.ts`.
 *
 * Two consequences worth knowing. A token is now a `var(...)` string, not a
 * hex or a number, so anything that needs to *compute* with one — parsing it
 * to RGB, appending an alpha suffix — has to resolve it first; `resolveToken`
 * in `lib/design/resolve.ts` does that. And a length carries its unit.
 */

export const font = {
  display: cssVar('font.display', `'Milligram', system-ui, -apple-system, sans-serif`),
  accent: cssVar('font.accent', `'Awesome Serif', Georgia, 'Times New Roman', serif`),
  body: cssVar('font.body', `'Noir Pro', 'Milligram', system-ui, -apple-system, sans-serif`),
  sans: cssVar('font.sans', `'Milligram', system-ui, -apple-system, sans-serif`),
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
  light: cssVar('weight.light', '300'),
  /** UI labels, nav links, captions. */
  medium: cssVar('weight.medium', '500'),
  /** Buttons, emphasis, card titles. */
  bold: cssVar('weight.bold', '700'),
  /** Section headings. */
  extrabold: cssVar('weight.extrabold', '800'),
  /** The biggest display moments and stat numbers. */
  black: cssVar('weight.black', '900'),
} as const;

export const color = {
  /* Brand red — reserved for buttons and interactive states, never a ground. */
  brand: cssVar('color.brand', '#e92038'),
  brandDeep: cssVar('color.brandDeep', '#c81a2f'),
  ink: cssVar('color.ink', '#250200'),
  inkNavy: cssVar('color.ink', '#250200'),
  inkHeading: cssVar('color.ink', '#250200'),
  inkSoft: cssVar('color.inkSoft', '#3a0d0a'),

  /* Rotating accents */
  accentYellow: cssVar('color.accentYellow', '#ffd741'),
  accentOrange: cssVar('color.accentOrange', '#fd7b33'),
  accentGreen: cssVar('color.accentGreen', '#2dc05e'),
  accentLime: cssVar('color.accentLime', '#c3fb50'),
  accentPink: cssVar('color.accentPink', '#feb3d2'),
  accentPurple: cssVar('color.accentPurple', '#7c65fe'),

  /* Surfaces */
  surfaceDark: cssVar('color.surfaceDark', '#3a1512'),
  paper: cssVar('color.paper', '#f0e9e5'),
  paperAlt: cssVar('color.paperAlt', '#f6f1ee'),
  cream: cssVar('color.cream', '#efe6e0'),
  tan: cssVar('color.tan', '#d3c2bb'),
  navPill: cssVar('color.navPill', '#f4efec'),
  muted: cssVar('color.muted', '#6b5a55'),
  border: cssVar('color.border', 'rgba(37, 2, 0, 0.12)'),
  white: cssVar('color.white', '#ffffff'),
} as const;

/**
 * The card grounds, in rotation order.
 *
 * The four lighter accents only — the deeper green and purple are in the
 * palette but the site does not wear them, and a card is a large area of flat
 * colour. Cards take their ground from position rather than from content, so
 * the rotation guarantees no two neighbours land on the same colour however
 * many there are.
 */
export const CARD_ACCENTS = [
  color.accentPink,
  color.accentLime,
  color.accentYellow,
  color.accentOrange,
] as const;

/** The ground for the card at `index`, cycling through `CARD_ACCENTS`. */
export function cardAccent(index: number): string {
  return CARD_ACCENTS[index % CARD_ACCENTS.length] as string;
}

/**
 * Comic-book shape language: a hard keyline with a solid offset shadow that
 * collapses on press, instead of a soft blur.
 */
const KEYLINE_WIDTH = cssVar('shape.keylineWidth', '2.5px');
const SHADOW_OFFSET = cssVar('shape.shadowOffset', '6px');

export const shape = {
  keyline: `${KEYLINE_WIDTH} solid ${color.ink}`,
  hardShadow: `${SHADOW_OFFSET} ${SHADOW_OFFSET} 0 ${color.ink}`,
  hardShadowSmall: `4px 4px 0 ${color.ink}`,
  hardShadowPressed: `2px 2px 0 ${color.ink}`,
  softShadow: '0 8px 24px rgba(37, 2, 0, 0.14)',
} as const;

export const radius = {
  nav: cssVar('radius.nav', '55px'),
  cta: '999px',
  pill: '999px',
  card: cssVar('radius.card', '28px'),
  section: cssVar('radius.section', '40px'),
  media: cssVar('radius.media', '28px'),
  panel: cssVar('radius.panel', '20px'),
  chip: cssVar('radius.chip', '16px'),
  sm: cssVar('radius.sm', '12px'),
  xs: cssVar('radius.xs', '8px'),
} as const;

/**
 * Layout constants, not design tokens.
 *
 * These are read in JavaScript — media query strings, a loop bound — so they
 * stay real numbers and are not editable in the panel.
 */

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
