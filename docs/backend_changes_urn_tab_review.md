# URN process tab review (admin)

## Endpoints

| Method | Path |
|--------|------|
| GET | `/api/admin/products/urn-tab-review/:urnNo` |
| PATCH | `/api/admin/products/urn-tab-review` |

Auth: same as other admin product routes (`JwtAuthGuard`, `PermissionsGuard`).

## Storage

Collection `urn_process_tab_reviews`:

- `urnNo`, `tabKey`, `stepId` (0 = process tab; 1–15 = raw materials)
- `reviewStatus`: 0 pending, 1 approved, 2 rejected
- `reviewedBy`, `reviewedAt`, `rejectionRemarks`

Unique index: `(urnNo, tabKey, stepId)`.

## Initialization

Pending rows upserted when:

- Vendor sets `urnStatus` → 4 (`updateUrnStatus`)
- Admin sets `urnStatus` → 4 (`adminUpdateUrnStatus`)
- GET tab-review (lazy ensure missing rows)

## Category steps

`visibleRawMaterialSteps` from `categories.category_raw_material_forms` CSV; empty → all 1–15.

## Files

- `src/product-registration/schemas/urn-process-tab-review.schema.ts`
- `src/product-registration/urn-tab-review.service.ts`
- `src/product-registration/constants/urn-tab-review.constants.ts`
- `src/product-registration/helpers/urn-tab-review.util.ts`
- `src/product-registration/dto/urn-tab-review.dto.ts`
- `src/product-registration/admin-products.controller.ts`
