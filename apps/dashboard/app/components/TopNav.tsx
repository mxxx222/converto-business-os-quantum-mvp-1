'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TopNav() {
  const pathname = usePathname()
  const isAlerts = pathname.startsWith('/copilot/settings/alerts')
  return (
    <nav className="flex items-center gap-3 text-sm mb-4">
      <Link href="/" className="px-2 py-1 rounded hover:bg-white/5">Home</Link>
      <Link href="/copilot" className="px-2 py-1 rounded hover:bg-white/5">Co-pilot Console</Link>
      <Link href="/copilot/settings/alerts" className="px-2 py-1 rounded hover:bg-white/5" aria-current={isAlerts ? 'page' : undefined}>Alerts</Link>
    </nav>
  )
}


