# Kira backup scripts

From the repository root, with Node.js, project dependencies installed via npm ci,
and PostgreSQL 17 tools in C:\Program Files\PostgreSQL\17\bin, run in PowerShell:

```powershell
.\scripts\backup-kira.ps1 -BackupRoot "$env:USERPROFILE\Kira-Backups"
```

Keep both scripts together. The PowerShell script locates backup-receipts.mjs
beside itself; Node resolves @supabase/supabase-js from the repository's node_modules.
The explicit backup path avoids the known PostgreSQL tools issue with this
machine's redirected Documents folder containing non-ASCII characters.
Without -BackupRoot, the existing default remains Documents\Kira-Backups.

The script prompts privately for the database password and Supabase service-role
key. Do not put either value in source files, command arguments, or Git.
Output is a timestamped folder containing database/roles.sql, schema.sql, data.sql,
receipts and its backup-manifest.json, plus backup-summary.json. Backups contain
private data; keep them outside the repository. Kira-Backups/ is also ignored by Git.

## Phase 16 migration record

supabase/migrations/20260918043408_phase16_least_privilege_hardening.sql copies
SQL from the live project's migration history (project zuueyhjzlcmegpklpdcb).
It was already applied remotely. This is a local history sync; do not replay it
on production. A restore test remains deferred.
