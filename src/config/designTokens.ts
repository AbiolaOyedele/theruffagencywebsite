/**
 * The design system, enumerated.
 *
 * `config/tokens.ts` says what the site uses; this says what may be changed,
 * what it is called in the panel, and what it falls back to. One registry
 * drives three things that would otherwise drift apart: the CSS custom
 * properties emitted into the page, the editors in the panel, and the reset
 * that puts a token back to the value in the repo.
 *
 * A token's `id` is its database key and its CSS variable name, so nothing has
 * to be mapped between the three.
 */

export type TokenKind = 'colour' | 'font' | 'weight' | 'length';

export interface DesignToken {
  /** Database key and CSS variable, e.g. `color.brand` -> `--color-brand`. */
  readonly id: string;
  readonly label: string;
  readonly kind: TokenKind;
  /** The value in the repo. Resetting a token restores this. */
  readonly fallback: string;
  /** One line on what it is for, shown beside the control. */
  readonly note?: string;
}

export interface TokenGroup {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tokens: readonly DesignToken[];
}

/**
 * `color.brand` -> `--rt-color-brand`.
 *
 * Namespaced deliberately. `globals.css` already declares a `:root` palette of
 * its own for the Tailwind theme — `--color-brand`, `--radius-card` and so on —
 * and an unprefixed name would bind to those instead of to the fallback written
 * beside it. Two of them disagree with the values in `config/tokens.ts`
 * (`--radius-card` is 24px there against 28px here), so the collision would not
 * merely be untidy: it would silently change the site.
 */
export function cssVarName(id: string): string {
  return `--rt-${id.replace(/\./g, '-')}`;
}

/** What a component writes: the variable, with the repo value behind it. */
export function cssVar(id: string, fallback: string): string {
  return `var(${cssVarName(id)}, ${fallback})`;
}

