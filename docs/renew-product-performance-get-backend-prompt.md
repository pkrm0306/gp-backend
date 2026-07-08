# Backend: Renew Product Performance GET — read path (implemented)

**Symptom:** DB has rows in `process_renew_product_performance` / embedded `testReports[]`, but GET returned empty stubs.

**Fix (backend):**
- `loadAuthoritativeTestReports` + `resolveRenewPerformanceTestReportRows` fall back to embedded `header.testReports` when child table `process_renew_pp_test_reports` is empty.
- `GET /renew/process-product-performance/:urnNo` returns full payload via `getFormPayloadByUrn` (root `testReports`, `product_performance.testReports`, `rows[].testReports`).
- `GET /renew/details/:urnNo` overlays renew `product_performance` from the same resolver.
- `testReportFiles` reflects saved row count when no file uploads.

## Confirm after deploy

```http
GET /renew/process-product-performance/URN-20260528142848?renewalCycleId=6a1edd713ec5008b997aca94
GET /renew/details/URN-20260528142848?renewalCycleId=6a1edd713ec5008b997aca94
```

Both must return saved `productName` / `eoiNo` in `testReports` (and `data[0].product_performance.testReports` on details).

See `docs/renewal-frontend-aligned-prompt.md` for frontend binding.
