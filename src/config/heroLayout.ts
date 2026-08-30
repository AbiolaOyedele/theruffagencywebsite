/**
 * Geometry shared by the hero and the intro sequence.
 *
 * The intro's phone has to land exactly where the hero's phone sits, or the
 * handover snaps. These values are the contract between the two — change them
 * here, never in one component alone.
 */

/** How much larger than its art board the phone renders. */
export const HERO_PHONE_SCALE = 1.2;

/**
 * Width of the column the phone sits in.
 *
 * The art board is 891px wide but the device occupies only its middle third,
 * so the column is a narrower window that crops the hands and keeps the phone
 * centred. Any wider and it starves the copy column.
 */
export const HERO_PHONE_WINDOW = 'min(720px, 42vw)';

/** Space above the composition, clearing the floating nav. */
export const HERO_PADDING_TOP = 104;

/** Gap between the two columns. */
export const HERO_COLUMN_GAP = 24;

/** Inset of the copy column from the left edge. */
export const HERO_PADDING_LEFT = 'clamp(24px, 5vw, 88px)';

/**
 * The hand photo overhangs the bottom of the 634px art board by 42px. Lifting
 * the column by that much — scaled — keeps the wrist from being sliced off at
 * the fold.
 */
export const HERO_PHONE_BOTTOM_LIFT = Math.round(42 * HERO_PHONE_SCALE);
