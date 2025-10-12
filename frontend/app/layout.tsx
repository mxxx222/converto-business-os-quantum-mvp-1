import "./globals.css";

export const metadata = {
  title: 'Converto Business OS',
  description: 'AI-powered business management with receipt OCR, gamification, and automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fi">
      <body className="antialiased">{children}</body>
    </html>
  )
}
