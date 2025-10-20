import dynamic from 'next/dynamic'

export const runtime = 'edge'
const CostDashboard = dynamic(() => import('./CostDashboard'))

export default async function BillingDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Billing Dashboard</h1>
      {/* @ts-expect-error Server Component wrapper */}
      <CostDashboard />
    </div>
  )
}


