# Backend prompt: Renewal payments & documents scoped by `renewalCycleId`

**Give this document to the API/backend team.**

**Problem (observed):** After **Test Renewal** starts a **new cycle** (`urn_status = 12`, cycle no. incremented), the renew process workflow refreshes, but:

- **Payment tab** still shows the **previous cycle’s** approved payment (amounts, reference no., status “Payment Approved”).
- **Process tabs** (Manufacturing, Waste, Innovation, Performance) may still show **prior-cycle** documents and saved form data.

**Root cause:** `payments` rows and `process_renew_*` / document rows are stored or returned **without** filtering by active `renewalCycleId`. Quick-view returns the latest renew payment for the URN regardless of cycle.

**Test URN:** `URN-20260528142848`

**Implementation status:** Implemented in `src/renew/helpers/renew-cycle-scope.util.ts`, `renew-quick-view.service.ts`, `renew-details.service.ts`, `payments.service.ts`. See also [`BACKEND-RENEW-CYCLE-SCOPED-PAYMENTS.md`](./BACKEND-RENEW-CYCLE-SCOPED-PAYMENTS.md).

---

## 1) Data model — payments

Add (or enforce) on the **payments** collection/table:

| Field | Type | Required for renew |
|-------|------|-------------------|
| `urnNo` | string | Yes |
| `paymentType` | string | `"renew"` |
| `renewalCycleId` | ObjectId / string | **Yes** for renew rows |
| `paymentStatus` | number | 0–3 |
| `quoteAmount`, `quoteGstAmount`, `quoteTdsAmount`, `quoteTotal` | number | |
| `paymentMode`, `paymentReferenceNo` | string | Vendor submit |
| `proposal_file`, etc. | file refs | Scoped to cycle |

**Unique constraint (recommended):** one active renew payment row per `(urnNo, renewalCycleId, paymentType)` — or allow history with “current” flag per cycle.

### On `PATCH /renew/admin/test-validity` with `startNewRenewalCycle: true`

- Do **not** mutate or delete cycle-1 payment rows (history).
- Do **not** return cycle-1 payment as the active payment for cycle 2.
- Cycle 2 has **no** payment row until admin `POST /payments` creates one.

---

## 2) Read APIs — return cycle-scoped payment only

### `GET /renew/admin/quick-view/:urnNo`

**Query:** `renewalCycleId` (optional; default = `renew_context.renewalCycleId`)

**Payments in response:**

```json
{
  "renewContext": { "renewalCycleId": "<cycle2Id>", "activeRenewalCycle": { "cycleNo": 2, "status": "in_progress" } },
  "urnStatus": 12,
  "payments": [],
  "payment": null
}
```

- If no payment exists for **that** `renewalCycleId`, return **`payments: []`** and **`payment: null`** (not cycle-1 row).
- If a payment exists for the cycle, return **only that row** in `payments[]` / `payment`.

### `GET /renew/admin/details/:urnNo?renewalCycleId=`

- Each `data[i].payments` array must contain **only** payments for the requested cycle (typically 0 or 1 renew row).
- Do not merge all historical renew payments into details.

### `GET /renew/vendor/quick-view/:urnNo` (vendor)

Same rules as admin quick-view.

---

## 3) Write APIs — always bind payment to cycle

### `POST /payments` (admin creates renewal fee)

**Body (multipart):** must accept:

| Field | Required |
|-------|----------|
| `urnNo` | Yes |
| `paymentType` | `"renew"` |
| `renewalCycleId` | **Yes** — active in-progress cycle |
| `quoteAmount`, `quoteGstAmount`, `quoteTdsAmount`, `quoteTotal` | Yes |
| `proposal_file` | Yes |

- Reject or **400** if `renewalCycleId` missing on renew payments.
- Reject if cycle is `completed` or `urn_status` is 11 without a new in-progress cycle.

### `PATCH /payments/{urnNo}` (approve / reject)

**Body:**

