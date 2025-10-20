import { NextResponse } from 'next/server'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (data: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      send([{ id: 'sse-welcome', title: 'Tervetuloa Co-pilot-virtaan', action: 'custom' }])
      let i = 0
      const interval = setInterval(() => {
        send([{ id: `sse-${i}`, title: `Ehdotus ${i + 1}`, action: 'custom' }])
        i += 1
        if (i > 5) {
          clearInterval(interval)
          controller.close()
        }
      }, 2000)
    }
  })
  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}

