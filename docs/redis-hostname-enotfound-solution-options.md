# Redis `ENOTFOUND redis` — Detailed Fix Guide (Without `.env.docker`)

This guide explains why you see:

`getaddrinfo ENOTFOUND redis`

and gives practical solution options **without creating `.env.docker`**.

---

## Why this error happens

Your app reads:

```env
REDIS_HOST=redis
```

`redis` is a Docker Compose service hostname.  
It resolves only inside Docker network (for containers talking to each other).

If you run the API directly on Windows host using:

```powershell
npm run start:dev
```

then hostname `redis` cannot be resolved by host DNS, so Node throws:

- `ENOTFOUND redis`
- `getaddrinfo ENOTFOUND redis`

---

## Choose one solution option

## Option 1 (Recommended if API runs locally): Use host Redis endpoint in `.env`

If you run API from host terminal (`npm run start:dev`), set:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6380
```

Use port:
- `6380` when using your Docker Redis mapping (`6380:6379`)
- `6379` if your Redis is local on 6379

### Pros
- Simple
- Persistent setup
- No command changes each run

### Cons
- If you later run API inside Docker, you must switch back to `redis:6379`

---

## Option 2 (No file change): Override env only for current terminal session

Keep `.env` unchanged, and before starting app run:

```powershell
$env:REDIS_HOST="127.0.0.1"
$env:REDIS_PORT="6380"
npm run start:dev
```

These values override `.env` for that PowerShell session only.

### Pros
- No file edits
- Useful when you switch contexts often

### Cons
- Must re-run each new terminal

---

## Option 3: Add extra npm script for local Redis host

Add script in `package.json`:

```json
"start:dev:localredis": "cross-env REDIS_HOST=127.0.0.1 REDIS_PORT=6380 nest start --watch"
```

Then run:

```powershell
npm run start:dev:localredis
```

### Pros
- No repeated manual env commands
- `.env` can remain docker-friendly

### Cons
- Requires small script update in `package.json`

---

## Option 4: Keep Redis optional when host unreachable

Your `RedisService` already logs warning and can continue in some flows, but current startup still shows hard failure in your run.

You can temporarily disable cache while running host mode:

```env
CACHE_ENABLED=false
```

This avoids Redis dependency for debugging other features.

### Pros
- Fast unblock for development

### Cons
- Redis caching behavior not tested in this mode

---

## Which option should you use?

- Mostly run API locally: **Option 1**
- Need frequent switching and don’t want file edits: **Option 2**
- Want one clean command for local mode: **Option 3**
- Need temporary unblock only: **Option 4**

---

## Quick verification commands

## 1) Check Redis container is running

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Expected Redis container:
- `greenpro_redis`

## 2) Test Redis responds

```powershell
docker exec -it greenpro_redis redis-cli ping
```

Expected:
- `PONG`

## 3) Test API in local mode

After setting `REDIS_HOST=127.0.0.1` and matching `REDIS_PORT`, run:

```powershell
npm run start:dev
```

You should not see `ENOTFOUND redis`.

---

## Important context for your setup

In your current project:
- Docker Redis is exposed on host `6380`
- Local API (`npm run start:dev`) should target `127.0.0.1:6380`
- Docker API (`docker compose up`) should target `redis:6379`

That host/context difference is the entire root cause.
