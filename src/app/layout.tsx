import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

const SITE_URL = 'https://theruff.agency';
const TITLE = 'The Ruff Agency | Brand Strategy & Creative Studio, Lagos';
const DESCRIPTION =
  'A remote creative studio in Lagos building brand strategy, identity, motion, and social content for startups and growing brands worldwide.';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SHARE_DESCRIPTION,
  },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