export const TOKEN_GROUPS: readonly TokenGroup[] = [
  {
    id: 'brand-colour',
    title: 'Brand colour',
    description:
      'The red is reserved for buttons and interactive states — it is never a background. Ink is the text colour everything else is measured against.',
    tokens: [
      { id: 'color.brand', label: 'Brand red', kind: 'colour', fallback: '#e92038', note: 'Buttons and links' },
      { id: 'color.brandDeep', label: 'Brand red, pressed', kind: 'colour', fallback: '#c81a2f' },
      { id: 'color.ink', label: 'Ink', kind: 'colour', fallback: '#250200', note: 'Body text and keylines' },
      { id: 'color.inkSoft', label: 'Ink, soft', kind: 'colour', fallback: '#3a0d0a' },
      { id: 'color.muted', label: 'Muted text', kind: 'colour', fallback: '#6b5a55' },
    ],
  },
  {
    id: 'accents',
    title: 'Card accents',
    description:
      'Cards take a ground from their position, not their content, cycling through the first four so no two neighbours match. The deeper green and purple are in the palette but the site does not wear them.',
    tokens: [
      { id: 'color.accentPink', label: 'Pink', kind: 'colour', fallback: '#feb3d2' },
      { id: 'color.accentLime', label: 'Lime', kind: 'colour', fallback: '#c3fb50' },
      { id: 'color.accentYellow', label: 'Yellow', kind: 'colour', fallback: '#ffd741' },
      { id: 'color.accentOrange', label: 'Orange', kind: 'colour', fallback: '#fd7b33' },
      { id: 'color.accentGreen', label: 'Green (unused)', kind: 'colour', fallback: '#2dc05e' },
      { id: 'color.accentPurple', label: 'Purple (unused)', kind: 'colour', fallback: '#7c65fe' },
    ],
  },
  {
    id: 'surfaces',
    title: 'Surfaces',
    description: 'The grounds the page is built on, lightest to darkest.',
    tokens: [
      { id: 'color.white', label: 'White', kind: 'colour', fallback: '#ffffff' },
      { id: 'color.paperAlt', label: 'Paper, light', kind: 'colour', fallback: '#f6f1ee' },
      { id: 'color.paper', label: 'Paper', kind: 'colour', fallback: '#f0e9e5', note: 'Also the browser theme colour' },
      { id: 'color.navPill', label: 'Nav pill', kind: 'colour', fallback: '#f4efec' },
      { id: 'color.cream', label: 'Cream', kind: 'colour', fallback: '#efe6e0' },
      { id: 'color.tan', label: 'Tan', kind: 'colour', fallback: '#d3c2bb' },
      { id: 'color.surfaceDark', label: 'Dark surface', kind: 'colour', fallback: '#3a1512' },
      { id: 'color.border', label: 'Border', kind: 'colour', fallback: 'rgba(37, 2, 0, 0.12)' },
    ],
  },
  {
    id: 'type',
    title: 'Typefaces',
    description:
      'Three tiers. Display carries the big claims, accent is the Didone italic used for one word inside a headline, body is for reading. The UI cut is separate because the body face ships in Light only and faking a bold smears it.',
    tokens: [
      {
        id: 'font.display',
        label: 'Display',
        kind: 'font',
        fallback: "'Milligram', system-ui, -apple-system, sans-serif",
      },
      {
        id: 'font.accent',
        label: 'Accent italic',
        kind: 'font',
        fallback: "'Awesome Serif', Georgia, 'Times New Roman', serif",
      },
      {
        id: 'font.body',
        label: 'Body',
        kind: 'font',
        fallback: "'Noir Pro', 'Milligram', system-ui, -apple-system, sans-serif",
      },
      {
        id: 'font.sans',
        label: 'UI',
        kind: 'font',
        fallback: "'Milligram', system-ui, -apple-system, sans-serif",
      },
    ],
  },
  {
    id: 'weights',
    title: 'Type weights',
    description:
      'Only the cuts the shipped fonts actually contain. Asking for a weight that does not exist lets the browser synthesise one, which smears the geometric letterforms.',
    tokens: [
      { id: 'weight.light', label: 'Light', kind: 'weight', fallback: '300', note: 'Body copy' },
      { id: 'weight.medium', label: 'Medium', kind: 'weight', fallback: '500', note: 'Labels and nav' },
      { id: 'weight.bold', label: 'Bold', kind: 'weight', fallback: '700', note: 'Buttons' },
      { id: 'weight.extrabold', label: 'Extrabold', kind: 'weight', fallback: '800', note: 'Section headings' },
      { id: 'weight.black', label: 'Black', kind: 'weight', fallback: '900', note: 'Display and stats' },
    ],
  },
  {
    id: 'shape',
    title: 'Shape',
    description:
      'A hard keyline with a solid offset shadow that collapses on press, rather than a soft blur. Corner radii, largest to smallest.',
    tokens: [
      { id: 'radius.nav', label: 'Nav', kind: 'length', fallback: '55px' },
      { id: 'radius.section', label: 'Section', kind: 'length', fallback: '40px' },
      { id: 'radius.card', label: 'Card', kind: 'length', fallback: '28px' },
      { id: 'radius.media', label: 'Media', kind: 'length', fallback: '28px' },
      { id: 'radius.panel', label: 'Panel', kind: 'length', fallback: '20px' },
      { id: 'radius.chip', label: 'Chip', kind: 'length', fallback: '16px' },
      { id: 'radius.sm', label: 'Small', kind: 'length', fallback: '12px' },
      { id: 'radius.xs', label: 'Extra small', kind: 'length', fallback: '8px' },
      { id: 'shape.keylineWidth', label: 'Keyline width', kind: 'length', fallback: '2.5px' },
      { id: 'shape.shadowOffset', label: 'Shadow offset', kind: 'length', fallback: '6px' },
    ],
  },
];

/** Every token, flat, for lookups and validation. */
export const ALL_TOKENS: readonly DesignToken[] = TOKEN_GROUPS.flatMap((g) => g.tokens);

const BY_ID = new Map(ALL_TOKENS.map((token) => [token.id, token]));

export function findToken(id: string): DesignToken | undefined {
  return BY_ID.get(id);
}

/** True for an id this build knows about. Anything else is refused on save. */
export function isKnownToken(id: string): boolean {
  return BY_ID.has(id);
}
