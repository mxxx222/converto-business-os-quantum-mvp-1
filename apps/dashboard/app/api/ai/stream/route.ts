import { NextResponse } from 'next/server'

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const send = (data: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      send({ text: 'Tervetuloa Co-pilot-virtaan' })
      let i = 0
      const interval = setInterval(() => {
        send({ id: i, suggestion: `Ehdotus ${i + 1}` })
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

