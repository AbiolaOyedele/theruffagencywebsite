/**
 * WCAG contrast, so the panel can say when a colour choice fails.
 *
 * The site already has one known case: white on the brand red measures 4.44:1
 * against the 4.5:1 that AA asks for on body text, and buttons are the only
 * place that red carries text. Rather than leave that in a document nobody
 * opens, the design section works it out live and says so.
 */

/** #rgb or #rrggbb to 0–255 channels. Null for anything else. */
export function parseHex(value: string): readonly [number, number, number] | null {
  const clean = value.trim().replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;

  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function channelLuminance(channel: number): number {
  const scaled = channel / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(rgb: readonly [number, number, number]): number {
  const [r, g, b] = rgb.map(channelLuminance) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The ratio between two hex colours, or null if either cannot be read. */
export function contrastRatio(foreground: string, background: string): number | null {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (!fg || !bg) return null;

  const light = Math.max(relativeLuminance(fg), relativeLuminance(bg));
  const dark = Math.min(relativeLuminance(fg), relativeLuminance(bg));
  return (light + 0.05) / (dark + 0.05);
}

export type ContrastVerdict = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/** Where a ratio lands, for normal-size body text. */
export function verdict(ratio: number): ContrastVerdict {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}
