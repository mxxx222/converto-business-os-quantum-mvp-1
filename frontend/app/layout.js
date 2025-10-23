import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Converto Business OS — Automaatio, joka maksaa itsensä takaisin',
  description: 'Älykäs automaatioalusta yrityksille. Yhdistä talous, myynti ja operointi yhteen näkymään.',
  metadataBase: new URL('https://converto.fi'),
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Converto Business OS',
    description: 'Automaatio, joka maksaa itsensä takaisin.',
    url: 'https://converto.fi',
    siteName: 'Converto',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Converto Business OS',
    description: 'Automaatio, joka maksaa itsensä takaisin.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  return (
    <html lang="fi">
      <body className={inter.className}>
        {children}
        {/* GTM/GTAG loader */}
        {GA_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
