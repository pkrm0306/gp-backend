# GreenPro MySQL → MongoDB Migration Scripts

**Prepared for:** Live dump `greenpro (16).sql` (Jul 07, 2026, ~100,793 rows across 59 tables)  
**Status:** Scripts only — **not executed** against your live MongoDB.

## Design principles

1. **Separate migration database** — all writes go to `MIGRATION_MONGO_URI` (never the live app DB by default).
2. **Dual ID on every row** — MongoDB `_id` (ObjectId) **plus** preserved MySQL numeric primary key on each document.
3. **Central ID map** — `migration_id_map` collection stores `mysqlTable + mysqlId → mongoId` for FK resolution and audits.
4. **Phased execution** — reference → identity → products → payments → process → renewal → CMS.
5. **Table-wise scripts** — one registry entry per MySQL table; run individually or by phase.

## Folder layout

```
src/scripts/mysql-migration/
  run-migration.ts          # Orchestrator CLI
  validate-counts.ts        # MySQL vs Mongo row counts
  lib/
    table-registry.ts       # All 60+ tables, phases, handlers
    generic-migrator.ts     # Snake_case → camelCase ETL for process/raw_materials
    id-map.ts               # migration_id_map service
    migration-guard.ts      # Blocks accidental live DB target
  migrators/
    custom/                 # manufacturers merge, users, products, plants, payments…
scripts/analyze-sql-dump.mjs
docker-compose.migration-mysql.yml
.env.migration.example
```

## Prerequisites

1. **Staging MySQL** with dump loaded (recommended):

```bash
docker compose -f docker-compose.migration-mysql.yml up -d
docker exec -i greenpro_migration_mysql mysql -ugreenpro -pgreenpro greenpro < "greenpro (16).sql"
```

2. **Empty migration MongoDB** (local or Atlas):

```bash
cp .env.migration.example .env.migration
# Edit MIGRATION_MONGO_URI=mongodb://127.0.0.1:27017/greenpro_migration
```

3. Install dependencies (includes `mysql2`):

```bash
npm install
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run migrate:mysql:list` | List all tables, phases, handlers |
| `npm run migrate:mysql:analyze` | Row counts from SQL file (no MySQL needed) |
| `npm run migrate:mysql -- --phase=1` | Run phase 1 only |
| `npm run migrate:mysql -- --table=products` | Run single table |
| `npm run migrate:mysql -- --all` | Run all phases (full migration) |
| `npm run migrate:mysql -- --dry-run` | Simulate without Mongo writes (true rehearsal — resolves FKs) |
| `npm run migrate:mysql -- --fresh --all` | Drop all migration-DB collections first, then run all phases |
| `npm run migrate:mysql:validate` | Compare MySQL vs Mongo counts |

> On Windows PowerShell, `npm run ... -- --flag` may not forward flags. If so, run directly:
> `npx ts-node -r tsconfig-paths/register src/scripts/mysql-migration/run-migration.ts --fresh --all`

### `--fresh` and idempotency

The migration DB has no unique indexes, so re-running without `--fresh` **appends duplicates**.
Always use `--fresh` when re-running a full migration so it drops existing collections first.
Dry runs never write, so `--fresh` is ignored in dry-run mode.

## Migration phases

| Phase | Tables |
|-------|--------|
| 1 | `sectors`, `categories`, `standards`, `states` (+ seed `countries`) |
| 2 | `manufacturers`, `vendors` (merged into `manufacturers`) |
| 3 | `admin`, `vendor_users`, `team_members` → `users` |
| 4 | `products`, `product_plants`, `offline_product_plants` (archive) |
| 5 | `payment_details`, `online_payment_details` |
| 6 | `all_product_documents`, `all_renew_product_documents` |
| 7 | All `process_*` registration tables |
| 8 | All 15 `raw_materials_*` tables |
| 9 | All `process_renew_*` tables |
| 10 | Synthetic `renewal_cycles` |
| 11 | `banners`, `events`, `contacts`, `subscription_list`, `notifications` |
| 12 | `basic_details`, `newsletter_release` (archived) |

