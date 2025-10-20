import { NextResponse } from 'next/server'
import { verifyJWT, signJWT } from '../../../../lib/auth/jwt'
import { setSessionCookie } from '../../../../lib/auth/session'
import { cookies } from 'next/headers'

export async function POST() {
  const token = cookies().get(process.env.COOKIE_NAME || 'converto.sid')?.value
  if (!token) return NextResponse.json({ error: 'no session' }, { status: 401 })
  const claims = await verifyJWT(token).catch(() => null)
  if (!claims) return NextResponse.json({ error: 'invalid' }, { status: 401 })
  const rotated = await signJWT({ sub: (claims as any).sub, tid: (claims as any).tid, roles: (claims as any).roles }, 900)
  setSessionCookie(rotated)
  return NextResponse.json({ ok: true })
}


