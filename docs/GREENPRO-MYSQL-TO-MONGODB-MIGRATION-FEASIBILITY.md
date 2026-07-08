# GreenPro MySQL → MongoDB Migration Feasibility Report

**Date:** Jul 06, 2026  
**Source:** Legacy MySQL `greenpro` (64 tables — see [GREENPRO-MYSQL-DATABASE-INVENTORY.md](./GREENPRO-MYSQL-DATABASE-INVENTORY.md))  
**Target:** NestJS MERN backend (`cursor-greenpro-mern`) on MongoDB Atlas  
**Dump reviewed:** Schema-only phpMyAdmin export (no row data in dump)

---

## Executive summary

| Question | Answer |
|----------|--------|
| **Is migration feasible?** | **Yes** — most legacy tables have a direct or near-direct MongoDB collection and schema in the new codebase. |
| **Is it straightforward?** | **No** — several architectural changes (vendor/manufacturer merge, RBAC, plant geography, file storage, renewal cycles) require **transform scripts**, not copy-paste ETL. |
| **Recommended approach** | **Phased migration** with ID mapping tables, staging validation, file migration, and a controlled cutover — not a single big-bang import. |
| **Rough effort (engineering)** | **6–12+ weeks** depending on production row counts, file volume, in-flight URNs/renewals, and how much historical renew/doc versioning you must preserve. |

**Bottom line:** Data migration is **feasible and worth doing** if you need production history in the new portal. Plan for **data transformation + validation + file moves**, not a one-click mysqldump import.

---

## Architecture delta (legacy vs MERN)

| Area | Legacy MySQL | New MongoDB |
|------|--------------|-------------|
| Primary keys | Auto-increment `int` | `_id` (`ObjectId`) **plus** retained numeric ids where needed (`productId`, `paymentId`, …) |
| Vendor model | Separate `vendors` + `manufacturers` | **Merged** into `manufacturers` (vendor profile fields on manufacturer doc) |
| Admin users | `admin` table (`role`, `access` strings) | `users` collection (`type: admin \| staff`) + **`roles`** + **`staff_role_mappings`** (RBAC) |
| Vendor logins | `vendor_users` (`vendor_id`, enum `vendor \| partner`) | `users` (`manufacturerId`, types `vendor \| partner \| admin \| staff`) |
| Website team | `team_members` table | `users` with `type: staff`, `team`, `sector_ids`, `showOnWebsite` |
| Plants | `product_plants` + `offline_product_plants`; `state` as **varchar** | `product_plants` requires **`countryId`**, **`stateId`**, **`city`** (`ObjectId` refs) |
| Documents | `all_product_documents.document_link` (path) | Same collection name + newer **`doc_streams` / `doc_versions`** versioning layer |
| Renewals | `process_renew_*` only | `process_renew_*` **plus** **`renewal_cycles`** (not in legacy MySQL) |
| Payments (online) | `online_payment_details` + `pg_json_response` | **`payment_details`** exists; **no dedicated `online_payment_details` collection** found |
| CMS extras | `basic_details`, `newsletter_release` | Partially replaced (`contactmessages`, `newsletter_subscribers`, summits/articles/gallery) — **gaps below** |
| Files | Local `/uploads/...` paths | **AWS S3 + CloudFront** (paths must be rewritten) |
| Referential integrity | **No FK constraints** in MySQL dump | App-level joins; orphan rows possible in source |

---

## Table-by-table migration map

Legend: ✅ Direct / low risk · ⚠️ Transform required · ❌ Gap or manual decision · ➕ MERN-only (no MySQL source)

### Core identity & access

