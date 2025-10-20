'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExampleDialog } from '../../components/ui/example-dialog'
import { LocaleSwitcher } from '../../components/LocaleSwitcher'

export default function TopNav() {
  const pathname = usePathname()
  const isAlerts = pathname.startsWith('/copilot/settings/alerts')
  return (
    <nav className="flex items-center gap-3 text-sm mb-4">
      <Link href="/" className="px-2 py-1 rounded hover:bg-white/5">Home</Link>
      <Link href="/copilot" className="px-2 py-1 rounded hover:bg-white/5">Co-pilot Console</Link>
      <Link href="/copilot/settings/alerts" className="px-2 py-1 rounded hover:bg-white/5" aria-current={isAlerts ? 'page' : undefined}>Alerts</Link>
      <a
        href="https://www.notion.so/Ops-Playbook-Alerts-Telemetry-e2467d7271cc47849b21e858afaa277c?pvs=21"
        target="_blank"
        rel="noopener noreferrer"
        className="px-2 py-1 rounded hover:bg-white/5"
      >
        Ops Playbook
      </a>
      <div className="ml-auto flex items-center gap-3">
        <LocaleSwitcher />
        <ExampleDialog />
      </div>
    </nav>
  )
}


