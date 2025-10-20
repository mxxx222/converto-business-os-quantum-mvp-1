export const runtime = 'edge'

import Link from 'next/link'

export default function DashboardHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Dashboard (Edge SSR)</h1>
      <p className="text-gray-600 mb-4">Rendered at the edge on each request.</p>
      <div className="space-x-4">
        <Link className="underline" href="https://dashboard.converto.fi">domain</Link>
        <Link className="underline" href="/">home</Link>
      </div>
    </div>
  )
}

export const runtime = 'edge'

import { Button } from '@converto/ui'

export default async function DashboardHome() {
  // SSR by default (no fetch here)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Dashboard (Edge SSR)</h1>
      <p className="text-gray-600 mb-4">Modular micro-frontend (apps/dashboard)</p>
      <Button label="Shared UI Button" />
    </div>
  )
}


