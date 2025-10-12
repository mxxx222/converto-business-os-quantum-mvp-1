import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Converto Selko Core",
  description: "Pienyrittäjän selkeä työpöytä"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 text-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="font-semibold text-lg">Converto Selko</div>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">Etusivu</Link>
              <Link href="/receipts/new" className="opacity-90 hover:opacity-100 transition-opacity">Kuitit</Link>
              <Link href="/vat" className="opacity-90 hover:opacity-100 transition-opacity">ALV</Link>
              <Link href="/reports" className="opacity-90 hover:opacity-100 transition-opacity">Raportit</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        <footer className="max-w-6xl mx-auto px-4 py-8 text-xs text-slate-500 text-center">
          © 2025 Converto Selko Core
        </footer>
      </body>
    </html>
  );
}
