import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CommandPalette } from "@/components/CommandPalette";

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
    <html lang="fi">
      <body className={inter.className}>
        {/* Command Palette (⌘K) */}
        <CommandPalette />
        
        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
