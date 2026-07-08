# Backend implementation spec: Renew URN details + product performance (vendor + admin)

**Give this document to the API/backend team as the single source of truth.**

**Problem:** Renew data saves correctly in Mongo (`process_renew_*`), but vendor and admin UIs show empty product performance grids and incomplete tabs after refresh. Initial certification works because `GET /products/details/:urnNo` joins all tables in one response. Renew must do the same on renew-specific endpoints and tables.

**Scope:** Vendor portal + admin portal (same API contract, different auth routes).

**Do not change:** Initial certification `GET /products/details`, `POST /product-performance`, or `process_*` (non-renew) collections for renew reads/writes.

---

## 1. Reference: what already works (initial certification)

### Endpoints

| Role | URN details (one joined response) |
|------|-----------------------------------|
| Vendor | `GET /products/details/:urnNo` |
| Admin | `GET /api/admin/products/details/:urnNo` |

### Behaviour

1. User clicks URN from listing.
2. Frontend calls **one** details GET.
3. Backend joins EOI/products + `product_performance` + `process_manufacturing` + `process_waste_management` + documents + comments, etc.
4. Every tab binds from `data[]` (usually `data[0]` for shared process fields).

### Keys the frontend reads (per EOI row in `data[]`)

| Tab / feature | JSON path on each `data[i]` |
|---------------|----------------------------|
| Product Performance | `product_performance.testReports[]`, `product_performance_documents[]` |
| Manufacturing | `process_manufacturing`, `process_manufacturing_documents[]` |
| Waste | `process_waste_management`, `process_waste_management_documents[]` |
| Innovation | `process_innovation`, `process_innovation_documents[]` |
| Stewardship | `process_product_stewardship`, related child arrays |
| All uploads | `all_urn_product_documents[]` (renew: `all_renew_product_documents[]`) |
| Comments | `process_comments` |

---

## 2. What renew must do (mirror cert, different tables)

### Endpoints to implement / fix

| Role | URN details (must join all renew process tables) | Section GET (optional; must match details) | Section POST |
|------|--------------------------------------------------|--------------------------------------------|--------------|
| **Vendor** | `GET /renew/details/:urnNo?renewalCycleId=` | `GET /renew/process-product-performance/:urnNo?renewalCycleId=` | `POST /renew/process-product-performance` |
| **Admin** | `GET /renew/admin/details/:urnNo?renewalCycleId=` | Same path, admin JWT | Same POST, admin JWT |

Also align section GET/POST for manufacturing, waste, innovation, stewardship, comments on `process_renew_*` tables (same pattern as cert).

### Scope key (mandatory on every renew read/write)

```
urnNo           = e.g. "URN-20260528142848"
renewalCycleId  = e.g. "6a1edd713ec5008b997aca94" (Mongo ObjectId string)
```

- Resolve active cycle from renew quick-view / renew context when query param omitted.
- **Never** read or write initial cert `product_performance` / `process_manufacturing` for renew UI.
- **Never** return renew saves on `GET /products/details/:urnNo`.

### Implementation approach (recommended)

1. Locate the service used by `GET /products/details/:urnNo` (the join/aggregation logic).
2. Create `getRenewUrnDetails(urnNo, renewalCycleId, role)` that:
   - Reuses the same **response envelope** and **field names** as cert details.
   - Swaps data sources to `process_renew_*` collections filtered by `urnNo` + `renewalCycleId`.
3. Wire:
   - Vendor route → `GET /renew/details/:urnNo`
   - Admin route → `GET /renew/admin/details/:urnNo`
4. Ensure CORS and auth on `/renew/details` match `/renew/vendor/quick-view/:urnNo` (vendor was blocked when endpoint was new).

---

## 3. Renew URN details — required response shape

### Envelope

