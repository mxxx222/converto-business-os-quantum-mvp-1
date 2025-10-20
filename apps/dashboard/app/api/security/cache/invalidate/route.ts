import { NextResponse } from 'next/server'
import { invalidateTenantSecurity } from '../../../../../lib/tenant-security-cache'

export async function POST(req: Request) {
  const { tenantId } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 })
  await invalidateTenantSecurity(tenantId)
  return NextResponse.json({ ok: true })
}


