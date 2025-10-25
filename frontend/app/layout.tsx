import "./globals.css";
import Providers from "./providers";
import { poppins, openSans } from "./fonts";

export const metadata = {
  metadataBase: new URL('https://converto.fi'),
  title: "Converto — Älykäs automaatio",
  description: "Vähennä manuaalia, nopeuta laskutusta ja seuraa tuloksia hallintapaneelissa.",
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: "Converto Business OS",
    description: "Automaatio, joka kasvattaa kassavirtaa.",
    images: ["/api/og"],
  },
  manifest: "/site.webmanifest",
  themeColor: "#1565EA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" suppressHydrationWarning>
      <body className={`${poppins.variable} ${openSans.variable}`}>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').catch(function (err) {
                  console.debug('Service worker registration failed', err);
                });
              });
            }
          `,
          }}
        />
      </body>
    </html>
  );
}
