import { color } from '@/config/tokens';
import { SERVICE_STEPS } from '@/config/tokens';

interface StepIndicatorProps {
  readonly activeIndex: number;
  /** Slightly smaller dots, used inside the narrow mobile pill. */
  readonly compact?: boolean;
}

/** Five-dot progress stepper; the active dot stretches into a pill. */
export function StepIndicator({ activeIndex, compact = false }: StepIndicatorProps) {
  const size = compact ? 7 : 8;
  const activeWidth = compact ? 24 : 28;

  return (
    <div
      role="progressbar"
      aria-label="Services progress"
      aria-valuemin={1}
      aria-valuemax={SERVICE_STEPS}
      aria-valuenow={activeIndex + 1}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 6 : 7,
        padding: compact ? '0 4px' : '0 10px',
      }}
    >
      {Array.from({ length: SERVICE_STEPS }, (_unused, index) => (
        <span
          key={index}
          style={{
            height: size,
            flexShrink: 0,
            width: index === activeIndex ? activeWidth : size,
            borderRadius: 4,
            background: index === activeIndex ? color.inkNavy : `${color.inkNavy}40`,
            transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1), background 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
