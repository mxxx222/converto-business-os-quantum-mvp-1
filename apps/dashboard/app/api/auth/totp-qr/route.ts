import { NextResponse } from 'next/server'
import * as OTPAuth from 'otpauth'

export async function GET() {
  const secret = new OTPAuth.Secret({ size: 20 })
  const totp = new OTPAuth.TOTP({
    issuer: process.env.TOTP_ISSUER!,
    label: 'user@example.com',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  })
  const uri = totp.toString()
  return NextResponse.json({ otpauth: uri })
}


