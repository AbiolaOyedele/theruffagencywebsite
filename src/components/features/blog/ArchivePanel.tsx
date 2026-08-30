'use client';

import { useState } from 'react';
import { PostShelf } from '@/components/features/blog/PostShelf';
import { color, font, shape, weight } from '@/config/tokens';
import { blogPosts, blogSection } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { pageCount, pageOfPosts } from '@/types/content';

/**
 * The page last read, kept outside the component.
 *
 * Opening a post closes this panel and reopening it mounts a fresh one — so
 * without this, coming back from a post on page two lands on page one. It is
 * deliberately not persisted: a new visit starts at the top.
 */
let lastPage = 1;

const stepStyle = {
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
  cursor: 'pointer',
} as const;

/**
 * Every post, in the panel that opens over the page.
 *
 * The archive is a panel like every other surface on this site, so paging
 * through it is state rather than navigation — a link would close the panel it
 * lives in. `/blog/<slug>` is still a real page for anyone arriving from a
 * search; this is how the site itself reads.
 */
export function ArchivePanel() {
  const isMobile = useIsMobile();
  const [page, setPageState] = useState(lastPage);

  const setPage = (next: number): void => {
    lastPage = next;
    setPageState(next);
  };

  const total = pageCount(blogPosts.length);
  const posts = pageOfPosts(blogPosts, page);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 28 }}>
      <p
        style={{
          fontFamily: font.body,
          fontWeight: weight.light,
          fontSize: isMobile ? 16 : 18,
          lineHeight: 1.7,
          color: color.muted,
          margin: 0,
          maxWidth: 620,
        }}
      >
        {blogSection.indexIntro}
      </p>

      {posts.length === 0 ? (
        <p
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 16,
            color: color.muted,
            margin: 0,
          }}
        >
          {blogSection.empty}
        </p>
      ) : (
        <PostShelf posts={posts} />
      )}

      {total > 1 ? (
        <nav
          aria-label="Writing pages"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}
        >
          {page > 1 ? (
            <button type="button" onClick={() => setPage(page - 1)} style={stepStyle}>
              ← Newer
            </button>
          ) : null}

          {Array.from({ length: total }, (_, index) => index + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === page ? 'page' : undefined}
              style={
                n === page
                  ? { ...stepStyle, background: color.ink, color: color.white }
                  : stepStyle
              }
            >
              {n}
            </button>
          ))}

          {page < total ? (
            <button type="button" onClick={() => setPage(page + 1)} style={stepStyle}>
              Older →
            </button>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
