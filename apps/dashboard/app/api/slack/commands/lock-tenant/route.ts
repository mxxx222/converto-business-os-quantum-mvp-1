import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { isSecurityOperator } from '../../../../../lib/security-rbac'

export const runtime = 'nodejs'

function verifySlack(req: Request, body: string) {
  const ts = req.headers.get('x-slack-request-timestamp') || ''
  const sig = req.headers.get('x-slack-signature') || ''
  const base = `v0:${ts}:${body}`
  const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET || '').update(base).digest('hex')
  const expected = `v0=${hmac}`
  const fresh = Math.abs(Date.now() / 1000 - Number(ts)) < 300
  try {
    return fresh && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}

function parseForm(body: string) {
  const params = new URLSearchParams(body)
  return {
    team_id: params.get('team_id') || '',
    user_id: params.get('user_id') || '',
    channel_id: params.get('channel_id') || '',
    text: params.get('text') || '',
    response_url: params.get('response_url') || '',
  }
}

export async function POST(req: Request) {
  const raw = await req.text()
  if (!verifySlack(req, raw)) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  const cmd = parseForm(raw)
  if (!(await isSecurityOperator(cmd.user_id))) {
    return NextResponse.json({ response_type: 'ephemeral', text: '❌ Ei oikeuksia (security‑rooli vaaditaan)' })
  }
  const [tenantId, ...rest] = cmd.text.trim().split(/\s+/)
  if (!tenantId) {
    return NextResponse.json({ response_type: 'ephemeral', text: 'Käyttö: /lock-tenant <TENANT> reason=<syy> [ttl=15m] [ratelimit=high|normal]' })
  }
  const args = Object.fromEntries(rest.map((kv) => { const [k, v] = kv.split('='); return [k, v] })) as Record<string, string>
  const reason = args.reason || 'manual'
  const ttl = args.ttl || '15m'
  const rate = args.ratelimit || 'high'

  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  const res = await fetch(`${base}/api/security/tenant/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.SECURITY_ADMIN_TOKEN}` },
    body: JSON.stringify({ tenantId, reason, ttl, rate, byUser: cmd.user_id }),
  })

  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    return NextResponse.json({ response_type: 'ephemeral', text: `❌ Lukitus epäonnistui: ${j.error || res.status}` })
  }

  // Optional Slack channel ack (webhook)
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `🔒 Tenant ${tenantId} lukittu (${reason}, ttl=${ttl}, rate=${rate}).`, username: 'Converto Security' }),
    }).catch(() => {})
  }

  return NextResponse.json({ response_type: 'in_channel', text: `🔒 Tenant ${tenantId} lukittu (${reason}, ttl=${ttl}, rate=${rate}).` })
}


