import Link from 'next/link';
import { color, font, shape, weight } from '@/config/tokens';

interface PaginationProps {
  readonly page: number;
  readonly total: number;
}

/** `/blog` is page one; the rest live under `/blog/page/<n>`. */
export function pageHref(page: number): string {
  return page <= 1 ? '/blog' : `/blog/page/${page}`;
}

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
  minWidth: 44,
  padding: '12px 20px',
  background: color.white,
  border: shape.keyline,
  borderRadius: 999,
  boxShadow: shape.hardShadowSmall,
  fontFamily: font.sans,
  fontWeight: weight.bold,
  fontSize: 14,
  color: color.ink,
  textDecoration: 'none',
} as const;

/**
 * Page links for the archive.
 *
 * Real links to real URLs rather than a swipe or a "load more" — each page has
 * to be somewhere a search engine can reach and a reader can send to someone
 * else. The current page is marked rather than linked.
 */
export function Pagination({ page, total }: PaginationProps) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Writing pages"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        margin: '40px 0 0',
      }}
    >
      {page > 1 ? (
        <Link href={pageHref(page - 1)} rel="prev" style={linkStyle}>
          ← Newer
        </Link>
      ) : null}

      {pages.map((n) =>
        n === page ? (
          <span
            key={n}
            aria-current="page"
            style={{ ...linkStyle, background: color.ink, color: color.white }}
          >
            {n}
          </span>
        ) : (
          <Link key={n} href={pageHref(n)} style={linkStyle}>
            {n}
          </Link>
        ),
      )}

      {page < total ? (
        <Link href={pageHref(page + 1)} rel="next" style={linkStyle}>
          Older →
        </Link>
      ) : null}
    </nav>
  );
}
