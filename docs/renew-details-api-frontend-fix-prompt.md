# Frontend fix prompt: Renew details API (vendor + admin)

**Give this entire file to the vendor and/or admin frontend agent.**

**Symptom:** Orange banner — *"Renew details API failed (CORS Error: Backend server may not be allowing requests from this domain). Check Network for GET /renew/details/URN-... (404/CORS/auth)."*

**Root cause (most common):** The browser is **not** calling the Nest API on port **3000**. The request hits the Next.js app (3001 vendor / 3004 admin) or a wrong path (`/api/renew/details`). Next returns 404 **without** CORS headers → DevTools shows **CORS**, not “wrong port”.

**Backend is ready.** Nest exposes the routes; quick-view already works when the URL is correct (see server logs: `GET /renew/vendor/quick-view/...` → 304).

---

## 1. Correct APIs (copy exactly)

### Vendor portal (`localhost:3001`)

| Purpose | Method | URL (relative to API base only) |
|---------|--------|----------------------------------|
| **URN page — load all tabs** (required on open) | `GET` | `/renew/details/{urnNo}?renewalCycleId={optional}` |
| Quick view card / payment summary only | `GET` | `/renew/vendor/quick-view/{urnNo}` |
| Product performance save | `POST` | `/renew/process-product-performance` |
| Product performance section GET (optional) | `GET` | `/renew/process-product-performance/{urnNo}?renewalCycleId={optional}` |

**Full URL example (local):**

```
GET http://localhost:3000/renew/details/URN-20260528142848?renewalCycleId=6a1edd713ec5008b997aca94
Authorization: Bearer <vendorJwt>
```

### Admin portal (`localhost:3004`)

| Purpose | Method | URL |
|---------|--------|-----|
| **URN page — load all tabs** (required on open) | `GET` | `/renew/admin/details/{urnNo}?renewalCycleId={optional}` |
| Quick view only | `GET` | `/renew/admin/quick-view/{urnNo}` |

**Full URL example (local):**

```
GET http://localhost:3000/renew/admin/details/URN-20260528142848?renewalCycleId=6a1edd713ec5008b997aca94
Authorization: Bearer <adminJwt>
```

### Never use on renew pages

| Wrong call | Why |
|------------|-----|
| `GET /products/details/{urnNo}` | Initial **certification** data only |
| `GET /api/admin/products/details/{urn}` | Same (admin cert) |
| `GET http://localhost:3001/renew/details/...` | Hits **Next.js**, not API → 404 + fake CORS |
| `GET http://localhost:3000/api/renew/details/...` | No `/api` prefix on this route → 404 |

---

## 2. API base URL — must match quick-view

Quick-view **already works** in Network/backend logs. Details must use the **same** HTTP client and base URL.

```ts
// .env.local (vendor example)
NEXT_PUBLIC_API_URL=http://localhost:3000
# NOT http://localhost:3001
```

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

// ✅ Correct
const url = `${API_BASE}/renew/details/${encodeURIComponent(urnNo)}${cycleQuery}`;

// ❌ Wrong — relative URL hits Next on 3001
const url = `/renew/details/${urnNo}`;

// ❌ Wrong — extra /api
const url = `${API_BASE}/api/renew/details/${urnNo}`;
```

**Acceptance:** In DevTools → Network → Fetch/XHR, the failing row’s **Request URL** must start with `http://localhost:3000/renew/details/` (or your deployed API host), **not** `localhost:3001`.

---

## 3. When to call which endpoint

```
User opens renew URN page (any tab: quick-view, performance, manufacturing, …)
    │
    ├─► GET /renew/details/{urnNo}     ← REQUIRED once (RenewalContext / layout)
    │       bind all tabs from response.data[0]
    │
    └─► GET /renew/vendor/quick-view/{urnNo}   ← OPTIONAL extra summary only
            do NOT use quick-view for form grids
```

**Admin:** same pattern with `/renew/admin/details/` and `/renew/admin/quick-view/`.

**After every renew POST save:** refetch **`GET /renew/details/...`** (vendor) or **`GET /renew/admin/details/...`** (admin) — not cert details.

---

## 4. Implementation tasks (vendor)

### A. Find broken call

Search the vendor repo for:

- `renew/details`
- `Renew details API failed`
- `RenewalContext`
- `renew-process` layout / page under `vendor/renew-process`

### B. Add or fix `fetchRenewDetails`

```ts
export type RenewDetailsResponse = {
  success: boolean;
  data: Record<string, unknown>[];
  product_details_list: Record<string, unknown>[];
  renewContext: {
    urnNo: string;
    urnStatus?: number;
    productRenewStatus?: number;
    vendorId?: string;
    manufacturerId?: string;
    renewalCycleId: string;
    activeRenewalCycle?: { id: string; cycleNo: number; status: string };
  };
  siteVisits?: unknown[];
};

export async function fetchRenewDetails(
  urnNo: string,
  token: string,
  renewalCycleId?: string,
): Promise<RenewDetailsResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  const params = new URLSearchParams();
  if (renewalCycleId) params.set('renewalCycleId', renewalCycleId);
  const qs = params.toString() ? `?${params}` : '';

  const res = await fetch(
    `${base}/renew/details/${encodeURIComponent(urnNo)}${qs}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      credentials: 'include', // only if you use cookies; else omit
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Renew details failed: ${res.status} ${res.statusText} ${body.slice(0, 200)}`,
    );
  }

  return res.json();
}
```