| MySQL table | Mongo target | Status | Notes |
|-------------|--------------|--------|-------|
| `manufacturers` | `manufacturers` | ⚠️ | Merge vendor fields from `vendors`; map `manufacturer_status` codes; add `gpInternalId` from `gp_internal_id` |
| `vendors` | *(merged into `manufacturers`)* | ⚠️ | One manufacturer per vendor row; preserve `vendor_id` → `ObjectId` in **ID map** for downstream FK resolution |
| `vendor_users` | `users` | ⚠️ | `vendor_id` → `manufacturerId`; passwords may need re-hash or force reset; `partner` type supported |
| `admin` | `users` + `roles` + `staff_role_mappings` | ⚠️ | Map `role`/`access` strings to RBAC permissions; no 1:1 table |
| `team_members` | `users` (`type: staff`) | ⚠️ | Website team — map to `team`, `displayOrder`, `sector_ids`; not a separate collection |
| — | `roles`, `staff_role_mappings` | ➕ | Must seed defaults + map legacy admin access |

### Products, plants, certification

| MySQL table | Mongo target | Status | Notes |
|-------------|--------------|--------|-------|
| `products` | `products` | ⚠️ | Keep `productId`, `eoiNo`, `urnNo`; `category_id`/`vendor_id`/`manufacturer_id` → `ObjectId`; `rejected_details` was `date` in MySQL, **string** in Mongo |
| `product_plants` | `product_plants` | ⚠️ | **Hardest plant migration:** resolve free-text `state` → `stateId` + `countryId`; set `city` (may be missing in legacy) |
| `offline_product_plants` | `product_plants` or archive | ❌ | No MERN module; decide merge vs read-only archive |
| `categories` | `categories` | ✅ | Keep `category_id` int; add `sector` if missing (default from business rules) |
| `sectors` | `sectors` (+ counter) | ✅ | Largely reference data |
| `standards` | `standards`, `standard_categories` | ⚠️ | MERN has richer standard/category model |
| `states` | `states` (+ `countries`) | ⚠️ | MERN links states to **countries**; legacy may be flat name list |

### Payments

| MySQL table | Mongo target | Status | Notes |
|-------------|--------------|--------|-------|
| `payment_details` | `payment_details` | ⚠️ | `products_to_be_certified` is `longtext` — parse JSON/array; MERN adds `vendorProposalApprovalStatus`, renewal `renewalCycleId` |
| `online_payment_details` | *(none)* | ❌ | Store inside payment audit / embed on `payment_details` / new collection — **design decision required** |

### Process forms (registration)

| MySQL table | Mongo target | Status |
|-------------|--------------|--------|
| `process_product_design` | `process_product_design` | ⚠️ camelCase fields |
| `process_pd_measures` | `process_pd_measures` | ⚠️ |
| `process_product_performance` | `process_product_performance` | ⚠️ |
| `process_pp_test_reports` | `process_pp_test_reports` | ➕ may be empty in legacy |
| `process_manufacturing` | `process_manufacturing` | ⚠️ |
| `process_mp_manufacturing_units` | `process_mp_manufacturing_units` | ⚠️ |
| `process_mp_energy_consumption` | `process_mp_energy_consumption` | ⚠️ |
| `process_waste_management` | `process_waste_management` | ⚠️ |
| `process_wm_manufacturing_units` | `process_wm_manufacturing_units` | ⚠️ |
| `process_life_cycle_approach` | `process_life_cycle_approach` | ⚠️ |
| `process_product_stewardship` | `process_product_stewardship` | ⚠️ |
| `process_ps_stakeholder_edu_awarness` | `process_ps_stakeholder_edu_awarness` | ⚠️ |
| `process_innovation` | `process_innovation` | ⚠️ |
| `process_comments` | `process_comments` | ⚠️ `raw_materials_3_*` → `rawMaterials3*` |
| `process_final_review` | `process_final_review` | ⚠️ **90+ text columns** — wide row mapping, typo `manfacturing` preserved in legacy |

### Raw materials (15 tables)

| MySQL table | Mongo target | Status |
|-------------|--------------|--------|
| `raw_materials_*` (all 15) | Same collection names | ⚠️ Row-per-unit tables; verify versioning/`doc_streams` for uploaded files |

### Renewal process

