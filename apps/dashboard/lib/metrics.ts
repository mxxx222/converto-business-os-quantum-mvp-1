import { metrics } from '@opentelemetry/api'
import { DEDUPE, getLastDedupeResetAt } from './alerts-dedupe'

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


