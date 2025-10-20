import { NextResponse } from 'next/server'
import { pool } from '../../../../../lib/db'

function isAuthorized(req: Request) {
  const hdr = req.headers.get('authorization') || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : ''
  return token && token === (process.env.SECURITY_ADMIN_TOKEN || '')
}

function parseTTL(str: string) {
  const m = /^(\d+)([smhd])$/.exec(str || '')
  if (!m) return 15 * 60
  const n = Number(m[1])
  const unit = m[2]
  const mult = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400
  return n * mult
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { tenantId, reason, ttl, rate, byUser } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'tenantId required' }, { status: 400 })

  const seconds = parseTTL(ttl || '15m')
  const until = new Date(Date.now() + seconds * 1000).toISOString()
  try {
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS tenant_security (
        tenant_id TEXT PRIMARY KEY,
        locked_until TIMESTAMPTZ,
        lock_reason TEXT,
        rate_policy TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      `,
    )
    await pool.query(
      `INSERT INTO tenant_security(tenant_id, locked_until, lock_reason, rate_policy, updated_at)
       VALUES ($1,$2,$3,$4,now())
       ON CONFLICT (tenant_id)
       DO UPDATE SET locked_until=$2, lock_reason=$3, rate_policy=$4, updated_at=now()`,
      [tenantId, until, reason || 'manual', rate || 'high'],
    )
    await pool.query(
      `INSERT INTO audits (user_id, tenant_id, action, outcome, resource, meta)
       VALUES ($1,$2,'tenant_lock','success','/api/security/tenant/lock',$3::jsonb)`,
      [byUser || null, tenantId, JSON.stringify({ reason, ttl: seconds, rate, source: 'slack_command' })],
    )
  } catch (e) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, tenantId, until })
}


