"use client";
import { useEffect, useState } from "react";
export default function ImpactCard(){
  const [d,setD]=useState<any>(null);
  useEffect(()=>{ fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/impact/summary?tenant_id=demo`).then(r=>r.json()).then(setD).catch(()=>{}); },[]);
  if(!d) return <div style={{padding:16,border:"1px solid #eee",borderRadius:12}}>Ladataan KPI…</div>;
  return (
    <div style={{padding:16,border:"1px solid #eee",borderRadius:12}}>
      <div style={{fontWeight:600}}>Impact Reporter™</div>
      <div style={{marginTop:8, display:"grid", gap:8, gridTemplateColumns:"repeat(2, minmax(0,1fr))"}}>
        {d.cards.map((c:any)=>(
          <div key={c.title} style={{border:"1px solid #f0f0f0",borderRadius:8,padding:8}}>
            <div style={{fontSize:12, color:"#666"}}>{c.title}</div>
            <div style={{fontWeight:600}}>{c.value}</div>
            {c.delta ? <div style={{fontSize:12,color:"#2563eb"}}>Δ {c.delta}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}


