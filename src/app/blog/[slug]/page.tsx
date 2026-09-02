import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleReader } from '@/components/features/blog/ArticleReader';
import { publicEnv } from '@/config/env';
import { getContent } from '@/lib/content/resolve';
import type { BlogPost } from '@/types/content';

/** Every post is known at build time, so every post is a static file. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { blogPosts } = await getContent();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

async function findPost(slug: string): Promise<BlogPost | undefined> {
  const { blogPosts } = await getContent();
  return blogPosts.find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const [post, { brand }] = await Promise.all([findPost(slug), getContent()]);
  if (!post) return {};

  const url = `/blog/${post.slug}`;

  return {
    title: `${post.title} | ${brand.name}`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      siteName: brand.name,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const { blogPosts, brand } = await getContent();
  const index = blogPosts.findIndex((entry) => entry.slug === slug);
  const post = blogPosts[index];
  if (!post) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: post.author.name },
    publisher: { '@type': 'Organization', name: brand.name },
    mainEntityOfPage: `${publicEnv.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    articleSection: post.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled JSON-LD — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ArticleReader post={post} index={index} />
    </>
  );
}
