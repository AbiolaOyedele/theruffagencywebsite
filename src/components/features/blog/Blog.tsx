'use client';

import Link from 'next/link';
import { BlogCard } from '@/components/features/blog/BlogCard';
import { AccentWord } from '@/components/ui/AccentWord';
import { color, font, shape, weight } from '@/config/tokens';
import { blogPosts, blogSection } from '@/content/site';
import { useIsCompact } from '@/hooks/useIsCompact';
import { useIsMobile } from '@/hooks/useIsMobile';
import { postHash } from '@/types/content';

/**
 * How many posts the home page carries.
 *
 * The section is a shelf, not an archive: three keeps it to one row on a
 * desktop and stops the writing swallowing the page as the list grows. The
 * rest live at /blog, which is the archive.
 */
const FEATURED = 3;

interface BlogProps {
  /** Opens a post in the reading panel, growing out of the card pressed. */
  readonly onOpenPost: (hash: string, fromRect: DOMRect) => void;
}

/**
 * "How we think about it" — the writing shelf.
 *
 * Sits on paper between the dark work section and pricing, so the page gets a
 * breath of light between two heavy blocks. A post opens in the same panel a
 * client story does.
 */
export function Blog({ onOpenPost }: BlogProps) {
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();

  const featured = blogPosts.slice(0, FEATURED);
  const rest = blogPosts.length - featured.length;

  if (featured.length === 0) return null;

  return (
    <section
      id="writing"
      data-section="writing"
      style={{
        background: color.paper,
        padding: isMobile ? '72px 20px 80px' : '120px 40px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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

        <div
          style={{
            display: 'flex',
            flexDirection: isCompact ? 'column' : 'row',
            alignItems: isCompact ? 'flex-start' : 'flex-end',
            justifyContent: 'space-between',
            gap: isMobile ? 20 : 32,
          }}
        >
          <h2
            style={{
              fontFamily: font.display,
              fontWeight: weight.black,
              fontSize: isMobile ? 40 : 'clamp(48px, 6vw, 82px)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
              color: color.ink,
              margin: 0,
              maxWidth: 720,
            }}
          >
            {blogSection.headline[0]}
            <br />
            <AccentWord>{blogSection.accentWord}</AccentWord> about it.
          </h2>

          <p
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: isMobile ? 16 : 18,
              lineHeight: 1.65,
              color: color.muted,
              margin: 0,
              maxWidth: 380,
            }}
          >
            {blogSection.intro}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : isCompact
                ? 'repeat(2, minmax(0, 1fr))'
                : 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? 20 : 24,
            marginTop: isMobile ? 40 : 64,
            alignItems: 'stretch',
          }}
        >
          {featured.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              onOpen={(fromRect) => onOpenPost(postHash(post.slug), fromRect)}
            />
          ))}
        </div>

        {/* Only worth showing once there is something the shelf is not showing. */}
        {rest > 0 ? (
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: isMobile ? 28 : 40,
              minHeight: 44,
              padding: '16px 28px',
              background: color.white,
              border: shape.keyline,
              borderRadius: 999,
              boxShadow: shape.hardShadowSmall,
              fontFamily: font.sans,
              fontWeight: weight.bold,
              fontSize: 15,
              color: color.ink,
              textDecoration: 'none',
            }}
          >
            {blogSection.allCta} ({blogPosts.length}) →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
