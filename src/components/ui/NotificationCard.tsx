import type { CSSProperties } from 'react';
import { LOGO_ASPECT, RuffLogo } from '@/components/ui/RuffLogo';
import { NOTIFICATION_CARD } from '@/config/heroLayout';
import { color, font, shape, weight } from '@/config/tokens';
import { hero } from '@/content/site';

interface NotificationHeaderProps {
  /** Multiplies every dimension, so one set of proportions serves any size. */
  readonly scale?: number;
}

/**
 * The delivery notification's header row: brand chip, eyebrow, title.
 *
 * Shared by the notification inside the phone and the free-floating cards the
 * intro deals out before it, so the two can never drift apart.
 */
export function NotificationHeader({ scale = 1 }: NotificationHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 9 * scale,
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          // Pink, not red: red is reserved for buttons, and the wordmark's
          // white letterforms would vanish on a white chip.
          background: color.accentPink,
          borderRadius: 10 * scale,
          width: 44 * scale,
          height: 44 * scale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <RuffLogo
          style={{ width: 34 * scale, height: (34 * scale) / LOGO_ASPECT.wordmark }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 * scale }}>
        <span
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 7 * scale,
            color: color.muted,
            lineHeight: 1.6,
          }}
        >
          {hero.notification.eyebrow}
        </span>
        <span
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 10.5 * scale,
            color: color.ink,
            lineHeight: 1.35,
          }}
        >
          {hero.notification.title}
        </span>
      </div>
    </div>
  );
}

interface NotificationCardProps {
  /** How much larger than the in-phone card this one paints. */
  readonly scale?: number;
  readonly style?: CSSProperties | undefined;
}

/**
 * A free-floating notification. The intro deals two of these out before the
 * third arrives inside the phone.
 *
 * This is the phone's own card at its collapsed size, simply painted larger —
 * same width, same padding, same line wrap — so the three read as one object
 * rather than three cards of drifting sizes. Only the shadow is added, since
 * these two have no phone behind them to sit against.
 */
export function NotificationCard({ scale = 2.2, style }: NotificationCardProps) {
  const { width, collapsedHeight, padding, borderWidth, radius } = NOTIFICATION_CARD;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', ...style }}>
      <div
        style={{
          width,
          height: collapsedHeight,
          background: color.white,
          borderRadius: radius,
          border: `${borderWidth}px solid ${color.ink}`,
          boxShadow: shape.hardShadow,
          padding,
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <NotificationHeader />
      </div>
    </div>
  );
}
