import { PostShelf } from '@/components/features/blog/PostShelf';
import { Pagination } from '@/components/features/blog/Pagination';
import { PageChrome } from '@/components/ui/PageChrome';
import { color, font, weight } from '@/config/tokens';
import { blogPosts, blogSection } from '@/content/site';
import { pageCount, pageOfPosts } from '@/types/content';

interface ArchiveViewProps {
  readonly page: number;
}

/**
 * The writing archive, one page of it.
 *
 * `/blog` and `/blog/page/<n>` render the same thing with a different page
 * number, so the two cannot drift apart.
 */
export function ArchiveView({ page }: ArchiveViewProps) {
  const posts = pageOfPosts(blogPosts, page);
  const total = pageCount(blogPosts.length);

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
          {total > 1 ? ` · Page ${page} of ${total}` : ''}
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

        {posts.length === 0 ? (
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
          <div style={{ margin: '48px 0 0' }}>
            <PostShelf posts={posts} />
            <Pagination page={page} total={total} />
          </div>
        )}
      </main>
    </PageChrome>
  );
}
