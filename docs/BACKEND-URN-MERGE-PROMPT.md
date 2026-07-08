# Backend prompt: Merge certified URN into existing URN

**Give this entire file to the API/backend team** (`cursor-greenpro-mern`, NestJS + MongoDB).

**Business requirement:** After certification, an admin may merge a **source URN** into an **existing target URN**. All **certified EOIs (products)** from the source must appear under the target URN. **Category must match**; different categories → reject. Vendor/manufacturer should match. Do not merge during active renewal.

**Status:** Implemented — `src/product-registration/urn-merge/`. URN is a **string grouping key** on `products`, not a separate entity. Many collections are keyed by `urnNo` (and often `vendorId`); some are **one row per URN** (process forms), others are **per EOI** (products, plants, EOI documents).

---

## 1. Concepts (MERN model)

| Term | Meaning in this codebase |
|------|---------------------------|
| URN | `products.urnNo` — groups multiple EOIs under one registration |
| EOI | One `products` row (`productId`, `eoiNo`) |
| Certified | `productStatus = 2` (`PRODUCT_STATUS_CERTIFIED`) |
| URN-level data | `process_manufacturing`, `process_product_design`, `payment_details`, raw-materials `*`, `process_comments`, etc. — typically **one header per `urnNo`** |
| EOI-level data | `products`, `product_plants`, `all_product_documents` (with `eoiNo`), per-EOI measures |

Existing multi-EOI under one URN already works via `getProductDetailsByUrn` + `consolidate-urn-detail-items.util.ts`. **Merge** = move source EOIs to target + reconcile URN-level rows.

---

## 2. Merge rules (hard requirements)

### 2.1 Allowed only when

| Check | Rule |
|-------|------|
| Role | Admin only (`PRODUCTS_UPDATE` or dedicated permission) |
| Source | At least one **certified** product (`productStatus = 2`, not soft-deleted) |
| Target | Exists; at least one certified product |
| Category | `categoryId` on source and target must be **equal** (compare ObjectId string) |
| Vendor / manufacturer | Same `vendorId` and `manufacturerId` on representative products |
| Renewal | **Block** if any product on either URN has `urnStatus` in **12–17** OR `productRenewStatus = 1` |
| Renewal cycles | **Block** if `renewal_cycles` has `status: in_progress` for **either** `urnNo` |
| EOI collision | After move, no duplicate `eoiNo` under target for that manufacturer |

### 2.2 What merge must do (v1)

| Step | Action |
|------|--------|
| 1 | Move certified source **products** → `urnNo = targetUrnNo` |
| 2 | Move **product_plants** for those products → same `urnNo` |
| 3 | Move **EOI-scoped** rows (`all_product_documents`, etc.) → update `urnNo` where keyed by source |
| 4 | **URN-level** collections: strategy `fill_gaps_keep_target` (see §4) |
| 5 | Insert **`urn_merges`** audit row; optional `mergedFromUrnNo` on moved products |
| 6 | Do **not** hard-delete source URN data in v1 |

### 2.3 What merge must NOT do in v1

- Merge across different categories
- Merge during active renewal (`urnStatus` 12–17)
- Blindly re-key two conflicting `process_manufacturing` rows onto the same `urnNo` (unique / business conflict)
- Re-key `renewal_cycles` / `process_renew_*` without explicit v2 rules
- Change `payment_details` without product/finance sign-off (v1: **leave payments on source `urnNo`** for audit, or document as optional phase 2)

---

## 3. API endpoints

Base: Nest admin routes under existing patterns, e.g. `api/admin/products/urn-merge`.

### 3.1 Preview (read-only)

```
GET /api/admin/products/urn-merge/preview?sourceUrnNo=URN-A&targetUrnNo=URN-B
```

**Auth:** Admin JWT + `PRODUCTS_UPDATE` (or new `PRODUCTS_URN_MERGE`).

**Response 200:**

```json
{
  "success": true,
  "canMerge": false,
  "sourceUrnNo": "URN-A",
  "targetUrnNo": "URN-B",
  "categoryId": "64abc...",
  "categoryName": "Cement",
  "blockers": [
    { "code": "CATEGORY_MISMATCH", "message": "..." }
  ],
  "eoisToMove": [
    {
      "productId": 101,
      "eoiNo": "GPCEM001",
      "productName": "...",
      "productStatus": 2
    }
  ],
  "urnLevelConflicts": [
    {
      "collection": "process_manufacturing",
      "sourceHasData": true,
      "targetHasData": true,
      "action": "keep_target_skip_source"
    }
  ],
  "urnLevelMoves": [
    {
      "collection": "process_innovation",
      "action": "rekey_source_to_target"
    }
  ],
  "warnings": []
}
```

**Response 409 / 400:** When `canMerge === false`, still return preview body with `blockers` (prefer 200 with `canMerge: false` so UI can render).

### 3.2 Execute merge

```
POST /api/admin/products/urn-merge
```

**Body:**

```json
{
  "sourceUrnNo": "URN-20260301120000",
  "targetUrnNo": "URN-20250115100000",
  "moveAllCertifiedEois": true,
  "productIds": [],
  "urnLevelStrategy": "fill_gaps_keep_target"
}
```

| Field | Required | Notes |
|-------|----------|--------|
| `sourceUrnNo` | Yes | URN to absorb |
| `targetUrnNo` | Yes | Surviving URN |
| `moveAllCertifiedEois` | No | Default `true`; if `false`, use `productIds[]` |
| `productIds` | No | Subset of certified EOIs on source |
| `urnLevelStrategy` | No | Default `fill_gaps_keep_target` |