```json
{
  "success": true,
  "data": [ /* one object per EOI on the URN — same structure as GET /products/details */ ],
  "product_details_list": [ /* alias of data[] */ ],
  "renewContext": {
    "urnNo": "URN-20260528142848",
    "urnStatus": 14,
    "productRenewStatus": 1,
    "vendorId": "<mongoId>",
    "manufacturerId": "<mongoId>",
    "renewalCycleId": "6a1edd713ec5008b997aca94",
    "activeRenewalCycle": {
      "id": "6a1edd713ec5008b997aca94",
      "cycleNo": 1,
      "status": "in_progress"
    }
  },
  "urnContext": { /* admin only — same as admin cert details if you use it today */ },
  "siteVisits": []
}
```

### Minimum `data[0]` for product performance (required when DB has saves)

```json
{
  "product_details": {
    "eoiNo": "GPPMI003026",
    "productName": "Test Product 2",
    "productId": 123
  },
  "category": { "categoryName": "Solar Photovoltaic Modules" },
  "manufacturer": { "manufacturerName": "...", "_id": "..." },
  "plants": [],
  "product_performance": {
    "renewalType": 1,
    "productPerformanceStatus": 0,
    "testReportFiles": 1,
    "testReports": [
      {
        "productName": "skjsdkjssd",
        "testReportFileName": "",
        "eoiNo": "GPPMI003026"
      }
    ]
  },
  "product_performance_test_reports": [
    {
      "productName": "skjsdkjssd",
      "testReportFileName": "",
      "eoiNo": "GPPMI003026"
    }
  ],
  "product_performance_documents": [],
  "process_manufacturing": {
    "beyondTheFenceInitiatives": "..."
  },
  "process_manufacturing_documents": [],
  "process_waste_management": {
    "wmImplementationDetails": "..."
  },
  "process_waste_management_documents": [],
  "process_innovation": {
    "innovationImplementationDetails": "..."
  },
  "process_innovation_documents": [],
  "all_renew_product_documents": []
}
```

**Frontend binding rule:** Vendor and admin tabs read **`data[0].product_performance.testReports`** first. Flat `product_performance_test_reports[]` is an acceptable alias. Section GET is fallback only.

---

## 4. MongoDB — confirmed saved document (must round-trip on GET)

Collection name may be `process_renew_product_performance` (adjust to your schema).

```json
{
  "_id": "6a1f364b593cdd067775b4fb",
  "urnNo": "URN-20260528142848",
  "renewalCycleId": "6a1edd713ec5008b997aca94",
  "processRenewProductPerformanceId": 3,
  "productName": "skjsdkjssd",
  "productPerformanceStatus": 0,
  "renewalType": 1,
  "testReportFiles": 0,
  "testReportFileName": "",
  "testReports": [
    {
      "productName": "skjsdkjssd",
      "testReportFileName": "",
      "eoiNo": "GPPMI003026",
      "_id": "6a1f85098495b4cf7cd6728c"
    }
  ],
  "vendorId": "...",
  "manufacturerId": "...",
  "createdDate": "2026-06-02T20:00:10.507Z",
  "updatedDate": "2026-06-03T01:36:08.664Z"
}
```

### Read mapping (Mongo → API)

| Mongo field | API field |
|-------------|-----------|
| `testReports[].productName` | `productName` |
| `testReports[].testReportFileName` | `testReportFileName` |
| `testReports[].eoiNo` | `eoiNo` |
| `testReports.length` | `testReportFiles` (must not stay `0` when array has items) |
| Embedded `testReports[]` | `data[0].product_performance.testReports` **and** section GET `data.testReports` |

If test reports live in a child collection, load them and populate the same arrays — do not return header row only.

---

## 5. Broken GET today (do not ship this)

This pattern causes **empty UI** on vendor and admin (frontend correctly ignores product stubs):

```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "processRenewProductPerformanceId": 1,
        "urnNo": "URN-20260528142848",
        "eoiNo": "GPPMI003030",
        "productName": "Naveen QA",
        "testReportFiles": 0
      },
      {
        "processRenewProductPerformanceId": 2,
        "eoiNo": "GPPMI003026",
        "productName": "Test Product 2",
        "testReportFiles": 0
      }
    ]
  }
}
```

**Problems:**

