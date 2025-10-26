import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Converto Business OS — Älykäs automaatio',
  description: 'Kuitit, laskutus ja verolaskenta — kaikki toimii itsestään.',
  openGraph: {
    title: 'Converto Business OS',
    description: 'Älykäs automaatio yrityksille.',
    images: ['/og-cover.png'],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body style={{ fontFamily: 'system-ui', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
