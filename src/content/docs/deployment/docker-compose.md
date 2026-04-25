---
title: Docker Compose
description: Run Quibble with Docker Compose for simple self-hosting
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="note">
Docker Compose is suitable for single-server self-hosting. For production use with high availability, see [Kubernetes / Helm](/docs/deployment/helm/).
</Aside>

A full Docker Compose deployment runs the API, web frontend, Redis, and a reverse proxy together on a single host.

## Example compose file

```yaml
services:
  api:
    image: ghcr.io/play-quibble/trivia-api:latest
    restart: unless-stopped
    environment:
      ADDR: :8080
      DATABASE_URL: ${DATABASE_URL}
      REDIS_ADDR: redis:6379
      AUTH0_DOMAIN: ${AUTH0_DOMAIN}
      AUTH0_AUDIENCE: ${AUTH0_AUDIENCE}
      LOG_LEVEL: info
    depends_on:
      - redis

  web:
    image: ghcr.io/play-quibble/trivia-web:latest
    restart: unless-stopped
    environment:
      API_URL: http://api:8080
    depends_on:
      - api

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis-data:/data

volumes:
  redis-data:
```

Store secrets in a `.env` file (never commit it):

```env
DATABASE_URL=postgres://user:pass@host/dbname?sslmode=require
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.yourdomain.com
```

## Reverse proxy

Place nginx or Caddy in front to handle TLS and route traffic:

- `/api/*` → `api:8080`
- `/*` → `web:3000`

## Postgres

Postgres is not included in the compose file above — use a managed service ([Neon](https://neon.tech) has a generous free tier) or run your own Postgres container with a persistent volume.

Run migrations before starting the API for the first time:

```bash
docker run --rm \
  -e DATABASE_URL="${DATABASE_URL}" \
  ghcr.io/play-quibble/trivia-api:latest \
  /app/api migrate up
```
