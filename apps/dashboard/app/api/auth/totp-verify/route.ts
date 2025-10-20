import { NextResponse } from 'next/server'
import * as OTPAuth from 'otpauth'
import { signJWT } from '../../../../lib/auth/jwt'
import { setSessionCookie } from '../../../../lib/auth/session'

export async function POST(req: Request) {
  const { code } = await req.json()
  const secret = 'JBSWY3DPEHPK3PXP' // demo only; load user secret
  const totp = new OTPAuth.TOTP({
    issuer: process.env.TOTP_ISSUER!,
    label: 'user@example.com',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })
  const delta = totp.validate({ token: code, window: 1 })
  if (delta === null) return NextResponse.json({ error: 'invalid' }, { status: 401 })

  const jwt = await signJWT({ sub: 'user-123', tid: 'T1', roles: ['user'] }, 900)
  setSessionCookie(jwt)
  return NextResponse.json({ ok: true })
}


