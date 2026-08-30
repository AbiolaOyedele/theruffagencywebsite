import type { CSSProperties } from 'react';
import { color, font } from '@/config/tokens';

/**
 * Geometry shared by the hero and the intro sequence.
 *
 * The intro's phone has to land exactly where the hero's phone sits, or the
 * handover snaps. These values are the contract between the two — change them
 * here, never in one component alone.
 */

/** Intrinsic size of the phone mockup's coordinate space. */
export const PHONE_STAGE_WIDTH = 891;
export const PHONE_STAGE_HEIGHT = 634;

/**
 * The hand photo is taller than the art board and hangs over both its edges,
 * so the painted composition is bigger than the box that lays it out.
 */
const BOARD_OVERHANG_TOP = 31;
const BOARD_OVERHANG_BOTTOM = 42;

/**
 * The delivery notification's card, in art-board pixels.
 *
 * The intro deals two of these out loose and the third arrives inside the
 * phone, so all three have to be cut from the same box — otherwise the last
 * one lands a different size from the pair before it.
 */
export const NOTIFICATION_CARD = {
  width: 211,
  collapsedHeight: 62,
  expandedHeight: 442,
  padding: 6,
  borderWidth: 1.5,
  radius: 17,
} as const;

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
 * How far the painted composition rises above the column's content box.
 *
 * The scale is anchored bottom-centre, so growing the board pushes its top out
 * by the extra height, and the photo's own overhang sits above even that. The
 * column crops the hands horizontally, so it has to clip — this is how much
 * headroom it needs before that clip starts eating the phone.
 */
export const HERO_PHONE_OVERFLOW_TOP = Math.ceil(
  PHONE_STAGE_HEIGHT * (HERO_PHONE_SCALE - 1) + BOARD_OVERHANG_TOP * HERO_PHONE_SCALE,
);

/** How far the photo hangs below the column's content box, once scaled. */
export const HERO_PHONE_BOTTOM_LIFT = Math.round(BOARD_OVERHANG_BOTTOM * HERO_PHONE_SCALE);

/**
 * The column the phone composition sits in.
 *
 * Padding opens the clip window out to the full painted extent so neither the
 * phone's top nor the wrist below it is sliced, and a matching negative top
 * margin hands that space back to the layout — the column still occupies
 * exactly the room it did before, it just stops cropping.
 */
export function heroPhoneColumn(isMobile: boolean): CSSProperties {
  if (isMobile) {
    return {
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'visible',
    };
  }

  return {
    flex: '0 0 auto',
    width: HERO_PHONE_WINDOW,
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'flex-end',
    paddingTop: HERO_PHONE_OVERFLOW_TOP,
    paddingBottom: HERO_PHONE_BOTTOM_LIFT,
    marginTop: -HERO_PHONE_OVERFLOW_TOP,
    marginBottom: 0,
  };
}

/**
 * The copy column beside the phone.
 *
 * The intro paints its own copy over the hero's and then retires, so any
 * difference in width or type size reads as the whole block snapping to a new
 * size the moment the overlay leaves. These three are why they cannot drift.
 */
export function heroCopyColumn(isMobile: boolean): CSSProperties {
  return {
    textAlign: isMobile ? 'center' : 'left',
    padding: isMobile ? '24px 20px 0' : 0,
    maxWidth: isMobile ? 440 : 780,
    ...(isMobile ? {} : { flex: '1 1 auto' }),
  };
}

export function heroHeadlineStyle(isMobile: boolean): CSSProperties {
  return {
    fontFamily: font.display,
    fontWeight: 900,
    fontSize: isMobile ? 38 : 'clamp(52px, 6.6vw, 100px)',
    lineHeight: isMobile ? '44px' : 1.06,
    letterSpacing: isMobile ? '-0.72px' : '-0.02em',
    color: color.inkHeading,
    margin: 0,
    WebkitFontSmoothing: 'antialiased',
    fontFeatureSettings: '"calt" 0, "liga" 0, "dlig" 0, "clig" 0',
  };
}

export function heroSubheadStyle(isMobile: boolean): CSSProperties {
  return {
    fontFamily: font.sans,
    fontWeight: 700,
    // Scales with the column so the line never has to wrap. A wrap here would
    // change the block's height every time the rotating word does.
    fontSize: isMobile ? 18 : 'clamp(15px, 1.45vw, 21px)',
    lineHeight: isMobile ? '28px' : 1.45,
    letterSpacing: '-0.24px',
    color: color.inkHeading,
    margin: '20px 0 0',
    whiteSpace: isMobile ? 'normal' : 'nowrap',
  };
}
