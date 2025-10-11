
#!/usr/bin/env bash
set -euo pipefail

BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000

PY=$(command -v python3 || command -v python)
if [ ! -d ".venv" ]; then
  echo ">> Creating virtualenv .venv"
  $PY -m venv .venv
fi
source .venv/bin/activate

if [ ! -f "requirements.txt" ]; then
  cat > requirements.txt <<'REQ'
fastapi==0.111.0
uvicorn[standard]==0.30.0
pydantic==2.8.2
REQ
fi

echo ">> Installing Python deps"
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
  cat > .env <<'ENV'
APP_BRAND=converto
ENV
  echo ">> Wrote .env"
fi

mkdir -p frontend
pushd frontend >/dev/null
if [ ! -f "package.json" ]; then
  npm init -y >/dev/null 2>&1
  npm install next@14 react react-dom >/dev/null 2>&1 || true
  mkdir -p app modules/impact
  cat > next.config.js <<'JS'
/** @type {import('next').NextConfig} */
const nextConfig = { experimental: { appDir: true } };
module.exports = nextConfig;
JS
  cat > package.json <<'JSON'
{
  "name": "converto-frontend",
  "private": true,
  "scripts": { "dev": "next dev -p 3000", "build": "next build", "start": "next start -p 3000" },
  "dependencies": { "next": "14.2.4", "react": "^18.2.0", "react-dom": "^18.2.0" }
}
JSON
  cat > app/page.tsx <<'TSX'
import dynamic from "next/dynamic";
const ImpactCard = dynamic(()=>import("../modules/impact/Card"),{ ssr:false });
export default function Page(){
  return <main style={{padding:24, display:"grid", gap:16}}>
    <h1>Converto™ Dashboard — MVP+</h1>
    <ImpactCard />
  </main>;
}
TSX
  cat > modules/impact/Card.tsx <<'TSX'
"use client";
import { useEffect, useState } from "react";
export default function ImpactCard(){
  const [d,setD]=useState<any>(null);
  useEffect(()=>{ fetch(`${process.env.NEXT_PUBLIC_API_BASE||"http://127.0.0.1:8000"}/api/v1/impact/summary?tenant_id=demo`).then(r=>r.json()).then(setD).catch(()=>{}); },[]);
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
TSX
fi
echo ">> Installing frontend deps"
npm install >/dev/null 2>&1 || npm install
popd >/dev/null

echo ">> Starting backend (uvicorn) on ${BACKEND_HOST}:${BACKEND_PORT}"
pkill -f "uvicorn app.main:app" >/dev/null 2>&1 || true
nohup uvicorn app.main:app --host ${BACKEND_HOST} --port ${BACKEND_PORT} --reload >/tmp/converto_backend.log 2>&1 &

echo ">> Starting frontend (Next.js) on 3000"
pkill -f "next dev -p 3000" >/dev/null 2>&1 || true
nohup bash -c "cd frontend && npm run dev --silent" >/tmp/converto_frontend.log 2>&1 &

echo ""
echo "✅ Setup complete."
echo "Backend  : http://${BACKEND_HOST}:${BACKEND_PORT}/api/v1/impact/summary"
echo "Frontend : http://127.0.0.1:3000"
echo "Logs     : /tmp/converto_backend.log, /tmp/converto_frontend.log"
