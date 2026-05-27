# Frontend: `productsToBeCertified` must use numeric `productId`

## Problem

Certification payments store `payment_details.productsToBeCertified` as a **string**. The backend now requires this to be a **JSON array of numeric `productId` values** from the `products` collection — **not** product names, labels, or EOI text.

Invalid (current bug):

```text
"test plkk"
```

Valid:

```text
"[42]"
"[42,57]"
```

Legacy PHP used comma-separated **product_id** integers; MERN accepts the same IDs in JSON array form.

---

## Backend contract (after fix)

| Rule | Detail |
|------|--------|
| Field | `productsToBeCertified` on create/update certification `payment_details` |
| Type | `string` (JSON serialized array) |
| Format | `"[<productId>, ...]"` — integers only, from `products.productId` |
| Validation | 400 if empty, non-numeric, or free text on create/submit/approve |
| Storage | Normalized to compact JSON, e.g. `"[42,57]"` |
| Approve | Admin approve (`paymentStatus: 2`) uses stored IDs to set `productStatus: 2` + certification dates |

Error example:

```text
productsToBeCertified must be a JSON array of numeric productId values (e.g. "[101,102]"). Product names are not accepted.
```

---

## Where to change (admin + vendor)

### 1. Certification fee form — “Products to be certified”

**Do not** bind a plain text input to `productsToBeCertified`.

Use a **multi-select** (or checkboxes) of EOIs on the current URN, backed by `productId`:

- Label in UI: `productName` / `eoiNo` (human-readable)
- Value sent to API: `product.productId` (number)

On submit (vendor payment proof or admin save):

```ts
const selectedProductIds: number[] = [...]; // from multi-select
const productsToBeCertified = JSON.stringify(selectedProductIds);
// e.g. "[42,57]"
```

### 2. Data source for options

Load EOIs for the URN from an existing API, e.g.:

- `GET /api/admin/products/details/:urn` (admin)
- Vendor product/EOI list for that URN

Each option must include at least:

```ts
{
  productId: number;   // required for payload
  productName: string;
  eoiNo: string;
  productStatus: number;
}
```

Only list EOIs eligible for certification (typically `productStatus === 1` Submitted, not already certified/rejected).

### 3. Display when read-only

When showing an approved/pending certification payment:

1. `JSON.parse(payment.productsToBeCertified)` → `number[]`
2. Map each `productId` to name from URN product list for display
3. If parse fails (old bad rows), show warning: “Invalid product selection — re-save with product picker”

```ts
function parseCertifiedProductIds(raw?: string | null): number[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => Number(x))
      .filter((id) => Number.isFinite(id) && id > 0);
  } catch {
    return [];
  }
}
```

### 4. API calls

**Create certification payment** (`POST` payment details, `paymentType: "certification"`):

- Include `productsToBeCertified: JSON.stringify([productId, ...])`
- Required before submit

**Update payment** (vendor submit / admin approve):

- Send `productsToBeCertified` only when the user changes selection; value must remain JSON productId array
- Admin **Approve** (`paymentStatus: 2`) fails if field is missing or invalid

### 5. Fix existing bad Mongo rows

For URNs already saved with text like `"test plkk"`:

1. Find correct `productId` in `products` for that URN
2. Update `payment_details.productsToBeCertified` to e.g. `"[12345]"` in Compass, **or**
3. Re-open payment in UI after deploy and re-save with the product picker

---

## UI mockup (behavior)

```
Products to be certified *
┌─────────────────────────────────────┐
│ ☑ test plkk (EOI-…-01)  productId 42│
│ ☐ other product (EOI-…-02)  id 57   │
└─────────────────────────────────────┘
```

Submit payload: `productsToBeCertified: "[42]"`

---

## Acceptance checklist

- [ ] Multi-select stores only numeric `productId`, never `productName`
- [ ] Payload is `JSON.stringify(number[])` string
- [ ] Create + update certification payment succeed in Network tab
- [ ] Compass shows `productsToBeCertified: "[42]"` not `"test plkk"`
- [ ] Admin Approve certification runs without `productsToBeCertified` errors
- [ ] Certified product rows get `certifiedDate`, `validtillDate`, notify dates in `products`

---

## Out of scope (backend already done)

- Certification date calculation on approve
- Expiry cron emails
