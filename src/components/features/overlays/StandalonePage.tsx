import Link from 'next/link';
import { color, font, shape, weight } from '@/config/tokens';
import { brand } from '@/content/site';

interface StandalonePageProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly children: React.ReactNode;
  /** Widened for the surfaces that carry a form beside a rail. */
  readonly maxWidth?: number;
}

/**
 * A panel's content, as a page of its own.
 *
 * The panels that open over the home page are hashes, and a hash is not an
 * address — a crawler cannot reach one, and a search result cannot point at
 * one. So contact and careers each have a real URL that server-renders the
 * same component the panel does. One source of copy, two ways in.
 */
export function StandalonePage({
  eyebrow,
  title,
  children,
  maxWidth = 1120,
}: StandalonePageProps) {
  return (
    <main style={{ background: color.paperAlt, minHeight: '100vh' }}>
      <div style={{ maxWidth, margin: '0 auto', padding: '40px 20px 96px' }}>
        <Link
          href="/"
          style={{
            fontFamily: font.sans,
            fontWeight: weight.bold,
            fontSize: 14,
            color: color.ink,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 44,
          }}
        >
          ← {brand.shortName}
        </Link>

        <p
          style={{
            fontFamily: font.sans,
            fontWeight: weight.bold,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: color.muted,
            margin: '20px 0 12px',
          }}
        >
          {eyebrow}
        </p>

        <h1
          style={{
            fontFamily: font.display,
            fontWeight: weight.black,
            fontSize: 'clamp(38px, 6vw, 76px)',
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            color: color.ink,
            margin: '0 0 32px',
          }}
        >
          {title}
        </h1>

        <div
          style={{
            background: color.paperAlt,
            borderTop: shape.keyline,
            paddingTop: 32,
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
