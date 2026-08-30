import Link from 'next/link';
import { color, font, primaryButton, shape, weight } from '@/config/tokens';
import { brand, blogSection } from '@/content/site';
import { formatPostDate, readingMinutes, postHash, type BlogPost } from '@/types/content';

interface ArticleReaderProps {
  readonly post: BlogPost;
}

/**
 * A post as a page of its own, at `/blog/<slug>`.
 *
 * The panel on the home page is the reading experience; this is the address.
 * It is a server component with the whole post in the HTML, so a search engine
 * or an AI crawler gets the writing without running any JavaScript — which the
 * panel, being opened by a hash, can never give them.
 */
export function ArticleReader({ post }: ArticleReaderProps) {
  return (
    <article style={{ background: color.paperAlt, minHeight: '100vh' }}>
      {/* Title block, on the post's own accent. */}
      <header
        style={{
          background: post.accent,
          borderBottom: shape.keyline,
          padding: '40px 20px 56px',
        }}
      >
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <Link
            href="/blog"
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
            ← {blogSection.indexTitle}
          </Link>

          <p
            style={{
              fontFamily: font.sans,
              fontWeight: weight.bold,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: color.ink,
              opacity: 0.7,
              margin: '20px 0 12px',
            }}
          >
            {post.category} · {formatPostDate(post.publishedAt)} · {readingMinutes(post)} min read
          </p>

          <h1
            style={{
              fontFamily: font.display,
              fontWeight: weight.black,
              fontSize: 'clamp(30px, 5vw, 54px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: color.ink,
              margin: 0,
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 18,
              lineHeight: 1.65,
              color: color.ink,
              opacity: 0.8,
              margin: '20px 0 0',
              maxWidth: 640,
            }}
          >
            {post.excerpt}
          </p>

          {post.draft ? (
            <p
              style={{
                display: 'inline-block',
                fontFamily: font.sans,
                fontWeight: weight.bold,
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: color.ink,
                background: color.white,
                border: shape.keyline,
                borderRadius: 999,
                padding: '7px 14px',
                margin: '24px 0 0',
              }}
            >
              Draft — not signed off yet
            </p>
          ) : null}
        </div>
      </header>

      <div
        style={{
          maxWidth: 780,
          margin: '0 auto',
          padding: '56px 20px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2
              style={{
                fontFamily: font.display,
                fontWeight: weight.extrabold,
                fontSize: 'clamp(22px, 3vw, 28px)',
                letterSpacing: '-0.02em',
                color: color.ink,
                margin: '0 0 16px',
              }}
            >
              {section.heading}
            </h2>
            <p
              style={{
                fontFamily: font.body,
                fontWeight: weight.light,
                fontSize: 17,
                lineHeight: 1.8,
                color: color.muted,
                margin: 0,
              }}
            >
              {section.body}
            </p>
          </section>
        ))}

        <footer
          style={{
            background: color.white,
            border: shape.keyline,
            borderRadius: 24,
            boxShadow: shape.hardShadow,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'flex-start',
          }}
        >
          <p
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 15,
              lineHeight: 1.6,
              color: color.muted,
              margin: 0,
            }}
          >
            Written by <strong style={{ fontFamily: font.sans, color: color.ink }}>
              {post.author.name}
            </strong>{' '}
            · {post.author.role}
          </p>

          <a href={brand.ctaHref} style={{ ...primaryButton, padding: '16px 28px', fontSize: 15 }}>
            {brand.ctaLabel} →
          </a>

          <Link
            href={`/#${postHash(post.slug)}`}
            style={{
              fontFamily: font.sans,
              fontWeight: weight.bold,
              fontSize: 14,
              color: color.ink,
              textDecoration: 'underline',
              textUnderlineOffset: 4,
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
            }}
          >
            Read this on the site
          </Link>
        </footer>
      </div>
    </article>
  );
}
