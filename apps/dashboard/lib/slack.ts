import type { Severity } from './alerts-config'

export type AlertPayload = {
  tenantId: string
  metric: 'p95' | 'errorRate' | 'throughput'
  severity: Severity
  z?: number
  at: string
  message: string
  link?: string
}

export async function sendSlack(webhookUrl: string, p: AlertPayload) {
  const color = p.severity === 'critical' ? '#ef4444' : p.severity === 'warn' ? '#f59e0b' : '#60a5fa'
  const blocks = [
    { type: 'section', text: { type: 'mrkdwn', text: `*${p.severity.toUpperCase()}* • ${p.tenantId} • ${p.metric}` } },
    { type: 'context', elements: [{ type: 'mrkdwn', text: `z=${p.z?.toFixed?.(2) ?? '-'} • ${new Date(p.at).toLocaleString('fi-FI')}` }] },
    { type: 'section', text: { type: 'mrkdwn', text: p.message } },
    ...(p.link ? [{ type: 'actions', elements: [{ type: 'button', text: { type: 'plain_text', text: 'Open dashboard' }, url: p.link }]}] : []),
  ]
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attachments: [{ color, blocks }] }),
  })
}


