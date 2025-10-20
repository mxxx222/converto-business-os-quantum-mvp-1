export const runtime = 'edge'
export const revalidate = 120

export default function ReceiptsHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Receipts (SSG + ISR)</h1>
      <p className="text-gray-600">Static pages regenerated every 2 minutes.</p>
    </div>
  )
}


