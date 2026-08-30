import type { CSSProperties } from 'react';
import { LOGO_ASPECT, RuffLogo } from '@/components/ui/RuffLogo';
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
  readonly scale?: number;
  readonly style?: CSSProperties | undefined;
}

/**
 * A free-floating notification, panelled in the brand's keyline-and-shadow
 * shape language. The intro deals two of these out before the phone arrives.
 */
export function NotificationCard({ scale = 2.2, style }: NotificationCardProps) {
  return (
    <div
      style={{
        background: color.white,
        borderRadius: 18 * (scale / 2.2),
        border: shape.keyline,
        boxShadow: shape.hardShadow,
        padding: `${14 * (scale / 2.2)}px ${20 * (scale / 2.2)}px`,
        display: 'inline-flex',
        ...style,
      }}
    >
      <NotificationHeader scale={scale} />
    </div>
  );
}
