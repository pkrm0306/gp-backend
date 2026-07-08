# Frontend Prompt: Renewal Forms — Same Pattern as Uncertified Certification

Use this prompt to align the renewal UI with the backend.

**Backend spec (API team):** [`renew-urn-details-backend-spec.md`](./renew-urn-details-backend-spec.md) → full prompt [`BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md`](./BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md).

**Fix CORS / “Renew details API failed” banner:** [`renew-details-api-frontend-fix-prompt.md`](./renew-details-api-frontend-fix-prompt.md) — use when Network shows no `GET /renew/details` to port 3000.

**Renewal uses the same API patterns and field names as initial (uncertified) certification; only the URL prefix and DB tables differ.**

---

## Core rule

| Initial certification | Renewal |
|----------------------|---------|
| `GET /products/details/:urn_no` | **`GET /renew/details/:urn_no`** |
| Admin: `GET /api/admin/products/details/:urn` | **`GET /renew/admin/details/:urnNo`** |
| `POST /product-performance`, `POST /process-manufacturing`, … | `POST /renew/process-product-performance`, `POST /renew/process-manufacturing`, … |

**Never** load renewal tab data from cert details APIs — they return **initial certification** data only.

**Never** send `vendorId` / `manufacturerId` in save payloads — backend resolves from `urnNo`.

---

## 1) Load URN details first (required)

### Vendor
```
GET /renew/details/{urnNo}?renewalCycleId={optional}
```

### Admin
```
GET /renew/admin/details/{urnNo}?renewalCycleId={optional}
```

### Response
```json
{
  "success": true,
  "data": [ /* one row per EOI — same keys as GET /products/details */ ],
  "product_details_list": [ /* alias of data */ ],
  "renewContext": {
    "urnNo": "URN-20260528142848",
    "urnStatus": 14,
    "productRenewStatus": 1,
    "vendorId": "...",
    "manufacturerId": "...",
    "renewalCycleId": "6a1edd713ec5008b997aca94",
    "activeRenewalCycle": { "id": "...", "cycleNo": 1, "status": "in_progress" }
  },
  "siteVisits": [],
  "site_visits": []
}
```

Admin also returns `urnContext` (same as admin cert details).

---

## 2) Where to read saved form data (bind UI from here)

Use **`data[0]`** (or any EOI row — shared process fields are merged across EOIs like cert).

| Tab | Read from details row |
|-----|------------------------|
| Product Performance | `data[0].product_performance` → **`testReports[]`**, `renewalType`, `productPerformanceStatus` |
| Performance docs | `data[0].product_performance_documents` |
| Performance rows (flat) | `data[0].product_performance_test_reports` |
| Manufacturing | `data[0].process_manufacturing` + `process_manufacturing_documents` |
| Waste | `data[0].process_waste_management` + `process_waste_management_documents` |
| Stewardship | `data[0].process_product_stewardship` + `process_ps_stakeholder_edu_awarness` + documents |
| Innovation | `data[0].process_innovation` + `process_innovation_documents` |
| Comments | `data[0].process_comments` |
| All renew uploads | `data[0].all_urn_product_documents` or `all_renew_product_documents` |

### Product performance — populate form from GET

Section GET returns **all** of these (bind any one; prefer root `testReports` or `product_performance.testReports`):

```json
{
  "success": true,
  "data": {
    "urnNo": "URN-20260528142848",
    "renewalCycleId": "6a1edd713ec5008b997aca94",
    "testReports": [
      { "productName": "kkjjdsdjksd", "testReportFileName": "", "eoiNo": "GPPMI003026" }
    ],
    "product_performance": {
      "testReports": [ /* same rows */ ],
      "testReportFiles": 1,
      "renewalType": 1,
      "productPerformanceStatus": 0
    },
    "product_performance_test_reports": [ /* same rows */ ],
    "rows": [
      {
        "eoiNo": "GPPMI003026",
        "productName": "Test Product 2",
        "testReports": [ { "productName": "kkjjdsdjksd", "testReportFileName": "", "eoiNo": "GPPMI003026" } ]
      }
    ]
  }
}
```

