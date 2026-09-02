import Link from 'next/link';
import { PageChrome } from '@/components/ui/PageChrome';
import { cardAccent, color, font, primaryButton, shape, weight } from '@/config/tokens';
import { imageUrl } from '@/lib/images';
import { getContent } from '@/lib/content/resolve';
import { formatPostDate, readingMinutes, postHash, type BlogPost } from '@/types/content';

interface ArticleReaderProps {
  readonly post: BlogPost;
  /** The post's place in the archive, so the page keeps its card's ground. */
  readonly index: number;
}

/** Kept in step with `storyFromPost`, so both readings break in the same place. */
const GALLERY_AFTER_SECTION = 1;

/**
 * A post as a page of its own, at `/blog/<slug>`.
 *
 * The panel on the home page is the reading experience; this is the address.
 * It is a server component with the whole post in the HTML, so a search engine
 * or an AI crawler gets the writing without running any JavaScript — which the
 * panel, being opened by a hash, can never give them.
 */
export async function ArticleReader({ post, index }: ArticleReaderProps) {
  const { brand, blogSection } = await getContent();
  return (
    <PageChrome>
      <article>
      {/* Title block, on the post's own accent. */}
      <header
        style={{
          background: cardAccent(index),
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
        {post.sections.map((section, index) => (
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

            {/* The gallery breaks the reading up after the first beat, the
                same place the panel breaks it. */}
            {index === GALLERY_AFTER_SECTION && post.gallery?.length ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 32,
                  margin: '40px 0 0',
                }}
              >
                {post.gallery.map((item) => (
                  <figure key={item.src} style={{ margin: 0 }}>
                    <div
                      style={{
                        borderRadius: 18,
                        overflow: 'hidden',
                        border: shape.keyline,
                        boxShadow: shape.hardShadow,
                        background: color.paper,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- artwork of unknown intrinsic size */}
                      <img
                        src={imageUrl(item.src, 1200)}
                        alt={item.caption}
                        loading="lazy"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>
                    <figcaption
                      style={{
                        fontFamily: font.body,
                        fontWeight: weight.light,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: color.muted,
                        margin: '12px 0 0',
                      }}
                    >
                      {item.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
          </section>
        ))}

        {post.pullQuotes?.length ? (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {post.pullQuotes.map((quote) => (
              <blockquote
                key={quote.title}
                style={{
                  background: color.ink,
                  borderRadius: 20,
                  padding: 28,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <p
                  style={{
                    fontFamily: font.sans,
                    fontWeight: weight.bold,
                    fontSize: 20,
                    lineHeight: 1.2,
                    color: color.white,
                    margin: 0,
                  }}
                >
                  {quote.title}
                </p>
                <p
                  style={{
                    fontFamily: font.body,
                    fontWeight: weight.light,
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0,
                  }}
                >
                  {quote.request}
                </p>
              </blockquote>
            ))}
          </section>
        ) : null}

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
    </PageChrome>
  );
}
