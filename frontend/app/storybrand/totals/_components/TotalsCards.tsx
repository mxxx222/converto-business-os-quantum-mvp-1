"use client"
import { useEffect, useState } from 'react'

type Stats = { totals: Record<string, number>; days: Record<string, number> }

const LABELS: Record<string, string> = {
  page_view: 'Page views',
  cta_click: 'CTA clicks',
  lead_submit: 'Leads',
  ab_expose: 'AB exposures',
}

export default function TotalsCards(): JSX.Element {
  const [data, setData] = useState<Stats | null>(null)
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    const t = setInterval(load, 3000)
    load()
    return () => clearInterval(t)
    async function load() {
      try {
        const res = await fetch('/api/event/stats', { cache: 'no-store' })
        setData(await res.json())
      } catch {}
    }
  }, [])

  if (!data) return <p className="muted">Loading…</p>

  const total = (k: string) => data.totals[k] ?? 0
  const breakdown = (prefix: string) =>
    Object.entries(data.totals)
      .filter(([k]) => k.startsWith(prefix + ':'))
      .sort((a, b) => (b[1] as number) - (a[1] as number))

  const today = new Date().toISOString().slice(0, 10)
  const todayViews = data.days[`${today}:page_view`] ?? 0
  const todayLeads = data.days[`${today}:lead_submit`] ?? 0

  return (
    <div className="totals-wrap">
      <div className="cards-4">
        <MetricCard title={LABELS.page_view} value={total('page_view')} sub={`Today ${todayViews}`} />
        <MetricCard title={LABELS.cta_click} value={total('cta_click')} sub="By source below" />
        <div className="card metric two">
          <div>
            <div className="metric-title">Leads today</div>
            <div className="metric-value">{todayLeads}</div>
          </div>
          <div>
            <div className="metric-title">Leads total</div>
            <div className="metric-value">{total('lead_submit')}</div>
          </div>
        </div>
        <MetricCard title={LABELS.ab_expose} value={total('ab_expose')} sub="A/B exposures" />
      </div>

      <div className="grid-2 mt-16">
        <Breakdown title="CTA clicks by source" items={breakdown('cta_click')} />
        <Breakdown title="Page views by variant" items={breakdown('page_view')} />
      </div>

      <div className="mt-16">
        <button className="btn btn-secondary" onClick={() => setShowRaw((v) => !v)}>
          {showRaw ? 'Hide raw JSON' : 'Show raw JSON'}
        </button>
        {showRaw && (
          <pre className="card mt-16" style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, sub }: { title: string; value: number; sub?: string }) {
  return (
    <div className="card metric">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      {sub && <div className="metric-sub muted">{sub}</div>}
    </div>
  )
}

function Breakdown({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div className="card">
      <div className="metric-title">{title}</div>
      <ul className="breakdown">
        {items.map(([k, v]) => (
          <li key={k}>
            <span className="mono">{k.split(':')[1]}</span>
            <span>{v}</span>
          </li>
        ))}
        {items.length === 0 && <li className="muted">No data</li>}
      </ul>
    </div>
  )
}