## Dual ID examples

| MySQL | Mongo collection | Numeric field kept |
|-------|------------------|-------------------|
| `products.product_id` | `products` | `productId` |
| `vendors.vendor_id` | `manufacturers` | `legacyVendorId` |
| `manufacturers.manufacturer_id` | `manufacturers` | `legacyManufacturerId` |
| `vendor_users.vendor_user_id` | `users` | `legacyVendorUserId` |
| `product_plants.product_plant_id` | `product_plants` | `productPlantId` |

Every migrated row also has `_id` (ObjectId) and an entry in `migration_id_map`.

## Special handling notes

- **Vendor/manufacturer merge** — `vendor_id` FKs resolve to `manufacturers._id` (vendor profile fields merged onto manufacturer doc).
- **Standalone vendors** — vendors with `manufacturer_id = 0` (self-registered) or a deleted manufacturer are **promoted to their own manufacturer document** (in the merged model a vendor *is* a manufacturer), so their products/plants/payments still resolve.
- **Passwords** — legacy MD5 stored in `legacyPasswordHash`; plan force-reset or custom verifier before live cutover.
- **Product plants** — MySQL `state` is numeric (`states.id`); mapped to `stateId` ObjectId + default India `countryId`.
- **Banners** — legacy CMS banners have no `vendor_id`; assigned a synthetic platform manufacturer.
- **Online payments** — stored in `migration_online_payments` (no MERN collection yet).
- **Archives** — `basic_details`, `newsletter_release`, `offline_product_plants` → `migration_legacy_archives`.
- **Files** — document paths copied as-is (`legacyDocumentLink`); S3 migration is a separate job.
- **renewal_cycles** — synthesized from `product_renew_status` + renew `payment_details` rows.
- **Skipped rows are captured, not lost** — any row that cannot be migrated (missing FK / draft data) is written to the `migration_skipped` collection with `sourceTable`, `legacyId`, `reason`, and the full original `payload` for review.

## Expected data-quality skips (from live dump `greenpro (16).sql`)

These are **legacy source-data issues**, not script bugs. They are counted as `errors` in the run summary and captured in `migration_skipped`:

| Table | Skipped | Reason |
|-------|---------|--------|
| `vendor_users` | ~1 | references a `vendor_id` that no longer exists |
| `products` | ~6 | reference a deleted category/vendor/manufacturer |
| `product_plants` | ~2,681 | ~1,767 have `state` NULL/empty (drafts); ~836 reference deleted products; ~480 all-zero FKs |
| `all_product_documents` | ~65 | reference a deleted vendor |

Everything else migrates fully (manufacturers, all 3,324 vendors, users, all `process_*`/`raw_materials_*`/renewal/CMS tables).

## Validation workflow (for your manager)

1. Load SQL into staging MySQL.
2. Point `.env.migration` at **empty** `greenpro_migration` MongoDB.
3. Run `npm run migrate:mysql -- --all`.
4. Run `npm run migrate:mysql:validate`.
5. Spot-check 5–10 URNs in admin/vendor portals against migration DB.
6. After sign-off, cut over via `mongodump`/`mongorestore` or Atlas clone — **not** by re-running against live.

## Safety guard

If `MIGRATION_MONGO_URI` equals `MONGODB_URI` (live app), scripts **exit with error** unless `ALLOW_LIVE_TARGET=true`.

## Related docs

- [GREENPRO-MYSQL-DATABASE-INVENTORY.md](./GREENPRO-MYSQL-DATABASE-INVENTORY.md)
- [GREENPRO-MYSQL-TO-MONGODB-MIGRATION-FEASIBILITY.md](./GREENPRO-MYSQL-TO-MONGODB-MIGRATION-FEASIBILITY.md)
