import type { Metadata } from 'next';

export const defaultSEO: Metadata = {
  title: 'CONVERTO™ — Business OS',
  description: 'Nopea, modulaarinen ja näyttävä markkinointisivu.',
  openGraph: {
    title: 'CONVERTO™ — Business OS',
    description: 'Nopea, modulaarinen ja näyttävä markkinointisivu.',
    url: 'https://converto.fi',
    siteName: 'CONVERTO',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};
