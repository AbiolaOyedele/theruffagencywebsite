/**
 * Uploads the site's own media to Cloudinary through the studio's unsigned
 * preset.
 *
 * Run with `node --env-file=.env.local scripts/cloudinary-upload.mjs`.
 *
 * The preset sets no folder of its own, so every upload names one — otherwise
 * assets land at the root of a cloud that several other projects share. Public
 * ids are derived from the file name rather than left to Cloudinary's random
 * generator, so re-running this overwrites in place instead of piling up
 * duplicates, and so a public id in `site.ts` says what it is.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
const root = `${process.env.CLOUDINARY_FOLDER ?? 'ruff-agency'}/website`;

if (!cloud || !preset) {
  console.error('Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET.');
  process.exit(1);
}

/** What goes up, and where it lands. */
const GROUPS = [
  { dir: 'public/placeholder', folder: `${root}/placeholder`, kind: 'image' },
  { dir: 'public', folder: `${root}/video`, kind: 'video', match: /\.mp4$/ },
];

async function upload(path, folder, kind) {
  const name = basename(path, extname(path));
  const form = new FormData();
  form.set('file', new Blob([readFileSync(path)]), basename(path));
  form.set('upload_preset', preset);
  form.set('folder', folder);
  form.set('public_id', name);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${kind}/upload`, {
    method: 'POST',
    body: form,
  });
  const body = await res.json();

  if (body.error) throw new Error(`${basename(path)}: ${body.error.message}`);
  return body;
}

for (const { dir, folder, kind, match } of GROUPS) {
  const files = readdirSync(dir)
    .filter((f) => (match ? match.test(f) : /\.(svg|png|jpe?g|webp)$/.test(f)))
    .sort();

  console.log(`\n${dir} → ${folder}\n`);

  for (const file of files) {
    const r = await upload(join(dir, file), folder, kind);
    const size = r.width ? `${r.width}×${r.height}` : '';
    console.log(`  ${r.public_id}  ${size} ${Math.round(r.bytes / 1024)}kB`);
  }
}

console.log('\nPaste a public id into site.ts — lib/images turns it into a URL.\n');
