import { NextResponse } from 'next/server'
import { getConfig, saveConfig, resetConfig, type AlertConfig } from '../../../../lib/alerts-config'

export async function GET() {
  return NextResponse.json(getConfig())
}

export async function POST(req: Request) {
  const body = (await req.json()) as AlertConfig
  try {
    new URL(body.webhookUrl)
  } catch {
    return NextResponse.json({ error: 'invalid webhookUrl' }, { status: 400 })
  }
  if (!['slack', 'webhook'].includes(body.provider)) return NextResponse.json({ error: 'invalid provider' }, { status: 400 })
  if (!['info', 'warn', 'critical'].includes(body.threshold)) return NextResponse.json({ error: 'invalid threshold' }, { status: 400 })
  if (body.suppressWindowSec < 0 || body.suppressWindowSec > 3600) return NextResponse.json({ error: 'invalid suppress' }, { status: 400 })

  const saved = saveConfig(body)
  return NextResponse.json(saved)
}

export async function DELETE() {
  const cfg = resetConfig()
  return NextResponse.json(cfg)
}


