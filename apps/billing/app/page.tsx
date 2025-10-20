export const runtime = 'edge'
export const revalidate = 60

import Link from 'next/link'

export default async function BillingHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Billing (SSG + ISR)</h1>
      <p className="text-gray-600 mb-4">Static content regenerated every 60s.</p>
      <Link className="underline" href="/">Home</Link>
    </div>
  )
}


