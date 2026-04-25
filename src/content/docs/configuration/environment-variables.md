---
title: Environment Variables
description: All environment variables for the Quibble API and web frontend
---

## API (`apps/api`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `ADDR` | No | `:8080` | Listen address |
| `DATABASE_URL` | Yes | — | Postgres connection string |
| `REDIS_ADDR` | Yes | — | Redis address (e.g. `localhost:6379`) |
| `REDIS_PASSWORD` | No | `""` | Redis password if authentication is enabled |
| `AUTH0_DOMAIN` | Yes* | — | Auth0 tenant domain (e.g. `tenant.us.auth0.com`) |
| `AUTH0_AUDIENCE` | Yes* | — | Auth0 API audience (e.g. `https://api.yourdomain.com`) |
| `LOG_LEVEL` | No | `info` | Log level: `debug`, `info`, `warn`, `error` |
| `DEV_AUTH_TOKEN` | No | `""` | **Local dev only.** Any non-empty string bypasses Auth0. Must be empty in production. |

*Required in production. Can be omitted locally when `DEV_AUTH_TOKEN` is set.

### DATABASE_URL format

```
postgres://user:password@host:5432/dbname?sslmode=require
```

For local development without SSL:
```
postgres://postgres:postgres@localhost:5432/quibble?sslmode=disable
```

## Web frontend (`apps/web`)

| Variable | Required | Description |
|---|---|---|
| `API_URL` | Yes | Internal URL of the API (server-side only, not exposed to the browser) |
| `AUTH0_SECRET` | Yes* | Random secret for Auth0 session encryption (32+ chars) |
| `AUTH0_BASE_URL` | Yes* | Public URL of the web app (e.g. `https://quibble.yourdomain.com`) |
| `AUTH0_ISSUER_BASE_URL` | Yes* | Auth0 tenant URL (e.g. `https://tenant.us.auth0.com`) |
| `AUTH0_CLIENT_ID` | Yes* | Auth0 SPA application client ID |
| `AUTH0_CLIENT_SECRET` | Yes* | Auth0 SPA application client secret |
| `DEV_AUTH_TOKEN` | No | Must match the API's `DEV_AUTH_TOKEN` for local dev auth bypass |

*Required in production.

## Notes

- `API_URL` is a server-side variable — it never appears in the browser bundle. The Next.js app proxies API calls server-side, keeping auth tokens off the client.
- `DEV_AUTH_TOKEN` in the web app causes `src/lib/session.ts` to return a hardcoded `DEV_SESSION`. Set the same value in both the API and web app when developing locally.
