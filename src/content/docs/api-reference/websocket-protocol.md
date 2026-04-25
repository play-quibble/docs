---
title: WebSocket Protocol
description: Real-time game messaging protocol over WebSocket
---

The game runs over a single WebSocket connection per participant at `/ws/:gameCode`.

- **Hosts** connect with a Bearer token (`Authorization` header or `?token=` query param).
- **Players** connect with the session token returned by `POST /join`.

All messages are JSON with the envelope:

```json
{ "type": "message_type", "payload": { ... } }
```

## Game phases

```
lobby → question → round_review → leaderboard → (next round or) ended
```

Each phase determines which messages are valid.

## Host → Server

Messages sent by the host to control the game.

| Type | Phase | Payload | Description |
|---|---|---|---|
| `start_game` | `lobby` | — | Start the game; transitions to `question` |
| `release_question` | `question` | `{ "questionId": "uuid" }` | Reveal a question to all players |
| `end_round` | `question` | — | Close the round; transitions to `round_review` |
| `override_answer` | `round_review` | `{ "playerId": "uuid", "questionId": "uuid", "correct": true }` | Mark a player's answer correct or incorrect |
| `release_scores` | `round_review` | — | Send scores to all players; transitions to `leaderboard` |
| `start_next_round` | `leaderboard` | — | Begin the next round; transitions to `question` |
| `end_game` | `leaderboard` | — | End the game; transitions to `ended` |

## Player → Server

| Type | Phase | Payload | Description |
|---|---|---|---|
| `submit_answer` | `question` | `{ "questionId": "uuid", "answer": "string" }` | Submit an answer. Multiple questions can be open simultaneously; include `questionId` to identify which one. |

## Server → All participants

Broadcast to every connected client (host and all players).

| Type | Trigger | Payload | Description |
|---|---|---|---|
| `lobby_update` | Player joins/leaves | `{ "players": [{ "id": "uuid", "displayName": "string" }] }` | Current lobby state |
| `game_started` | `start_game` | — | Game has begun |
| `question_released` | `release_question` | `{ "question": { "id", "text", "type", "choices"?, "points" } }` | A question is now open for answers |
| `round_ended` | `end_round` | — | No more questions in this round |
| `round_leaderboard` | `release_scores` | `{ "leaderboard": [{ "playerId", "displayName", "score", "rank" }] }` | Round leaderboard shown to all |
| `game_ended` | `end_game` | `{ "leaderboard": [...] }` | Final leaderboard |

## Server → Host only

| Type | Trigger | Payload | Description |
|---|---|---|---|
| `scoreboard_update` | Answer submitted | `{ "questionId": "uuid", "answerCount": 3 }` | Live answer count per question |
| `round_review` | `end_round` | `{ "answers": [{ "playerId", "displayName", "questionId", "answer", "correct" }] }` | All player answers for review before scores are released |
| `override_applied` | `override_answer` | `{ "playerId", "questionId", "correct" }` | Confirmation of score override |

## Server → Player only

| Type | Trigger | Payload | Description |
|---|---|---|---|
| `answer_accepted` | `submit_answer` | `{ "questionId": "uuid" }` | Server acknowledged the player's answer |
| `round_scores` | `release_scores` | `{ "results": [{ "questionId", "question", "yourAnswer", "correctAnswer", "correct", "points" }], "roundTotal": 42 }` | Per-question results and round total for this player |
| `scoreboard_update` | `release_scores` | `{ "leaderboard": [...] }` | Running leaderboard update sent to individual players |

## Error handling

If a message is sent in the wrong phase or with invalid data, the server closes the connection with a WebSocket close code and reason string. Clients should handle reconnection with exponential backoff.

## Example: question flow

```
host   → server:  { "type": "release_question", "payload": { "questionId": "abc123" } }
server → all:     { "type": "question_released", "payload": { "question": { ... } } }
player → server:  { "type": "submit_answer", "payload": { "questionId": "abc123", "answer": "Paris" } }
server → player:  { "type": "answer_accepted", "payload": { "questionId": "abc123" } }
server → host:    { "type": "scoreboard_update", "payload": { "questionId": "abc123", "answerCount": 1 } }
```
