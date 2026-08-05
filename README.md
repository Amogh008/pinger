# pinger-api

A tiny keep-alive companion service for the wordcontrol-api.

- Exposes `GET /pingtest` → `{ "message": "server active" }` (same shape as wordcontrol-api).
- Every 30 seconds it calls `WORDCONTROL_URL/pingtest` to keep that service awake.
- The wordcontrol-api pings this service back every 30 seconds (via its own `PINGER_URL`).
- Runs a minimal AstraDB lookup for `user_id = 123` at startup and every 12 hours.
- Exposes `GET /astra-keepalive`, which performs the same lookup and returns an empty `204` response.
- All ping failures are ignored — a missed ping never crashes or spams logs.

## Run locally

```bash
npm install
npm run dev
```

## Environment

| Var              | Purpose                                                            |
| ---------------- | ----------------------------------------------------------------- |
| `PORT`           | Port to listen on (default 4002).                                 |
| `WORDCONTROL_URL`| Base URL of wordcontrol-api. Leave blank to disable outbound pings.|
| `ASTRA_DB_APPLICATION_TOKEN` | AstraDB application token. |
| `ASTRA_DB_KEYSPACE` | Keyspace containing the `notes` table. |
| `ASTRA_DB_SECURE_BUNDLE_PATH` | Local path to the Secure Connect Bundle. |
| `ASTRA_DB_SECURE_BUNDLE_B64` | Base64 Secure Connect Bundle for hosted deployments. |
