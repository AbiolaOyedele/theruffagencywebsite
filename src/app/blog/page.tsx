import type { Metadata } from 'next';
import Link from 'next/link';
import { PageChrome } from '@/components/ui/PageChrome';
import { cardAccent, color, font, shape, weight } from '@/config/tokens';
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
 * The writing archive.
 *
 * A real page rather than a section of the home page, so each post has an
 * address a search engine can send someone to. Newest first — `blogPosts` is
 * already kept in that order — laid out as a bento so ten posts read as an
 * arrangement rather than a stack. Tile sizes come from `.bento` in
 * globals.css; grounds come from position, so no two neighbours share one.
 */
export default function BlogIndexPage() {
  return (
    <PageChrome>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px 88px' }}>
        <p
          style={{
            fontFamily: font.sans,
            fontWeight: weight.bold,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: color.muted,
            margin: '0 0 16px',
          }}
        >
          {blogSection.eyebrow}
        </p>

        <h1
          style={{
            fontFamily: font.display,
            fontWeight: weight.black,
            fontSize: 'clamp(44px, 8vw, 92px)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: color.ink,
            margin: 0,
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
          <div className="bento" style={{ margin: '48px 0 0' }}>
            {blogPosts.map((post, index) => {
              // The opener of each run of six gets the room for a bigger
              // headline; the rest are set to sit comfortably in a half tile.
              const lead = index % 6 === 0;

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    background: cardAccent(index),
                    border: shape.keyline,
                    borderRadius: 24,
                    boxShadow: shape.hardShadow,
                    padding: lead ? 30 : 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    textDecoration: 'none',
                    minHeight: 190,
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
                    {post.category} · {formatPostDate(post.publishedAt)}
                  </span>

                  <h2
                    style={{
                      fontFamily: font.display,
                      fontWeight: weight.extrabold,
                      fontSize: lead ? 'clamp(24px, 3.4vw, 34px)' : 'clamp(19px, 2.2vw, 23px)',
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
                      fontSize: lead ? 16 : 14,
                      lineHeight: 1.55,
                      color: color.ink,
                      opacity: 0.75,
                      margin: 0,
                      maxWidth: 560,
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
                      fontSize: 13,
                      color: color.ink,
                    }}
                  >
                    {blogSection.cardCta} → <span style={{ opacity: 0.6 }}>{readingMinutes(post)} min</span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </PageChrome>
  );
}
