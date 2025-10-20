export const runtime = 'edge'

type Suggestion = {
  id: string
  title: string
  action: 'create_invoice' | 'categorize' | 'reconcile' | 'custom'
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const uiContext = url.searchParams.get('context') || 'default'

  // @ts-expect-error WebSocketPair is provided by the Edge runtime
  const pair = new WebSocketPair()
  const [client, server] = Object.values(pair) as [WebSocket, WebSocket]
  // Accept the server side of the pair
  // @ts-ignore
  server.accept()

  let i = 0
  const interval = setInterval(() => {
    const suggestions: Suggestion[] = [
      { id: `ws-${uiContext}-${i}`, title: `WS-ehdotus ${i + 1}`, action: 'custom' }
    ]
    try {
      server.send(JSON.stringify(suggestions))
    } catch {}
    i += 1
    if (i > 5) {
      clearInterval(interval)
      try { server.close() } catch {}
    }
  }, 2500)

  server.addEventListener('message', (evt: MessageEvent) => {
    try {
      // Echo/ack feedback messages in dev
      const msg = JSON.parse((evt as any).data || '{}')
      if (msg && msg.type === 'feedback') {
        const ack = [{ id: String(msg.id ?? '0'), title: `ACK ${msg.action}`, action: 'custom' }] as Suggestion[]
        try { server.send(JSON.stringify(ack)) } catch {}
      }
    } catch {}
  })

  server.addEventListener('close', () => {
    clearInterval(interval)
  })

  // Upgrade the connection
  // @ts-ignore
  return new Response(null, { status: 101, webSocket: client })
}


