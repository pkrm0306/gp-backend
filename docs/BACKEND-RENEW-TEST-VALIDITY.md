# Admin test renewal — `PATCH /renew/admin/test-validity`

## Endpoint

`PATCH /renew/admin/test-validity` (admin JWT, `PRODUCTS_UPDATE`)

Alias: `PATCH /api/admin/products/renew-validity` with `"startNewRenewalCycle": true`

## Body

```json
{
  "urnNo": "URN-20260528142848",
  "validTillDate": "2026-03-01",
  "startNewRenewalCycle": true
}
```

`startNewRenewalCycle` defaults to **true** on the renew admin route only.

## Behaviour (single transaction when possible)

1. Set `validtill_date` on certified EOIs (`product_status = 2`)
2. Mark any `in_progress` `renewal_cycles` row **completed**
3. Insert new cycle: `cycleNo = max + 1`, `status = in_progress`
4. Products: `urn_status = 12`, `product_renew_status = 0`, `renewCycleNo = new cycleNo`, notify dates from new valid till; **unset** `renewedDate`
5. Does **not** seed `process_renew_*` or copy payment/docs from prior cycle

## Response (200)

Top-level `urnStatus`, `productRenewStatus`, `renewContext.renewalCycleId`, `renewContext.activeRenewalCycle`.

## Read APIs

After success, `GET /renew/admin/quick-view` and `GET /renew/admin/details` must use the new `renewalCycleId` (in-progress cycle). Pass `?renewalCycleId=` on section GETs for cycle-scoped data.
