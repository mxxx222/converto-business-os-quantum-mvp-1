import { redis } from './redis'
import { DEBUG_REDIS_LOCKS } from './debug'

let inFlight: Promise<number> | null = null

export async function countTenantLocks(
  prefix = `tenant_sec:${process.env.TENANT_SEC_NAMESPACE || 'default'}:`,
) {
  const cacheKey = `metrics:${prefix}:lock_count_cache`
  const cached = await redis.get(cacheKey)
  if (cached) {
    if (DEBUG_REDIS_LOCKS) console.log('[locks] cache hit =', cached)
    return Number(cached)
  }
  if (inFlight) return inFlight

  inFlight = (async () => {
    let cursor = '0'
    let total = 0
    do {
      const [next, keys] = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', '1000')
      total += keys.length
      cursor = next
    } while (cursor !== '0')
    if (DEBUG_REDIS_LOCKS) console.log('[locks] SCAN computed =', total)
    await redis.set(cacheKey, String(total), 'EX', 10)
    return total
  })()

  try {
    return await inFlight
  } finally {
    inFlight = null
  }
}


