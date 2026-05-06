# Redis module priority plan

This file lists which backend modules should adopt `RedisService` first, and what to use Redis for in each.

Current Redis foundation already exists:

- `src/common/redis/redis.module.ts`
- `src/common/redis/redis.service.ts`

## Priority 1 (implement first)

These give immediate performance wins with low risk.

1. **Categories module** (`src/categories`)
   - Status: already implemented for list caching.
   - Use case:
     - Cache: `GET /categories`
     - Invalidate on create/update/status/delete.
   - Why first:
     - High read frequency
     - Data changes less frequently than reads

2. **Sectors module** (`src/sectors`)
   - Use case:
     - Cache list endpoints and dropdown data.
   - Why:
     - Small, mostly static lookup data used in many forms.

3. **Standards module** (`src/standards`)
   - Use case:
     - Cache standards list + filtered lookups.
   - Why:
     - Similar profile to sectors/categories (heavy reads, low write rate).

4. **Countries + States modules** (`src/countries`, `src/states`)
   - Use case:
     - Cache list/search endpoints.
   - Why:
     - Very stable reference data; ideal for Redis TTL caching.

## Priority 2 (high value, moderate complexity)

5. **Dashboard module** (`src/dashboard`)
   - Use case:
     - Cache expensive aggregate responses for short TTL (30-120s).
   - Why:
     - Dashboards often execute many DB queries and aggregations.

6. **Website module** (`src/website`)
   - Use case:
     - Public list content caching (banner/newsletter/contact listing where appropriate).
   - Why:
     - Public endpoints benefit most from response caching.

7. **Admin banner/event listing** (`src/admin`)
   - Use case:
     - Cache public or stable list endpoints only.
   - Why:
     - Frequent UI reads; easy invalidation on CRUD.

## Priority 3 (careful/scoped caching)

8. **Product registration and product listing modules** (`src/product-registration`)
   - Use case:
     - Cache filtered list responses with strict key scoping.
   - Why:
     - Heavy queries, but high key-cardinality and frequent updates.
   - Caution:
     - Key must include all filters + role/tenant context.

9. **Payments module** (`src/payments`)
   - Use case:
     - Cache read-only report summaries only.
   - Why:
     - Can reduce DB pressure for repeated report views.
   - Caution:
     - Avoid caching payment state transitions or sensitive details blindly.

10. **Documents / audit / activity log modules** (`src/documents`, `src/audit-log`, `src/activity-log`)
    - Use case:
      - Short TTL cache for list/search views if heavy.
    - Why:
      - Useful for repeated table browsing.
    - Caution:
      - Ensure audit visibility is acceptable with eventual consistency.

## Usually NOT first for Redis caching

11. **Auth module** (`src/auth`)
    - Better Redis usage (later):
      - Refresh token/session storage
      - Token blacklist/revocation
      - Rate limiting counters
    - Not first for simple response caching.

12. **RBAC module** (`src/rbac`)
    - Better Redis usage (later):
      - Permission set caching per staff user with explicit invalidation on role update.
    - Caution:
      - Stale permission cache can cause security confusion.

## Cache key strategy (recommended)

- Prefix all keys with env prefix:
  - `REDIS_KEY_PREFIX=greenpro:`
- Module style:
  - `greenpro:categories:list:{normalizedQuery}`
  - `greenpro:sectors:list:{normalizedQuery}`
  - `greenpro:dashboard:summary:{vendorId}`
- Always normalize query params before key generation (sort arrays, trim strings).

## TTL guidance

- Lookup lists (categories/sectors/standards/countries/states): `300-1800s`
- Dashboard summaries: `30-120s`
- Public website lists: `60-300s`
- Sensitive or rapidly changing business data: `15-60s` or no cache until validated

## Invalidation strategy

- For each module, invalidate cache on write paths:
  - create
  - update
  - status toggle
  - delete
- Prefer narrow invalidation patterns:
  - example: `greenpro:categories:list:*`

## Suggested implementation order (actionable)

1. Categories (done)
2. Sectors(done)
3. Standards(done)
4. Countries(done)
5. States(done)
6. Dashboard
7. Website public lists(done)
8. Admin list endpoints
9. Product listings(done)
10.Auth module(done)
11. RBAC permission cache (with strict invalidation) (done)

