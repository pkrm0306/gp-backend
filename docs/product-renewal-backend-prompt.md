# Backend: Product Renewal APIs (PHP / CodeIgniter parity)

Use this document as the **Agent mode** implementation spec for the Product Renewal backend.

---

## Goal

Implement the **Product Renewal** flow in the existing NestJS + MongoDB backend as a **parallel** flow to initial certification. Same business behavior as legacy PHP (`Renew_process_forms`, `RenewProducts`, etc.), but:

- **Separate MongoDB collections** (mirror exported MySQL `process_renew_*` + `all_renew_product_documents`)
- **Separate API routes** under `/renew/...` (do not change initial certification APIs)
- **Same patterns** as initial: Mongoose schemas, `SequenceHelper`, transactions, `ActivityLogService`, JWT guards, `uploadFile`, `DocumentVersioningService`
- **Limited tabs** for renewal UI: Quick View, Payment, Product Performance, Manufacturing, Waste, Innovation, Product Discontinue (+ Product Stewardship APIs for optional future client use)

Do **not** migrate or backfill legacy MySQL data. New writes only from rollout forward.

---

## Reference material (in repo)

| Topic | Location |
|-------|----------|
| Legacy renewal behavior | `src/manufacturers/schemas/greenpro02_19_26_product registrationFUNCTIONAL SCOPE DOCUMENT.txt` — **Section 2** |
| Renew list (vendor) | `GET /products/renew-list` in `product-registration` |
| Payments | `paymentType: 'renew'` in `payments` module |
| Document versioning | `DocumentVersioningService`, `doc_streams`, `doc_versions` — `processType: 'renewal'` + `renewalCycleId` |
| Modules to mirror | `process-manufacturing`, `process-waste-management`, `process-product-stewardship`, `process-innovation`, `process-comments`, `product-performance`, `process-mp-manufacturing-units`, `process-wm-manufacturing-units` |

---

## UI scope (renewal screens)

| Tab / area | Backend |
|------------|---------|
| Quick View | Aggregated read API |
| Payment | `payment_details` with `paymentType: 'renew'` |
| Product Performance | `process_renew_product_performance` + renew docs |
| Manufacturing Process | `process_renew_manufacturing`, MP units, energy consumption |
| Waste Management | `process_renew_waste_management`, WM units |
| Innovation | `process_renew_innovation` |
| Product Discontinue | New MERN API (align with PHP discontinue behavior) |
| **Product Stewardship** | **Implement APIs; frontend optional** |
| Comments | `process_renew_comments` |

**Out of scope:** All `raw_materials_*`, `product_design`, `process_life_cycle_approach`, writes to initial `process_*` / `all_product_documents`.

---

## URN & product status (legacy parity)

### URN status during renewal

| Value | Meaning |
|------|---------|
| 12 | Renewal Payment Pending |
| 13 | Renewal Payment Submitted |
| 14 | Renewal Payment Approved (process forms available) |
| 15 | Check Process Forms (admin review) |
| 16 | Vendor Response Pending |
| 17 | Final Verification Pending / process completed |

On renewal **completion**:

- `urnStatus = 11`
- `productRenewStatus = 2`
- `renewedDate = now`
- Extend `validtillDate` by **24 months** from existing `validtillDate` (normalize to **Dec 31** — reuse `certification-dates.util` if applicable)
- Recalculate `firstNotifyDate`, `secondNotifyDate`, `thirdNotifyDate`

### `productRenewStatus` on `products`

| Value | Meaning |
|-------|---------|
| 0 | Not renewed |
| 1 | Renewal in progress |
| 2 | Renewed |

### Eligibility

- `productStatus = 2` (certified)
- `validtillDate < now + 60 days`
- `productRenewStatus = 0` to start a new renewal cycle
- Reuse/extend `GET /products/renew-list`; add admin renew list if missing

Extend admin/vendor URN status DTOs to allow **12–17** (today may only allow 0–11).

---

## MongoDB: create ALL new collection schemas (required deliverable)

**Task:** For every collection below, create a Mongoose schema file under `src/renew/schemas/`, register it in `RenewalModule` via `MongooseModule.forFeature`, and ensure `collection` name matches the legacy SQL table name exactly.

**Conventions (match initial certification modules):**

- `timestamps: false` — use `createdDate` / `updatedDate` (and soft-delete fields on documents)
- Numeric business IDs via `SequenceHelper` (e.g. `processRenewManufacturingId`, `renewProductDocumentId`)
- `vendorId`: `Types.ObjectId` ref `Vendor`
- `urnNo`: string, indexed; unique where one row per URN per entity
- Status fields: `tinyint` parity → `number` (0=Pending, 1=Completed)
- Document flags `0|1` → `number` (0=No file, 1=File available)
- Export `SchemaFactory.createForClass` + document type alias `XxxDocument`

