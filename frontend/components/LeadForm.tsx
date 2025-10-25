'use client'
import { useState } from 'react'
import { getUtm, track } from '@/lib/analytics'

export default function LeadForm() {
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [done, setDone] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const utm = getUtm()
    track('form_start', { email_domain: email.split('@')[1], ...utm })

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, utm }),
      })

      if (res.ok) {
        track('form_success', { email_domain: email.split('@')[1], ...utm })
        setDone(true)
        setShowModal(true)
        setEmail('')
      } else {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.message || 'Jotain meni pieleen. Yritä uudelleen.'
        setError(errorMessage)
        track('form_error', { error: errorMessage, email_domain: email.split('@')[1], ...utm })
      }
    } catch {
      const errorMessage = 'Verkkovirhe. Tarkista yhteys ja yritä uudelleen.'
      setError(errorMessage)
      track('form_error', { error: errorMessage, email_domain: email.split('@')[1], ...utm })
    }
    setLoading(false)
  }

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <input
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Sähköposti"
            className={`rounded-lg border px-3 py-3 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              error ? 'border-red-300' : 'border-zinc-300'
            }`}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
        <button
          disabled={loading}
          className="rounded-lg bg-emerald-600 text-white px-5 py-3 font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Lähetetään…' : 'Aloita ilmaiseksi'}
        </button>
      </form>

      {/* Thank You Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold mb-3">Kiitos yhteydenotostasi!</h3>
            <p className="text-zinc-600 mb-6">
              Olemme sinuun yhteydessä 24 tunnin kuluessa ja lähetämme henkilökohtaisen säästöarvion yrityksellesi.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Sulje
            </button>
          </div>
        </div>
      )}
    </>
  )
}
