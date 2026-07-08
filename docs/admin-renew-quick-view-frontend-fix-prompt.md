# Admin frontend fix: Renew quick-view & API base URL

**Give this file to the admin portal agent (`greenpro-portals/admin`, port `3004`).**

**Symptom:** Nest log shows `404 Cannot GET /Admin/dashboard/products/renew/urn/URN-.../quick-view` (often with `?_rsc=...`). Payment tab still shows the previous cycle after test renewal.

**Root cause:** The browser or HTTP client is calling the **Next.js page path** on the **API host** (`localhost:3000`), or using a relative URL that resolves to the wrong server. Renew APIs live under `/renew/admin/*`, not under `/Admin/dashboard/...`.

---

## 1. Correct quick-view API (admin)

| Purpose | Method | URL (relative to API base only) |
|---------|--------|----------------------------------|
| Renewal quick view | `GET` | `/renew/admin/quick-view/{urnNo}?renewalCycleId={optional}` |

**Full URL (local):**

```
GET http://localhost:3000/renew/admin/quick-view/URN-20260528142848?renewalCycleId=<cycleId>
Authorization: Bearer <adminJwt>
```

**Never use as API:**

| Wrong | Why |
|-------|-----|
| `/Admin/dashboard/products/renew/urn/{urn}/quick-view` | Next **page** route — valid on `3004` only, not on Nest |
| `http://localhost:3004/renew/admin/quick-view/...` without proxy | Hits Next, not API |
| `/api/renew/admin/quick-view/...` | Nest has **no** `/api` prefix on this route |

---

## 2. Environment

```env
# admin/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Use the **same** `API_BASE` / axios instance as renew **details** and **test-validity** (whatever already returns 200 for `/renew/admin/test-validity`).

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export function renewAdminQuickViewUrl(urnNo: string, renewalCycleId?: string | null) {
  const q = renewalCycleId?.trim()
    ? `?renewalCycleId=${encodeURIComponent(renewalCycleId.trim())}`
    : '';
  return `${API_BASE}/renew/admin/quick-view/${encodeURIComponent(urnNo.trim())}${q}`;
}
```

**Acceptance:** DevTools → Network → the quick-view XHR **Request URL** must start with `http://localhost:3000/renew/admin/quick-view/`, not `/Admin/dashboard/`.

---

## 3. Pass `renewalCycleId` after test renewal

When test renewal starts cycle 2+, always pass the active cycle id on reads and writes:

| Call | Query / body |
|------|----------------|
| `GET /renew/admin/quick-view/{urn}` | `?renewalCycleId=` |
| `GET /renew/admin/details/{urn}` | `?renewalCycleId=` |
| `POST /payments` (renew fee) | `renewalCycleId` in multipart body |
| `PATCH /payments/{urn}` (approve) | `renewalCycleId` in body |

Use `renewContext.renewalCycleId` or `pickActiveRenewalCycleId()` from `admin/lib/renew/renewCycleContext.ts` when the shell already has it.

**Expected after test renewal (cycle 2, no fee yet):** quick-view `data.payments` is `[]`, `data.payment` is `null` — not cycle-1 “Payment Approved”.

---

## 4. Defensive UI (until all callers are fixed)

- `pickRenewPayment(payments, renewalCycleId)` — ignore renew rows without matching `renewalCycleId`.
- Do not build API URLs from `usePathname()` or `router.asPath` (those are page routes).
- RSC `?_rsc=` requests are for **Next pages** on port **3004**; data fetching for renew tabs must use `fetch`/`axios` to **3000** as above.

---

## 5. Related admin routes (same base)

| Action | Path |
|--------|------|
| Full renew URN payload | `GET /renew/admin/details/{urnNo}?renewalCycleId=` |
| Test valid till + new cycle | `PATCH /renew/admin/test-validity` |
| Process comments | `GET/POST /renew/admin/process-comments` |
| URN status (renew 12–17) | `PATCH /renew/urn-status` (not `/api/admin/products/urn-status`) |

Backend reference: `docs/BACKEND-RENEW-CYCLE-SCOPED-PAYMENTS.md`, `docs/renew-details-api-frontend-fix-prompt.md`.

---

## 6. Checklist

- [ ] `NEXT_PUBLIC_API_URL=http://localhost:3000`
- [ ] Quick-view service uses `/renew/admin/quick-view/{urnNo}`, not dashboard page path
- [ ] `renewalCycleId` query param sent when active cycle is known
- [ ] Renew payment POST/PATCH include `renewalCycleId`
- [ ] Network tab: no `GET localhost:3000/Admin/dashboard/...` for API data
