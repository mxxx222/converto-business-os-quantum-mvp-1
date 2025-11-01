const dangerous = [
  'DEBUG_CACHE',
  'DEBUG_REDIS',
  'DEBUG_REDIS_LOCKS',
  'DEBUG_SESSION',
  'DEBUG_METRICS',
]

const truthy = (v) => ['1', 'true', 'TRUE', 'True', 'yes', 'on'].includes(String(v || '').trim())
const hit = dangerous.filter((k) => truthy(process.env[k]))

if (hit.length) {
  console.error(`[CI] DEBUG-liput päällä buildissa: ${hit.join(', ')}`)
  process.exit(1)
} else {
  console.log('[CI] DEBUG-liput pois päältä – ok')
}
