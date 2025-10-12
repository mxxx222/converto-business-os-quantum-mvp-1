'use client'
import { useEffect, useState } from 'react'

const api = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE}${path}`
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || 'tenant_demo'

export default function BillingPage(){
  const [plans, setPlans] = useState<any[]>([])
  const [ents, setEnts] = useState<any>({})
  const [busy, setBusy] = useState(false)
  useEffect(()=>{
    fetch(api(`/api/v1/billing/plans`)).then(r=>r.json()).then(setPlans).catch(()=>{})
    fetch(api(`/api/v1/billing/${TENANT}/entitlements`)).then(r=>r.json()).then(setEnts).catch(()=>{})
  },[])

  const checkout = async (price_id: string) => {
    setBusy(true)
    const r = await fetch(api(`/api/v1/stripe/checkout/session`),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tenant_id:TENANT, price_id})})
    const j = await r.json(); setBusy(false)
    if(j.url) window.location.href = j.url
  }
  const portal = async () => {
    setBusy(true)
    const r = await fetch(api(`/api/v1/stripe/portal/session`),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tenant_id:TENANT})})
    const j = await r.json(); setBusy(false)
    if(j.url) window.location.href = j.url
  }

  return (
    <main style={{padding:24, display:'grid', gap:16}}>
      <h1>Billing</h1>
      <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(3, minmax(0,1fr))'}}>
        {plans.map(p=> (
          <div key={p.id} style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
            <div style={{fontWeight:700}}>{p.name}</div>
            <div style={{opacity:.7}}>{(p.price_cents/100).toFixed(2)} € / {p.interval||'mo'}</div>
            <button disabled={busy} onClick={()=>checkout(p.default_price_id)} style={{marginTop:8}}>Proceed to Checkout</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Customer Portal</h2>
        <button disabled={busy} onClick={portal}>Open Portal</button>
      </div>
      <pre>{JSON.stringify(ents, null, 2)}</pre>
    </main>
  )
}



