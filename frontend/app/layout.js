import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Converto Business OS - Quantum Edition',
  description: 'Älykäs automaatioalusta yrityksille',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
