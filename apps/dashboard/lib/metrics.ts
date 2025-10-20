import { metrics } from '@opentelemetry/api'
import { DEDUPE, getLastDedupeResetAt } from './alerts-dedupe'
import { countTenantLocks } from './redis-lock-metrics'

const meter = metrics.getMeter('converto-alerts')

meter
  .createObservableGauge('alerts_status_count', {
    description: 'Number of active dedupe entries in alert system',
  })
  .addCallback((obs) => {
    try {
      obs.observe(typeof DEDUPE?.size === 'number' ? DEDUPE.size : 0)
    } catch {
      obs.observe(0)
    }
  })

meter
  .createObservableGauge('alerts_last_reset_timestamp_seconds', {
    description: 'Epoch seconds of last dedupe cache reset',
  })
  .addCallback((obs) => {
    try {
      const t = getLastDedupeResetAt()
      if (t) obs.observe(new Date(t).getTime() / 1000)
    } catch {
      // ignore
    }
  })

// Counter: total number of dedupe resets since process start
const resets = meter.createCounter('alerts_resets_total', {
  description: 'Total number of dedupe resets since process start',
})

export function incResetCounter() {
  try {
    resets.add(1)
  } catch {
    // ignore
  }
}

// Gauge: active tenant locks in Redis
meter
  .createObservableGauge('tenant_locks_active', {
    description: 'Number of active tenant lock keys in Redis',
  })
  .addCallback(async (obs) => {
    try {
      const n = await countTenantLocks()
      obs.observe(n)
    } catch {
      // ignore
    }
  })


