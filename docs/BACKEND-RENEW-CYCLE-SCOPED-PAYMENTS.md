# Renewal payments & documents scoped by `renewalCycleId`

## Payments (`payment_details`)

- New field: `renewalCycleId` (ObjectId ref `RenewalCycle`) — **required on create** when `paymentType: renew`.
- Sparse unique index: `(urnNo, paymentType, renewalCycleId)` for renew rows.

### Writes

| API | Requirement |
|-----|-------------|
| `POST /payments` | Body must include `renewalCycleId` for renew; cycle must be `in_progress`. |
| `PATCH /payments/{urnNo}` | Body must include `renewalCycleId` for renew updates. |

On create, `renewal_cycles.paymentId` is set to the new payment id.

### Reads

| API | Query | Payments |
|-----|-------|----------|
| `GET /renew/admin/quick-view/:urnNo` | `?renewalCycleId=` | Only renew payment for that cycle (or `[]` / `null`) |
| `GET /renew/vendor/quick-view/:urnNo` | same | same |
| `GET /renew/admin/details/:urnNo` | `?renewalCycleId=` | Each `data[i].payments` cycle-scoped |

Legacy rows without `renewalCycleId` are matched to a cycle only when `renewal_cycles.paymentId` equals the payment id (cycle 1 backfill).

## Documents & process

- `buildRenewDocumentsQueryFilter(..., { strictCycleOnly: true })` for `cycleNo > 1` — no legacy null-cycle documents.
- Process headers (`process_renew_manufacturing`, `innovation`, `waste`) filter by `renewalCycleId` for cycle 2+; cycle 1 allows legacy untagged rows.
- Performance already uses `renewalCycleId`.

## Test renewal

`PATCH /renew/admin/test-validity` does not copy or delete prior-cycle payments. New cycle returns empty payments until `POST /payments` with the new `renewalCycleId`.
