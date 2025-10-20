import { NextResponse } from 'next/server'
import { getConfig } from '../../../../lib/alerts-config'
import { sendSlack } from '../../../../lib/slack'

export async function POST(req: Request) {
  const cfg = getConfig()
  const body = await req.json().catch(() => ({}))
  const payload = {
    tenantId: body.tenantId ?? 'T1',
    metric: body.metric ?? 'p95',
    severity: body.severity ?? 'critical',
    z: body.z ?? 4.2,
    at: new Date().toISOString(),
    message: body.message ?? 'Test alert from settings',
    link: body.link ?? `${process.env.NEXT_PUBLIC_BASE_URL || ''}/copilot/overview`,
  }

  if (cfg.provider === 'slack') {
    if (!cfg.webhookUrl) return NextResponse.json({ error: 'Missing webhookUrl' }, { status: 400 })
    await sendSlack(cfg.webhookUrl, payload as any)
  } else {
    await fetch(cfg.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  }
  return NextResponse.json({ ok: true })
}