- `rows[]` built from product/EOI list, not from saved renew performance.
- No `testReports` at root, no `product_performance.testReports`.
- `testReportFiles: 0` while Mongo has `testReports[]`.

**Also invalid:** `data: [ performanceDoc ]` without mapping `testReports` onto `product_performance` (frontend can parse raw doc as fallback, but details join is still required).

---

## 6. Section GET `/renew/process-product-performance/:urnNo`

Must return the **same** `testReports` as renew details. Accept any of these shapes (frontend supports all):

### Shape A — object under `data` (preferred)

```json
{
  "success": true,
  "data": {
    "urnNo": "URN-20260528142848",
    "renewalCycleId": "6a1edd713ec5008b997aca94",
    "testReports": [
      { "productName": "skjsdkjssd", "testReportFileName": "", "eoiNo": "GPPMI003026" }
    ],
    "product_performance": {
      "testReports": [
        { "productName": "skjsdkjssd", "testReportFileName": "", "eoiNo": "GPPMI003026" }
      ],
      "testReportFiles": 1
    },
    "product_performance_test_reports": [
      { "productName": "skjsdkjssd", "testReportFileName": "", "eoiNo": "GPPMI003026" }
    ],
    "product_performance_documents": []
  }
}
```

### Shape B — Mongo document as `data[]` array

```json
{
  "success": true,
  "data": [
    {
      "processRenewProductPerformanceId": 3,
      "urnNo": "URN-20260528142848",
      "renewalCycleId": "6a1edd713ec5008b997aca94",
      "testReports": [
        { "productName": "skjsdkjssd", "testReportFileName": "", "eoiNo": "GPPMI003026" }
      ]
    }
  ]
}
```

### Shape C — nested on `data.rows[]` (if you keep audit rows)

Each saved performance row **must** include nested `testReports`:

```json
{
  "processRenewProductPerformanceId": 3,
  "eoiNo": "GPPMI003026",
  "productName": "skjsdkjssd",
  "testReports": [
    { "productName": "skjsdkjssd", "testReportFileName": "", "eoiNo": "GPPMI003026" }
  ]
}
```

---

## 7. POST `/renew/process-product-performance` (save rules)

Multipart — **same field names as initial** `POST /product-performance`, plus renew scope.

| Field | Required | Notes |
|-------|----------|-------|
| `urnNo` | Yes | |
| `renewalCycleId` | Yes | Active cycle id |
| `eoiNo` | Recommended | Tie rows to EOI when multi-product URN |
| `renewalType` | Yes | e.g. `1` |
| `productPerformanceStatus` | Yes | e.g. `0` |
| `testReports` | When saving rows | JSON string — **full replace** for this URN+cycle |
| `test_reports` | Alias | Snake_case alias of `testReports` |
| `existingDocumentIds` | Optional | JSON array e.g. `[201,202]` — **retain** these docs |
| `files` | Optional | **New** uploads only; do not delete retained docs |

### Rule: `testReports` is FULL REPLACE (not merge)

On POST for `(urnNo, renewalCycleId)`:

1. Parse `testReports` JSON array.
2. Delete (or soft-delete) existing renew test-report rows for this URN+cycle **not** in the new array.
3. Upsert each incoming row.
4. Persist exact array on `process_renew_product_performance.testReports` (and child table if used).
5. **No orphan rows** after save.

| User action | POST length | GET length must match |
|-------------|-------------|------------------------|
| Save 4 rows | 4 | 4 |
| Delete 1 row, save | 3 | 3 |
| Clear all rows | 0 | 0 |

### Rule: documents

- Append new `files` as new document rows (`documentForm`: `product_performance`).
- When `existingDocumentIds` sent: **keep** those documents; do not wipe all performance docs on new upload.

### POST response

Return success with saved `testReports` (or require client to refetch GET). Frontend refetches **`GET /renew/details`** (vendor) or **`GET /renew/admin/details`** (admin) after save — not cert details.

Example POST body (vendor):

