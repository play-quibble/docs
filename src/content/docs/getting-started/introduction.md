---
title: Introduction
description: What Quibble is and how it works
---

Quibble is a self-hosted live trivia platform. A host creates question banks and quizzes, launches a game, and players join from any browser using a 6-character code — no account or app install required.

## How it works

### Building content

1. **Create a question bank** — a reusable library of questions. Each question is either a text answer (accepts a list of valid spellings) or multiple choice (2–6 options). Questions have point values and can be reordered.
2. **Build a quiz** — a curated program of rounds. Add rounds in order, then pick questions from any of your banks into each round.

### Running a game

3. **Launch a game** — from any quiz, click *Launch Game*. A 6-character join code is generated and you land on the host panel.
4. **Players join** — players go to the app URL, enter the code and a display name, and appear in the lobby.
5. **Start the game** — the first round begins.
6. **Release questions one at a time** — players can answer any released question in the current round at their own pace.
7. **End the round → review answers** — the host sees every player's answer and can mark any free-text answer correct with *Mark ✓*.
8. **Release scores** — each player receives per-question results and a round total. A leaderboard shows after every round.
9. **Repeat or end** — start the next round or end the game. A final leaderboard is shown to all players.

## Stack

| Layer | Technology |
|---|---|
| Backend | Go 1.23, Chi router |
| Database | Postgres (goose migrations, sqlc query layer) |
| Cache / realtime | Redis |
| Auth | Auth0 |
| Frontend | Next.js (App Router) |
| Deployment | Kubernetes, Helm |
| GitOps | Argo CD + Kustomize |

## Architecture

The API and web frontend are separate containers. The API serves HTTP routes and a WebSocket endpoint for live game state. A single Redis instance handles game state caching; Redis Pub/Sub is the planned path for multi-replica scale-out.

```
Browser (host)  ──┐
                  ├── ingress-nginx ──┬── /api/* ── Go API ── Postgres
Browser (player)──┘                  └── /*      ── Next.js
                                              Go API ── Redis
```

Scaling out the API adds WebSocket fan-out via Redis Pub/Sub — an additive change, not a rewrite.
