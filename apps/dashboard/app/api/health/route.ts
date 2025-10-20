import '../../../telemetry/otel'
import '../../../lib/metrics'
import { ensureSecurityAlertListener } from '../../../lib/security-alert-listener'

export async function GET() {
  if (process.env.DATABASE_URL) {
    await ensureSecurityAlertListener(process.env.DATABASE_URL)
  }
  return new Response('ok')
}