**Response 200:**

```json
{
  "success": true,
  "mergeId": "67...",
  "sourceUrnNo": "URN-A",
  "targetUrnNo": "URN-B",
  "movedProductIds": [101, 102],
  "movedEoiNos": ["GPCEM001", "GPCEM002"],
  "urnSectionsRekeyed": ["process_innovation"],
  "urnSectionsSkipped": ["process_manufacturing"],
  "targetDetailsUrl": "/renew/admin/details/URN-B"
}
```

Run inside **`runInTransactionIfSupported`** (same as renewal/payments).

---

## 4. URN-level strategy: `fill_gaps_keep_target`

For each URN-scoped collection (config-driven list):

1. If **target** has no row for `(urnNo, vendorId)` and **source** has row → `updateMany` set `urnNo = targetUrnNo`.
2. If **both** have rows → **skip** source; record in `urnSectionsSkipped` (target wins).
3. If only target has data → no op.

**v1 collection list (minimum):**

- `process_product_design`
- `process_manufacturing`
- `process_product_performance` (certification header — not renew)
- `process_waste_management`
- `process_life_cycle_approach`
- `process_product_stewardship`
- `process_innovation`
- `process_comments`
- `process_mp_manufacturing_units` / `process_wm_manufacturing_units` (may be multiple per URN — rekey all matching `urnNo`)
- Raw-materials collections keyed by `urnNo` (see `consolidate-urn-detail-items.util.ts` `SHARED_*` keys)

**Exclude from v1 rekey (audit only):**

- `payment_details` (unless product approves)
- `renewal_cycles`, `process_renew_*`, `all_renew_product_documents`
- `activity_log` (optional: append note only)

---

## 5. Suggested module layout

```
src/product-registration/
  urn-merge/
    urn-merge.module.ts
    urn-merge.controller.ts
    urn-merge.service.ts
    urn-merge-preview.service.ts
    urn-merge.constants.ts          # collection registry + renewal status lists
    dto/
      urn-merge-preview-query.dto.ts
      urn-merge-execute.dto.ts
    schemas/
      urn-merge-audit.schema.ts
    helpers/
      urn-merge-eligibility.util.ts
```

Register in `ProductRegistrationModule` or dedicated `UrnMergeModule` imported by `AppModule`.

**Reuse:**

- `matchActiveProducts()` from `active-product.filter`
- `PRODUCT_STATUS_CERTIFIED` from `renew/constants/product-status.constants`
- `RENEWAL_URN_STATUS` / active 12–17 list
- `runInTransactionIfSupported` from `renew/helpers/mongo-session.util`

---

## 6. Audit schema: `urn_merges`

```ts
{
  sourceUrnNo: string;
  targetUrnNo: string;
  categoryId: ObjectId;
  vendorId: ObjectId;
  manufacturerId: ObjectId;
  movedProductIds: number[];
  movedEoiNos: string[];
  urnSectionsRekeyed: string[];
  urnSectionsSkipped: string[];
  urnLevelStrategy: string;
  mergedBy: ObjectId;       // admin user
  mergedAt: Date;
  blockersAtPreview?: object[];
}
```

Optional on `products` after move:

- `mergedFromUrnNo?: string`

---

## 7. Post-merge product alignment

After moving EOIs, align moved rows with **target URN lifecycle** (pick one policy and document):

| Field | Suggested policy |
|-------|------------------|
| `urnStatus` | Set to target URN’s current `urnStatus` (from any target certified product) |
| `validtillDate`, notify dates | Use **target** certified product dates if URN-wide; or keep per-EOI if business requires |
| `productRenewStatus` | Match target |

Log changes in audit `meta`.

---

## 8. Activity log (optional)

```
Activity: "Admin merged URN {source} into {target} — {n} EOIs moved"
urn_no: targetUrnNo
```

---

## 9. Acceptance tests

- [ ] Preview: same category → `canMerge: true`; different category → `canMerge: false`, `CATEGORY_MISMATCH`
- [ ] Preview: source `urnStatus: 12` → blocked
- [ ] Execute: moves certified products; rejected EOIs on source stay on source `urnNo`
- [ ] Execute: duplicate `eoiNo` on target → 400 before any write
- [ ] Execute: `process_innovation` only on source → rekeyed to target
- [ ] Execute: both have `process_manufacturing` → target kept, source skipped, merge still succeeds for EOIs
- [ ] `GET /api/admin/products/details/:targetUrn` lists all EOIs from both URNs
- [ ] Idempotent: second merge same source → 400 "source has no certified products" or no-op

---

## 10. Related code (read first)

| Area | Path |
|------|------|
| Product schema | `src/product-registration/schemas/product.schema.ts` |
| URN details aggregation | `src/product-registration/product-registration.service.ts` → `getProductDetailsByUrn` |
| Shared URN sections | `src/product-registration/utils/consolidate-urn-detail-items.util.ts` |
| Renew eligibility | `src/renew/helpers/renew-eligible-product.util.ts` |
| Certified status | `PRODUCT_STATUS_CERTIFIED = 2` |

---

## 11. Out of scope (v2)

- Vendor-initiated merge
- Merge with field-level deep merge of process forms
- Automatic merge suggestions
- Public website / Zoho sync for merged EOIs
- Merging `payment_details` and renewal history

---

## 12. Frontend contract

Admin UI spec: **`docs/FRONTEND-URN-MERGE-PROMPT.md`**

Implement preview + execute APIs first; frontend depends on `canMerge`, `blockers`, `eoisToMove`, `urnLevelConflicts`.
