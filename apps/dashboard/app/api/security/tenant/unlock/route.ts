import { NextResponse } from 'next/server'
import { pool } from '../../../../../lib/db'

function isAuthorized(req: Request) {
  const hdr = req.headers.get('authorization') || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : ''
  return token && token === (process.env.SECURITY_ADMIN_TOKEN || '')
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { tenantId, reason, byUser } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 })
  try {
    await pool.query(
      `INSERT INTO tenant_security(tenant_id, locked_until, lock_reason, rate_policy, updated_at)
       VALUES ($1, null, null, 'normal', now())
       ON CONFLICT (tenant_id)
       DO UPDATE SET locked_until=null, lock_reason=$2, rate_policy='normal', updated_at=now()`,
      [tenantId, reason || 'manual'],
    )
    await pool.query(
      `INSERT INTO audits (user_id, tenant_id, action, outcome, resource, meta)
       VALUES ($1,$2,'tenant_unlock','success','/api/security/tenant/unlock',$3::jsonb)`,
      [byUser || null, tenantId, JSON.stringify({ reason, source: 'slack_command' })],
    )
  } catch (e) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, tenantId })
}


