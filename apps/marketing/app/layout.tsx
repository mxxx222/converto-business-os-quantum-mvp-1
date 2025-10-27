import '../styles/globals.css';
import type { Metadata } from 'next';
import { defaultSEO } from '../lib/seo';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = defaultSEO;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-LIVALOWbQ1Cpkjh1mkLq1.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
              plausible.init()
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