### 1) `renewal_cycles` (NEW — not in legacy MySQL)

**File:** `src/renew/schemas/renewal-cycle.schema.ts`  
**Collection:** `renewal_cycles`

| Field | Type | Notes |
|-------|------|--------|
| urnNo | string | required, indexed |
| cycleNo | number | required; unique with urnNo |
| paymentId | number | optional, links to `payment_details` |
| vendorId | ObjectId | required |
| status | enum | `in_progress` \| `completed` \| `cancelled` |
| urnStatusAtStart | number | optional |
| startedAt | Date | required |
| completedAt | Date | optional |
| createdAt, updatedAt | Date | required |
| createdBy, updatedBy | ObjectId | required |

**Indexes:** unique `{ urnNo: 1, cycleNo: 1 }`, `{ urnNo: 1, status: 1 }`

Use Mongo `_id` as `renewalCycleId` for document versioning (no separate numeric id required unless you prefer one).

---

### 2) `all_renew_product_documents`

**File:** `src/renew/schemas/all-renew-product-document.schema.ts`  
**Collection:** `all_renew_product_documents`  
**Mirror:** `src/product-design/schemas/all-product-document.schema.ts`

Fields: `productDocumentId`, `vendorId`, `urnNo`, `eoiNo`, `documentForm`, `documentFormSubsection`, `formPrimaryId`, `documentName`, `documentOriginalName`, `documentLink`, `documentTag?`, `createdDate`, `updatedDate`, `isDeleted`, `deletedAt`, `deletedBy`

- `productDocumentId` unique index
- `documentForm` enum: `DOCUMENT_SECTION_KEY_VALUES` (renewal sections only)

---

### 3) `process_renew_comments`

**File:** `src/renew/schemas/process-renew-comments.schema.ts`  
**Collection:** `process_renew_comments`  
**Mirror:** `src/process-comments/schemas/process-comments.schema.ts`

Fields: `processCommentsId`, `urnNo`, `vendorId`, comment text fields (`productDesign`, `productPerformance`, `manfacturingProcess`, `wasteManagement`, `lifeCycleApproach`, `productStewardship`, `productInnovation`, `rawMaterials31`–`rawMaterials315`), `updatedDate`

**Index:** unique `urnNo`

---

### 4) `process_renew_product_performance`

**File:** `src/renew/schemas/process-renew-product-performance.schema.ts`  
**Collection:** `process_renew_product_performance`

| Field | Type |
|-------|------|
| processRenewProductPerformanceId | number, unique |
| urnNo, vendorId, eoiNo | required |
| productName | string |
| testReportFileName | string |
| testReportFiles | number (0/1) |
| renewalType | number |
| productPerformanceStatus | number (0/1) |
| createdDate, updatedDate | Date |

Index strategy: mirror initial product-performance / per-EOI patterns.

---

### 5) `process_renew_manufacturing`

**File:** `src/renew/schemas/process-renew-manufacturing.schema.ts`  
**Collection:** `process_renew_manufacturing`  
**Mirror:** `src/process-manufacturing/schemas/process-manufacturing.schema.ts`

**Index:** unique `{ urnNo: 1 }`

---

### 6) `process_renew_mp_manufacturing_units`

**File:** `src/renew/schemas/process-renew-mp-manufacturing-unit.schema.ts`  
**Collection:** `process_renew_mp_manufacturing_units`  
**Mirror:** `src/process-mp-manufacturing-units/schemas/process-mp-manufacturing-unit.schema.ts`

---

### 7) `process_renew_mp_energy_consumption`

**File:** `src/renew/schemas/process-renew-mp-energy-consumption.schema.ts`  
**Collection:** `process_renew_mp_energy_consumption`  
**SQL parity:** link to renew manufacturing id field name consistent with schema.

---

### 8) `process_renew_waste_management`

**File:** `src/renew/schemas/process-renew-waste-management.schema.ts`  
**Collection:** `process_renew_waste_management`  
**Mirror:** `src/process-waste-management/schemas/process-waste-management.schema.ts`

**Index:** unique `{ urnNo: 1 }`

---

### 9) `process_renew_wm_manufacturing_units`

**File:** `src/renew/schemas/process-renew-wm-manufacturing-unit.schema.ts`  
**Collection:** `process_renew_wm_manufacturing_units`  
**Mirror:** `src/process-wm-manufacturing-units/schemas/process-wm-manufacturing-unit.schema.ts`

---

### 10) `process_renew_product_stewardship`

