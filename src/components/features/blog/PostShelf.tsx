'use client';

import Link from 'next/link';
import { CARD_ACCENTS, color, font, shape, weight } from '@/config/tokens';
import { openStory } from '@/hooks/useStoryRoute';
import {
  formatPostDate,
  postHash,
  readingMinutes,
  shelfAccents,
  tileRoles,
  type BlogPost,
} from '@/types/content';
import { useContent } from '@/components/providers/ContentProvider';

interface PostShelfProps {
  readonly posts: readonly BlogPost[];
}

/**
 * One page of the archive.
 *
 * The arrangement comes from `tileRoles`, which adapts to how many posts there
 * are — the shapes are in `.shelf`, the decision is here.
 *
 * Each card is a real link to the post's own page, so a crawler can follow it
 * and a reader can copy it, but a click opens the post in the reading panel
 * instead — growing out of the card pressed, the same as a client story, and
 * coming back here when it closes. Same writing either way.
 */
export function PostShelf({ posts }: PostShelfProps) {
  const { blogSection } = useContent();
  const roles = tileRoles(posts.length);
  const accents = shelfAccents(roles, CARD_ACCENTS.length);

  return (
    <div className="shelf">
      {posts.map((post, index) => {
        const role = roles[index] ?? 'half';
        // The opener and any full-width card carry a larger headline; the
        // half-width ones are set to sit comfortably in a narrower column.
        const large = role === 'lead' || role === 'leadRight' || role === 'wide';

        return (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            onClick={(event) => {
              // Let the browser handle anything that is not a plain click —
              // a new tab, a saved link, a middle click.
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
              event.preventDefault();
              openStory(postHash(post.slug), {
                fromRect: event.currentTarget.getBoundingClientRect(),
                // Closing the post comes back here rather than dropping to the
                // page underneath — this is where the reader was.
                returnTo: 'blog',
              });
            }}
            data-tile={role}
            style={{
              background: CARD_ACCENTS[accents[index] ?? 0],
              border: shape.keyline,
              borderRadius: 24,
              boxShadow: shape.hardShadow,
              padding: large ? 30 : 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              textDecoration: 'none',
              minHeight: role === 'lead' || role === 'leadRight' ? 300 : 190,
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
                fontSize: large ? 'clamp(23px, 3vw, 31px)' : 'clamp(19px, 2.2vw, 24px)',
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
                fontSize: large ? 16 : 15,
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
                paddingTop: 14,
                fontFamily: font.sans,
                fontWeight: weight.bold,
                fontSize: 13,
                color: color.ink,
              }}
            >
              {blogSection.cardCta} →{' '}
              <span style={{ opacity: 0.6 }}>{readingMinutes(post)} min</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
