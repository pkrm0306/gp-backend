# Frontend: Product Renewal UI (PHP / MERN parity)

Use this document as the **Agent mode** implementation spec for renewal screens **after** the backend in [product-renewal-backend-prompt.md](./product-renewal-backend-prompt.md) is complete.

---

## Goal

Add **Product Renewal** vendor and admin UI as a **separate flow** from initial certification. Same interaction patterns as existing certification process forms, but:

- **Limited tabs only** (see screenshot / legacy PHP renew screens)
- **Renew APIs only** (`/renew/...`) — never call initial `process-*` or full `GET /admin/products/details/:urn` for renew tab data
- **Same UX habits** as initial: upload, save, delete, status badges, activity timeline where already used
- **Optional** document version badge + History modal (non-blocking; see [Document versioning](#document-version-history-optional))

Do **not** refactor or break initial certification routes, tabs, or payloads.

---

## Prerequisites (backend must exist)

Confirm these before frontend work:

| Backend | Purpose |
|---------|---------|
| `GET /renew/admin/quick-view/:urnNo` | Admin Quick View |
| `GET /renew/vendor/quick-view/:urnNo` | Vendor Quick View (if exposed) |
| `GET /products/renew-list` | Vendor renew eligibility list |
| Admin renew list API (if added) | Admin renew products grid |
| `paymentType: 'renew'` payment create/update/approve | Payment tab |
| `/renew/process-*` endpoints | Process tabs |
| `DELETE /renew/documents/:documentId` | Renew document delete |
| `GET /documents/history`, `GET /documents/latest-metadata` | Version history UI |
| URN status **12–17** on status update APIs | Tab gating |

Reference: [product-renewal-backend-prompt.md](./product-renewal-backend-prompt.md)

---

## Scope: renewal tabs vs initial certification

### In scope (renewal screens)

| Tab | Route segment (suggested) | Primary API |
|-----|---------------------------|-------------|
| **Quick View** | `.../renew/:urnNo` or `.../renew/:urnNo/quick-view` | `GET /renew/.../quick-view/:urnNo` |
| **Payment** | `.../renew/:urnNo/payment` | Existing payments APIs + `paymentType: 'renew'` |
| **Product Performance** | `.../renew/:urnNo/product-performance` | `POST/GET /renew/process-product-performance/...` |
| **Manufacturing Process** | `.../renew/:urnNo/manufacturing` | `/renew/process-manufacturing`, MP units, energy |
| **Waste Management** | `.../renew/:urnNo/waste-management` | `/renew/process-waste-management`, WM units |
| **Innovation** | `.../renew/:urnNo/innovation` | `/renew/process-innovation/...` |
| **Product Discontinue** | `.../renew/:urnNo/discontinue` | Renew discontinue API |
| **Product Stewardship** | *(optional — hide tab until client asks)* | `/renew/process-product-stewardship/...` |

Admin/vendor **comments** for renewal: use `process_renew_comments` GET/PATCH (panel or modal, same pattern as initial process comments if exists).

### Out of scope (initial certification only)

- Product Design, all Raw Materials (3.x), Life Cycle Approach
- Initial `process-manufacturing`, `process-waste-management`, etc.
- Initial `all_product_documents` lists on renew screens

---

## Routing & navigation

### Separate route tree

Do **not** reuse initial certification URL paths with a query flag alone. Use a dedicated prefix, e.g.:

**Admin**

```
/admin/renew-process/:urnNo/quick-view
/admin/renew-process/:urnNo/payment
/admin/renew-process/:urnNo/product-performance
...
```

**Vendor**

```
/vendor/renew-process/:urnNo/quick-view
/vendor/renew-process/:urnNo/payment
...
```

### Entry points

| From | Action |
|------|--------|
| Vendor renew list | `GET /products/renew-list` → navigate to renew Quick View for selected URN |
| Admin renew products list | Admin list → renew Quick View |
| Breadcrumb | `Process > Un-certified Products List > {urnNo}` (match legacy admin UX) |

### Tab bar

Horizontal tabs matching legacy screenshot:

`QUICK VIEW` | `PAYMENT` | `PRODUCT PERFORMANCE` | `MANUFACTURING PROCESS` | `WASTE MANAGEMENT` | `INNOVATION` | `PRODUCT DISCONTINUE`

- Omit **Product Stewardship** tab by default; keep route/component ready behind feature flag `RENEW_STEWARDSHIP_TAB_ENABLED`.
- Highlight active tab; preserve URN in layout header.

---

## Renewal context (React context / route state)

Provide **`RenewalContext`** (or equivalent) for all renew pages under `:urnNo`:

```ts
type RenewalContextValue = {
  urnNo: string;
  processType: 'renewal';                    // always for renew screens
  renewalCycleId: string | null;           // from quick-view.activeRenewalCycle._id
  renewalCycleNo: number | null;
  urnStatus: number;                         // 12–17 during renew, 11 when done
  productRenewStatus: number;                // 0 | 1 | 2
  vendorId?: string;
  refetchQuickView: () => Promise<void>;
};
```

Load once from Quick View (or dedicated bootstrap call), pass to child tabs. **Every** document history/metadata call must include:

- `processType: 'renewal'`
- `renewalCycleId` when available

---

## URN status gating (UI rules)

Mirror legacy PHP; disable/hide actions when status does not allow them.

| urnStatus | Label (example) | Vendor | Admin |
|-----------|-----------------|--------|-------|
| 12 | Renewal Payment Pending | Read payment; wait for proposal | Create/edit renew payment + proposal |
| 13 | Renewal Payment Submitted | Submit/view proof if allowed | Review payment |
| 14 | Renewal Payment Approved | Edit process tabs | View + review |
| 15 | Check Process Forms | Read-only or limited | Review / change status |
| 16 | Vendor Response Pending | Edit rejected sections | Review |
| 17 | Final Verification Pending | Read-only | Complete renewal |
| 11 | Verification completed (post-renew) | Read-only certified view | Admin actions per existing rules |

Show status badge on Quick View (e.g. green **RENEWAL PAYMENT PENDING**).

Reuse the same **read-only / canSave** patterns as initial certification when `urnStatus === 5` resubmit exists on initial — for renew, map admin review states 15–16 similarly if backend exposes edit permissions.

---

## API client layer

Create `src/api/renew/` (or project equivalent):

```ts
// renewQuickView.ts
getAdminRenewQuickView(urnNo: string)
getVendorRenewQuickView(urnNo: string)

// renewProcess.ts — mirror initial api modules but hit /renew/...
createRenewProductPerformance(...)
getRenewProductPerformance(urnNo)
createRenewManufacturing(...)
getRenewManufacturing(urnNo)
// ... etc.

// renewDocuments.ts
deleteRenewDocument(documentId, { urnNo, sectionKey })

// renewDiscontinue.ts
submitRenewDiscontinue(...)

// renewComments.ts
getRenewComments(urnNo)
patchRenewComments(urnNo, payload)
```

**Rules**

- Base URL: same axios/fetch client as rest of app; Bearer token unchanged
- Parse `{ success, message, data }` wrapper
- On 404 for optional metadata: fail silently (version badge/history)
- Do not import initial `processManufacturingApi` for renew tabs — duplicate thin wrappers pointing at `/renew/...`

---

## Quick View tab

**Data source:** `GET /renew/admin/quick-view/:urnNo` (admin) or vendor variant.

**Layout (match screenshot)**

1. **Header:** URN, status badge, category (e.g. Cooling Tower)
2. **Fees:** Registration Fee, Certification Fee, Renewal fee from payment summary
3. **Products table:** columns `PRODUCT EOI`, `NO OF UNITS`, `STATUS` (PENDING / etc.)
4. **Documents List:** from renew quick-view payload only (`all_renew_product_documents`); empty → **No Documents Found**
5. **Manufacturing Unit Details:** EOI NUMBER, PLANT NAME, PLANT LOCATION (from quick-view summary)

**Behavior**

- Read-only except links to other tabs
- On mount: set `RenewalContext` from response (`renewalCycle`, `urnStatus`, …)
- Do **not** call `GET /admin/products/details/:urn` here

---

## Payment tab

Reuse existing payment form components where possible; **branch on `paymentType: 'renew'`**.

| Actor | Actions |
|-------|---------|
| Admin | Create/update renew quote, upload **proposal** file, set amounts, approve payment |
| Vendor | View proposal, approve/reject proposal if applicable, submit cheque/TDS proof |

**After admin approve:** backend seeds renew process tables and sets `urnStatus → 14`. UI should:

- Refetch Quick View / context
- Enable process tabs

**Payment file URLs:** may live under `uploads/payments/` — use existing file URL helper.

**Version history (optional):** for proposal/cheque/TDS, call document metadata with:

- `sectionKey: 'payment'`
- `slotKey: 'proposalFile' | 'chequeOrDdFile' | 'tdsFile'`
- `processType: 'renewal'`, `renewalCycleId`

---

## Process tabs (Performance, Manufacturing, Waste, Innovation)

### General pattern (copy from initial certification tab)

For each tab:

1. **Load:** `GET /renew/process-{section}/:urnNo` on mount
2. **Save:** `POST` or `PATCH` multipart if files — same field names as initial DTOs
3. **Documents:** list from GET response + renew document rows; upload via same form as initial but API is `/renew/...`
4. **Delete file:** `DELETE /renew/documents/:productDocumentId?urnNo=&sectionKey=`
5. **After success:** refetch tab data; optional refetch latest version metadata

### Tab-specific notes

| Tab | Notes |
|-----|--------|
| **Product Performance** | Per-EOI rows; test report uploads; `renewalType` display if returned |
| **Manufacturing** | Main form + nested MP manufacturing units + energy consumption sub-screens (reuse initial unit editors, renew APIs) |
| **Waste Management** | Main form + WM manufacturing units |
| **Innovation** | Supporting docs; optional `documentTag` if initial innovation has it |
| **Product Stewardship** | **Feature-flagged tab**; when enabled, same as initial stewardship UI with `/renew/process-product-stewardship` |

### Upload paths

Display links from `documentLink` returned by API (`renew_urns/{urnNo}/...`). Do not assume `urns/` prefix.

### Shared document row component

Extend existing file row component with optional:

- Badge `vN` from `getLatestDocumentMetadata`
- **History** button → modal (see below)

Pass `buildDocumentStreamQuery(doc, renewalContext)`:

```ts
function buildRenewDocumentStreamQuery(
  doc: { productDocumentId: number; documentForm: string; documentFormSubsection?: string },
  ctx: RenewalContextValue,
  options?: { singleSlotSubsection?: boolean },
) {
  return {
    urnNo: ctx.urnNo,
    processType: 'renewal' as const,
    renewalCycleId: ctx.renewalCycleId ?? undefined,
    sectionKey: doc.documentForm,
    subsectionKey: doc.documentFormSubsection,
    slotKey: options?.singleSlotSubsection
      ? (doc.documentFormSubsection?.trim() || 'default')
      : String(doc.productDocumentId),
  };
}
```

---

## Product Discontinue tab

New UI aligned with backend discontinue API:

- List products on URN from Quick View / renew context
- Allow vendor/admin to mark products discontinued for this renewal (confirm PHP parity with backend behavior)
- Submit → refetch Quick View product statuses
- Show validation errors from API

---

## Comments (admin / vendor)

If initial certification has process comments UI:

- Duplicate for renew using `GET/PATCH` on `process_renew_comments`
- Same field mapping (`productPerformance`, `manfacturingProcess`, `wasteManagement`, `productInnovation`, `productStewardship`, …)
- Raw material comment fields may stay empty on renew (no 3.x tabs)

---

## Document version / history (optional)

Non-blocking add-on; initial renew upload/delete must work without it.

### API utilities

Add to `src/api/documents.ts`:

```ts
getDocumentHistory(params: DocumentStreamQuery)
getLatestDocumentMetadata(params: DocumentStreamQuery)
```

Query params: `urnNo`, `processType: 'renewal'`, `renewalCycleId?`, `sectionKey`, `subsectionKey?`, `slotKey`.

### UI

| Element | Behavior |
|---------|----------|
| Badge `vN` | Call latest-metadata lazily; hide if 404/null |
| **History** link | Modal: Version, Action, Date, User ID (`createdBy`), File link |
| After delete/upload | Existing list refresh unchanged; optional metadata refresh |

### Backward compatibility

404 / empty → no badge, empty history message, no toast error.

See also: document versioning section in initial certification frontend notes (same `slotKey` rules).

---

## Activity log

If initial process screens show URN activity timeline:

- Reuse same `GET` activity log component and filters by `urnNo`
- No frontend change required unless backend uses new `activities_id` — then map renewal labels in display layer only

---

## Admin vs vendor differences

| Feature | Admin | Vendor |
|---------|-------|--------|
| Quick View | Full fees, all products, admin actions | Subset per backend |
| Payment | Create proposal, approve | Submit proof, approve proposal |
| Process tabs | Review, status changes 15–17 | Fill forms when urnStatus allows |
| URN status update | Allowed transitions 12–17 | Limited or none |
| Comments | Edit all sections | Edit when allowed |
| Stewardship tab | Same if flag on | Same if flag on |

Use existing role guards (`isAdmin`, `vendorId`) consistent with initial certification pages.

---

## State management & loading

- Per-tab loading/error states (do not block entire renew layout on one tab failure)
- Optimistic UI optional; prefer refetch-after-save like initial tabs
- Keep form dirty-state warnings on tab switch if initial app does

---

## Error handling

| Case | UX |
|------|-----|
| Renew API 403 | “Not allowed for current renewal status” |
| 404 quick-view | “Renewal not started” → link to payment or renew list |
| Validation 400 | Show backend `message` |
| Version API 404 | Silent for badge/history |

---

## Non-goals

- Do not merge renew and initial certification into one mega-form component with excessive branching
- Do not remove or rename initial certification routes
- Do not backfill/display legacy PHP renew data unless backend migrates it
- Do not require Stewardship tab in v1

---

## Implementation order

1. **Routes + tab shell** + `RenewalContext` bootstrap from Quick View
2. **Quick View** page (admin + vendor)
3. **Renew list** entry (vendor) + admin renew list link
4. **Payment tab** (`paymentType: 'renew'`) + post-approve refetch
5. **Product Performance** tab
6. **Manufacturing** (+ units + energy sub-flows)
7. **Waste Management** (+ WM units)
8. **Innovation** tab
9. **Product Discontinue** tab
10. **Comments** panel (if applicable)
11. **Document version badge + History** (optional polish)
12. **Product Stewardship** tab (feature flag off by default)

---

## Acceptance criteria

1. Initial certification UI and routes unchanged; regression smoke on one initial URN flow.
2. Renew list opens renew Quick View for eligible URN.
3. Quick View uses **only** `/renew/.../quick-view` — not full certification details API.
4. Tab bar shows limited tabs matching legacy screenshot (Stewardship hidden unless flag on).
5. Payment tab completes renew flow through approve; process tabs unlock at urnStatus 14.
6. Each process tab loads/saves via **`/renew/...`** APIs; uploads appear in Documents List on Quick View.
7. Document delete uses `DELETE /renew/documents/...`; list refreshes correctly.
8. `processType: 'renewal'` and `renewalCycleId` passed to history/metadata when feature enabled.
9. Status badge and tab actions respect urnStatus 12–17.
10. Empty documents / missing version metadata degrade gracefully.
11. Admin and vendor renew paths both work with existing auth.

---

## Agent instructions

When implementing in Agent mode:

1. Read [product-renewal-backend-prompt.md](./product-renewal-backend-prompt.md) and Swagger for exact `/renew/*` paths and response shapes.
2. **Copy** initial certification tab components; swap API module and route prefix only.
3. Introduce `RenewalContext` early so document history and payment tabs share `renewalCycleId`.
4. Gate Stewardship tab with env/flag `RENEW_STEWARDSHIP_TAB_ENABLED=false` by default.
5. Verify Network tab: no calls to initial `process-manufacturing`, `product-design`, or full admin product details on renew pages.
6. Manual test matrix: urnStatus 12 → 14 → fill tabs → 17 → completion read-only state.

---

## Related docs

- Backend spec: [product-renewal-backend-prompt.md](./product-renewal-backend-prompt.md)
- Certification payment picker: [admin-certification-products-frontend-prompt.md](./admin-certification-products-frontend-prompt.md)
