export const runtime = 'edge'
export const revalidate = 300

export default function LegalHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Legal (SSG + ISR)</h1>
      <p className="text-gray-600">Regenerated every 5 minutes.</p>
    </div>
  )
}


