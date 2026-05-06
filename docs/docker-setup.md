# Docker setup (backend)

This guide runs the NestJS backend in Docker with persistent uploads and Redis.

## 1) Prerequisites

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Verify:
  - `docker --version`
  - `docker compose version`

## 2) Files added

- `Dockerfile` (multi-stage image build)
- `docker-compose.yml` (API + Redis + optional local MongoDB profile)
- `.dockerignore` (faster build context)

## 3) Choose database mode

### Mode A (recommended now): Use your existing Atlas URI

Keep `MONGODB_URI` in `.env` as Atlas. Start only API container.

```bash
docker compose up -d --build api
```

Start API + Redis together:

```bash
docker compose up -d --build redis api
```

### Mode B: Use local Mongo in Docker

Use compose profile `localdb`, and set `MONGODB_URI` to:

`mongodb://mongo:27017/greenpro_db`

Then start:

```bash
docker compose --profile localdb up -d --build
```

## 4) Check app health

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f redis
```

Backend should be available at:

- `http://localhost:3000`
- Swagger (if enabled in app): `http://localhost:3000/api`

Redis should be available at:

- From **Windows / Redis Insight**: `localhost:6380` (maps to container port 6379)
- From **other containers** on the same Compose network: hostname `redis`, port `6379`

## 5) Upload persistence

`uploads` are stored in Docker named volume `uploads_data`, mounted at `/app/uploads`.

This keeps files after restart:

```bash
docker compose restart api
```

## 6) Common commands

Start:

```bash
docker compose up -d
```

Start in hot-reload development mode:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build redis api
```

Watch dev logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f api
```

Stop:

```bash
docker compose down
```

Stop + remove volumes (danger: removes local docker DB/uploads volumes):

```bash
docker compose down -v
```

Rebuild after dependency/code changes:

```bash
docker compose up -d --build
```

Open shell in API container:

```bash
docker compose exec api sh
```

Open Redis CLI:

```bash
docker compose exec redis redis-cli
```

Flush Redis cache (local only):

```bash
docker compose exec redis redis-cli FLUSHALL
```

## 7) Redis env vars

Add these to `.env`:

```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=greenpro:
CACHE_ENABLED=true
CACHE_TTL_SECONDS=60
```

## 8) Redis common service usage

Use `RedisService` from `src/common/redis/redis.service.ts` in any module:

```ts
constructor(private readonly redisService: RedisService) {}

const key = this.redisService.buildKey('vendor', vendorId, 'stats');
await this.redisService.set(key, payload, 120);
const cached = await this.redisService.get<typeof payload>(key);
```

The app also enables route-level cache via `CacheInterceptor` backed by Redis.

## 9) Redis Insight

In Redis Insight, connect with:

- Host: `127.0.0.1`
- Port: `6380` (see `docker-compose.yml` host port mapping)
- Password: blank (unless configured)

## 10) Troubleshooting

- **Port 3000 busy**: change mapping in `docker-compose.yml` to `"3001:3000"`.
- **Mongo connection refused**:
  - If using Atlas, confirm `.env` URI and network allowlist.
  - If using local profile, ensure `--profile localdb` is used and URI points to `mongo`.
- **No email received**:
  - Confirm SMTP values in `.env`.
  - If using Mailtrap, check Mailtrap inbox (not Gmail inbox).
- **Redis connection refused**:
  - Confirm Redis container is running: `docker compose ps`
  - Check `REDIS_HOST=redis` inside Docker-based app setup.

