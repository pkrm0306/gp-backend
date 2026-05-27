# Agent prompt: Raw Materials (and related) — replace-not-append API audit

Use this document in **Agent mode** to find and fix endpoints that **append** rows on every save instead of **replacing** the vendor’s full table snapshot for a URN.

---

## Problem pattern (what to look for)

| Symptom | Likely cause |
|---------|----------------|
| Vendor deletes rows in UI, saves, refresh → **old rows still there** | Server only `INSERT`s; never deletes removed rows |
| GET row count grows on every save with same data | Insert-only or merge-with-GET |
| Network payload has N rows; GET returns N + old orphans | Not full replace per URN |
| Multi-step: 5 saves over time → GET always ≥ previous count | Append semantics |

**Not a frontend bug** when POST body is correct but GET count keeps growing.

---

## Golden reference implementations (read first)

| Module | Pattern | Key files |
|--------|---------|-----------|
| Product Design | Full replace `measuresAndBenefits` + document retain | `src/product-design/product-design.service.ts` (`replaceMeasuresByUrn`, `syncProductDesignDocuments`) |
| Product Performance | Full replace `testReports` + `existingDocumentIds` | `src/product-performance/product-performance.service.ts` (`parseIncomingTestReportRows`, `replaceTestReportsTable`, `syncPerformanceDocuments`) |
| Hazardous products (fixed) | `POST .../replace` + legacy `replaceTable` / `rowIndex` | `src/raw-materials-hazardous-products/raw-materials-hazardous-products.service.ts`, `raw-materials-hazardous-products.controller.ts` |
| Unit-table steps (usually OK) | `deleteMany` + `insertMany` per save | e.g. `raw-materials-recycled-content.service.ts` |

**Do not modify** `src/product-design/**` except as read-only reference.

---

## Constraints

- Prefer extending `src/common/raw-materials/*` and `src/common/vendor/vendor-urn-edit.util.ts` — do not duplicate.
- Reuse: `RAW_MATERIALS_AT_LEAST_ONE_MESSAGE`, `assertStepSubmitAllowed`, `normalizeRawMaterialsProductRow`, `hasPartialRawMaterialsProductRow`, `filterHazardousProductsForVendorDisplay`, `parseMultipartJsonIdArray`, `rawMaterialsMultipartMemoryMulterOptions`, `deleteUploadedFileByDocumentLink`, `uploadFile`.
- URN review lock: `urnStatus === 4` → `This URN is submitted for review and cannot be edited.`
- File-only saves must **not** create product/metadata table rows from filenames (documents only).
- Deliverable: update `docs/backend_changes_raw_materials.md` (or add section) listing every route fixed.

---

## Audit procedure (run for each step)

### 1. Inventory the endpoint

For each row in the table below:

1. Open `*controller.ts` — note route, multipart vs JSON, loop vs batch.
2. Open `*service.ts` — search for:
   - `new this.model(` / `.save()` without prior `deleteMany` for same `urnNo` + `vendorId`
   - `insertMany` **without** preceding `deleteMany` on that collection
   - `created[0].someId` when `created` may be empty (file-only → 500)
   - Per-request `create` in a vendor loop (append risk)
3. Check vendor client (if in monorepo): per-row POST loop vs single batch body.

### 2. Classify save semantics

| Class | Expected behavior | Red flag |
|-------|-------------------|----------|
| **A — Unit/grid table** | One POST with `units` JSON → `deleteMany` + `insertMany` all rows for URN | Only `insert` / only `save` new doc |
| **B — Product pair table** | Full replace list (`productsName` + `productsTestReport`) | One row per POST with no delete |
| **C — Single record upsert** | One row per URN (`findOne` + update or upsert) | New insert every POST |
| **D — Documents only** | Files → `all_product_documents` only; table unchanged | Filename → table row |
| **E — Step 15 / RMC grid** | Upsert one document + field payload; not row append | Duplicate key 409 on repeat |

### 3. Reproduce acceptance test

For any **B** or suspect **A** with vendor per-row loop:

1. Seed URN with 3 rows (or use existing data).
2. Save with **1** row in UI (or POST 1 row).
3. `GET /products/details/{urnNo}` (or step GET).
4. **Pass:** row count === rows sent on last save. **Fail:** count > rows sent.

### 4. Fix pattern (choose one)

#### Option 1 — Batch replace (preferred)

```http
POST /raw-materials-{step}/replace
```

| Field | Description |
|-------|-------------|
| `urnNo` | Required |
| `{rows}` | JSON array — **full snapshot** (`units`, `products`, `mines`, etc.) |
| `{stepFile}` | New uploads only |
| `existingDocumentIds` | Omit = keep all docs; `[]` = soft-delete unlisted |

