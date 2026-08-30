import type { ReactNode } from 'react';
import { font } from '@/config/tokens';

interface AccentWordProps {
  readonly children: ReactNode;
}

/**
 * A single word inside a display headline, set in the Didone italic.
 *
 * The brand's signature typographic device: one word breaks out of the heavy
 * geometric sans into an elegant serif italic. Use it once per headline —
 * twice and it stops reading as an accent.
 */
export function AccentWord({ children }: AccentWordProps) {
  return (
    <em
      style={{
        fontFamily: font.accent,
        fontStyle: 'italic',
        fontWeight: 600,
        // The serif runs small next to the sans at the same size.
        fontSize: '1.08em',
        letterSpacing: '0.005em',
      }}
    >
      {children}
    </em>
  );
}
