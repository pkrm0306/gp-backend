# Frontend: Renew workspace — single `include=full` load on URN open

**Backend spec:** Extend existing renew details endpoints with `include=full` so one read returns everything needed to open the renew process workspace. No new route (`/workspace`).

**Test URN:** `URN-20260605113319`  
**Test cycle:** `6a26719a22375978fb33e020`

---

## Goal

Stop the multi-request waterfall when opening a renew URN workspace. One GET replaces the initial burst of:

1. Details GET
2. Quick-view GET
3. Up to four process section GETs (manufacturing, waste, innovation, product performance)
4. Admin only: tab reviews GET + process comments GET

**Still separate (not in `include=full`):** activity log, document version history, file download/stream endpoints.

---

## API

### Admin

```http
GET /renew/admin/details/{urnNo}?renewalCycleId={cycleId}&include=full
Authorization: Bearer <admin_access_token>
```

### Vendor

```http
GET /renew/details/{urnNo}?renewalCycleId={cycleId}&include=full
Authorization: Bearer <vendor_access_token>
```

### Query parameters

| Param | Required | Values | Notes |
|-------|----------|--------|-------|
| `urnNo` | Yes | path | e.g. `URN-20260605113319` |
| `renewalCycleId` | Recommended | ObjectId string | Active cycle; backend resolves from `renewContext` if omitted |
| `include` | No | omit / `summary` / `full` | `full` = complete workspace payload |

### `include` modes

| Mode | Behavior |
|------|----------|
| Omitted or `include=summary` | Legacy lighter payload — **no breaking change** |
| `include=full` | Complete workspace payload (see below) |

---

## Remove on initial URN open

After wiring `include=full`, do **not** call these on first paint:

| Remove from initial load | Replaced by |
|--------------------------|-------------|
| `GET /renew/admin/quick-view/:urnNo` or vendor quick-view | Root fields in `include=full` response |
| `GET /renew/process-manufacturing/:urnNo` | `data[0].process_manufacturing`, `process_mp_manufacturing_units`, `process_manufacturing_documents` |
| `GET /renew/process-waste-management/:urnNo` | `data[0].process_waste_management`, `process_wm_manufacturing_units`, `process_waste_management_documents` |
| `GET /renew/process-innovation/:urnNo` | `data[0].process_innovation`, `process_innovation_documents` |
| `GET /renew/process-product-performance/:urnNo` | `data[0].product_performance`, `product_performance_test_reports`, `product_performance_documents` |
| Admin: `GET /api/admin/products/urn-tab-review/{urnNo}` | Root `tabReviews` |
| Admin: `GET /renew/admin/process-comments/:urnNo` | Root `processComments` |

Quick-view and section GETs may remain for **manual refresh** after a save (lighter partial reload).

---

## Response mapping

### Top-level (replaces quick-view enrichment)

| Field | Use |
|-------|-----|
| `renewContext` | `urnNo`, cycle-scoped `urnStatus`, `productRenewStatus`, `renewalCycleId`, `activeRenewalCycle` |
| `urnContext` | Vendor/manufacturer ids + status mirror |
| `category` | Category summary card |
| `manufacturer` | Manufacturer summary |
| `vendor` | Vendor contact card (`company`, `contact`, `email`, `phone`) |
| `product_details_list` | Compact certified products: `eoiNo`, `productName`, `productStatus`, `hpUnits` / `plantCount` |
| `payment` | Single renew payment for requested cycle, or `null` |
| `payments` | `[]` or cycle-scoped array — **never** prior-cycle payment when a new cycle is active |
| `plants` / `plant_details` | Deduped plant list for Quick View sidebar |

### Process tabs — read from `data[0]`

All four renew sections are **always present** when `include=full` (objects may be empty stubs; arrays may be `[]`).

```typescript
const row = response.data[0];

// Product performance — prefer nested testReports first
row.product_performance?.testReports
row.product_performance?.testReportFiles  // must match testReports.length when reports exist
row.product_performance_test_reports
row.product_performance_documents

// Manufacturing
row.process_manufacturing
row.process_mp_manufacturing_units   // alias: process_renew_mp_manufacturing_units if needed
row.process_manufacturing_documents

// Waste
row.process_waste_management
row.process_wm_manufacturing_units
row.process_waste_management_documents

// Innovation
row.process_innovation
row.process_innovation_documents

// All documents (cycle-scoped, soft-deleted excluded)
row.all_renew_product_documents
```

#### Product performance shape

```json
{
  "product_performance": {
    "renewalType": 1,
    "productPerformanceStatus": 0,
    "testReportFiles": 1,
    "testReports": [
      {
        "productName": "greenproduct",
        "testReportFileName": "report.pdf",
        "eoiNo": "GPPMI003028"
      }
    ]
  },
  "product_performance_test_reports": [ /* same rows as testReports */ ],
  "product_performance_documents": []
}
```

### Admin only

```typescript
response.tabReviews       // same contract as urn-tab-review GET
response.processComments  // admin section comments
```

**Vendor must not expect** `tabReviews` or `processComments`.

#### `processComments` field names (legacy typo preserved)

| Admin tab | JSON field |
|-----------|------------|
| Product Performance | `productPerformance` |
| Manufacturing Process | `manfacturingProcess` |
| Waste Management | `wasteManagement` |
| Innovation | `productInnovation` |

#### Tab review gating (admin Quick View buttons)

Use `tabReviews.summary`:

| Condition | Action |
|-----------|--------|
| `!allReviewed` | Disable Resend and Submit final |
| `allReviewed && (hasRejection \|\| allApproved)` | Enable Resend to vendor → `urnStatus` 16 |
| `allReviewed && allApproved` | Enable Submit for final review → `urnStatus` 17 |

