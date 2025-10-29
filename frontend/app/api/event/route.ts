export const dynamic = 'force-dynamic'

async function getKV() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const mod = await import('@vercel/kv')
    return mod.kv
  }
  return undefined
}

function key(...p: string[]) { return ['sb', ...p].join(':') }
function today() { return new Date().toISOString().slice(0,10) }

const WHERE_WHITELIST = new Set([
  'hero_primary','hero_secondary',
  'storybrand_cta',
  'riskfree_primary','riskfree_secondary',
  'storybrand_a','storybrand_b',
  'riskfree_a','riskfree_b',
  'unknown',
])

function normWhere(raw?: string | null): string {
  const s = (raw ?? 'unknown').trim().toLowerCase().replace(/\s+/g, '_')
  const cut = s.slice(0, 60)
  return WHERE_WHITELIST.has(cut) ? cut : 'unknown'
}

function normName(raw?: string | null): string {
  const s = (raw ?? '').trim().toLowerCase()
  switch (s) {
    case 'cta_click':
    case 'lead_submit':
    case 'page_view':
    case 'page_close':
    case 'ab_expose':
      return s
    default:
      return 'unknown'
  }
}

// In-memory fallback for local dev without KV
type Ctx = { totals: Record<string, number>; days: Record<string, number> }
const g = globalThis as unknown as { __SB_CTX__?: Ctx }
if (!g.__SB_CTX__) g.__SB_CTX__ = { totals: {}, days: {} }

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))
    const name = normName(body?.name)
    if (name === 'unknown') return new Response('Bad Request', { status: 400 })
    const where = normWhere(body?.where)
    const d = today()

    const kv = await getKV()
    if (kv) {
      await Promise.all([
        kv.incr(key('totals', name)),
        kv.incr(key('totals', `${name}:${where}`)),
        kv.incr(key('days', `${d}:${name}`)),
      ])
    } else {
      // Fallback: update in-memory counters
      g.__SB_CTX__!.totals[name] = (g.__SB_CTX__!.totals[name] ?? 0) + 1
      const kWhere = `${name}:${where}`
      g.__SB_CTX__!.totals[kWhere] = (g.__SB_CTX__!.totals[kWhere] ?? 0) + 1
      const kDay = `${d}:${name}`
      g.__SB_CTX__!.days[kDay] = (g.__SB_CTX__!.days[kDay] ?? 0) + 1
    }

    return new Response(null, { status: 200 })
  } catch {
    return new Response('Bad Request', { status: 400 })
  }
}
