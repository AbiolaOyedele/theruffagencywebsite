/**
 * Lists what is in the studio's Cloudinary folder, with the public id to paste
 * into `src/content/site.ts`.
 *
 * Run with `node --env-file=.env.local scripts/cloudinary-assets.mjs`.
 * Read-only: it lists and nothing else. Content names an image by its public
 * id and `src/lib/images.ts` turns that into a delivery URL, so swapping a
 * placeholder for real work is a one-string change.
 */
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;
const folder = process.env.CLOUDINARY_FOLDER ?? 'ruff-agency';

if (!cloud || !key || !secret) {
  console.error('Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and');
  console.error('CLOUDINARY_API_SECRET — see .env.example.');
  process.exit(1);
}

const auth = Buffer.from(`${key}:${secret}`).toString('base64');

/** One page of a resource type, sorted so the listing is stable. */
async function list(type) {
  const url = new URL(`https://api.cloudinary.com/v1_1/${cloud}/resources/${type}`);
  url.searchParams.set('prefix', folder);
  url.searchParams.set('type', 'upload');
  url.searchParams.set('max_results', '500');

  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (!res.ok) throw new Error(`Cloudinary answered ${res.status} for ${type}`);

  const { resources = [] } = await res.json();
  return resources.sort((a, b) => a.public_id.localeCompare(b.public_id));
}

for (const type of ['image', 'video']) {
  const resources = await list(type);
  console.log(`\n${type} — ${resources.length} in ${folder}/\n`);

  for (const r of resources) {
    const size = `${r.width}×${r.height}`.padEnd(12);
    const weight = `${Math.round(r.bytes / 1024)}kB`.padStart(7);
    console.log(`  ${r.public_id}  ${size}${weight}  ${r.format}`);
  }
}

console.log('\nPaste a public id straight into site.ts — no URL, no domain.\n');
