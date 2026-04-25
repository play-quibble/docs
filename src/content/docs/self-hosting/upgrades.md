---
title: Upgrades
description: How to upgrade Quibble to a new version
---

import { Aside } from '@astrojs/starlight/components';

Quibble follows [Semantic Versioning](https://semver.org). Patch and minor releases are safe to upgrade without reading the changelog. Major releases may include database migrations or breaking changes.

## Check the current version

```bash
helm list -n quibble
```

## Before upgrading

1. **Back up Postgres** — see [Backups & Restore](/docs/self-hosting/backups/).
2. **Read the [CHANGELOG](https://github.com/play-quibble/trivia/blob/main/CHANGELOG.md)** for any migration notes.
3. Ensure no games are currently in progress — active WebSocket state is not persisted across restarts.

## Upgrade with Helm

```bash
helm repo update
helm upgrade quibble quibble/quibble \
  --namespace quibble \
  --values values.yaml
```

Helm will perform a rolling update of the API and web deployments.

## Database migrations

Migrations run automatically on API startup via `goose`. No manual step is required. If the API pod fails to start after an upgrade, check its logs for migration errors:

```bash
kubectl logs -n quibble deployment/quibble-api
```

## Rolling back

If an upgrade causes issues, roll back the Helm release:

```bash
helm rollback quibble -n quibble
```

This restores the previous chart version. If a migration was applied, you may need to run a manual rollback migration — check the `CHANGELOG` for instructions.

<Aside type="caution">
Helm rollback does **not** undo database migrations. Always back up before upgrading.
</Aside>
