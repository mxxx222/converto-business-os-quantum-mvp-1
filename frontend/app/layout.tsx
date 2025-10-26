import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Converto Dashboard',
  description: 'Koneluettava dashboard Vercelissa, yhdistetty Render-taustaan.',
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
