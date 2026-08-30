import { publicEnv } from '@/config/env';

/**
 * Image sources, wherever they are stored.
 *
 * Content names an image one of two ways: a path into `public/`
 * (`/placeholder/writing-1.svg`) or a Cloudinary public id
 * (`ruff/writing/logo-not-a-brand-01`). This resolves whichever it is given,
 * so a picture can move to Cloudinary by changing one string in the content
 * file — no component learns where images live.
 *
 * With no cloud name configured, a public id is returned untouched rather than
 * pointing at a URL that cannot resolve. The site keeps working; the images
 * simply stay wherever they already are.
 */

/** Delivery transforms applied to everything: modern format, tuned quality. */
const TRANSFORMS = 'f_auto,q_auto';

/** True for anything already addressable as it stands. */
function isDirectSource(source: string): boolean {
  return source.startsWith('/') || source.startsWith('http://') || source.startsWith('https://');
}

/**
 * Resolves a content image source to a URL the browser can fetch.
 *
 * @param source A `public/` path, an absolute URL, or a Cloudinary public id.
 * @param width Optional target width, so Cloudinary serves no more than needed.
 */
export function imageUrl(source: string, width?: number): string {
  if (isDirectSource(source)) return source;

  const cloud = publicEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return source;

  const transforms = width ? `${TRANSFORMS},w_${width},c_limit` : TRANSFORMS;
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${source}`;
}

/** The same, for looping footage. Cloudinary serves video from its own path. */
export function videoUrl(source: string): string {
  if (isDirectSource(source)) return source;

  const cloud = publicEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return source;

  return `https://res.cloudinary.com/${cloud}/video/upload/q_auto/${source}`;
}