**File:** `src/renew/schemas/process-renew-product-stewardship.schema.ts`  
**Collection:** `process_renew_product_stewardship`  
**Mirror:** `src/process-product-stewardship/schemas/process-product-stewardship.schema.ts`

**Index:** unique `{ urnNo: 1 }`  
**Note:** Backend required; frontend tab optional.

---

### 11) `process_renew_ps_stakeholder_edu_awarness`

**File:** `src/renew/schemas/process-renew-ps-stakeholder-edu-awarness.schema.ts`  
**Collection:** `process_renew_ps_stakeholder_edu_awarness`  
**Mirror:** `src/process-product-stewardship/schemas/process-ps-stakeholder-edu-awarness.schema.ts`

---

### 12) `process_renew_innovation`

**File:** `src/renew/schemas/process-renew-innovation.schema.ts`  
**Collection:** `process_renew_innovation`  
**Mirror:** `src/process-innovation/schemas/process-innovation.schema.ts`

**Index:** unique `{ urnNo: 1 }`

---

### SequenceHelper extensions (required)

Add getters (sync max id from each collection on first use, same pattern as `getProductDocumentId`):

- `getRenewProductDocumentId()`
- `getProcessRenewManufacturingId()`
- `getProcessRenewProductPerformanceId()`
- `getProcessRenewWasteManagementId()`
- `getProcessRenewInnovationId()`
- `getProcessRenewProductStewardshipId()`
- `getProcessRenewCommentsId()`
- `getProcessRenewMpManufacturingUnitId()`
- `getProcessRenewMpEnergyConsumptionId()`
- `getProcessRenewWmManufacturingUnitId()`
- `getProcessRenewPsStakeholderEduAwarnessId()`

### Schema acceptance checklist

- [ ] All 12 collections exist as Mongoose schemas under `src/renew/schemas/`
- [ ] All registered in `RenewalModule`
- [ ] Collection names match SQL table names exactly
- [ ] Unique indexes on `urnNo` where one header row per URN
- [ ] `all_renew_product_documents` mirrors initial document schema + soft delete
- [ ] `renewal_cycles` with unique `{ urnNo, cycleNo }`
- [ ] `npm run build` passes

**Do not** store renewal data in initial `process_*` or `all_product_documents` collections.

---

## File storage & document versioning

- Upload path: `uploadFile(file, 'renew_urns/${urnNo}')`
- Metadata: `all_renew_product_documents`
- On upload/replace/delete: `DocumentVersioningService` with:
  - `processType: 'renewal'`
  - `renewalCycleId` = active cycle `_id`
  - `liveSource: 'all_renew_product_documents'`
  - `sectionKey` = `documentForm`, `subsectionKey` = `documentFormSubsection`
  - `slotKey` = `String(productDocumentId)` or subsection for single-slot sections

Read APIs (existing): `GET /documents/history`, `GET /documents/latest-metadata` with renewal query params.

Payment file versioning: `sectionKey: 'payment'`, `slotKey`: `proposalFile` | `chequeOrDdFile` | `tdsFile`.

---

## Module layout

```
src/renew/
  renewal.module.ts
  constants/
    renewal-urn-status.constants.ts
    renewal-activity.constants.ts
  schemas/                    # all 12 collections above
  services/
    renewal-orchestration.service.ts
    renew-quick-view.service.ts
  controllers/
    admin-renew.controller.ts
    vendor-renew.controller.ts
  documents/
    renew-documents.service.ts
    renew-documents.controller.ts
  process-renew-product-performance/
  process-renew-manufacturing/
  process-renew-mp-manufacturing-units/
  process-renew-mp-energy-consumption/
  process-renew-waste-management/
  process-renew-wm-manufacturing-units/
  process-renew-product-stewardship/
  process-renew-innovation/
  process-renew-comments/
```

Register `RenewalModule` in `app.module.ts`. All routes under `/renew/...`.

---

## Product Stewardship (renewal) — IMPLEMENT API, FRONTEND OPTIONAL

**Requirement:** Build full renew stewardship backend even if renewal UI has no Stewardship tab.

### Collections

- `process_renew_product_stewardship` — one header per `urnNo`
- `process_renew_ps_stakeholder_edu_awarness` — child rows
- Documents: `documentForm: process_product_stewardship`, subsections `sea_supporting_documents`, `qm_supporting_documents`, `epr_supporting_documents`

### Mirror

`src/process-product-stewardship/` — same DTOs, validation, replace-all doc pattern, transactions, `assertVendorCanEditUrn`, activity log.

### API routes (Swagger: `Renew - Product Stewardship`)

