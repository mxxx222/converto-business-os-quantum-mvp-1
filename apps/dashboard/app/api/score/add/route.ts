import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { delta } = await req.json().catch(() => ({ delta: 0 }))
  return NextResponse.json({ ok: true, applied: Number(delta) || 0 })
}