```
urnNo=URN-20260528142848
renewalCycleId=6a1edd713ec5008b997aca94
eoiNo=GPPMI003026
renewalType=1
productPerformanceStatus=0
testReports=[{"productName":"skjsdkjssd","testReportFileName":"","eoiNo":"GPPMI003026"}]
existingDocumentIds=[]
```

---

## 8. Pseudo-code: read product performance for renew

```typescript
async function loadRenewProductPerformance(urnNo: string, renewalCycleId: string) {
  const header = await ProcessRenewProductPerformance.findOne({
    urnNo,
    renewalCycleId: new ObjectId(renewalCycleId),
  });

  if (!header) {
    return { testReports: [], product_performance: { testReports: [] } };
  }

  // Prefer embedded array; else load child collection
  let testReports = Array.isArray(header.testReports) ? header.testReports : [];
  if (testReports.length === 0) {
    testReports = await ProcessRenewProductPerformanceTestReports.find({
      urnNo,
      renewalCycleId,
      // or processRenewProductPerformanceId: header.processRenewProductPerformanceId
    }).lean();
  }

  const mapped = testReports.map((r) => ({
    productName: r.productName ?? r.product_name ?? '',
    testReportFileName: r.testReportFileName ?? r.test_report_file_name ?? '',
    eoiNo: r.eoiNo ?? r.eoi_no ?? header.eoiNo,
  }));

  const documents = await loadRenewDocuments(urnNo, renewalCycleId, 'product_performance');

  return {
    testReports: mapped,
    product_performance: {
      renewalType: header.renewalType,
      productPerformanceStatus: header.productPerformanceStatus,
      testReportFiles: mapped.length,
      testReports: mapped,
    },
    product_performance_test_reports: mapped,
    product_performance_documents: documents,
  };
}

async function buildRenewUrnDetails(urnNo: string, renewalCycleId: string) {
  const eoiRows = await loadEoiProductRowsForUrn(urnNo); // same as cert listing
  const performance = await loadRenewProductPerformance(urnNo, renewalCycleId);
  const manufacturing = await loadRenewManufacturing(urnNo, renewalCycleId);
  const waste = await loadRenewWasteManagement(urnNo, renewalCycleId);
  const innovation = await loadRenewInnovation(urnNo, renewalCycleId);
  const allDocs = await loadAllRenewDocuments(urnNo, renewalCycleId);

  const data = eoiRows.map((row, index) => ({
    ...row,
    ...(index === 0
      ? {
          product_performance: performance.product_performance,
          product_performance_test_reports: performance.product_performance_test_reports,
          product_performance_documents: performance.product_performance_documents,
          process_manufacturing: manufacturing.process,
          process_manufacturing_documents: manufacturing.documents,
          process_waste_management: waste.process,
          process_waste_management_documents: waste.documents,
          process_innovation: innovation.process,
          process_innovation_documents: innovation.documents,
          all_renew_product_documents: allDocs,
        }
      : {}),
  }));

  return {
    success: true,
    data,
    product_details_list: data,
    renewContext: await buildRenewContext(urnNo, renewalCycleId),
    siteVisits: await loadRenewSiteVisits(urnNo, renewalCycleId),
  };
}
```

Use the same merge strategy cert details uses for multi-EOI URNs (shared process block on primary row or per-EOI — **match cert behaviour**).

---

## 9. Other renew process sections (same join pattern)

| Cert table (initial) | Renew table | Details key | POST path |
|----------------------|-------------|-------------|-----------|
| `process_manufacturing` | `process_renew_manufacturing` | `process_manufacturing` | `POST /renew/process-manufacturing` |
| `process_waste_management` | `process_renew_waste_management` | `process_waste_management` | `POST /renew/process-waste-management` |
| `process_innovation` | `process_renew_innovation` | `process_innovation` | `POST /renew/process-innovation` |
| `process_product_stewardship` | `process_renew_product_stewardship` | `process_product_stewardship` | `POST /renew/process-product-stewardship` |
| `process_comments` | `process_renew_comments` | `process_comments` | `POST /renew/process-comments` |

Each must appear on **`GET /renew/details`** and **`GET /renew/admin/details`** when saved — not only on isolated section GET.