Use the **same** `fetch` / `axios` instance as `renew/vendor/quick-view` (copy headers/interceptors from that working call).

### C. Wire `RenewalContext` (or renew layout)

On mount when `urnNo` is in the route:

```ts
useEffect(() => {
  let cancelled = false;
  (async () => {
    try {
      setDetailsError(null);
      setDetailsLoading(true);
      const res = await fetchRenewDetails(urnNo, accessToken, renewalCycleIdFromQuery);
      if (cancelled) return;
      setRenewDetails(res.data);
      setRenewContext(res.renewContext);
      setProductDetailsList(res.product_details_list ?? res.data);
    } catch (e) {
      if (!cancelled) setDetailsError(e instanceof Error ? e.message : 'Renew details failed');
    } finally {
      if (!cancelled) setDetailsLoading(false);
    }
  })();
  return () => { cancelled = true; };
}, [urnNo, accessToken, renewalCycleIdFromQuery]);
```

Expose to tabs:

```ts
const row0 = renewDetails?.[0] ?? {};
const testReports =
  (row0.product_performance as { testReports?: unknown[] })?.testReports ??
  (row0.product_performance_test_reports as unknown[]) ??
  [];
```

### D. Fix the error banner logic

Only show the CORS banner when the request URL was wrong **or** status is 0 / failed fetch. After fix:

- **200** → hide banner, render tabs
- **401** → refresh login / token
- **403** → vendor does not own URN
- **404** → log full `Request URL`; almost always wrong host or `/api` prefix

```ts
// Better banner message for devs
`Renew details failed (${status}). Request was: ${requestUrl}`
```

### E. Optional: seed `renewalCycleId` before details

If the page has quick-view data first:

```ts
const qv = await fetchQuickView(urnNo, token);
const cycleId = qv?.renewContext?.renewalCycleId ?? qv?.activeRenewalCycle?.id;
await fetchRenewDetails(urnNo, token, cycleId);
```

`renewalCycleId` query param is **optional** on GET — backend resolves active cycle if omitted.

---

## 5. Implementation tasks (admin)

Same as §4, but:

```ts
`${API_BASE}/renew/admin/details/${encodeURIComponent(urnNo)}${qs}`
```

Quick-view: `${API_BASE}/renew/admin/quick-view/${urnNo}`

Wire in `admin/context/RenewalContext.tsx` (or equivalent). Today admin logs show only `GET /renew/admin/quick-view/...` — **details is never called** until you add this.

---

## 6. Product Performance tab binding

After successful details GET:

| UI field | JSON path |
|----------|-----------|
| Test report grid | `data[0].product_performance.testReports[]` |
| Flat alias | `data[0].product_performance_test_reports[]` |
| Docs | `data[0].product_performance_documents[]` |
| Cycle for save | `renewContext.renewalCycleId` |

Save multipart (unchanged field names as cert):

```
POST {API_BASE}/renew/process-product-performance
urnNo, renewalCycleId, renewalType, productPerformanceStatus, testReports (JSON string), eoiNo, existingDocumentIds, files
```

Then:

```
GET {API_BASE}/renew/details/{urnNo}?renewalCycleId=...
```

---

## 7. Network verification checklist

| # | Check | Pass |
|---|--------|------|
| 1 | Filter **Fetch/XHR** | |
| 2 | Request URL host = API (`localhost:3000` or prod API) | ☐ |
| 3 | Path = `/renew/details/URN-...` (vendor) or `/renew/admin/details/URN-...` (admin) | ☐ |
| 4 | Status **200**, body has `data` array + `renewContext` | ☐ |
| 5 | Nest console shows `GET /renew/details/...` or `GET /renew/admin/details/...` | ☐ |
| 6 | Orange CORS banner **gone** | ☐ |
| 7 | `data[0].product_performance.testReports` has saved rows after refresh | ☐ |

---

## 8. Parity with uncertified certification

| Uncertified (vendor) | Renewal (vendor) |
|----------------------|------------------|
| Page load: `GET /products/details/:urn_no` | **`GET /renew/details/:urn_no`** |
| Context stores `product_details_list` | Same keys — bind `data` / `product_details_list` |
| Tab POST `/product-performance` | **`POST /renew/process-product-performance`** |
| After save refetch details | **Renew** details URL only |

Reuse the **same tab components**; only change API paths and context source.

---

## 9. Acceptance (ticket done when)

- [ ] Vendor renew URN page calls **`GET {API_BASE}/renew/details/{urnNo}`** on load (visible in Network + Nest logs)
- [ ] Admin renew URN page calls **`GET {API_BASE}/renew/admin/details/{urnNo}`** on load
- [ ] No request to `localhost:3001/renew/details` or `localhost:3004/renew/details`
- [ ] CORS / orange banner removed for valid token
- [ ] Product Performance grid reads `data[0].product_performance.testReports`
- [ ] After save, refetch renew details; cert `GET /products/details` not used on renew routes
- [ ] Quick-view remains separate; not used as sole data source for forms

---

## 10. Related docs (backend)

- Full API spec: [`BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md`](./BACKEND-RENEW-URN-DETAILS-AND-PERFORMANCE.md)
- General renewal UI patterns: [`renewal-frontend-aligned-prompt.md`](./renewal-frontend-aligned-prompt.md)

**Document version:** 2026-06-03
