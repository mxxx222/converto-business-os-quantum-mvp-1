import { pool } from './db'
import { redis } from './redis'
import { DEBUG_CACHE } from './debug'

const ns = process.env.TENANT_SEC_NAMESPACE || 'default'
const keyOf = (tenantId: string) => `tenant_sec:${ns}:${tenantId}`

export async function getTenantSecurity(tenantId: string) {
  const key = keyOf(tenantId)
  const cached = await redis.get(key)
  if (DEBUG_CACHE) console.log('[cache] get', key, 'hit', !!cached)
  if (cached) return JSON.parse(cached)

  const { rows } = await pool.query(
    'SELECT locked_until, rate_policy FROM tenant_security WHERE tenant_id=$1',
    [tenantId],
  )
  const row = rows[0]
  if (!row) return null
  const ttl = row.locked_until
    ? Math.max(0, Math.floor((new Date(row.locked_until).getTime() - Date.now()) / 1000))
    : 0
  if (ttl > 0) {
    if (DEBUG_CACHE) console.log('[cache] set', key, 'ttl', ttl)
    await redis.set(key, JSON.stringify(row), 'EX', ttl)
  } else {
    if (DEBUG_CACHE) console.log('[cache] set', key, 'no ttl (unlocked)')
    await redis.set(key, JSON.stringify(row), 'EX', 30)
  }
  return row
}

export async function invalidateTenantSecurity(tenantId: string) {
  const key = keyOf(tenantId)
  if (DEBUG_CACHE) console.log('[cache] del', key)
  await redis.del(key)
}


