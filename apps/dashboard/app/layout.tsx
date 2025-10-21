import type { Metadata } from 'next'
import Providers from './providers'
import NotificationProvider from './providers/notifications'
import { ScoreProvider } from '../lib/score/context'
import dynamic from 'next/dynamic'
import { SWRegister } from '../components/sw-register'
import { UploadQueue } from '../components/UploadQueue'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import { OTELWebBoot } from '../components/otel-web'
import ThemeProvider from '../components/ThemeProvider'
import TopNav from './components/TopNav'
import Script from 'next/script'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const CoPilotDrawer = dynamic(() => import('../components/CoPilotDrawer'), { ssr: false })

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const space = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-space' })

export const metadata: Metadata = {
  title: 'Converto Business OS — Älykäs automaatio',
  description: 'Kuitit, laskutus ja verolaskenta — kaikki toimii itsestään.',
  openGraph: {
    title: 'Converto Business OS',
    description: 'Älykäs automaatio yrityksille.',
    images: ['/og-cover.png']
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className={`${inter.variable} ${space.variable}`}>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://cdn.vercel-insights.com" />
        <link rel="preconnect" href="https://cdn.converto.app" />
        <link rel="preconnect" href="https://assets.stripe.com" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-b from-[#0B0D11] to-[#111826] text-gray-100">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster richColors position="top-center" />
        <SWRegister />

        {/* Load analytics script after interactive */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE === 'true' && (
          <Script
            src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'}
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'converto.app'}
            strategy="afterInteractive"
          />
        )}
        {process.env.NEXT_PUBLIC_GA4 === 'true' && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');`}
            </Script>
          </>
        )}
        <Script
          src="https://cdn.vercel-insights.com/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
