# Frontend prompt: Admin renew process comments (backend ready)

Backend now exposes the admin-only renew process comments API. **No frontend code changes are required** if you already use the paths below.

---

## What was broken

- `POST /renew/admin/process-comments` → **404** (route missing)
- Workarounds failed:
  - `POST /process-comments` → cert URN status gate at renew `urnStatus` **15**
  - `POST /renew/process-comments` → vendor must own URN (admin JWT fails)

---

## Use these endpoints (already wired in admin app)

| Action | Method | URL |
|--------|--------|-----|
| Submit section comment | `POST` | `/renew/admin/process-comments` |
| Load all section comments | `GET` | `/renew/admin/process-comments/{urnNo}?renewalCycleId={id}` |

Resolve URL with `resolveClientApiUrl()` (same as renew details / quick-view).

### Existing files (verify only)

- `admin/lib/renew/renewProcessComments.service.ts`
  - `renewAdminProcessCommentsPostUrl()`
  - `renewAdminProcessCommentsGetByUrnPath(urnNo)`
- `admin/context/RenewAdminProcessReviewContext.tsx`
  - `loadProcessComments` → GET with `renewalCycleId` query
  - `submitProcessComment` → POST body `{ urnNo, renewalCycleId, [fieldKey] }`
- `admin/lib/renew/renewAdminTabKeys.ts` — field mapping:

| `tabKey` | POST field |
|----------|------------|
| `product-performance` | `productPerformance` |
| `manufacturing-process` | `manfacturingProcess` |
| `waste-management` | `wasteManagement` |
| `innovation` | `productInnovation` |

---

## POST body (one section per request)

```json
{
  "urnNo": "URN-20260528142848",
  "renewalCycleId": "6a1edd713ec5008b997aca94",
  "productPerformance": "<html from buildSectionCommentPayload>"
}
```

Use the **packed string** from `buildSectionCommentPayload(commentHtml, technicalHtml)` — unchanged from uncertified flow.

---

## GET response shape

```json
{
  "success": true,
  "data": {
    "productPerformance": "...",
    "manfacturingProcess": "...",
    "wasteManagement": "...",
    "productInnovation": "..."
  }
}
```

`extractProcessCommentsPayload` in `RenewAdminProcessReviewContext` already reads `data` when present. Empty `data: {}` is valid (no comments yet).

---

## Env (optional overrides)

```env
NEXT_PUBLIC_RENEW_ADMIN_PROCESS_COMMENTS_POST_PATH=/renew/admin/process-comments
NEXT_PUBLIC_RENEW_ADMIN_PROCESS_COMMENTS_GET_BY_URN_PATH=/renew/admin/process-comments/{urn}
```

Defaults match the above; only set if your proxy uses a different prefix.

---

## Manual test checklist

1. Restart Nest API (`npm run start:dev` on port **3000**).
2. Open admin renew URN at `urnStatus` **15** (Check process forms).
3. Confirm `renewalCycleId` is loaded (from quick-view or details `renewContext`).
4. On Product Performance tab → submit admin comment → **200**, toast success, GET shows saved HTML.
5. Repeat for Manufacturing, Waste, Innovation tabs.
6. Network tab must show:
   - `POST http://localhost:3000/renew/admin/process-comments` (or proxied equivalent)
   - **Not** `POST /process-comments` or `POST /renew/process-comments` for admin renew review.

---

## Error handling (already in context)

- **404** on POST → toast mentions backend route (can remove after deploy confirms 200).
- Missing `renewalCycleId` → “Renewal cycle is not loaded…” (unchanged).

---

## Deploy note

Deploy backend to Render (`gp-backend-siab.onrender.com`) before testing production admin; missing routes caused the original 404 in prod.
