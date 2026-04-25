---
title: Auth0 Setup
description: Configure Auth0 for Quibble host authentication
---

import { Steps } from '@astrojs/starlight/components';

Quibble uses Auth0 to authenticate **hosts** only. Players join without any account.

You need two Auth0 resources: an **SPA Application** (for the Next.js frontend) and an **API** (for the Go backend JWT validation).

## Prerequisites

- An Auth0 account (free tier is sufficient)
- Your Quibble deployment URL (e.g. `https://quibble.yourdomain.com`)

## Create the API

<Steps>

1. In the Auth0 dashboard, go to **Applications → APIs → Create API**.

2. Set:
   - **Name**: `Quibble API`
   - **Identifier**: `https://api.yourdomain.com` (this becomes `AUTH0_AUDIENCE` — can be any URL, doesn't need to resolve)

3. Leave **Signing Algorithm** as `RS256`.

4. Click **Create**.

</Steps>

## Create the SPA Application

<Steps>

1. Go to **Applications → Applications → Create Application**.

2. Set:
   - **Name**: `Quibble`
   - **Type**: `Single Page Web Applications`

3. Click **Create**.

4. On the **Settings** tab, configure:
   - **Allowed Callback URLs**: `https://quibble.yourdomain.com/api/auth/callback`
   - **Allowed Logout URLs**: `https://quibble.yourdomain.com`
   - **Allowed Web Origins**: `https://quibble.yourdomain.com`

5. Save changes and note the **Client ID** and **Client Secret**.

</Steps>

## Configure environment variables

### API

```env
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.yourdomain.com
```

### Web frontend

```env
AUTH0_SECRET=<random 32+ character string>
AUTH0_BASE_URL=https://quibble.yourdomain.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID=<your SPA client ID>
AUTH0_CLIENT_SECRET=<your SPA client secret>
```

Generate a random `AUTH0_SECRET`:
```bash
openssl rand -hex 32
```

## Local development

For local dev, set `DEV_AUTH_TOKEN` to any non-empty string in both the API and web app `.env` files. This bypasses Auth0 entirely — no Auth0 config is needed locally.

```env
# apps/api/.env
DEV_AUTH_TOKEN=devtoken123

# apps/web/.env.local
DEV_AUTH_TOKEN=devtoken123
```
