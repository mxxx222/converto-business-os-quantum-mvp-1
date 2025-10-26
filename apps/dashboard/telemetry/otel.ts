import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const exporter: PrometheusExporter = new PrometheusExporter({
  port: 9464,
  endpoint: '/metrics',
});

export const otelSdk: NodeSDK = new NodeSDK({
  metricReader: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start OTEL SDK
otelSdk.start();
