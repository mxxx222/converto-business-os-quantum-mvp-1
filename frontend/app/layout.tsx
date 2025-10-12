import "./globals.css";

export const metadata = {
  title: "Converto Business OS",
  description: "AI-powered business management"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className="antialiased bg-slate-50">{children}</body>
    </html>
  );
}
