---
title: REST API
description: Quibble HTTP API reference
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="note">
A machine-readable OpenAPI spec is planned. This page documents the API manually in the interim.
</Aside>

All API routes are prefixed with `/api` when accessed through the web app's proxy. Direct API calls use the base URL configured in `ADDR` (default `:8080`).

## Authentication

All host routes require a Bearer token from Auth0:

```
Authorization: Bearer <access_token>
```

In local dev with `DEV_AUTH_TOKEN` set, pass the dev token instead:

```
Authorization: Bearer devtoken123
```

Player routes (join, submit answer) are unauthenticated.

## Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/healthz` | Liveness — checks Postgres + Redis |
| `GET` | `/readyz` | Readiness — same checks |

Both return `200 OK` with `{"status":"ok"}` when healthy.

## Question Banks

| Method | Path | Description |
|---|---|---|
| `GET` | `/banks` | List all banks owned by the authenticated host |
| `POST` | `/banks` | Create a bank |
| `GET` | `/banks/:id` | Get a bank with its questions |
| `PUT` | `/banks/:id` | Update a bank |
| `DELETE` | `/banks/:id` | Delete a bank |

### Question endpoints (nested under banks)

| Method | Path | Description |
|---|---|---|
| `GET` | `/banks/:id/questions` | List questions in a bank |
| `POST` | `/banks/:id/questions` | Add a question |
| `PUT` | `/banks/:bankId/questions/:id` | Update a question |
| `DELETE` | `/banks/:bankId/questions/:id` | Delete a question |

## Quizzes

| Method | Path | Description |
|---|---|---|
| `GET` | `/quizzes` | List all quizzes |
| `POST` | `/quizzes` | Create a quiz |
| `GET` | `/quizzes/:id` | Get a quiz with rounds and questions |
| `PUT` | `/quizzes/:id` | Update a quiz |
| `DELETE` | `/quizzes/:id` | Delete a quiz |

### Round endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/quizzes/:id/rounds` | Add a round |
| `PUT` | `/quizzes/:quizId/rounds/:id` | Update a round |
| `DELETE` | `/quizzes/:quizId/rounds/:id` | Remove a round |
| `POST` | `/quizzes/:quizId/rounds/:id/questions` | Add a question to a round |
| `DELETE` | `/quizzes/:quizId/rounds/:roundId/questions/:id` | Remove a question from a round |

## Games

| Method | Path | Description |
|---|---|---|
| `GET` | `/games` | List all games |
| `POST` | `/games` | Create a game from a quiz |
| `GET` | `/games/:id` | Get game details |
| `DELETE` | `/games/:id` | Delete a game |

## Players (unauthenticated)

| Method | Path | Description |
|---|---|---|
| `POST` | `/join` | Join a game by code. Body: `{"code":"ABCDEF","displayName":"Alice"}`. Returns a session token for the WebSocket. |

## WebSocket

| Path | Description |
|---|---|
| `/ws/:gameCode` | Real-time game connection. See [WebSocket Protocol](/docs/api-reference/websocket-protocol/). |

## IDs

All resource IDs are UUIDv7, generated app-side. Every `POST` response includes the created resource with its `id`.
