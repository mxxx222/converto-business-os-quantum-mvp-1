import { pool } from './db'

export type AuditEvent = {
  userId?: string | null
  tenantId?: string | null
  action: string
  resource?: string
  outcome: 'success' | 'failure' | 'denied'
  ip?: string | null
  userAgent?: string | null
  meta?: Record<string, unknown>
}

export async function audit(e: AuditEvent) {
  try {
    await pool.query(
      `INSERT INTO audits (user_id, tenant_id, action, resource, outcome, ip, user_agent, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        e.userId ?? null,
        e.tenantId ?? null,
        e.action,
        e.resource ?? null,
        e.outcome,
        e.ip ?? null,
        e.userAgent ?? null,
        JSON.stringify(e.meta ?? {}),
      ],
    )
  } catch (err) {
    console.error('audit insert failed', err)
  }
}


