"use client"

import { useState } from "react"
import { useConversionTracking } from "@/lib/conversion-tracking"
import { crmIntegration } from "@/lib/crm-integration"

export default function PilotForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { trackPilot } = useConversionTracking()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Lomakkeen lähetys epäonnistui")
      }

      setSent(true)
      
      // Create CRM lead
      await crmIntegration.createLead({
        name: form.name,
        email: form.email,
        company: form.company,
        source: 'pilot_form',
        stage: 'pilot',
      })
      
      // Track conversion
      trackPilot('landing', { company: form.company })
      
      setForm({ name: "", email: "", company: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Virhe tapahtui")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-semibold text-center">
          ✓ Kiitos! Olemme sinuun pian yhteydessä.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left max-w-md mx-auto">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Yrityksen nimi"
        required
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />

      <input
        type="text"
        placeholder="Yhteyshenkilö"
        required
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Sähköposti"
        required
        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
      >
        {loading ? "Lähetetään..." : "Lähetä ilmoittautuminen"}
      </button>
    </form>
  )
}