import { Client } from 'pg'

let client: Client | null = null
let ready = false
const listeners = new Set<(payload: any) => void>()

export async function ensureSecurityAlertListener(connectionString: string) {
  if (client && ready) return
  client = new Client({
    connectionString,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  })
  client.on('error', () => {
    ready = false
    setTimeout(() => ensureSecurityAlertListener(connectionString).catch(() => {}), 2000)
  })
  await client.connect()
  await client.query('LISTEN security_alerts_channel')
  client.on('notification', (msg) => {
    if (msg.channel !== 'security_alerts_channel' || !msg.payload) return
    try {
      const payload = JSON.parse(msg.payload)
      for (const fn of Array.from(listeners)) { try { fn(payload) } catch {} }
    } catch {}
  })
  ready = true
}

export function subscribeSecurityAlerts(fn: (p: any) => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}


