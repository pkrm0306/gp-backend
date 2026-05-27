# Raw Materials backend — Product Design / Product Performance parity

## Summary

All Raw Materials vendor POST routes now use **PDF/Excel-only** multer filtering (`rawMaterialsMultipartMemoryMulterOptions`, 10MB), shared empty-form message, and `RawMaterialsStepGateService.assertStepSubmitAllowed` (URN review lock + at least-one-field gate). Product-table steps no longer persist empty rows on file-only or text-only partial saves where fixed: **hazardous products** (existing), **formaldehyde**, **prohibited flame solvents products**. GET URN details filter empty product stubs for hazardous, formaldehyde, and solvents products. Step 15 uses review lock, PDF/Excel multer, and step gate with multipart body fields.

## Modified files

| Path |
|------|
| `src/common/upload/multer-universal.config.ts` |
| `src/common/raw-materials/raw-materials-upload.util.ts` |
| `src/common/raw-materials/raw-materials-step-gate.service.ts` |
| `src/common/raw-materials/raw-materials-hazardous-display.util.ts` |
| `src/common/raw-materials/raw-materials-hazardous-display.util.spec.ts` (new) |
| `src/product-registration/product-registration.service.ts` |
| `src/raw-materials-hazardous/raw-materials-hazardous.controller.ts` |
| `src/raw-materials-hazardous-products/raw-materials-hazardous-products.controller.ts` |
| `src/raw-materials-recycled-content/raw-materials-recycled-content.controller.ts` |
| `src/raw-materials-regional-materials/raw-materials-regional-materials.controller.ts` |
| `src/raw-materials-rapidly-renewable-materials/raw-materials-rapidly-renewable-materials.controller.ts` |
| `src/raw-materials-utilization/raw-materials-utilization.controller.ts` |
| `src/raw-materials-green-supply/raw-materials-green-supply.controller.ts` |
| `src/raw-materials-elimination-of-formaldehyde/raw-materials-elimination-of-formaldehyde.controller.ts` |
| `src/raw-materials-elimination-of-formaldehyde/raw-materials-elimination-of-formaldehyde.service.ts` |
| `src/raw-materials-recovery/raw-materials-recovery.controller.ts` |
| `src/raw-materials-elimination-of-ozone-depleting-global-warming-substances/raw-materials-elimination-of-ozone-depleting-global-warming-substances.controller.ts` |
| `src/raw-materials-elimination-of-prohibited-flame/raw-materials-elimination-of-prohibited-flame.controller.ts` |
| `src/raw-materials-elimination-of-prohibited-flame-solvents/raw-materials-elimination-of-prohibited-flame-solvents.controller.ts` |
| `src/raw-materials-elimination-of-prohibited-flame-solvents-products/raw-materials-elimination-of-prohibited-flame-solvents-products.controller.ts` |
| `src/raw-materials-elimination-of-prohibited-flame-solvents-products/raw-materials-elimination-of-prohibited-flame-solvents-products.service.ts` |
| `src/raw-materials-reduce-environmental/raw-materials-reduce-environmental.controller.ts` |
| `src/raw-materials-optimization-of-raw-mix/raw-materials-optimization-of-raw-mix.controller.ts` |
| `src/raw-materials-additives/raw-materials-additives.controller.ts` |
| `src/raw-materials-utilization-rmc/raw-materials-utilization-rmc.controller.ts` |
| `src/raw-materials-utilization-rmc/raw-materials-step15.controller.ts` |
| `src/raw-materials-utilization-rmc/raw-materials-utilization-rmc.service.ts` |
| `src/common/raw-materials/raw-materials-single-record-replace.util.ts` (new) |
| `src/common/constants/document-section-key.constants.ts` |
| `src/raw-materials-green-supply/raw-materials-green-supply.service.ts` |
| `src/raw-materials-utilization/raw-materials-utilization.service.ts` |
| `src/raw-materials-elimination-of-prohibited-flame/raw-materials-elimination-of-prohibited-flame.service.ts` |
| `src/raw-materials-elimination-of-prohibited-flame-solvents/raw-materials-elimination-of-prohibited-flame-solvents.service.ts` |
| `src/raw-materials-elimination-of-ozone-depleting-global-warming-substances/raw-materials-elimination-of-ozone-depleting-global-warming-substances.service.ts` |
| `docs/backend_changes_raw_materials.md` (this file) |

**Not modified:** `src/product-design/**`

Unit-table steps (recycled, regional, recovery, etc.) already use `filterMeaningfulRows` for body rows; they do not auto-create unit rows from filenames.

## Validations updated

| Area | Before | After |
|------|--------|-------|
| Multer (all RM POST with files) | `certificationMultipartMemoryMulterOptions` (PNG/DOC allowed) | `rawMaterialsMultipartMemoryMulterOptions` — PDF/Excel only |
| Empty-form message | Shared constant (most steps) | Unchanged exact copy |
| Review lock | Most steps via step gate | Step 15 + RMC service also call `assertVendorCanEditUrn` |
| Formaldehyde file-only | Created empty product row | Documents only (no product row) |
| Solvents products empty row | Always inserted | Only when partial product row present |
| GET product tables | Hazardous + formaldehyde filtered | + solvents products filtered |
| `urnNo` multipart | `parseRequiredRawMaterialsUrn` (64) | Unchanged |