| MySQL table | Mongo target | Status | Notes |
|-------------|--------------|--------|-------|
| `process_renew_*` (11 tables) | Matching `process_renew_*` | ⚠️ | Field transforms + `vendorId` → `ObjectId` |
| `process_renew_comments` | `process_renew_comments` | ⚠️ | Same wide comment layout as registration |
| `all_renew_product_documents` | `all_renew_product_documents` | ⚠️ | File paths + optional `renewalCycleId` |
| — | `renewal_cycles` | ➕ | **Must synthesize** for legacy renew rows (infer from `product_renew_status`, payments, URN status) |

### Documents & files

| MySQL table | Mongo target | Status | Notes |
|-------------|--------------|--------|-------|
| `all_product_documents` | `all_product_documents` | ⚠️ | `document_form` → enum `documentForm`; migrate files to S3; `form_primary_id` polymorphic |
| — | `doc_streams`, `doc_versions` | ➕ | Optional post-migration backfill for versioning UI |

### CMS & website

| MySQL table | Mongo target | Status | Notes |
|-------------|--------------|--------|-------|
| `banners` | `banners` | ⚠️ | MERN adds `imageSource`, vendor scope nullable for admin |
| `events` | `events` | ⚠️ | Status mapping (`draft`/`published` → `inactive`/`active`) |
| `contacts` | `contactmessages` | ⚠️ | Different field names; add `inquiryType: contact` |
| `subscription_list` | `newsletter_subscribers` | ⚠️ | Map `subscription_type` / status |
| `newsletter_release` | *(no direct collection)* | ❌ | Likely **articles** or static CMS asset — clarify with business |
| `basic_details` | *(no direct collection)* | ❌ | Footer social/address — may live in env, summit, or needs new settings collection |
| `notifications` | `notifications` + `user_notifications` | ⚠️ | Legacy `notify_type` codes differ from new in-app model |

### MERN-only (no MySQL import)

These exist in the new system and are **not** in the 64-table MySQL inventory:

- `renewal_cycles`, `urn_process_tab_reviews`, `urn_renew_tab_reviews`
- `urn_site_visits`, `urn_merges`, `vendor_product_change_requests`
- `product_status_audits`, `cron_email_logs`
- `audit_log`, `zoho_*` mappings
- `articles`, `galleries`, `summits`
- `doc_streams`, `doc_versions`

---

## Top challenges (ranked)

### 1. ID resolution layer (critical)

Almost every row uses integer `vendor_id`, `manufacturer_id`, `product_id`, `category_id`.

**Required:** Build and persist mapping tables during ETL:

```
mysql_vendor_id      → manufacturers._id
mysql_manufacturer_id → manufacturers._id
mysql_product_id     → products._id (and keep products.productId)
mysql_category_id    → categories._id
mysql_payment_id     → payment_details._id
...
```

Without this, process forms and documents cannot link correctly.

### 2. Vendor + manufacturer merge

Legacy has two entities; MERN stores vendor profile **on** `manufacturers`.

**Risk:** Duplicate emails, conflicting GST/PAN, multiple vendors per manufacturer (if any).  
**Mitigation:** One-time merge script + manual review queue for conflicts.  
**Reference:** [MANUFACTURER_ID_MIGRATION_APPROACH.md](../MANUFACTURER_ID_MIGRATION_APPROACH.md) (Mongo-internal; same pattern applies MySQL → Mongo).

### 3. Product plants — geography normalization

| Legacy | MERN |
|--------|------|
| `state` varchar (free text) | `stateId` + `countryId` + required `city` |

**Challenge:** “Maharashtra”, “MH”, typos, or missing state must be fuzzy-matched to `states` collection.  
**Impact:** High — certificates and filters depend on plant location.  
**Mitigation:** Mapping spreadsheet + admin UI for unresolved plants before go-live.

### 4. File / document migration

Thousands of rows in `all_product_documents`, `all_renew_product_documents`, payment PDFs, product images, banners.

| Issue | Detail |
|-------|--------|
| Path format | Legacy `document_link` / `proposal_file` may be relative PHP paths |
| Target | S3 keys + CloudFront URLs |
| Broken files | DB path exists but file missing on disk |
| Innovation docs | `documentTag` (`tech`/`process`/`social`) may be absent in legacy |

