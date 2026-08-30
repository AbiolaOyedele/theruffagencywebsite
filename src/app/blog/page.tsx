import type { Metadata } from 'next';
import Link from 'next/link';
import { color, font, shape, weight } from '@/config/tokens';
import { blogPosts, blogSection, brand } from '@/content/site';
import { formatPostDate, readingMinutes } from '@/types/content';

export const metadata: Metadata = {
  title: `${blogSection.indexTitle} | ${brand.name}`,
  description: blogSection.indexIntro,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: `${blogSection.indexTitle} | ${brand.name}`,
    description: blogSection.indexIntro,
    siteName: brand.name,
  },
};

/**
 * The writing index.
 *
 * A real page rather than a section of the home page, so each post has an
 * address a search engine can send someone to. Newest first — `blogPosts` is
 * already kept in that order.
 */
export default function BlogIndexPage() {
  return (
    <main style={{ background: color.paperAlt, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px 96px' }}>
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

        <h1
          style={{
            fontFamily: font.display,
            fontWeight: weight.black,
            fontSize: 'clamp(40px, 7vw, 84px)',
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            color: color.ink,
            margin: '24px 0 0',
          }}
        >
          {blogSection.indexTitle}
        </h1>

        <p
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 18,
            lineHeight: 1.7,
            color: color.muted,
            margin: '20px 0 0',
            maxWidth: 560,
          }}
        >
          {blogSection.indexIntro}
        </p>

        {blogPosts.length === 0 ? (
          <p
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 16,
              color: color.muted,
              margin: '48px 0 0',
            }}
          >
            {blogSection.empty}
          </p>
        ) : (
          /* Auto-fill rather than a fixed column count: this is a server
             component with no viewport to read, and the grid does not need
             one — it is one column on a phone and two from about 700px up.
             The newest post spans the row, so the archive opens on something
             rather than on a wall of equal cards. */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
              margin: '56px 0 0',
              alignItems: 'stretch',
            }}
          >
            {blogPosts.map((post, index) => {
              const feature = index === 0;

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    gridColumn: feature ? '1 / -1' : 'auto',
                    background: post.accent,
                    border: shape.keyline,
                    borderRadius: 24,
                    boxShadow: shape.hardShadow,
                    padding: feature ? 32 : 26,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: font.sans,
                      fontWeight: weight.bold,
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: color.ink,
                      opacity: 0.7,
                    }}
                  >
                    {post.category} · {formatPostDate(post.publishedAt)} · {readingMinutes(post)} min
                  </span>

                  <h2
                    style={{
                      fontFamily: font.display,
                      fontWeight: weight.extrabold,
                      fontSize: feature ? 'clamp(26px, 4vw, 38px)' : 'clamp(20px, 3vw, 24px)',
                      lineHeight: 1.12,
                      letterSpacing: '-0.02em',
                      color: color.ink,
                      margin: 0,
                    }}
                  >
                    {post.title}
                  </h2>

                  <p
                    style={{
                      fontFamily: font.body,
                      fontWeight: weight.light,
                      fontSize: feature ? 17 : 15,
                      lineHeight: 1.6,
                      color: color.ink,
                      opacity: 0.75,
                      margin: 0,
                      maxWidth: feature ? 620 : undefined,
                    }}
                  >
                    {post.excerpt}
                  </p>

                  <span
                    style={{
                      marginTop: 'auto',
                      paddingTop: 12,
                      fontFamily: font.sans,
                      fontWeight: weight.bold,
                      fontSize: 14,
                      color: color.ink,
                    }}
                  >
                    {blogSection.cardCta} →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
