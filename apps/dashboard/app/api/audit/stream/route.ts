import { NextResponse } from 'next/server'
import { isAdminFromRequest } from '../../../../lib/admin'
import { ensureAuditListener, subscribeAudit } from '../../../../lib/audit-listener'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const isAdmin = await isAdminFromRequest(req)
  if (!isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const tenant = url.searchParams.get('tenant') || undefined

  await ensureAuditListener(process.env.DATABASE_URL!)

  const stream = new ReadableStream({
    start(controller) {
      const keepAlive = setInterval(() => controller.enqueue(`: keepalive\n\n`), 15000)
      const unsub = subscribeAudit((row) => {
        if (tenant && row.tenant_id !== tenant) return
        controller.enqueue(`data: ${JSON.stringify(row)}\n\n`)
      })
      controller.enqueue(`event: ready\ndata: {"ok":true}\n\n`)
      return () => {
        clearInterval(keepAlive)
        unsub()
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}


