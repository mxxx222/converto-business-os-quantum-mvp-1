import { NextResponse } from 'next/server'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const send = (obj: any) => controller.enqueue(`data: ${JSON.stringify(obj)}\n\n`)
      send({ type: 'info', msg: 'Notifications stream ready' })
      let i = 0
      const int = setInterval(() => {
        i += 1
        send({ type: i % 3 === 0 ? 'success' : 'info', msg: `Event #${i}` })
        if (i >= 5) clearInterval(int)
      }, 3000)
      return () => clearInterval(int)
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


