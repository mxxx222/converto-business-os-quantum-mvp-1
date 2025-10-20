import { NextResponse } from 'next/server'
import { pool } from '../../../../lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const range = url.searchParams.get('range') || '24h'
  const hours = Number(range.replace('h', '')) || 24
  const { rows } = await pool.query(
    `SELECT ts, user_id, tenant_id, action, resource, outcome, ip, user_agent, meta
     FROM audits WHERE ts >= now() - interval '${hours} hours'
     ORDER BY ts DESC LIMIT 5000`,
  )
  const header = 'ts,user_id,tenant_id,action,resource,outcome,ip,user_agent,meta\n'
  const csv = header + rows.map((r: any) => [
    new Date(r.ts).toISOString(),
    r.user_id ?? '',
    r.tenant_id ?? '',
    r.action,
    r.resource ?? '',
    r.outcome,
    r.ip ?? '',
    String(r.user_agent ?? '').replaceAll(',', ' '),
    JSON.stringify(r.meta ?? {}),
  ].join(',')).join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="audit_${hours}h.csv"`,
    },
  })
}


