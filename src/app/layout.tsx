import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { ContentProvider } from '@/components/providers/ContentProvider';
import { TrafficBeacon } from '@/components/providers/TrafficBeacon';
import { getContent, getContentOverrides } from '@/lib/content/resolve';
import { buildTokenCss, getDesignTokens } from '@/lib/design/resolve';
import { publicEnv } from '@/config/env';
import '@/styles/globals.css';

const SITE_URL = publicEnv.NEXT_PUBLIC_SITE_URL;

/**
 * The link-preview card. 1200×630, the size every platform crops to.
 * Regenerate from `scripts/og-image.mjs` if the wordmark or the line changes.
 */
const SHARE_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'The Ruff Agency — brand strategy and creative direction',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const { seo, brand } = await getContent();

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    keywords: [...seo.keywords],
    authors: [{ name: brand.name }],
    alternates: { canonical: '/' },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: SITE_URL,
      title: seo.title,
      description: seo.shareDescription,
      siteName: brand.name,
      locale: 'en_US',
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.shareDescription,
      images: [SHARE_IMAGE.url],
    },
    icons: {
      icon: [
        { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}

/** The browser chrome takes the page's own paper colour, override included. */
export async function generateViewport(): Promise<Viewport> {
  const tokens = await getDesignTokens();
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: tokens['color.paper'] ?? '#f0e9e5',
  };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  // Read once here and hand down, rather than each consumer resolving its own:
  // both are cached and tagged, so a save in the panel invalidates them
  // together and the page and its metadata cannot disagree.
  const [overrides, tokens, content] = await Promise.all([
    getContentOverrides(),
    getDesignTokens(),
    getContent(),
  ]);

  const tokenCss = buildTokenCss(tokens);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: content.brand.name,
    url: SITE_URL,
    description: content.seo.description,
    serviceType: 'Brand Strategy and Creative Direction',
    areaServed: 'Worldwide',
    address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
    priceRange: 'From ₦150,000',
  };

  /**
   * The FAQ, marked up so a search engine can answer the question in the result
   * rather than only linking to it. The answers are already on the page — this
   * says which text answers which question.
   */
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/AwesomeSerif-Bold.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Milligram-Light.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/Milligram-Bold.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/assets/105e7cd3a106296d90d081af3766923516632143.webp"
        />
        {/* Only the tokens the studio has changed. Empty until one is. */}
        {tokenCss ? <style dangerouslySetInnerHTML={{ __html: tokenCss }} /> : null}
        <script
          type="application/ld+json"
          // Static, author-controlled JSON-LD — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      </head>
      <body>
        <ContentProvider overrides={overrides}>{children}</ContentProvider>
        {/* Reads search params, so it is suspended rather than opting the
            whole tree into dynamic rendering. */}
        <Suspense fallback={null}>
          <TrafficBeacon />
        </Suspense>
      </body>
    </html>
  );
}
