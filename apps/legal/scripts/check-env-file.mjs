import fs from 'node:fs'

const file = '.env.production'
if (!fs.existsSync(file)) {
  process.exit(0)
}
const txt = fs.readFileSync(file, 'utf8')
const bad = [...txt.matchAll(/^DEBUG_[A-Z_]+=(.*)$/gm)]
  .map((m) => [m[0], (m[1] || '').trim()])
  .filter(([, v]) => ['true', '1', 'yes', 'on'].includes((v || '').toLowerCase()))
if (bad.length) {
  console.error(
    '[CI] Kielletyt DEBUG_* arvot .env.productionissa:\n' + bad.map(([k]) => `- ${k}`).join('\n'),
  )
  process.exit(1)
}
console.log('[CI] .env.production DEBUG‑tarkistus ok')


