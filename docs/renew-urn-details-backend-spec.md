# Backend implementation spec (vendor + admin)

**Use this file with the backend/API team.**

The full definitive prompt lives here (single source of truth):

- **Monorepo (admin app):** [`../admin/docs/BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md`](../admin/docs/BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md)
- **This backend repo (same content):** [`BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md`](./BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md)

Copy either doc into your backend ticket or wiki **unchanged**.

---

## Quick reference

| Portal | Details GET (join all renew tables on URN click) |
|--------|---------------------------------------------------|
| Vendor | `GET /renew/details/:urnNo?renewalCycleId=` |
| Admin | `GET /renew/admin/details/:urnNo?renewalCycleId=` |

| Portal | Product performance save / section GET |
|--------|--------------------------------------|
| Both | `POST /renew/process-product-performance` |
| Both | `GET /renew/process-product-performance/:urnNo?renewalCycleId=` |

**Required on details GET:** `data[0].product_performance.testReports[]` must match Mongo `process_renew_product_performance.testReports[]` for the active cycle.

---

## Implementation status (this repo)

Implemented as of 2026-06-02. Code map:

| Piece | Location |
|-------|----------|
| Renew URN details join | `src/renew/services/renew-details.service.ts` |
| Shared performance read | `ProcessRenewProductPerformanceService.loadRenewProductPerformanceReadPayload()` |
| Vendor details | `GET /renew/details/:urn_no` — `renew-details.controller.ts` |
| Admin details | `GET /renew/admin/details/:urnNo` — `admin-renew.controller.ts` |

Frontend contract: [`renewal-frontend-aligned-prompt.md`](./renewal-frontend-aligned-prompt.md).
