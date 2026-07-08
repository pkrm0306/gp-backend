# Backend: Renew URN details — mirror `GET /products/details`

**Vendor + admin** use the same joined payload from `RenewDetailsService.getRenewDetailsByUrn`.

| Role | Endpoint |
|------|----------|
| Vendor | `GET /renew/details/:urnNo?renewalCycleId=` |
| Admin | `GET /renew/admin/details/:urnNo?renewalCycleId=` |

## Behaviour

- One aggregation-style response per certified URN (one `data[]` row per certified EOI).
- **Cert tables cleared** via `RENEW_CLEARED_CERT_SECTIONS`; renew data from `process_renew_*` only.
- Scoped by **`urnNo` + `renewalCycleId`** (active in-progress cycle when query omitted).
- **`data[i].product_performance.testReports`** comes from `process_renew_product_performance` (child table or embedded `testReports[]` on header).
- URN-level sections (`process_manufacturing`, `process_waste_management`, …) are shared on every row (same as cert `enrichUrnDetailRowsWithSharedProcessData`).

## Cycle resolution

1. `?renewalCycleId=` if provided (must match URN).
2. Else `renewal_cycles` with `status: in_progress` (highest `cycleNo`).
3. Performance read uses the **same** cycle id as process headers (no longer prefers “latest saved” cycle over active cycle).

## Key files

| File | Role |
|------|------|
| `src/renew/services/renew-details.service.ts` | Main join |
| `src/renew/utils/renew-details-format.util.ts` | Section formatters + `spreadProductPerformanceToDetailRows` |
| `src/renew/process-renew-product-performance/process-renew-product-performance.service.ts` | `loadRenewProductPerformanceReadPayload` |
| `src/product-registration/product-registration.service.ts` | `getRenewProductDetailsByUrn` (EOI + plants base) |

## Response keys (cert parity)

| UI tab | `data[0]` keys |
|--------|----------------|
| Performance | `product_performance.testReports[]`, `product_performance_documents` |
| Manufacturing | `process_manufacturing`, `process_manufacturing_documents`, `process_mp_manufacturing_units` |
| Waste | `process_waste_management`, `process_waste_management_documents`, `process_wm_manufacturing_units` |
| Innovation | `process_innovation`, `process_innovation_documents` |
| Stewardship | `process_product_stewardship`, `process_ps_stakeholder_edu_awarness`, … |
| Comments | `process_comments` |
| Documents | `all_renew_product_documents`, `payments` |

`renewContext.renewalCycleId` is always set when a cycle exists.

## Related

- Cycle-scoped payments: `docs/BACKEND-RENEW-CYCLE-SCOPED-PAYMENTS-AND-DOCS.md`
- Test cycle: `docs/BACKEND-RENEW-TEST-VALIDITY.md`
