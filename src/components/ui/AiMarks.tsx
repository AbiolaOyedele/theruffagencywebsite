import type { CSSProperties } from 'react';

/**
 * Marks for the assistants this flow is meant to be used with.
 *
 * NOTE: these are hand-drawn approximations, not the official artwork. They are
 * here so the block reads correctly at a glance; swap in the vendors' own SVGs
 * from their brand pages before launch, and keep them to the size and clear
 * space those pages specify. Both are trademarks of their owners and are used
 * here only to say which tools the flow works with.
 */

interface MarkProps {
  readonly size?: number;
  readonly style?: CSSProperties | undefined;
}

/** Claude's radiating asterisk. */
export function ClaudeMark({ size = 20, style }: MarkProps) {
  // Twelve tapered rays: thick at the hub, pointed at the tip.
  const rays = Array.from({ length: 12 }, (_unused, index) => {
    const angle = (index * 360) / 12;
    return (
      <path
        key={angle}
        d="M12 12 L11.05 5.2 Q12 2.6 12.95 5.2 Z"
        transform={`rotate(${angle} 12 12)`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      role="img"
      aria-label="Claude"
      style={style}
    >
      {rays}
    </svg>
  );
}

/** OpenAI's interlocking knot, approximated as six linked lobes. */
export function OpenAiMark({ size = 20, style }: MarkProps) {
  const lobes = Array.from({ length: 6 }, (_unused, index) => {
    const angle = (index * 360) / 6;
    return (
      <path
        key={angle}
        d="M12 3.4 A5 5 0 0 1 16.4 5.9 A5 5 0 0 1 16.3 11"
        transform={`rotate(${angle} 12 12)`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="ChatGPT"
      style={style}
    >
      {lobes}
    </svg>
  );
}