```json
{
  "paymentType": "renew",
  "renewalCycleId": "<activeCycleId>",
  "paymentStatus": 2
}
```

- Update **only** the payment row matching `(urnNo, paymentType: renew, renewalCycleId)`.
- On approve (`paymentStatus: 2`), set `urn_status` → **14** for that cycle (existing renew flow).

**If approve returns** `ProcessRenewProductPerformance validation failed: renewalCycleId is required`:

- The payment handler was seeding legacy per-EOI `process_renew_product_performance` rows **without** `renewalCycleId`.
- **Fix (implemented):** `RenewalOrchestrationService.seedAllRenewHeaders` creates one performance header per `(urnNo, renewalCycleId)`; `PATCH /payments` persists `renewalCycleId` on the payment row when approving renew fees.
- Admin frontend (defensive): ensure performance header exists for the cycle via `POST /renew/process-product-performance` before approve, and send `renewalCycleId` on `PATCH /payments/{urnNo}`.

---

## 4) Documents & process data — same scope key

**Scope key for all renew reads/writes:** `urnNo` + **`renewalCycleId`**

| Resource | Filter |
|----------|--------|
| `process_renew_product_performance` | `urnNo` + `renewalCycleId` |
| `process_renew_manufacturing` | same |
| `process_renew_waste_management` | same |
| `process_renew_innovation` | same |
| `process_*_documents` / `all_renew_product_documents` | `renewalCycleId` on each row |
| Document stream / version history | Query param `renewalCycleId` required for renew |
| `urn_tab_review` / process comments | `(urnNo, renewalCycleId, section)` |

### New test cycle

When cycle 2 starts:

- `GET /renew/admin/details/...?renewalCycleId=<cycle2>` → empty `process_renew_*` sections and **no** documents from cycle 1.
- Document stream for cycle 2 returns empty until new uploads.
- **History** may list prior-cycle versions if productDocumentId spans cycles — main table shows **current cycle only**.

---

## 5) Frontend (deployed) — defensive filtering

Until backend filters responses:

- `pickRenewPayment(..., renewalCycleId)` ignores renew payments **without** matching `renewalCycleId` → Payment tab shows **create fee** form for new cycle.
- Quick-view/details requests pass `?renewalCycleId=` when active cycle is known.
- `POST /payments` and `PATCH /payments/{urn}` send `renewalCycleId`.

**Full fix still requires backend** to tag payments and filter GET responses; otherwise Quick View renewal fee card may still show old totals from unscoped API data.

---

## 6) Acceptance tests

- [ ] Complete renewal on cycle 1 (payment approved, docs saved).
- [ ] `PATCH /renew/admin/test-validity` → cycle 2, `urn_status = 12`.
- [ ] `GET /renew/admin/quick-view/URN-...?renewalCycleId=<cycle2>` → `payments: []`, renewal fee not 4,500 / not “Payment Approved”.
- [ ] Admin Payment tab → empty / “Create renewal fee” (frontend).
- [ ] `POST /payments` with `renewalCycleId=<cycle2>` → new row; GET returns only that row for cycle 2.
- [ ] `GET /renew/admin/details/...?renewalCycleId=<cycle2>` → no cycle-1 manufacturing/waste/performance docs in primary arrays.
- [ ] Cycle 1 payment still queryable by `renewalCycleId=<cycle1>` for audit/history.

---

## 7) Related docs

- Test cycle start: [`BACKEND-RENEW-TEST-VALIDITY.md`](./BACKEND-RENEW-TEST-VALIDITY.md)
- Cycle-scoped summary: [`BACKEND-RENEW-CYCLE-SCOPED-PAYMENTS.md`](./BACKEND-RENEW-CYCLE-SCOPED-PAYMENTS.md)
- Completion: [`BACKEND-RENEW-COMPLETE-ON-FINAL-REVIEW.md`](./BACKEND-RENEW-COMPLETE-ON-FINAL-REVIEW.md)
