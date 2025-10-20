import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CommandPalette } from "@/components/CommandPalette";
import GlobalNavbar from "@/components/GlobalNavbar";
import Providers from "./providers";
import { Toaster } from "sonner";
import PWARegister from "@/components/PWARegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Converto™ Business OS 2.0",
  description: "100% suomalainen automaatio - Data ei poistu Suomesta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Global Navigation */}
          <GlobalNavbar />

          {/* Command Palette (⌘K) */}
          <CommandPalette />

          {/* Toast Notifications */}
          <Toaster richColors position="top-right" />

          {/* Main Content */}
          {children}
          {/* PWA Service Worker */}
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
