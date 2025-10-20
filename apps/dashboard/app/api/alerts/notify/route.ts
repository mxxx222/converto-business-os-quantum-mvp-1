import { NextResponse } from 'next/server'
import { getConfig } from '../../../../lib/alerts-config'
import { sendSlack } from '../../../../lib/slack'
import { DEDUPE, clearDedupe } from '../../../../lib/alerts-dedupe'
import { isAdminFromRequest, setDevAdminHeader } from '../../../../lib/admin'

const sevRank = { info: 0, warn: 1, critical: 2 } as const

export async function POST(req: Request) {
  const cfg = getConfig()
  const body = await req.json()

  if (sevRank[body.severity as keyof typeof sevRank] < sevRank[cfg.threshold]) {
    return NextResponse.json({ skipped: 'below threshold' })
  }

  const bucket = new Date(body.at).toISOString().slice(0, 16)
  const key = `${body.tenantId}:${body.metric}:${body.severity}:${bucket}`
  const now = Date.now()
  const prev = DEDUPE.get(key) ?? 0
  if (now - prev < cfg.suppressWindowSec * 1000) {
    return NextResponse.json({ skipped: 'suppressed' })
  }
  DEDUPE.set(key, now)

  if (cfg.provider === 'slack') {
    if (!cfg.webhookUrl) return NextResponse.json({ error: 'Missing webhookUrl' }, { status: 400 })
    await sendSlack(cfg.webhookUrl, body)
  } else {
    await fetch(cfg.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('reset') === 'true') {
    const isAdmin = await isAdminFromRequest(req)
    if (!isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    clearDedupe()
    const res = NextResponse.json({ ok: true, reset: true })
    return setDevAdminHeader(res, isAdmin)
  }
  return NextResponse.json({ ok: false, reset: false }, { status: 400 })
}


