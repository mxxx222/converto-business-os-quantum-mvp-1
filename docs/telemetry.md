# Telemetry (Prometheus + OpenTelemetry)

- Exporter runs at http://localhost:9464/metrics (service: dashboard)
- Metrics:
  - alerts_status_count (gauge): active dedupe entries
  - alerts_last_reset_timestamp_seconds (gauge): epoch seconds of last dedupe reset

Scrape example (Prometheus):

```
- job_name: 'dashboard-alerts'
  static_configs:
    - targets: ['dashboard:9464']
```

Local check:

```
curl -s http://localhost:9464/metrics | grep alerts_status_count || true
```
