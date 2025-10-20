import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const ns = url.searchParams.get('namespace') || 'legal'
  const stream = new ReadableStream({
    start(controller) {
      const send = (obj: any) => controller.enqueue(`data: ${JSON.stringify(obj)}\n\n`)
      send({ type: 'info', msg: `${ns}: stream ready` })
      let i = 0
      const int = setInterval(() => {
        i += 1
        send({ type: i % 2 ? 'info' : 'success', msg: `${ns}: event #${i}` })
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


