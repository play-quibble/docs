---
title: Going to Production
description: Checklist and recommendations for a production Quibble deployment
---

import { Aside } from '@astrojs/starlight/components';

## Checklist

- [ ] Postgres running outside the cluster (Neon, RDS, Cloud SQL) with SSL
- [ ] `DEV_AUTH_TOKEN` is **empty** — never set this in production
- [ ] Auth0 SPA and API configured with your production domain
- [ ] TLS enabled on the ingress (cert-manager + Let's Encrypt)
- [ ] Redis persistence enabled (AOF or RDB snapshot)
- [ ] Resource requests and limits set on all pods
- [ ] Liveness and readiness probes verified (`/healthz`, `/readyz`)
- [ ] Prometheus scraping enabled if running kube-prometheus-stack

## Postgres

Use a managed Postgres service. The `DATABASE_URL` must include `sslmode=require`.

Run migrations as a pre-install/pre-upgrade Helm hook or a one-shot Job:

```bash
kubectl run migrate --rm -it \
  --image=ghcr.io/play-quibble/trivia-api:latest \
  --restart=Never \
  --env="DATABASE_URL=${DATABASE_URL}" \
  -- /app/api migrate up
```

## Redis

The in-cluster Redis StatefulSet (enabled by default in the Helm chart) is sufficient for most deployments. For high availability, replace it with a managed Redis (DigitalOcean Managed Redis, Elasticache, Memorystore).

## Secrets management

Never put secrets in `values.yaml`. Use one of:

- **Kubernetes Secret** created out-of-band (`kubectl create secret`) and referenced via `api.existingSecret`
- **External Secrets Operator** syncing from AWS Secrets Manager, GCP Secret Manager, or Vault
- **Sealed Secrets** for GitOps-safe encrypted secret manifests

## Scaling

The API is stateful per WebSocket connection. For multiple replicas, enable Redis Pub/Sub fan-out (planned feature) and add sticky sessions to the ingress:

```yaml
nginx.ingress.kubernetes.io/affinity: "cookie"
nginx.ingress.kubernetes.io/session-cookie-name: "quibble-session"
```

## Observability

The API exposes Prometheus metrics at `/metrics`. Add a `ServiceMonitor` if you're running the kube-prometheus-stack:

```yaml
serviceMonitor:
  enabled: true
  namespace: monitoring
```

<Aside type="note">
The `ServiceMonitor` is not yet included in the Helm chart. Scrape `/metrics` manually or open a PR.
</Aside>

## Ingress

The recommended setup uses `ingress-nginx` with cert-manager:

```yaml
ingress:
  enabled: true
  className: nginx
  host: quibble.yourdomain.com
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  tls:
    enabled: true
    issuer: letsencrypt-prod
```

All traffic routes through one ingress:
- `/api/*` → API service
- `/*` → Web service
