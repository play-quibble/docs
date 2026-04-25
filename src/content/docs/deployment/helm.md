---
title: Kubernetes / Helm
description: Deploy Quibble to Kubernetes using the official Helm chart
---

import { Steps, Aside } from '@astrojs/starlight/components';

The official Helm chart deploys the API, web frontend, and Redis as a single release.

## Add the Helm repository

```bash
helm repo add quibble https://play-quibble.github.io/charts
helm repo update
```

## Install

<Steps>

1. **Create a values file**

   ```bash
   helm show values quibble/quibble > values.yaml
   ```

   Edit `values.yaml`. At minimum, set:

   ```yaml
   api:
     env:
       databaseUrl: "postgres://user:pass@host/dbname?sslmode=require"
       auth0Domain: "your-tenant.us.auth0.com"
       auth0Audience: "https://api.yourdomain.com"

   ingress:
     enabled: true
     className: nginx
     host: "quibble.yourdomain.com"
     tls:
       enabled: true
       issuer: letsencrypt-prod
   ```

   See the full [values reference](#values-reference) below.

2. **Create a namespace**

   ```bash
   kubectl create namespace quibble
   ```

3. **Create a secret for sensitive values**

   ```bash
   kubectl create secret generic quibble-secrets \
     --namespace quibble \
     --from-literal=databaseUrl="postgres://..." \
     --from-literal=auth0Domain="your-tenant.us.auth0.com" \
     --from-literal=auth0Audience="https://api.yourdomain.com"
   ```

   Reference the secret in `values.yaml`:
   ```yaml
   api:
     existingSecret: quibble-secrets
   ```

4. **Install the chart**

   ```bash
   helm install quibble quibble/quibble \
     --namespace quibble \
     --values values.yaml
   ```

5. **Verify**

   ```bash
   kubectl get pods -n quibble
   kubectl logs -n quibble deployment/quibble-api
   ```

</Steps>

## Upgrade

```bash
helm upgrade quibble quibble/quibble \
  --namespace quibble \
  --values values.yaml
```

## Uninstall

```bash
helm uninstall quibble --namespace quibble
```

## Values reference

| Key | Default | Description |
|---|---|---|
| `api.image.repository` | `ghcr.io/play-quibble/trivia-api` | API image |
| `api.image.tag` | `""` (chart appVersion) | Image tag |
| `api.replicaCount` | `1` | API replicas |
| `api.env.databaseUrl` | `""` | Postgres connection string |
| `api.env.auth0Domain` | `""` | Auth0 tenant domain |
| `api.env.auth0Audience` | `""` | Auth0 API audience |
| `api.existingSecret` | `""` | Name of existing Secret for env vars |
| `web.image.repository` | `ghcr.io/play-quibble/trivia-web` | Web image |
| `web.replicaCount` | `1` | Web replicas |
| `redis.enabled` | `true` | Deploy in-cluster Redis |
| `ingress.enabled` | `false` | Enable ingress |
| `ingress.className` | `nginx` | Ingress class |
| `ingress.host` | `""` | Hostname |
| `ingress.tls.enabled` | `false` | Enable TLS |
| `ingress.tls.issuer` | `letsencrypt-prod` | cert-manager ClusterIssuer name |

<Aside type="tip">
For the full annotated values file, run `helm show values quibble/quibble`.
</Aside>
