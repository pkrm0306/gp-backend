# Frontend: Admin un-certified products — category change

Implement category dropdown rules, URN-wide sync, list refresh, and vendor raw-materials visibility for **Products → Un-Certified Products**.

---

## Business rules

| When | Category editable? |
|------|-------------------|
| Uncertified EOI, `urnStatus` **0–5** (before admin **Final Submit**) | **Yes** |
| After admin **Final Submit** (`urnStatus >= 6`) | **No** — all forms sent for final review |
| Certified product (`productStatus === 2`) | **No** |
| Renewal workflow (`urnStatus` 12–17) | **No** |

**Important:** Category stays editable during admin tab review (`urnStatus = 4`) and vendor resubmit (`urnStatus = 5`). It locks only after admin clicks **Submit Final** (backend sets `urnStatus = 6`).

Changing category on **any one EOI** updates **every EOI on the same URN**. Raw-material data for **overlapping** criteria (steps present in both old and new category) is **kept**. Only steps that existed in the old category but not the new one are purged; new steps are empty for the vendor to fill.

---

## APIs

### Edit category (uncertified)

```
PUT /api/product-registration/{productId}
```

Required body fields: `productName`, `productDetails`, `urnNo`, `eoiNo`, `categoryId`.

Do **not** rely on sending `purgedRawMaterialStepIds` (or other step preview fields) — the server ignores them and computes purge/retain from categories. If your form spreads list/detail rows into the PUT body, that is OK; extra read-only fields are accepted and ignored.

### Read edit flags

| Source | Fields |
|--------|--------|
| `POST /api/admin/products/list` → each EOI | `categoryEditable`, `categoryChangeBlockReason`, `categoryId`, `urnWorkflowStatus`, `urnStatusCode` (alias) |
| `GET /api/admin/products/details/:urn` → `product_details` | `categoryEditable`, `categoryChangeBlockReason`, `visibleRawMaterialSteps` |

Use **`categoryEditable`** from the API — do not hard-code `urnStatus` checks in the UI.

### Certified edit (category always disabled)

```
PATCH /api/admin/products/certified/:productId}
```

Response includes `categoryEditable: false`. Omit `categoryId` or send the unchanged value.

---

## Success response after category change

```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "_id": "...",
    "categoryId": "...",
    "categoryChange": {
      "changed": true,
      "listRefreshRequired": true,
      "vendorMustRefillRawMaterials": true,
      "categorySyncedAcrossUrn": true,
      "syncedEoiCount": 3,
      "syncedEoiNos": ["GPABC001001", "GPABC001002", "GPABC001003"],
      "syncedProductIds": ["...", "...", "..."],
      "previousCategoryId": "...",
      "newCategoryId": "...",
      "visibleRawMaterialSteps": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "retainedRawMaterialSteps": [1, 2, 3],
      "addedRawMaterialSteps": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "purgedSteps": [],
      "manufacturerListTotals": {
        "previousCategory": { "total_urns": 5, "total_eois": 8 },
        "newCategory": { "total_urns": 3, "total_eois": 4 }
      }
    }
  }
}
```

---

## UI implementation

### 1. Category dropdown (uncertified EOI / URN edit)

```tsx
<CategorySelect
  disabled={!eoi.categoryEditable}
  value={eoi.categoryId}
  title={eoi.categoryChangeBlockReason ?? undefined}
  onChange={handleCategoryChange}
/>
```

Show `categoryChangeBlockReason` as helper text or tooltip when disabled, e.g.:

- *"Product category cannot be changed after admin final submit..."*

### 2. After successful category change

```ts
const { categoryChange } = response.data ?? {};

if (categoryChange?.listRefreshRequired) {
  await refetchAdminProductList(); // keep current filters
}

if (categoryChange?.categorySyncedAcrossUrn) {
  // All EOIs on this URN now share newCategoryId — refresh URN detail if open
  await refetchUrnDetails(urnNo);
  toast.success(
    `Category updated for ${categoryChange.syncedEoiCount} EOI(s) on URN ${urnNo}`,
  );
}
```

Update **all EOI rows** in local state for the same `urnNo` to `categoryChange.newCategoryId` (do not wait for refetch if you optimistically update).

### 3. Total URN count

When the list is filtered by category, counts change after a category move. Use:

- `categoryChange.manufacturerListTotals.newCategory` / `previousCategory`, or
- Refetch list when `listRefreshRequired === true`

### 4. Vendor raw materials (after admin category change)

When the category **expands** (e.g. old category had steps `1,2,3`, new has all 15), vendor data for steps **1–3 is preserved**; steps **4–15** are new and empty. `vendorMustRefillRawMaterials` is `true` only when `addedRawMaterialSteps.length > 0`.

When the category **shrinks**, data for removed steps is purged (`purgedSteps`); overlapping steps are kept.

Vendor / admin URN process view:

```ts
const steps = urnDetails.visibleRawMaterialSteps
  ?? urnDetails.product_details?.visibleRawMaterialSteps
  ?? urnDetails.category?.visibleRawMaterialSteps
  ?? [];

steps.map((stepId) => <RawMaterialStep key={stepId} stepId={stepId} />);
```

Sources:

- `GET /api/products/details/:urn_no` → `visibleRawMaterialSteps` (top-level) + per-row `category`
- `GET /api/admin/products/details/:urn` → `urnContext.visibleRawMaterialSteps`
- `GET /api/admin/products/urn-tab-review/:urnNo` → `visibleRawMaterialSteps`

### 5. Final Submit button (admin tab review)

When admin clicks **Submit Final**, backend sets `urnStatus = 6`. After that:

- Disable category on all EOIs for that URN
- Refetch list/details so `categoryEditable` becomes `false`

No separate frontend lock is required if you always bind to `categoryEditable`.

---

## Error handling (400)

Show API `message`:

| Message | Meaning |
|---------|---------|
| `Product category cannot be changed after admin final submit...` | `urnStatus >= 6` |
| `Product category cannot be changed for certified products...` | Certified EOI |
| `Product category cannot be changed while the URN is in renewal workflow` | Renewal |

---

## Backend reference

- `src/product-registration/helpers/category-change.util.ts`
- `src/product-registration/services/category-change-cleanup.service.ts`
- `PUT /api/product-registration/:id` → `ProductRegistrationService.updateProduct`
