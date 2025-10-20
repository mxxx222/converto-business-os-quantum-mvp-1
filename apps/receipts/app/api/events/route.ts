import { NextResponse } from 'next/server'
import { subscribe } from '../../../lib/events/bus'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const ns = url.searchParams.get('namespace') || 'receipts'
  const stream = new ReadableStream({
    start(controller) {
      const keepAlive = setInterval(() => controller.enqueue(`: keepalive\n\n`), 15000)
      const unsub = subscribe(ns, (p) => controller.enqueue(`data: ${JSON.stringify(p)}\n\n`))
      controller.enqueue(`event: ready\ndata: {"ok":true,"namespace":"${ns}"}\n\n`)
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


