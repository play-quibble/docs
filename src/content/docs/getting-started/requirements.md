---
title: Requirements
description: What you need to run Quibble
---

## For local development

| Requirement | Version |
|---|---|
| Go | 1.23+ |
| Node.js | 22+ |
| Postgres | 14+ |
| Redis | 6+ |
| Auth0 account | Free tier works |

## For Kubernetes deployment

| Requirement | Notes |
|---|---|
| Kubernetes | 1.26+ (any distribution) |
| Helm | 3.x |
| Postgres | External — [Neon](https://neon.tech), RDS, Cloud SQL, or in-cluster |
| Ingress controller | ingress-nginx recommended |
| cert-manager | For automatic TLS via Let's Encrypt |
| Auth0 account | Free tier covers most self-hosted use cases |

## Auth0

Quibble uses Auth0 for host authentication. You need:

- An **SPA application** in Auth0 for the Next.js frontend
- An **API** in Auth0 for the Go backend JWT validation

Both can be created on the free tier. See [Auth0 Setup](/docs/configuration/auth0/) for the full walkthrough.

## Ports

| Service | Default port |
|---|---|
| API | 8080 |
| Web | 3000 |
| Redis | 6379 |

In production, both the API and web are exposed via a single ingress — no direct port access needed.
