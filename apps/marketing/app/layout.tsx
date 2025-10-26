import '../styles/globals.css';
import type { Metadata } from 'next';
import { defaultSEO } from '../lib/seo';

export const metadata: Metadata = defaultSEO;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
