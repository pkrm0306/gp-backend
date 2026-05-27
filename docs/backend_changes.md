# Product Performance backend — Product Design parity

## Summary

Product Performance `POST /product-performance` now mirrors Product Design vendor rules: partial dynamic rows (one column filled is enough), PDF/Excel-only uploads at multer and controller, file-only saves go to `all_product_documents` without auto-creating `process_pp_test_reports` rows from filenames, full replace of test report rows per URN, document sync with `existingDocumentIds` semantics (omit = keep all, `[]` = clear unlisted), Mongo transaction with post-commit file cleanup, idempotent upsert (repeat POST → 200), and response shape `{ success, message, data }` without top-level `meta`. URN review lock (`urnStatus === 4`) uses shared `assertVendorCanEditUrn`.

## Modified files

| Path |
|------|
| `src/common/upload/multer-universal.config.ts` |
| `src/common/vendor/vendor-urn-edit.util.ts` (new) |
| `src/common/raw-materials/raw-materials-step-gate.service.ts` |
| `src/product-performance/product-performance.controller.ts` |
| `src/product-performance/product-performance-upload.util.ts` (unchanged logic; referenced) |
| `src/product-performance/product-performance.service.ts` |
| `src/product-performance/product-performance.service.spec.ts` |
| `src/product-performance/product-performance.module.ts` |
| `src/product-performance/schemas/pp-test-report.schema.ts` |
| `docs/backend_changes.md` (this file) |

**Not modified:** `src/product-design/**` (read-only reference).

## Validations updated

| Area | Before | After |
|------|--------|-------|
| Empty form | Gate on rows/files/docs | Same message: `Please fill in at least one field in the form before continuing.` when no partial row, no files, no retained docs |
| Partial rows | Both columns implied | Either `productName` OR `testReportFileName` (trim); vendor aliases via `normalizeTestReportRow` |
| Multer file types | Broad certification filter | PDF/Excel only for `files` / `testReportFile` fields; same error text as Product Design supporting docs |
| Controller file types | `assertSupportingDesignFileTypes` | Unchanged (PDF/Excel) |
| File size | 10MB | 10MB (`TEN_MB`) |
| Max files | 20 | 20 |
| Filename → table | Auto rows from uploads when `testReports` empty | **Removed** — uploads → documents only |
| URN review lock | Not on PP | `assertVendorCanEditUrn` before save (`urnStatus === 4`) |
| Response | Included `meta` | `data` only (+ `filesUploaded` inside `data`) |

## APIs modified

### `POST /product-performance`

- **Multipart:** `urnNo`, optional `testReports` (JSON), `existingDocumentIds` (JSON), `files` / legacy field aliases, status fields.
- **Validation:** At least one of partial `testReports` row, new PDF/Excel file, or retained performance document; otherwise 400 with exact empty-form message.
- **Save:** Transaction — sync documents → upsert `process_product_performance` → full replace `process_pp_test_reports` from meaningful body rows only → commit → delete orphaned file links.
- **`existingDocumentIds`:** Omitted = keep all current performance docs; `[]` = soft-delete all not re-uploaded.
- **Repeat POST:** 200 (upsert, no 409).
- **Errors:** Re-throw 400/404; unexpected → 500 `InternalServerErrorException`.

## Acceptance tests checklist

- [ ] POST with `testReports: [{ "productName": "", "testReportFileName": "report-a.pdf" }]` → 200
- [ ] POST with `testReports: [{ "productName": "Widget", "testReportFileName": "" }]` → 200
- [ ] POST file-only (PDF), empty `testReports` → 200; documents increased; **no new meaningless pp_test_report rows** from filename
- [ ] POST all empty, no files, no retained docs → 400 exact empty-form message
- [ ] POST with `existingDocumentIds: []` removes unlisted docs (soft delete + file cleanup after commit)
- [ ] Repeat POST same body → 200
- [ ] Upload `.png` → 400 invalid type message (not empty-form message)
- [ ] GET URN details: table rows match saved `testReports`; files in performance documents

## Parity matrix: Product Design vs Product Performance

| Behavior | Product Design | Product Performance |
|----------|----------------|---------------------|
| Empty-form message | Shared exact copy | Same |
| Partial dynamic row | measures OR benefits | productName OR testReportFileName |
| File-only save | Documents only, no measure rows from filenames | Documents only, no pp_test_report rows from filenames |
| Upload types (supporting) | PDF/Excel multer + assert | PDF/Excel multer + assert |
| Max file size | 10MB | 10MB |
| Table replace | Full replace per URN | Full replace per URN |
| Document retain semantics | `existing*DocumentIds` omit/[] | `existingDocumentIds` omit/[] |
| Transaction + file cleanup | Yes | Yes |
| Repeat POST | 200 upsert | 200 upsert |
| Response shape | `{ success, message, data }` | `{ success, message, data }` |
| Normalized schema fields | Optional defaults `''` | Optional defaults `''` |
| URN review lock | (raw materials steps) | Shared `assertVendorCanEditUrn` |