## APIs modified (behavior)

| Route | Change |
|-------|--------|
| All `POST`/`PUT` Raw Materials routes with file upload | PDF/Excel multer + controller `assertRawMaterialsDocumentTypes` |
| `POST /raw-materials-hazardous-products` | Full replace handshake + `POST .../replace` |
| `POST /raw-materials-elimination-of-formaldehyde` | Full replace + `POST .../replace`; file-only → docs only |
| `POST /raw-materials-elimination-of-prohibited-flame-solvents-products` | Full replace + `POST .../replace`; no empty rows |
| `POST /raw-materials-green-supply` | One row per URN (no append) |
| `POST /raw-materials-utilization` | One row per URN (no append) |
| `POST /raw-materials-elimination-of-prohibited-flame` | One row per URN; doc replace on new file |
| `POST /raw-materials-elimination-of-prohibited-flame-solvents` | One row per URN; doc replace on new file |
| `POST /raw-materials-elimination-of-ozone-depleting-global-warming-substances` | Replaces prior docs on new upload |
| `PUT /vendor/raw-materials/step-15/:urnNo` | PDF/Excel multer, step gate, review lock |
| GET URN details (`product-registration`) | Filter solvents products empty rows |

## Acceptance tests checklist

### Product-table steps
- [ ] Partial row: only `productsTestReport` → 200
- [ ] Partial row: only `productsName` → 200
- [ ] File-only PDF, empty products JSON → 200; docs up; no meaningless product rows
- [ ] All empty → 400 exact empty-form message
- [ ] Repeat POST → 200
- [ ] Upload `.png` → 400 invalid type (not empty-form)
- [ ] GET URN: table = saved rows; files in step documents

### All steps
- [ ] PDF/Excel multer on every Raw Materials POST with files
- [ ] `urnStatus === 4` → 403 review lock
- [ ] Multipart `urnNo` > 20 chars → OK (max 64)

## Parity matrix

| Behavior | Product Design | Product Performance | Raw Materials |
|----------|----------------|---------------------|---------------|
| Empty-form message | Exact copy | Same | `RAW_MATERIALS_AT_LEAST_ONE_MESSAGE` |
| Partial dynamic row | measures OR benefits | productName OR testReportFileName | productsName OR productsTestReport |
| File-only → table | No auto rows | No auto rows | No auto rows (product steps fixed) |
| Upload types | PDF/Excel (supporting) | PDF/Excel | PDF/Excel (all RM file routes) |
| Review lock | — | `assertVendorCanEditUrn` | `assertStepSubmitAllowed` |
| Multer 10MB | Yes | Yes | Yes |

## Replace-not-append audit (2026-05)

Full snapshot per URN on save — repeat POST must not grow row count.

### Shared helpers (new)

| Path | Purpose |
|------|---------|
| `src/common/raw-materials/raw-materials-upload.util.ts` | `shouldReplaceRawMaterialsTableBeforeInsert` (product-table handshake) |
| `src/common/raw-materials/raw-materials-single-record-replace.util.ts` | `replaceSingleRecordForUrn` (one text row per URN) |
| `src/common/constants/document-section-key.constants.ts` | `RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS` |

### APIs — replace semantics

| Route | Semantics |
|-------|-----------|
| `POST /raw-materials-hazardous-products` | Legacy `replaceTable` / `rowIndex=0`; legacy single POST = full replace |
| `POST /raw-materials-hazardous-products/replace` | Batch JSON `products` + files + `existingDocumentIds` |
| `POST /raw-materials-elimination-of-formaldehyde` | Same handshake as hazardous products |
| `POST /raw-materials-elimination-of-formaldehyde/replace` | Batch `products` + files + `existingDocumentIds` |
| `POST /raw-materials-elimination-of-prohibited-flame-solvents-products` | Same handshake |
| `POST /raw-materials-elimination-of-prohibited-flame-solvents-products/replace` | Batch `products` JSON |
| `POST /raw-materials-green-supply` | One record per URN (`deleteMany` + insert) |
| `POST /raw-materials-utilization` | One record per URN |
| `POST /raw-materials-elimination-of-prohibited-flame` | One text row per URN; new file soft-deletes prior step docs |
| `POST /raw-materials-elimination-of-prohibited-flame-solvents` | Same as prohibited flame |
| `POST /raw-materials-elimination-of-ozone-depleting-global-warming-substances` | New upload replaces prior ozone docs (soft-delete) |
| Unit-table steps (2–4, 5b, 8, 12–14) | Already `deleteMany` + `insertMany` when vendor sends full `units` in one POST |
| `POST /raw-materials-reduce-environmental` (+ typo alias) | `units`/`mines` full replace; legacy per-row `replaceTable` on row 0; `existingDocumentIds` for docs |

### Replace acceptance (product-table)

- [ ] 5 rows → save 1 → GET returns **1**
- [ ] Save same snapshot twice → GET count unchanged
- [ ] `replaceTable=true` on first row of multi-row loop → GET matches sent count
- [ ] File-only → docs only; table rows unchanged

### Verification

- `npx tsc --noEmit` — pass
- `raw-materials-hazardous-products.service.spec.ts` — pass (handshake helper)
