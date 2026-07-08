# Frontend: Admin — restore rejected products to Un-certified or Certified

**Backend base:** `/api/admin/products/rejected-restore`  
**Auth:** Admin JWT + `products:update` (PATCH) / `products:view` (GET options)  
**Admin list:** `POST /api/admin/products/list` with `status: [3]`

---

## Goal

From the **Rejected Products** tab, let admins move EOIs out of **Rejected** (`productStatus: 3`) without re-creating the URN:

| Target | `productStatus` | Appears in tab |
|--------|-----------------|----------------|
| **Un-certified** | `0` (Pending) | Un-certified Products (`status: [0, 1]`) |
| **Certified** | `2` | Certified Products (`status: [2]`) |

**Scope:** single EOI or all rejected EOIs on one URN.

---

## URN certified gate (backend enforced)

Before showing restore targets, the backend evaluates **the whole URN**:

```text
hasCertifiedOnUrn = EXISTS product WHERE urnNo = :urnNo AND productStatus = 2
```

| `hasCertifiedOnUrn` | Allowed restore targets |
|---------------------|-------------------------|
| **false** | Un-certified (`0`) **or** Certified (`2`) |
| **true** | **Certified (`2`) only** |

If admin tries `targetStatus: 0` when the URN already has certified siblings → **400**:

```json
{
  "success": false,
  "message": "This URN already has certified products. Restore to Certified only."
}
```

**Do not infer this from the rejected list alone** — certified siblings are not in `status: [3]` rows.

---

## API endpoints

### 1. `GET /api/admin/products/rejected-restore/options`

```http
GET /api/admin/products/rejected-restore/options?urnNo=URN-20260428123027
Authorization: Bearer <admin_token>
```

**Response (200):**

```json
{
  "success": true,
  "urnNo": "URN-20260428123027",
  "hasCertifiedProducts": true,
  "certifiedProductCount": 2,
  "rejectedProductCount": 1,
  "allowedTargets": ["certified"],
  "targetStatusMap": {
    "uncertified": 0,
    "certified": 2
  }
}
```

Use `allowedTargets` to enable/disable radio buttons in the restore modal.

---

### 2. `PATCH /api/admin/products/rejected-restore/product` — single EOI

```json
{
  "urnNo": "URN-20260428123027",
  "productId": "507f1f77bcf86cd799439011",
  "eoiNo": "GPPMI003803",
  "targetStatus": 0
}
```

| Field | Required | Values |
|-------|----------|--------|
| `urnNo` | Yes | URN string |
| `productId` | Yes | Mongo `_id` or numeric `productId` from list |
| `eoiNo` | No | Optional validation / audit |
| `targetStatus` | Yes | **`0`** or **`2`** only |

**Response (200):**

```json
{
  "success": true,
  "urnNo": "URN-20260428123027",
  "productId": "507f1f77bcf86cd799439011",
  "eoiNo": "GPPMI003803",
  "fromStatus": 3,
  "toStatus": 0,
  "hasCertifiedOnUrn": false,
  "updatedAt": "2026-06-09T10:00:00.000Z"
}
```

---

### 3. `PATCH /api/admin/products/rejected-restore/urn` — all rejected on URN

```json
{
  "urnNo": "URN-20260428123027",
  "targetStatus": 2
}
```

**Response (200):**

```json
{
  "success": true,
  "urnNo": "URN-20260428123027",
  "targetStatus": 2,
  "hasCertifiedOnUrn": true,
  "updatedProductIds": ["507f1f77bcf86cd799439011"],
  "updatedEoiNos": ["GPPMI003803"],
  "updatedCount": 1
}
```

---

## HTTP errors

| Case | HTTP |
|------|------|
| Missing/invalid JWT | 401 |
| Not admin / missing permission | 403 |
| Invalid `targetStatus`, gate violation (`0` when URN has certified) | 400 |
| Unknown product / URN / no rejected rows | 404 |
| Product not status `3` / concurrent change | 409 |

---

## List API (`POST /api/admin/products/list`)

Rejected tab: `status: [3]`, `groupBy: "manufacturer"` (default).

Each **URN group** in the response now includes (when listing rejected only):

```json
{
  "urnNo": "URN-20260428123027",
  "hasCertifiedProducts": true,
  "certifiedProductCount": 1,
  "rejectedProductCount": 2,
  "allowedTargets": ["certified"],
  "eois": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "productId": 366,
      "eoiNo": "GPPMI003803",
      "productStatus": 3,
      "statusLabel": "Rejected"
    }
  ]
}
```

Use `_id` or `productId` from each EOI row for the single-product PATCH body.

If `allowedTargets` is present on the URN row, you can open the restore modal **without** calling `GET /options`. Otherwise call options on modal open.

---

## Suggested UI flow

### Rejected list row actions

- **Restore EOI** → single-product modal
- **Restore URN** → bulk modal (all rejected EOIs on that URN)

### Modal

1. On open: use `urn.allowedTargets` from list **or** fetch `GET .../options?urnNo=`
2. Radio / select:
   - **Un-certified** → `targetStatus: 0` (only if `allowedTargets` includes `uncertified`)
   - **Certified** → `targetStatus: 2`
3. Confirm → `PATCH /product` or `PATCH /urn`
4. On success: refresh rejected list; product moves to Un-certified or Certified tab

### Client service sketch

```typescript
// admin/lib/products/rejectedRestore.service.ts

export async function getRejectedRestoreOptions(urnNo: string) {
  const { data } = await api.get('/api/admin/products/rejected-restore/options', {
    params: { urnNo },
  });
  return data;
}

export async function restoreRejectedProduct(body: {
  urnNo: string;
  productId: string;
  eoiNo?: string;
  targetStatus: 0 | 2;
}) {
  const { data } = await api.patch(
    '/api/admin/products/rejected-restore/product',
    body,
  );
  return data;
}

export async function restoreRejectedUrn(body: {
  urnNo: string;
  targetStatus: 0 | 2;
}) {
  const { data } = await api.patch(
    '/api/admin/products/rejected-restore/urn',
    body,
  );
  return data;
}
```

---

## After restore

| `targetStatus` | User sees product in |
|----------------|----------------------|
| `0` | Un-certified Products (`status: [0, 1]`) |
| `2` | Certified Products (`status: [2]`) |

Product is removed from Rejected list (`status: [3]`).

Backend also re-sequences manufacturer EOIs and clears `rejectedDetails`.

---

## Acceptance checklist

- [ ] Rejected URN with **no** certified siblings → both Un-certified and Certified options shown
- [ ] Rejected URN with **≥1** certified sibling → Certified only; Un-certified disabled/hidden
- [ ] Single restore `3 → 0` succeeds when gate allows
- [ ] Single restore `3 → 2` always succeeds for rejected product
- [ ] URN bulk restore updates **only** `productStatus === 3` rows
- [ ] `targetStatus: 0` on gated URN → 400 with clear message
- [ ] Non-rejected product → 409
- [ ] Wrong `productId` / URN mismatch → 404
- [ ] Vendor JWT → 403
- [ ] List refresh shows product in correct tab
