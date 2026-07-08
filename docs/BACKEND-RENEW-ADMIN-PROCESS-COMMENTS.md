# Admin renew process comments API (implemented)

Routes are registered on the Nest API root (same as other renew admin routes), with alias for direct host calls.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/renew/admin/process-comments` | Admin JWT + `PRODUCTS_UPDATE` |
| `GET` | `/renew/admin/process-comments/:urnNo?renewalCycleId=` | Admin JWT + `PRODUCTS_VIEW` |

Alias (optional): `/admin/renew/admin/process-comments` — same handlers.

## POST body

```json
{
  "urnNo": "URN-20260528142848",
  "renewalCycleId": "6a1edd713ec5008b997aca94",
  "productPerformance": "<packed html string>"
}
```

| Tab key (frontend) | Field name (exact) |
|--------------------|-------------------|
| `product-performance` | `productPerformance` |
| `manufacturing-process` | `manfacturingProcess` |
| `waste-management` | `wasteManagement` |
| `innovation` | `productInnovation` |

- One section field per request (plus `urnNo`, `renewalCycleId`).
- Upserts `process_renew_comments` for `(urnNo, renewalCycleId)`.
- No vendor ownership check; no cert `urn_status` edit gate.
- Rejects `completed` / `cancelled` renewal cycles.

## GET response

```json
{
  "success": true,
  "message": "Renew process comments fetched successfully",
  "data": {
    "productPerformance": "...",
    "manfacturingProcess": "..."
  }
}
```

Only non-empty section fields are returned. `renewalCycleId` query param is **required**.

## Code

- `src/renew/process-renew-comments/admin-renew-process-comments.controller.ts`
- `src/renew/process-renew-comments/process-renew-comments.service.ts` — `adminUpsertSection`, `adminGetCommentsPayload`

## Verify locally

```bash
# GET (admin token)
curl -s "http://localhost:3000/renew/admin/process-comments/URN-20260528142848?renewalCycleId=CYCLE_ID" \
  -H "Authorization: Bearer ADMIN_JWT"

# POST
curl -s -X POST "http://localhost:3000/renew/admin/process-comments" \
  -H "Authorization: Bearer ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"urnNo":"URN-20260528142848","renewalCycleId":"CYCLE_ID","productPerformance":"test"}'
```

Expect **200**, not **404**.
