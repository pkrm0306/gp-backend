# Run App Every Time (Docker + Redis)

Use this quick guide whenever you want to start the backend with Docker and Redis.

## 1) Open project folder

```powershell
Set-Location "D:\Node\cursor-greenpro-mern"
```

## 2) Start Redis + API (development mode, hot reload)

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build redis api
```

This starts:
- `greenpro_redis` (Redis container)
- `greenpro_api_dev` (NestJS in watch mode)

## 3) Check containers are running

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Expected:
- `greenpro_redis` -> `Up ... (healthy)`
- `greenpro_api_dev` -> `Up ...` (may show `health: starting` for a short time)

## 4) Check API logs (optional, useful after code changes)

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f api
```

Stop log streaming with `Ctrl + C`.

## 5) Verify Redis is reachable

```powershell
docker exec -it greenpro_redis redis-cli ping
```

Expected output:
- `PONG`

## 6) Stop containers when done

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

---

## Quick Restart Commands

### Restart only API container

```powershell
docker restart greenpro_api_dev
```

### Restart only Redis container

```powershell
docker restart greenpro_redis
```

### Rebuild and restart fresh

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build redis api
```

---

## If Port/Container Conflicts Happen

### If Redis port conflict appears

Check who is using host port:

```powershell
netstat -ano | findstr :6379
netstat -ano | findstr :6380
```

Your compose is configured to expose Redis on host `6380`, so Redis Insight should connect to:
- Host: `127.0.0.1`
- Port: `6380`

---

## One-Line Daily Start (recommended)

```powershell
Set-Location "D:\Node\cursor-greenpro-mern"; docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build redis api
```
