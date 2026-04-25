---
title: Backups & Restore
description: Backing up and restoring your Quibble data
---

All persistent Quibble state lives in **Postgres**. Redis holds only ephemeral game state — active games in progress — and does not need to be backed up.

## What to back up

| Data | Location | Required |
|---|---|---|
| Question banks and questions | Postgres | Yes |
| Quizzes and rounds | Postgres | Yes |
| Game history and answers | Postgres | Yes |
| User accounts | Postgres | Yes |
| Active game state | Redis | No (ephemeral) |

## Postgres backup

### pg_dump (manual)

```bash
pg_dump "${DATABASE_URL}" \
  --format=custom \
  --no-acl \
  --no-owner \
  -f quibble-$(date +%Y%m%d-%H%M%S).dump
```

### Restore

```bash
pg_restore \
  --no-acl \
  --no-owner \
  -d "${DATABASE_URL}" \
  quibble-20260101-120000.dump
```

### Managed Postgres backups

If you're using a managed Postgres service, enable automated backups in the provider's dashboard:

- **Neon**: point-in-time restore is available on all plans
- **DigitalOcean Managed Postgres**: daily backups with 7-day retention
- **AWS RDS**: automated backups + manual snapshots

## Kubernetes CronJob

For in-cluster backups using a scheduled Kubernetes job:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: quibble-backup
  namespace: quibble
spec:
  schedule: "0 3 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: postgres:16-alpine
              env:
                - name: DATABASE_URL
                  valueFrom:
                    secretKeyRef:
                      name: quibble-secrets
                      key: databaseUrl
              command:
                - /bin/sh
                - -c
                - |
                  pg_dump "$DATABASE_URL" \
                    --format=custom \
                    -f /backup/quibble-$(date +%Y%m%d-%H%M%S).dump
              volumeMounts:
                - name: backup
                  mountPath: /backup
          volumes:
            - name: backup
              persistentVolumeClaim:
                claimName: quibble-backup-pvc
          restartPolicy: OnFailure
```
