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
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px 96px' }}>
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              margin: '56px 0 0',
            }}
          >
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  background: post.accent,
                  border: shape.keyline,
                  borderRadius: 24,
                  boxShadow: shape.hardShadow,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
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
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    lineHeight: 1.15,
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
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: color.ink,
                    opacity: 0.75,
                    margin: 0,
                  }}
                >
                  {post.excerpt}
                </p>

                <span
                  style={{
                    fontFamily: font.sans,
                    fontWeight: weight.bold,
                    fontSize: 14,
                    color: color.ink,
                  }}
                >
                  {blogSection.cardCta} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