Renew details: use `data[0].product_performance.testReports` (same row shape).

```typescript
const perf = details.data[0]?.product_performance;
const rows = perf?.testReports ?? details.data[0]?.testReports ?? [];
```

Store `renewContext.renewalCycleId` in page state — required for performance save.

---

## 3) Tab save — same FormData as uncertified

| Tab | POST |
|-----|------|
| Product Performance | `POST /renew/process-product-performance` |
| Manufacturing | `POST /renew/process-manufacturing` |
| Waste | `POST /renew/process-waste-management` |
| Stewardship | `POST /renew/process-product-stewardship` |
| Innovation | `POST /renew/process-innovation` |
| Comments | `POST /renew/process-comments` |

Reuse the **exact same multipart field names** as uncertified (`portableWaterDemand`, `testReports`, file field names, etc.).

### Product performance save (multipart)
| Field | Required | Notes |
|-------|----------|-------|
| `urnNo` | Yes | |
| `renewalCycleId` | Yes | From `renewContext.renewalCycleId` |
| `eoiNo` | Per product row | Applied to test report rows missing `eoiNo` |
| `renewalType` | Yes | e.g. `1` |
| `productPerformanceStatus` | Yes | e.g. `0` |
| `testReports` | When replacing rows | JSON string: `[{"productName":"...","testReportFileName":"...","eoiNo":"..."}]` |
| `existingDocumentIds` | Optional | JSON array of retained doc ids |
| files | Optional | Same field names as cert (`files`, `testReportFile`, …) |

After save:
```
GET /renew/details/{urnNo}?renewalCycleId={same cycle id}
```
Do **not** refetch cert details.

---

## 4) Optional per-tab GET (cert-shaped)

Same subsection keys as details `data[0]`:

| Tab | GET |
|-----|-----|
| Performance | `GET /renew/process-product-performance/:urnNo?renewalCycleId=` |
| Manufacturing | `GET /renew/process-manufacturing/:urnNo` |
| Others | `GET /renew/process-{section}/:urnNo` |

Prefer single **`GET /renew/details`** load for the whole page.

---

## 5) Page flow

### Vendor / admin renewal URN page
1. `GET /renew/details/{urnNo}` (or admin route)
2. Save `renewContext.renewalCycleId`
3. Reuse **uncertified tab components** — bind from `data[0].process_*` / `product_performance`
4. On save → `POST /renew/process-*` → refetch **`GET /renew/details`**
5. Hide tabs not in renewal scope: product design, raw materials, life cycle

### Quick view (summary only)
- `GET /renew/vendor/quick-view/:urnNo` or `/renew/admin/quick-view/:urnNo`
- Use for payments / version badges — **not** for form field binding

---

## 6) Common mistakes to avoid

| Mistake | Result |
|---------|--------|
| Loading `GET /products/details` on renew page | Shows **cert** data, not renew saves |
| Not passing `renewalCycleId` on performance save/GET | Wrong or empty performance rows |
| Reading performance from cert `product_performance` | Empty after renew save |
| Omitting `eoiNo` on multi-EOI URN | Row saves but may not match product grid |
| Refetching cert details after renew save | Form appears unchanged |

---

## 7) Acceptance checklist

- [ ] Renew page calls **`GET /renew/details/:urn_no`** on open
- [ ] Product performance grid binds from `data[0].product_performance.testReports`
- [ ] Save sends `urnNo` + `renewalCycleId` + `testReports` (+ form `eoiNo`)
- [ ] After save, refetch renew details — saved `productName` / `eoiNo` visible
- [ ] Cert details API unchanged; renew page never uses it for process tabs
- [ ] Same field names as uncertified components (`processManufacturingId` aliases work in response)
