import { NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'

export async function GET() {
  const opts = await generateRegistrationOptions({
    rpID: process.env.PASSKEY_RP_ID!,
    rpName: process.env.PASSKEY_RP_NAME!,
    userID: 'user-123',
    userName: 'user@example.com',
    attestationType: 'none',
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
  })
  return NextResponse.json(opts)
}


