/**
 * Regenerates `public/og.png`, the link-preview card.
 *
 * Run with `node scripts/og-image.mjs`. The wordmark is read from
 * `public/ruff-logo.svg` and nested into the layout, so the card cannot drift
 * from the real mark. Text sets in a system sans — the brand faces ship as
 * woff2, which no SVG rasteriser reads.
 */
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const INK = '#250200';
const PAPER = '#f0e9e5';
const BRAND = '#e92038';

const LOGO_VIEWBOX_W = 1125.47;
const LOGO_VIEWBOX_H = 766.18;
const LOGO_W = 430;
const LOGO_H = Math.round((LOGO_W * LOGO_VIEWBOX_H) / LOGO_VIEWBOX_W);
const LOGO_X = 88;
const LOGO_Y = 96;

const wordmark = readFileSync('public/ruff-logo.svg', 'utf8')
  .replace(/<\?xml.*?\?>/s, '')
  .trim()
  .split('>')
  .slice(1)
  .join('>')
  .replace(/<\/svg>\s*$/, '');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="14" fill="${INK}"/>
  <g transform="translate(${LOGO_X} ${LOGO_Y}) scale(${LOGO_W / LOGO_VIEWBOX_W})">
${wordmark}
  </g>
  <text x="${LOGO_X}" y="${LOGO_Y + LOGO_H + 92}" font-family="Helvetica,Arial,sans-serif"
        font-size="42" font-weight="700" fill="${INK}">Brand strategy &#38; creative direction</text>
  <text x="${LOGO_X}" y="${LOGO_Y + LOGO_H + 146}" font-family="Helvetica,Arial,sans-serif"
        font-size="30" font-weight="400" fill="${INK}" opacity="0.65">Lagos, working worldwide &#183; theruff.agency</text>
  <rect x="856" y="150" width="256" height="76" rx="38" fill="${BRAND}" stroke="${INK}" stroke-width="5"/>
  <text x="984" y="199" text-anchor="middle" font-family="Helvetica,Arial,sans-serif"
        font-size="28" font-weight="700" fill="#ffffff">Work with us</text>
</svg>
`;

const info = await sharp(Buffer.from(svg), { density: 144 })
  .resize(1200, 630, { fit: 'contain', background: PAPER })
  .png()
  .toFile('public/og.png');

console.log(`public/og.png — ${info.width}×${info.height}, ${info.size} bytes`);