- `POST /renew/process-product-stewardship`
- `GET /renew/process-product-stewardship/:urnNo`
- Stakeholder CRUD under `/renew/...` if initial has them

### Orchestration

Seed empty `process_renew_product_stewardship` on renew payment approve (same transaction as other headers).

### Stewardship acceptance (backend only)

- [ ] POST/GET work when `urnStatus >= 14` and active cycle exists
- [ ] Documents only in `all_renew_product_documents`
- [ ] Row seeded on payment approve even if UI never calls API

---

## Orchestration service

`RenewalOrchestrationService`:

1. **Admin start renew payment** — `paymentType: 'renew'`, `urnStatus → 12`, create `renewal_cycles`, activity log
2. **Vendor submit payment proof** — `urnStatus → 13`
3. **Admin approve renew payment** — **single transaction:**
   - Approve payment
   - Seed **all** `process_renew_*` headers (including stewardship)
   - `urnStatus → 14`, `productRenewStatus → 1` where applicable
   - Rollback on failure
4. **Renewal completion** — validity extension, `productRenewStatus → 2`, `urnStatus → 11`, complete cycle
5. **Product discontinue** — API for discontinuing products on URN during renewal

Do **not** copy initial `process_*` data into renew tables on seed.

---

## Quick View APIs

- `GET /renew/admin/quick-view/:urnNo`
- `GET /renew/vendor/quick-view/:urnNo` (optional)

Return: `urnNo`, `urnStatus`, `productRenewStatus`, active `renewalCycle`, category, payment summary, products list, documents from `all_renew_product_documents` only, manufacturing unit summary if available.

Do **not** use `GET /admin/products/details/:urn` for renew screens.

---

## Payment APIs

Reuse `PaymentsModule`; extend/hook:

- Admin create/update renew payment
- Vendor submit proof for `paymentType: 'renew'`
- Admin approve → `RenewalOrchestrationService.onRenewPaymentApproved(...)`

Initial registration/certification payment flows unchanged.

---

## Renew documents API

- `DELETE /renew/documents/:documentId?urnNo=&sectionKey=`
- Soft-delete in `all_renew_product_documents`
- Version track as `deleted`

---

## Other process tab APIs

| Module | Routes (under `/renew/...`) |
|--------|----------------------------|
| Product Performance | POST, GET by urnNo |
| Manufacturing | POST/PATCH, GET, docs |
| MP manufacturing units | CRUD |
| MP energy consumption | CRUD |
| Waste management | POST/PATCH, GET, docs |
| WM manufacturing units | CRUD |
| Innovation | POST/PATCH, GET, docs |
| Product Stewardship | POST, GET (+ stakeholder CRUD) |
| Comments | GET/PATCH |

Each: `JwtAuthGuard`, vendor urn lock, admin routes where initial has them, activity log, renew uploads + versioning.

---

## Non-goals

- No writes to initial `all_product_documents` or `process_*` from renew code
- No raw materials / product design / life cycle renew modules
- No MySQL migration
- No frontend work in this task

---

## Testing & quality

- Unit tests: orchestration (approve seeds all tables, rollback)
- Unit tests: quick-view, renew stewardship POST/GET
- `npm run build` passes

---

## Acceptance criteria

1. Renew payment → `urnStatus 12` + `renewal_cycles` created.
2. Renew payment approve → all `process_renew_*` seeded (including stewardship), `urnStatus 14`, transactional.
3. Renew uploads → `all_renew_product_documents` + `renew_urns/` + version tracking.
4. Each process tab (including stewardship) has working `/renew/...` APIs.
5. Quick View uses renew documents only.
6. Renewal completion updates validity, `productRenewStatus`, `urnStatus 11`, completes cycle.
7. Initial certification APIs unchanged.
8. Activity log on payment and major status transitions.

---

## Implementation order

1. Constants + all **12 schemas** + `RenewalModule` registration + `SequenceHelper`
2. Extend URN status validation (12–17)
3. `RenewalOrchestrationService` + payment approve hook
4. `all_renew_product_documents` + renew delete + versioning
5. Quick View APIs
6. Process modules: Performance → Manufacturing (+ units/energy) → Waste (+ units) → Innovation → **Product Stewardship** → Comments → Discontinue
7. Admin renew list if missing
8. Swagger for all `/renew/*` endpoints

**Optional first PR:** Stop after steps 1–5; deliver process tabs in follow-up PRs.

---

## Agent instructions

When implementing in Agent mode:

1. Create **all schemas first** and verify `npm run build`.
2. Wire orchestration before individual process tab UIs.
3. Mirror initial module code; change only collection names, routes (`/renew/...`), upload folder, and document model.
4. Do not modify initial certification behavior.
