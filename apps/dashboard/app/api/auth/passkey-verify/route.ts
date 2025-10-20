import { NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { signJWT } from '../../../../lib/auth/jwt'
import { setSessionCookie } from '../../../../lib/auth/session'

export async function POST(req: Request) {
  const body = await req.json()
  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: 'stored-challenge',
    expectedOrigin: `https://${process.env.PASSKEY_RP_ID}`,
    expectedRPID: process.env.PASSKEY_RP_ID!,
  }).catch(() => ({ verified: false }))

  if (!verification?.verified) return NextResponse.json({ error: 'invalid' }, { status: 401 })

  const jwt = await signJWT({ sub: 'user-123', tid: 'T1', roles: ['admin'] }, 900)
  setSessionCookie(jwt)
  return NextResponse.json({ ok: true })
}


