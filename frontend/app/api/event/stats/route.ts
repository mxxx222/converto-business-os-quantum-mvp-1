export const dynamic = 'force-dynamic'

async function getKV() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const mod = await import('@vercel/kv')
    return mod.kv
  }
  return undefined
}

export async function GET() {
  const kv = await getKV()
  if (kv) {
    const [totals, days] = await Promise.all([
      kv.keys('sb:totals:*'),
      kv.keys('sb:days:*'),
    ])

    const mgetTotals = (totals.length ? await kv.mget<number[]>(...totals) : []) as (number|null)[]
    const mgetDays = (days.length ? await kv.mget<number[]>(...days) : []) as (number|null)[]
    const toObj = (keys: string[], vals: (number|null)[]) =>
      Object.fromEntries(keys.map((k, i) => [k.replace(/^sb:(totals|days):/, ''), vals[i] ?? 0]))

    const payload = {
      totals: toObj(totals as string[], mgetTotals),
      days: toObj(days as string[], mgetDays),
    }
    return new Response(JSON.stringify(payload, null, 2), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  // Fallback to in-memory counters for local dev
  const g = globalThis as unknown as { __SB_CTX__?: { totals: Record<string, number>; days: Record<string, number> } }
  const payload = g.__SB_CTX__ ?? { totals: {}, days: {} }
  return new Response(JSON.stringify(payload, null, 2), { status: 200, headers: { 'content-type': 'application/json' } })
}
