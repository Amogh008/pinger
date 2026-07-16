# pinger-api

A tiny keep-alive companion service for the wordcontrol-api.

- Exposes `GET /pingtest` → `{ "message": "server active" }` (same shape as wordcontrol-api).
- Every 10 minutes it calls `WORDCONTROL_URL/pingtest` to keep that service awake.
- The wordcontrol-api pings this service back every 10 minutes (via its own `PINGER_URL`).
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
