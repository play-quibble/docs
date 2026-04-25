---
title: Monitoring
description: Observability for your Quibble deployment
---

## Prometheus metrics

The API exposes Prometheus metrics at `/metrics` (default port `8080`). This includes standard Go runtime metrics plus HTTP request metrics from the Chi router middleware.

### Scrape config (standalone Prometheus)

```yaml
scrape_configs:
  - job_name: quibble-api
    static_configs:
      - targets: ['quibble-api.quibble.svc.cluster.local:8080']
```

### ServiceMonitor (kube-prometheus-stack)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: quibble-api
  namespace: quibble
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: quibble
      app.kubernetes.io/component: api
  endpoints:
    - port: http
      path: /metrics
```

## Health endpoints

| Endpoint | Description |
|---|---|
| `GET /healthz` | Liveness probe — checks Postgres and Redis connectivity |
| `GET /readyz` | Readiness probe — same checks, used by Kubernetes before routing traffic |

Both return `200 {"status":"ok"}` when healthy or `503` with a failure reason.

## Logging

The API uses structured JSON logging via Go's `slog`. Set `LOG_LEVEL` to control verbosity:

| Level | Use |
|---|---|
| `debug` | Verbose — request/response details, WebSocket events |
| `info` | Default — service lifecycle, errors |
| `warn` | Degraded state (e.g. Redis unreachable in dev) |
| `error` | Errors only |

Log output goes to stdout and is captured by your container runtime. In Kubernetes, forward to your log aggregator (Loki, Datadog, CloudWatch) via a DaemonSet log collector.

## Recommended alerts

| Alert | Condition |
|---|---|
| API down | No healthy pods for > 1 minute |
| High error rate | HTTP 5xx rate > 1% over 5 minutes |
| Postgres connection failures | `healthz` returning 503 |
| Redis connection failures | `healthz` returning 503 |