**Mitigation:** Batch copy with checksum log; keep legacy path in a `legacyDocumentLink` field until verified.

### 5. Passwords and authentication

`admin.password` and `vendor_users.password` are likely **legacy PHP hashes** (bcrypt/md5 depending on age).

| Option | Trade-off |
|--------|-----------|
| Re-hash on first login | Best UX if algorithm detectable |
| Force password reset | Safest; disruptive for all users |
| Store hash as-is | Only if Nest uses same verifier |

**Recommendation:** Force reset for admin/staff; attempt bcrypt carry-over for vendors if confirmed.

### 6. Renewal cycles (synthetic data)

MERN renewal is **cycle-scoped** (`renewal_cycles`, `renewalCycleId` on payments and renew docs).

Legacy MySQL has **no** `renewal_cycles` table. In-flight or completed renewals need rules such as:

- One `renewal_cycles` row per URN per renew attempt
- Link `payment_details` where `payment_type = 'renew'`
- Tag `process_renew_*` rows with `renewalCycleId` (cycle 1 may allow null per current code)

**Risk:** Renew UI may hide or mis-scope legacy renew data without this step.  
**Note:** Internal docs previously said *“do not backfill legacy renew data”* for **greenfield rollout** — that differs from **full production migration**, where business usually expects history.

### 7. Data quality (no foreign keys)

MySQL dump declares **zero FK constraints**. Expect:

- `vendor_id` pointing to deleted vendors
- Documents with invalid `form_primary_id`
- Payments without matching URN
- Orphan `process_*` rows

**Mitigation:** Pre-migration validation SQL + quarantine report; do not fail entire import on bad rows.

### 8. Status / enum parity

Numeric status fields are used everywhere (`product_status`, `urn_status`, `product_renew_status`, `payment_status`, …).

**Challenge:** MERN uses the same numeric codes in many places, but adds new states (soft delete, discontinued, tab reviews, renewal cycle status strings).

**Mitigation:** Publish a **single status mapping sheet** (MySQL value → MERN value) and unit-test edge URNs (rejected, mid-review, expired, discontinued).

### 9. Wide text tables

`process_final_review` and `process_comments` store **15+ raw material sections** as separate `text` columns.

**Feasible** but tedious; automate column rename map in ETL. Typos (`manfacturing_process`) must match MERN field names exactly.

### 10. CMS gaps

| Legacy | Action needed |
|--------|----------------|
| `basic_details` | Import to new settings collection or hard-code in website config |
| `newsletter_release` | Map to `articles` or file gallery |
| `offline_product_plants` | Merge or deprecate |
| `online_payment_details` | Archive table or embed `pg_json_response` on payment record |

### 11. Cutover & dual-write

During migration window:

- Freeze legacy PHP writes **or** accept delta sync
- In-flight URN registrations are highest risk
- Plan read-only legacy mode + MERN validation portal

---

## What migrates easily (low risk)

- Reference data: `categories`, `sectors`, `standards`, `states` (after country linkage)
- Process child tables keyed by `urn_no` + `vendor_id` (once ID map exists)
- Raw materials unit rows (table-per-section model matches MERN)
- `contacts` → `contactmessages` (with field rename)
- `banners`, `events` (with status/image path fixes)

---

## What is hard or high-risk

- `product_plants` geography
- Vendor/manufacturer merge + `users` passwords
- Admin → RBAC mapping
- File migration at scale
- Active renewal / in-review URN state at cutover
- `renewal_cycles` synthesis
- `online_payment_details` without a target schema

---

## Recommended migration phases

### Phase 0 — Discovery (1–2 weeks)

- Export **full** MySQL dump **with data** + row counts per table
- Inventory files on legacy server (`uploads/`, payment PDFs)
- Sample 10 manufacturers across statuses (active, unverified, renewing, expired)
- List in-flight URNs at cutover date

### Phase 1 — Reference & identity (1–2 weeks)

