export type Severity = 'info' | 'warn' | 'critical'

export type AlertConfig = {
  provider: 'slack' | 'webhook'
  threshold: Severity
  suppressWindowSec: number
  webhookUrl: string
  quietHours?: { start: string; end: string }
  rateLimitPerMin?: number
}

let MEM_CONFIG: AlertConfig | null = null

function envDefaults(): AlertConfig {
  const provider = (process.env.ALERT_PROVIDER ?? 'slack') as 'slack' | 'webhook'
  const threshold = (process.env.ALERT_THRESHOLD ?? 'warn') as Severity
  const suppressWindowSec = Number(process.env.ALERT_SUPPRESS_SEC ?? 600)
  const webhookUrl = process.env.SLACK_WEBHOOK_URL || process.env.ALERT_WEBHOOK_URL || ''
  const quietStart = process.env.ALERT_QUIET_START
  const quietEnd = process.env.ALERT_QUIET_END
  const rateLimitPerMin = process.env.ALERT_RATE_LIMIT ? Number(process.env.ALERT_RATE_LIMIT) : undefined

  return {
    provider,
    threshold,
    suppressWindowSec,
    webhookUrl,
    quietHours: quietStart && quietEnd ? { start: quietStart, end: quietEnd } : undefined,
    rateLimitPerMin,
  }
}

export function getConfig(): AlertConfig {
  if (!MEM_CONFIG) MEM_CONFIG = envDefaults()
  return MEM_CONFIG
}

export function saveConfig(next: AlertConfig) {
  MEM_CONFIG = { ...next }
  return MEM_CONFIG
}

export function resetConfig(): AlertConfig {
  MEM_CONFIG = null
  return getConfig()
}


