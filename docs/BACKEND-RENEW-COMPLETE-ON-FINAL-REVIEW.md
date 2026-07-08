# Renew completion on admin “Submit for final review” (implemented)

## Single atomic step (confirmed)

Admin **Submit for final review** sends `updateStatusTo: 17`. The server must **not** persist `urn_status = 17` as a resting state. In the **same transaction**, the handler applies all completion updates.

```json
PATCH /renew/urn-status
{
  "urnNo": "URN-20260528142848",
  "renewalCycleId": "6a1edd713ec5008b997aca94",
  "updateStatusType": "urn_status",
  "updateStatusTo": 17
}
```

| Step | Field / action | Persisted value |
|------|----------------|-----------------|
| 1 | `renewed_date` | `now` |
| 2 | `product_renew_status` | **2** |
| 3 | `urn_status` | **11** (never leave 17 after success) |
| 4 | `validtill_date` | +24 months, year-end (`extendValidityForRenewal`) |
| 5 | Notify dates | `computeNotifyDates` |
| 6 | Documents | promote latest renew upload per slot for `renewalCycleId` (`RenewDocumentPromotionService`) |
| 7 | Activity log | `RENEWAL_ACTIVITY.RENEWAL_COMPLETED` |

**API contract:** `17` is the request trigger only; clients read **`urnStatus: 11`** and **`productRenewStatus: 2`** after success. There is no separate admin `17 → 11` step.

## Endpoint

`PATCH /renew/urn-status` (admin or vendor JWT per transition rules).

| Field | Required | Notes |
|-------|----------|--------|
| `urnNo` | Yes | |
| `renewalCycleId` | Yes for completion | Must match in-progress cycle for URN |
| `updateStatusType` | Yes | `"urn_status"` |
| `updateStatusTo` | Yes | `11–17` per allowed transitions |

**Do not** use `PATCH /api/admin/products/urn-status` for renew statuses **12–17** (returns **400**).

### Success response (200)

```json
{
  "success": true,
  "urnNo": "URN-20260528142848",
  "renewalCycleId": "6a1edd713ec5008b997aca94",
  "urnStatus": 11,
  "productRenewStatus": 2,
  "renewedDate": "2026-06-02T12:00:00.000Z",
  "validtillDate": "2028-12-31T00:00:00.000Z",
  "message": "Renewal completed — final review approved"
}
```

## Admin transitions

| From | Request `updateStatusTo` | Persisted `urn_status` |
|------|--------------------------|------------------------|
| 15 | 16 | 16 (resend to vendor) |
| 15 | **17** | **11** (+ §1 side effects) |

`15 → 17` requires all tab reviews approved.

**Legacy:** URN stuck at `17` with `product_renew_status !== 2` — idempotent `PATCH` with `updateStatusTo: 17` re-runs completion.

## Code

- `RenewUrnStatusService.finishRenewalCompletion` → `RenewalOrchestrationService.completeRenewal(urnNo, userId, renewalCycleId)`
- `RenewalCycleService.completeCycleById`
- `RenewDocumentPromotionService.promoteRenewDocumentsForCompletedCycle` (inside completion transaction)
- `ProductRegistrationService.adminUpdateUrnStatus` rejects `urn_status` 12–17 on cert route

## Frontend

`admin/services/renew/renewUrnStatus.service.ts` — `submitRenewForFinalReview()` → `17`. Refetch details/quick view; expect `urnStatus: 11`, `productRenewStatus: 2`. UI label “Final verification pending” describes the **action**; after success show “Verification completed” (`11`).

## Acceptance (manual)

URN `URN-20260528142848`, cycle `6a1edd713ec5008b997aca94`: `15` + tabs approved → `PATCH` with `17` + `renewalCycleId` → DB `urn_status=11`, `product_renew_status=2`, dates updated; wrong cycle → **400**; cert `urn-status` with `17` → **400**.
