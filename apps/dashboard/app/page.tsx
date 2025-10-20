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