`tabReviews.canReview` is `true` only when cycle-scoped `urnStatus === 15`.

---

## urnStatus rules

Use `renewContext.urnStatus` (or `tabReviews.urnStatus`) for the **requested renewal cycle**, not the parent product's certified status **11** while a renew cycle is in progress.

| Code | Label |
|------|-------|
| 12 | Renewal payment pending |
| 13 | Renewal payment submitted |
| 14 | Renewal payment approved |
| 15 | Check process forms (admin section review) |
| 16 | Vendor response pending |
| 17 | Final verification pending |
| 11 | Verification completed |

New renewal cycle starts at **12** until payment workflow advances. After admin approves renewal payment → **14**.

---

## Product filtering

Renewal lists include **only** certified products (`productStatus === 2`).

| `productStatus` | Meaning | In renew lists? |
|-----------------|---------|-----------------|
| 0 | Pending | No |
| 1 | Submitted | No |
| 2 | Certified | **Yes** |
| 3 | Rejected | **Never** |
| 4 | Discontinued / Expired | No |

If the UI previously counted all EOIs, expect fewer rows when rejected products exist.

---

## Cycle scoping

Every renew read/write uses:

```
urnNo           = e.g. "URN-20260605113319"
renewalCycleId  = e.g. "6a26719a22375978fb33e020"
```

When cycle 2 starts (`PATCH /renew/admin/test-validity`):

- `GET ...?renewalCycleId=<cycle2>&include=full` → **empty** `process_renew_*` sections, `payment: null`, `payments: []`, no cycle-1 docs in primary arrays
- Cycle-1 data is only returned when `renewalCycleId=<cycle1>` is explicitly requested

Do **not** use cert snapshot process data from `GET /products/details/:urnNo` for renew workspace tabs.

---

## Suggested client change

### Before (waterfall)

```typescript
await getRenewDetails(urn);
await getQuickView(urn);
await Promise.all([
  getManufacturing(urn),
  getWaste(urn),
  getInnovation(urn),
  getProductPerformance(urn),
]);
if (isAdmin) {
  await getTabReviews(urn, cycleId);
  await getProcessComments(urn, cycleId);
}
// Then client-side "enrichment" merges quick-view into details state
```

### After (single load)

```typescript
const { data: workspace } = await api.get(
  isAdmin
    ? `/renew/admin/details/${urnNo}`
    : `/renew/details/${urnNo}`,
  {
    params: {
      renewalCycleId: cycleId, // from renew list or renewContext
      include: 'full',
    },
  },
);

hydrateRenewWorkspace(workspace);
// One state update — no second enrichment pass
```

### Hydration sketch

```typescript
function hydrateRenewWorkspace(res: RenewWorkspaceResponse) {
  const row = res.data[0];

  setRenewContext(res.renewContext);
  setUrnContext(res.urnContext);
  setCategory(res.category);
  setManufacturer(res.manufacturer);
  setVendor(res.vendor);
  setProductList(res.product_details_list);
  setPlants(res.plants);
  setPayment(res.payment);

  setProductPerformance(row.product_performance);
  setManufacturing(row.process_manufacturing, row.process_mp_manufacturing_units);
  setWaste(row.process_waste_management, row.process_wm_manufacturing_units);
  setInnovation(row.process_innovation);
  setAllDocuments(row.all_renew_product_documents);

  if (isAdmin) {
    setTabReviews(res.tabReviews);
    setProcessComments(res.processComments);
  }
}
```

---

## After writes (unchanged)

Write APIs stay separate. After any save, either:

- Re-call `GET ...?include=full`, or
- Use individual section GETs for a lighter partial refresh

| Action | Method | Path |
|--------|--------|------|
| Create renewal fee | POST | `/payments` (`paymentType: renew`, `renewalCycleId`) |
| Approve/reject payment | PATCH | `/payments/{urnNo}` |
| Save process section | POST | `/renew/process-manufacturing`, `/renew/process-waste-management`, etc. |
| Tab approve/reject | PATCH | `/api/admin/products/urn-tab-review` |
| Admin comment | POST | `/renew/admin/process-comments` |
| Resend / final submit | PATCH | `/renew/urn-status` |

---

## HTTP errors

| Case | HTTP |
|------|------|
| URN not found | 404 |
| No active renewal cycle | 404 or 400 |
| Missing / invalid JWT | 401 |
| Vendor does not own URN | 403 or 404 |
| Server error | 500 |

---

## Acceptance checklist

### Admin

- [ ] `GET /renew/admin/details/:urn?renewalCycleId=&include=full` → 200
- [ ] `data[0]` has all four process blocks + document arrays
- [ ] `payment` / `payments` only for requested cycle
- [ ] `tabReviews` and `processComments` at root
- [ ] No `productStatus: 3` in `product_details_list` or `data`
- [ ] `include` omitted → 200, lighter payload, no regression
- [ ] Cycle 2 after test renewal → empty process sections, `payment: null`, no cycle-1 docs

### Vendor

- [ ] `GET /renew/details/:urn?renewalCycleId=&include=full` → 200, same process/payment/plants
- [ ] No `tabReviews` or `processComments`
- [ ] Wrong vendor JWT → 403 / 404

### Performance

- [ ] One `include=full` call replaces details + quick-view + up to 4 section GETs on open
- [ ] Time-to-interactive lower than multi-call flow

### Rejected products

- [ ] URN with 1 certified + 1 rejected EOI → details shows 1 product only

### Payments

- [ ] Complete cycle 1; start cycle 2 → `include=full` with cycle 2 → `payments: []`, `payment: null`
- [ ] Cycle 1 payment still returned when `renewalCycleId=<cycle1>`
