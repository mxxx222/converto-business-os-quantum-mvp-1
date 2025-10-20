import { NextResponse } from 'next/server'
import { z } from 'zod'
import { emit } from '../../../../lib/events/bus'

const Payload = z.object({
  namespace: z.string().default('receipts'),
  type: z.enum(['success', 'error', 'info']).default('info'),
  msg: z.string().min(1),
  invalidateKeys: z.array(z.any()).optional(),
})

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json().catch(() => ({}))
  const parsed = Payload.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'invalid_payload', issues: parsed.error.issues }, { status: 400 })
  const p = parsed.data
  const delivered = emit(p.namespace, p)
  return NextResponse.json({ ok: true, namespace: p.namespace, delivered })
}


