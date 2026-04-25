---
title: Quick Start
description: Run Quibble locally in under 10 minutes
---

import { Steps } from '@astrojs/starlight/components';

This guide gets Quibble running locally with a real Postgres database and Redis. Auth0 is bypassed using a dev token.

<Steps>

1. **Clone the repo**

   ```bash
   git clone https://github.com/play-quibble/trivia.git
   cd trivia
   ```

2. **Start Postgres and Redis**

   ```bash
   docker compose up -d
   ```

   This starts Postgres on `5432` and Redis on `6379`.

3. **Set up the API**

   ```bash
   cd apps/api
   cp .env.example .env
   ```

   Edit `.env` and set:
   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/quibble?sslmode=disable
   REDIS_ADDR=localhost:6379
   DEV_AUTH_TOKEN=devtoken123
   # Leave AUTH0_DOMAIN and AUTH0_AUDIENCE empty for local dev
   ```

   Run migrations and start:
   ```bash
   make migrate-up
   make run
   ```

   The API is now at `http://localhost:8080`. Health check: `curl http://localhost:8080/healthz`

4. **Set up the web frontend**

   In a new terminal:
   ```bash
   cd apps/web
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   API_URL=http://localhost:8080
   DEV_AUTH_TOKEN=devtoken123
   ```

   ```bash
   npm install
   npm run dev
   ```

   The app is now at `http://localhost:3000`.

5. **Log in**

   Open `http://localhost:3000`. With `DEV_AUTH_TOKEN` set, the app bypasses Auth0 and logs you in automatically as a dev host.

6. **(Optional) Seed questions**

   ```bash
   cd apps/api
   ./seed_questions.sh
   ```

</Steps>

## Docker Compose reference

The `docker-compose.yml` at the repo root starts:

| Service | Image | Port |
|---|---|---|
| postgres | postgres:16-alpine | 5432 |
| redis | redis:7-alpine | 6379 |

The application services themselves are not in Docker Compose for local dev — you run them directly with `make run` and `npm run dev`.
