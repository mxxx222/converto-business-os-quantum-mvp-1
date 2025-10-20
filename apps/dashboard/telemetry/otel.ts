import { NodeSDK } from '@opentelemetry/sdk-node'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

const exporter = new PrometheusExporter({
  port: 9464,
  endpoint: '/metrics',
})

export const otelSdk = new NodeSDK({
  metricReader: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
})

otelSdk.start().catch((err) => {
  // Do not crash app if telemetry fails
  console.error('OTEL start failed', err)
})


