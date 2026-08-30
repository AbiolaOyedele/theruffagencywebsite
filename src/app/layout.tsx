import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

const SITE_URL = 'https://theruff.agency';
const TITLE = 'The Ruff Agency | Your Dedicated Senior Product Designer';
const DESCRIPTION =
  'A dedicated senior product designer embedded in your team. Unlimited design requests, 4-day delivery, flexible subscription. Mobile apps, SaaS, websites and design systems for startups and scale-ups.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'product designer',
    'freelance designer',
    'design subscription',
    'UX design',
    'UI design',
    'mobile app design',
    'SaaS design',
    'website design',
    'design systems',
    'startup design',
    'scale-up design',
  ],
  authors: [{ name: 'The Ruff Agency' }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description:
      'A dedicated senior product designer embedded in your team. Unlimited design requests, 4-day delivery, flexible subscription. Pause or cancel anytime.',
    siteName: 'The Ruff Agency',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'A dedicated senior product designer embedded in your team. Unlimited design requests, 4-day delivery, flexible subscription. Pause or cancel anytime.',
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
  serviceType: 'Product Design',
  areaServed: 'Worldwide',
  priceRange: 'From 260€/day',
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
