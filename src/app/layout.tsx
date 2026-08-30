import type { Metadata, Viewport } from 'next';
import { faq } from '@/content/site';
import '@/styles/globals.css';

const SITE_URL = 'https://theruff.agency';
const TITLE = 'The Ruff Agency | Brand Strategy & Creative Studio, Lagos';
const DESCRIPTION =
  'A remote creative studio in Lagos building brand strategy, identity, motion, and social content for startups and growing brands worldwide.';

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

/** Shorter, punchier variant for link previews. */
const SHARE_DESCRIPTION =
  'Brand strategy, creative direction, motion, and social content, built remotely from Lagos for startups and growing brands worldwide.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'brand strategy agency Lagos',
    'creative director Lagos',
    'brand identity Nigeria',
    'remote creative studio',
    'brand strategist for startups',
    'creative studio for startups',
    'motion design studio',
    'social media content strategy',
  ],
  authors: [{ name: 'The Ruff Agency' }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: SHARE_DESCRIPTION,
    siteName: 'The Ruff Agency',
    locale: 'en_US',
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SHARE_DESCRIPTION,
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f0e9e5',
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'The Ruff Agency',
  url: SITE_URL,
  description: DESCRIPTION,
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
const FAQ_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
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
        <script
          type="application/ld+json"
          // Static, author-controlled JSON-LD — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_STRUCTURED_DATA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
