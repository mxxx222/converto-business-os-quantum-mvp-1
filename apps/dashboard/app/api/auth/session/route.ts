import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJWT } from '../../../../lib/auth/jwt'
import { getFeatureMatrix } from '../../../../lib/auth/feature-matrix'

export async function GET() {
  const token = cookies().get(process.env.COOKIE_NAME || 'converto.sid')?.value
  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 })
  const claims = await verifyJWT(token).catch(() => null)
  if (!claims) return NextResponse.json({ authenticated: false }, { status: 200 })
  const features = await getFeatureMatrix((claims as any).sub, (claims as any).tid)
  return NextResponse.json({ authenticated: true, userId: (claims as any).sub, tenantId: (claims as any).tid, roles: (claims as any).roles || [], features })
}


