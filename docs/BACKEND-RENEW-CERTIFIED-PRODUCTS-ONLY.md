# Renewal: certified products only (`product_status = 2`)

## Rule

For a given **URN**, renewal flows only consider EOIs with **`product_status === 2` (certified)**.

| Status | Meaning | In renewal? |
|--------|---------|-------------|
| 2 | Certified | **Yes** |
| 3 | Rejected | **No** |
| 4 | Discontinued | **No** |
| 0, 1, other | Pending / submitted / etc. | **No** |

Rejected and discontinued products on the same URN are **not** listed, updated, completed, or shown in renew performance/documents (when tied to an `eoiNo`).

## Implementation

Central helpers: `src/renew/helpers/renew-eligible-product.util.ts`

| Helper | Use |
|--------|-----|
| `matchRenewEligibleProducts()` | Mongo queries (`productStatus: 2` + active filter) |
| `filterRenewDetailsRows()` | Renew admin/vendor **details** product rows |
| `fetchRenewCertifiedEoiSet()` | EOI numbers for URN-level doc filtering |
| `filterRenewRowsByCertifiedEoi()` | Renew uploads / test reports with `eoiNo` |

Applied in:

- **`products.renewCycleNo`** — 1-based; matches `renewal_cycles.cycleNo` for the URN
- Set when renewal cycle **starts** (`startRenewalCycle`, `onRenewPaymentApproved`)
- Updated on **completion** (`completeRenewal` / submit for final review)
- Exposed on `renewContext`, quick view, and completion API response

- `PATCH /renew/urn-status` — `updateMany` uses `matchRenewUrnStatusUpdateProducts()` (`productStatus: 2` only; **status 3 never updated**)
- Renew payment approve — `onRenewPaymentApproved` only; no blanket URN `updateMany` on all EOIs
- Payment `updatePayment` with `urnStatus` — when `paymentType === 'renew'` or status **12–17**, same certified-only filter
- `getRenewList` / `adminListRenewProducts` / `getRenewProductDetailsByUrn`
- `RenewUrnStatusService`, `RenewalOrchestrationService.completeRenewal`
- `RenewDetailsService`, `RenewQuickViewService`
- `ProcessRenewProductPerformanceService` (read + save `eoiNo` validation)
- `RenewDocumentPromotionService`

**Admin discontinue** (`AdminRenewProductDiscontinueService`) intentionally lists **all** EOIs on the URN so admins can discontinue/reactivate — not part of the renew workflow.

## API messages

When no certified EOIs exist on a URN, renew endpoints return **404** with text like:

`No certified products found for URN … (rejected EOIs are excluded from renewal)`
