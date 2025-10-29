"use client"
import { useState } from 'react'

export default function StoryCTA(): JSX.Element {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      // lightweight metric hook; can be replaced by real analytics endpoint later
      const email = fd.get('email') as string | null
      if (email) console.info('lead_submit', { email })
      fetch('/api/event', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'lead_submit', where: 'storybrand_cta' })
      }).catch(() => {})
    } catch {}
    setLoading(true)
    const res = await fetch('/api/lead', { method: 'POST', body: fd })
    setLoading(false)
    if (res.ok) setSent(true)
    else alert('Lähetys epäonnistui. Yritä uudestaan.')
  }

  return (
    <section id="get-started" className="sb-section">
      <h2 className="sb-h2">Let’s build a website that sells</h2>
      <p className="sb-lead">Schedule your clarity session today and start converting story to revenue.</p>
      <div id="pilot" className="sb-cta-form">
        {sent ? (
          <p className="card success">Kiitos! Vahvistus lähetetty sähköpostiisi. Palaamme 1 arkipäivässä.</p>
        ) : (
          <form onSubmit={submit} className="form-grid">
            <input name="email" type="email" required placeholder="Sähköposti *" className="field" />
            <input name="name" type="text" placeholder="Nimi" className="field" />
            <input name="company" type="text" placeholder="Yritys" className="field" />
            <input name="phone" type="tel" placeholder="Puhelin" className="field" />
            <textarea name="note" rows={3} placeholder="Mitä haluat automatisoida? (kuitit, laskutus, raportit…)" className="field full" />
            <button className="btn btn-primary full" disabled={loading}>{loading ? 'Lähetetään…' : 'Ilmoittaudu pilottiin'}</button>
            <small className="muted full">Ei piilokuluja. Aloitamme sähköpostista ja pankkiyhteydestä. Autamme luvituksissa.</small>
          </form>
        )}
      </div>
    </section>
  )
}