Server (transaction):

1. `assertStepSubmitAllowed` + `assertVendorCanEditUrn`
2. `deleteMany({ urnNo, vendorId })` on step table
3. `insertMany` meaningful rows from JSON only (not from filenames)
4. Sync documents + post-commit file cleanup

#### Option 2 — Legacy per-row POST handshake

On existing `POST`, support:

| Field | When | Action |
|-------|------|--------|
| `replaceTable` | `true` on **first** row only | `deleteMany` all rows for URN before insert |
| `rowIndex` | `0` | Same as replaceTable |
| *(none)* | Single POST, no handshake | Treat as **full replace** (1-row vendor save) — see hazardous products |

Copy helpers from:

- `shouldReplaceHazardousProductsTableBeforeInsert` in `src/common/raw-materials/raw-materials-upload.util.ts`

#### Option 3 — Already correct

If service already has `deleteMany` then `insertMany` on **every** save with full `units` array in **one** request — verify vendor sends full array, not one unit per request. If vendor sends one unit per request, add Option 1 or Option 2.

---

## Raw Materials steps — audit checklist

Mark each: **OK** | **FIXED** | **NEEDS FIX** | **N/A** (no table rows)

| Step | Route prefix | Table / data | Current server pattern (baseline) | Audit focus |
|------|--------------|--------------|-----------------------------------|-------------|
| 1 Details | `POST /raw-materials-hazardous` | Text `details` | Upsert + `clearHazardousProducts` | **FIXED** |
| 1 Products | `POST /raw-materials-hazardous-products` | `raw_materials_hazardous_products` | `/replace` + `replaceTable` handshake | **FIXED** |
| 2 Recycled | `POST /raw-materials-recycled-content` | `units` per URN | `deleteMany` + `insertMany` | **OK** (vendor must send full `units` in one POST) |
| 3 Regional | `POST /raw-materials-regional-materials` | `units` | Same as recycled | **OK** |
| 4 Rapidly renewable | `POST /raw-materials-rapidly-renewable-materials` | `units` | Same + `created[0]?` fix | **OK** |
| 5 Utilization | `POST /raw-materials-utilization` | Single + file | `replaceSingleRecordForUrn` | **FIXED** |
| 5b Mfg units | `POST /raw-materials-utilization-manufacturing-units` | `units` | `deleteMany` + `insertMany` | **OK** |
| 6 Green supply | `POST /raw-materials-green-supply` | Single + file | `replaceSingleRecordForUrn` | **FIXED** |
| 7 Formaldehyde | `POST /raw-materials-elimination-of-formaldehyde` | Product pair rows | `/replace` + `replaceTable` | **FIXED** |
| 8 Recovery | `POST /raw-materials-recovery` | `units` | `deleteMany` + `insertMany` | **OK** |
| 9 Ozone/GWP | `POST /raw-materials-elimination-of-ozone-...` | Documents only | Soft-delete prior docs on new upload | **FIXED** |
| 10 Prohibited flame | `POST /raw-materials-elimination-of-prohibited-flame` | Single + file | `replaceSingleRecordForUrn` + doc replace | **FIXED** |
| 11 Solvents | `POST /raw-materials-elimination-of-prohibited-flame-solvents` | Single + file | Same as step 10 | **FIXED** |
| 11b Solvents products | `POST /raw-materials-elimination-of-prohibited-flame-solvents-products` | Product pairs | `/replace` + `replaceTable` | **FIXED** |
| 12 Reduce environmental | `POST /raw-materials-reduce-environmental` | `units` / `mines` | Full replace + per-row `replaceTable` | **FIXED** |
| 13 Raw mix | `POST /raw-materials-optimization-of-raw-mix` | `units` | `deleteMany` + `insertMany` | Same |
| 14 Additives | `POST /raw-materials-additives` | `units` | `deleteMany` + `insertMany` | Same |
| 15 RMC | `PUT /vendor/raw-materials/step-15`, `POST /raw-materials-utilization-rmc` | Grid upsert | Upsert one doc | 409 on duplicate? Review lock |

---

## Cross-module audit (same bug class)

Also scan (grep: `new this.model`, `.save(`, without `deleteMany` for same URN):

| Area | Routes / collections | Notes |
|------|----------------------|--------|
| Product Design | `POST /product-design` | Reference — already replace |
| Product Performance | `POST /product-performance` | Reference — already replace |
| Process — Waste Management | Manufacturing units, supporting docs | Per-row append? |
| Process — Manufacturing | Unit tables | Compare to RM utilization |
| Any `GET /products/details/{urnNo}` embed | Lookup arrays | GET must match last save snapshot |

