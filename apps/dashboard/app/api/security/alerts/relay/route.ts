import { NextResponse } from 'next/server'
import { ensureSecurityAlertListener, subscribeSecurityAlerts } from '../../../../../lib/security-alert-listener'

export const runtime = 'nodejs'

export async function GET() {
  await ensureSecurityAlertListener(process.env.DATABASE_URL!)
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  const stream = new ReadableStream({
    start(controller) {
      const unsub = subscribeSecurityAlerts(async (p) => {
        const payload = {
          tenantId: p.tenant_id,
          metric: p.kind,
          severity: p.kind.includes('burst') ? 'critical' : 'warn',
          at: new Date(p.ts).toISOString(),
          message: `[SECURITY] ${p.kind} tenant=${p.tenant_id} count=${p.count} window=${p.window_sec}s`,
          link: `${base}/copilot/overview`,
        }
        await fetch(`${base}/api/alerts/notify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      })
      controller.enqueue(`event: ready\ndata: {"ok":true}\n\n`)
      return () => unsub()
    },
  })
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}