1. `categories`, `sectors`, `standards`, `states`/`countries`
2. `manufacturers` (+ merge `vendors`)
3. `users` (vendor_users + admin + team_members)
4. RBAC seed + staff role mapping
5. Build **ID map** collection in Mongo

### Phase 2 — Commercial core (2–3 weeks)

1. `products`, `product_plants` (with state resolution)
2. `payment_details` (+ online payment strategy)
3. `all_product_documents` + file upload to S3

### Phase 3 — Certification data (2–4 weeks)

1. All `process_*` and `raw_materials_*` tables (by URN batches)
2. `process_comments`, `process_final_review`
3. Validation: admin URN detail pages match legacy for sample set

### Phase 4 — Renewal & expiry (1–2 weeks)

1. `process_renew_*`, `all_renew_product_documents`
2. Synthesize `renewal_cycles`
3. Reconcile `product_renew_status`, expiry dates, cron eligibility

### Phase 5 — CMS & comms (1 week)

1. `banners`, `events`, `contacts`, `subscription_list`
2. Resolve `basic_details`, `newsletter_release`
3. Notifications (optional; may start fresh)

### Phase 6 — Validation & cutover (1–2 weeks)

- Parallel run: compare counts and spot-check APIs
- DNS / portal switch
- Rollback plan (keep MySQL read-only snapshot)

---

## Validation checklist (per entity)

| Check | Method |
|-------|--------|
| Row counts | MySQL `COUNT(*)` vs Mongo `countDocuments` per collection |
| URN integrity | Every `urn_no` in `process_*` has a `products` row |
| Document files | HTTP 200 / S3 head-object for sample of `document_link` |
| Payments | Sum of `payment_status=2` matches legacy report |
| Login | Sample vendor + admin login (or forced reset flow) |
| Certified products | Public website ecolabel listing matches count |
| Renewal | Open renew URN in vendor portal — tabs populate |

---

## Risk matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Broken document links after S3 move | High | High | Checksum log + legacy URL fallback |
| Plant state unmapped | High | Medium | Manual resolution UI |
| Wrong URN status after import | Medium | High | Status mapping tests + admin sign-off |
| Password login failure | High | Medium | Forced reset campaign |
| Renewal data not cycle-scoped | Medium | High | `renewal_cycles` backfill script |
| Orphan process rows | Medium | Low | Quarantine + admin report |
| Cutover during active registration | Medium | Critical | Freeze window + communicate |

---

## Verdict

| Scenario | Recommendation |
|----------|----------------|
| **Greenfield** (new portal, no legacy history) | **Do not migrate** — current MERN approach (fresh writes only) is correct. |
| **Replace production PHP** with full history | **Migrate** — feasible with phased ETL, ID maps, and file migration. |
| **Read-only archive** | Migrate subset: `manufacturers`, `products`, certified docs only; skip in-progress process forms. |

**Overall:** Migration is **feasible** and aligns well with the new schema (most collection names match legacy table names). The main work is **transformation logic**, **file moves**, and **operational cutover** — not MongoDB limitations.

---

## Next steps

1. Provide a **data-inclusive** MySQL export (with row counts) from production.
2. Decide policy on **renewal history** and **online payment** archival.
3. Run Phase 0 sample migration on staging for **5–10 URNs** end-to-end.
4. Build automated **ID map** + **validation report** scripts (extend `scripts/parse-mysql-inventory.js` pattern).

---

## Related docs

- [GREENPRO-MYSQL-DATABASE-INVENTORY.md](./GREENPRO-MYSQL-DATABASE-INVENTORY.md) — full legacy schema inventory
- [MANUFACTURER_ID_MIGRATION_APPROACH.md](../MANUFACTURER_ID_MIGRATION_APPROACH.md) — vendor/manufacturer ID merge (Mongo)
- [product-renewal-backend-prompt.md](./product-renewal-backend-prompt.md) — renewal cycle model (greenfield note vs full migration)
- [s3-integration-check-and-setup.md](./s3-integration-check-and-setup.md) — file storage target