---

## Code search commands (agent)

```bash
# Insert-only product/row creates (no deleteMany in same method)
rg "new this\.model\(|\.save\(" src/raw-materials-* --glob "*service.ts"

# Full replace pattern (good for unit tables)
rg "deleteMany.*urnNo" src/raw-materials-* --glob "*service.ts"

# Unsafe created[0] after empty insertMany (file-only)
rg "created\[0\]\." src/raw-materials-* --glob "*service.ts"

# Per-row POST without replace
rg "replaceTable|replaceByUrn|/replace" src/raw-materials-*
```

---

## Required server behavior (all fixed endpoints)

1. **Full replace** per URN + vendor on each save (table snapshot).
2. **Repeat POST** same snapshot → **200**, same row count (not double).
3. **Partial rows** — either column filled is enough; no Mongoose required-field errors on empty column.
4. **File-only** — documents increase; **table row count unchanged** (no filename-derived rows).
5. **GET** filters empty stubs (`filterHazardousProductsForVendorDisplay` or equivalent on product-registration aggregate).
6. **`existingDocumentIds`** where documents are retained: omit = keep all; `[]` = clear unlisted + file cleanup after commit.

---

## Acceptance tests (copy per step)

### Product-table / per-row POST steps

- [ ] URN has 5 rows → save **1** row → GET returns **1** (not 6).
- [ ] Save **`products: []`** or 0 product POSTs with clear flag → GET **0** product rows.
- [ ] Save 3 rows → GET **3**; save same 3 again → GET still **3** (not 6).
- [ ] Partial row: only `productsTestReport` → **200**.
- [ ] File-only PDF, empty table JSON → **200**; docs up; table rows **unchanged**.

### Unit-table steps (single POST with full `units` array)

- [ ] POST 3 units → GET 3; POST 1 unit (full array with 1 element) → GET **1** (not 4).
- [ ] File-only, empty `units` → **200**; no crash on `created[0]`; docs only.

### Review lock

- [ ] `urn_status === 4` → **403** with review lock message.

---

## Implementation order (agent)

1. Grep audit table → mark NEEDS FIX.
2. Fix **product-pair append** steps first (formaldehyde, solvents products) — copy hazardous products `replaceByUrn` + handshake.
3. Fix **single-record append** (green supply, utilization, ozone) → upsert by `urnNo` + `vendorId` or replace endpoint.
4. Verify **unit-table** steps: confirm vendor sends full `units` in one request; if vendor loops, add `/replace` or `replaceTable`.
5. Fix any remaining `created[0].*` without optional chaining.
6. Extend GET filters in `product-registration.service.ts` for each product-table collection.
7. Run `npx tsc --noEmit` + step `*.service.spec.ts` tests.
8. Update `docs/backend_changes_raw_materials.md` with Modified files + APIs table.

---

## Swagger / docs updates (per fixed route)

1. State clearly: **“Replaces all rows for this URN; not create-only.”**
2. Document `/replace` body schema or `replaceTable` / `rowIndex` / `totalRows`.
3. Note vendor migration: batch replace vs legacy loop with handshake.

---

## Optional vendor follow-up (after API ready)

| API | Vendor change |
|-----|----------------|
| `POST .../replace` | One request with JSON array + files; remove per-row loop |
| `replaceTable` on row 0 | Keep loop; first row deletes all, rest append |

Until vendor ships batch replace, **legacy single POST without handshake** must still replace the full table when only one row is sent (hazardous products behavior).

---

## Related docs in repo

| File | Purpose |
|------|---------|
| `docs/backend_changes_raw_materials.md` | Parity + multer + partial rows |
| `docs/backend_changes.md` | Product Performance replace |
| `docs/raw-materials-api-list.md` | Route inventory |
| `docs/replace-not-append-api-audit-backend-prompt.md` | This file |

---

## Agent task summary (paste into chat)

```
Audit all Raw Materials POST/PUT routes (and related Process modules) for replace-not-append bugs.

For each step in docs/replace-not-append-api-audit-backend-prompt.md:
- Classify save semantics (unit table vs product table vs upsert vs documents-only).
- Reproduce: 5 rows → save 1 → GET must return 1.
- Fix using Option 1 (/replace + transaction) or Option 2 (replaceTable on row 0) or upsert-by-URN.
- Do not modify src/product-design/**.
- Update docs/backend_changes_raw_materials.md with all changed paths.

Reference: raw-materials-hazardous-products (replaceByUrn + shouldReplaceHazardousProductsTableBeforeInsert).
Run npx tsc --noEmit and relevant jest tests.
```