---

## 10. Acceptance tests (ticket not done until all pass)

Use URN `URN-20260528142848` and cycle `6a1edd713ec5008b997aca94` (or your active test cycle).

### A. Product performance

| # | Step | Expected |
|---|------|----------|
| A1 | Mongo has `testReports` with `productName: "skjsdkjssd"` | — |
| A2 | `GET /renew/process-product-performance/URN-...?renewalCycleId=...` (vendor token) | `testReports.length >= 1`, name `skjsdkjssd` |
| A3 | Same GET with admin token | Same as A2 |
| A4 | `GET /renew/details/URN-...?renewalCycleId=...` (vendor) | `data[0].product_performance.testReports` matches A2 |
| A5 | `GET /renew/admin/details/URN-...?renewalCycleId=...` (admin) | Same as A4 |
| A6 | Vendor UI → Renew → Product Performance → refresh | Table shows `skjsdkjssd` |
| A7 | Admin UI → Renew → Product Performance → refresh | Table shows `skjsdkjssd` |
| A8 | POST save 1 row, refetch details | GET shows exactly 1 row (full replace) |
| A9 | `GET /products/details/URN-...` | **No** renew-only rows mixed in |

### B. Renew details join

| # | Step | Expected |
|---|------|----------|
| B1 | Open renew URN from listing (vendor) | One `GET /renew/details` returns EOI + process blocks |
| B2 | Open renew URN from listing (admin) | One `GET /renew/admin/details` returns same shape |
| B3 | Response includes `renewContext.renewalCycleId` | Always set |
| B4 | Saved manufacturing/waste/innovation text in DB | Present on `data[0].process_*` in details GET |

### C. Regression

| # | Check |
|---|--------|
| C1 | Initial cert product performance unchanged for same URN |
| C2 | CORS: vendor browser can call `/renew/details` (no block vs quick-view) |
| C3 | POST without `renewalCycleId` rejected or defaults to active cycle explicitly |

---

## 11. Quick verification commands

Replace base URL and tokens.

```http
### Vendor — section GET
GET {{base}}/renew/process-product-performance/URN-20260528142848?renewalCycleId=6a1edd713ec5008b997aca94
Authorization: Bearer {{vendorToken}}

### Vendor — details GET
GET {{base}}/renew/details/URN-20260528142848?renewalCycleId=6a1edd713ec5008b997aca94
Authorization: Bearer {{vendorToken}}

### Admin — details GET
GET {{base}}/renew/admin/details/URN-20260528142848?renewalCycleId=6a1edd713ec5008b997aca94
Authorization: Bearer {{adminToken}}
```

---

## 12. Frontend contract (for backend awareness only)

- **Vendor app** loads `GET /renew/details/:urnNo` on renew URN page open (`vendor/context/RenewalContext.tsx`).
- **Admin app** loads `GET /renew/admin/details/:urnNo` (`admin/context/RenewalContext.tsx`).
- Tabs bind `data[0].product_performance.testReports`, `process_manufacturing`, etc.
- Temporary client-side enrichment exists until this spec is implemented; **backend join remains required** for parity with uncertified.

---

## 13. Summary checklist for backend PR

- [ ] `GET /renew/details/:urnNo` joins `process_renew_*` by `urnNo` + `renewalCycleId`
- [ ] `GET /renew/admin/details/:urnNo` returns **same payload** (admin auth only)
- [ ] `data[0].product_performance.testReports` populated from Mongo embedded/child rows
- [ ] Section GET performance returns same `testReports` as details
- [ ] POST performance uses **full replace** for `testReports` + document retain via `existingDocumentIds`
- [ ] No stub-only `rows[]` without nested `testReports` when DB has saves
- [ ] `testReportFiles` reflects real count
- [ ] Cert endpoints unchanged
- [ ] Acceptance tests §10 pass on vendor and admin tokens

---

**Document version:** 2026-06-02  
**Contact:** Frontend renew flow — `admin/docs/renew-frontend-pattern-prompt.md`
