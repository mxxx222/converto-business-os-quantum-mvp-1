import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Converto Business OS - Automaatio yrityksellesi',
  description: 'Automatisoi yrityksesi Converto Business OS:lla. OCR-kuittien käsittely, ALV-laskelmat, lakisäädäntöjen seuranta ja paljon muuta. Aloita ilmaiseksi.',
  keywords: 'automaatio, yritys, OCR, ALV, laskutus, Suomi, business os, converto',
  authors: [{ name: 'Converto Business OS' }],
  creator: 'Converto Business OS',
  publisher: 'Converto Business OS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://converto.fi'),
  alternates: {
    canonical: '/',
    languages: {
      'fi-FI': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Converto Business OS - Automaatio yrityksellesi',
    description: 'Automatisoi yrityksesi Converto Business OS:lla. OCR-kuittien käsittely, ALV-laskelmat, lakisäädäntöjen seuranta ja paljon muuta.',
    url: 'https://converto.fi',
    siteName: 'Converto Business OS',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Converto Business OS - Automaatio yrityksellesi',
      },
    ],
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Converto Business OS - Automaatio yrityksellesi',
    description: 'Automatisoi yrityksesi Converto Business OS:lla. OCR-kuittien käsittely, ALV-laskelmat, lakisäädäntöjen seuranta.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="fi">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Converto" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.converto.fi" />
        <link rel="preconnect" href="https://calendly.com" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//resend.com" />
        <link rel="dns-prefetch" href="//plausible.io" />

        {/* Privacy-friendly analytics by Plausible - OPTIMIZED */}
        <script async src="https://plausible.io/js/pa-LIVALOWbQ1Cpkjh1mkLq1.js" data-domain="converto.fi"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
              plausible.init()
              
              // OPTIMIZED: Track outbound links automatically
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.href && !link.href.startsWith(window.location.origin)) {
                  plausible('Outbound Link Click', {
                    props: {
                      url: link.href,
                      text: link.textContent?.substring(0, 50),
                    }
                  });
                }
              });
              
              // OPTIMIZED: Track file downloads
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.download) {
                  plausible('File Download', {
                    props: {
                      filename: link.download,
                      url: link.href,
                    }
                  });
                }
              });
            `,
          }}
        />

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Conversion Tracking Helper */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.trackConversion = function(eventName, params) {
                if (window.gtag) {
                  gtag('event', eventName, params);
                }
                if (window.plausible) {
                  plausible(eventName, { props: params });
                }
              };
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                  CONVERTO
                </a>
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/dashboard"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  {process.env.NODE_ENV !== 'production' && (
                    <a
                      href="/storybrand/totals"
                      className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dev-link"
                    >
                      Totals
                    </a>
                  )}
                  <a
                    href="/receipts"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Kuitit
                  </a>
                  <a
                    href="/receipts/list"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Lista
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((reg) => console.log('Service Worker registered:', reg))
                    .catch((err) => console.log('Service Worker registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
