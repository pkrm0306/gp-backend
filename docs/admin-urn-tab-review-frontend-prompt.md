# Admin portal — URN tab-wise review UI prompt

Copy into the **admin** repo (`UrnProcessDetail`, process tabs + raw materials). Backend: `cursor-greenpro-mern`.

---

## When to show review UI

- Show **Approve / Reject** controls only when **`urnStatus === 4`** (Admin Review Pending).
- Hide tab-review actions on Quick View, Payment, Site Visits (unchanged).
- Do **not** use vendor completion flags (`productDesignStatus`, `processManufacturingStatus`, etc.) for admin review — use the APIs below only.

---

## API (Admin Products)

Base: same API host as `GET /api/admin/products/details/:urn`  
Auth: `Authorization: Bearer <admin-jwt>`

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/admin/products/urn-tab-review/{urnNo}` | Load all required tabs/steps + decisions + summary |
| `PATCH` | `/api/admin/products/urn-tab-review` | Approve or reject **one** tab/step |

---

## Review status (numeric)

| `reviewStatus` | Meaning |
|----------------|---------|
| `0` | Pending — not reviewed |
| `1` | Approved |
| `2` | Rejected |

---

## `GET /api/admin/products/urn-tab-review/{urnNo}`

### Response (`data`)

```ts
type UrnTabReviewResponse = {
  urnNo: string;
  urnStatus: number;
  categoryRawMaterialForms: string; // e.g. "1,2,5,7"
  visibleRawMaterialSteps: number[]; // [1,2,5,7] or 1..15
  canReview: boolean; // true when urnStatus === 4
  requiredTabs: Array<{
    tabKey: string;
    stepId: number | null; // null = process tab
    label: string;
  }>;
  reviews: Array<{
    tabKey: string;
    stepId: number | null;
    reviewStatus: 0 | 1 | 2;
    rejectionRemarks: string | null;
    reviewedBy: string | null;
    reviewedAt: string | null;
  }>;
  summary: {
    totalRequired: number;
    pending: number;
    approved: number;
    rejected: number;
    allReviewed: boolean;
    allApproved: boolean;
    hasRejection: boolean;
  };
};
```

Call once when opening `UrnProcessDetail` (and after each PATCH). Map `reviews` by `(tabKey, stepId)` to your 7 process tabs and 15 raw-material steps.

### Process tab `tabKey` → UI

| `tabKey` | UI tab |
|----------|--------|
| `product-design` | Product Design |
| `product-performance` | Product Performance |
| `manufacturing-process` | Manufacturing Process |
| `waste-management` | Waste Management |
| `life-cycle-approach` | Life Cycle Approach |
| `product-stewardship` | Product Stewardship |
| `innovation` | Innovation |

### Raw materials

- `tabKey`: always `"raw-materials"`
- `stepId`: `1` … `15` (only steps in `visibleRawMaterialSteps` are required)
- Hide steps not in `visibleRawMaterialSteps` (match existing `parseVisibleRawMaterialSteps` on category CSV)

---

## `PATCH /api/admin/products/urn-tab-review`

### Body

```json
{
  "urnNo": "URN-20260326162423",
  "tabKey": "raw-materials",
  "stepId": 7,
  "decision": "approved",
  "rejectionRemarks": null
}
```

**Process tab example** (no `stepId`):

```json
{
  "urnNo": "URN-20260326162423",
  "tabKey": "product-design",
  "decision": "rejected",
  "rejectionRemarks": "Missing eco-design documentation"
}
```

| Field | Rules |
|-------|--------|
| `decision` | `"approved"` \| `"rejected"` |
| `rejectionRemarks` | **Required** if `decision === "rejected"` |
| `stepId` | **Required** for `raw-materials` (1–15); **omit** for process tabs |

### Response

Includes updated `review`, `reviewStatus`, and refreshed `summary`. Re-call GET or merge `summary` into local state for tab badges.

---

## Suggested UI (`admin/lib/urnTabReview.ts`)

```ts
export async function fetchUrnTabReviews(urnNo: string) {
  const res = await api.get(`/api/admin/products/urn-tab-review/${encodeURIComponent(urnNo)}`);
  return res.data; // wrapped: use res.data from axios after unwrapping success wrapper
}

export async function submitUrnTabReview(body: {
  urnNo: string;
  tabKey: string;
  stepId?: number;
  decision: 'approved' | 'rejected';
  rejectionRemarks?: string | null;
}) {
  return api.patch('/api/admin/products/urn-tab-review', body);
}

export function reviewStatusLabel(status: number) {
  if (status === 1) return 'Approved';
  if (status === 2) return 'Rejected';
  return 'Pending';
}
```

---

## Per-tab UI pattern

For each process tab and each visible raw-material step:

1. Badge: Pending (gray) / Approved (green) / Rejected (red) from `reviewStatus`.
2. Buttons **Approve** / **Reject** (only if `canReview`).
3. On Reject → modal for `rejectionRemarks` → PATCH.
4. On Approve → PATCH without remarks.
5. Disable final “Complete review” until `summary.allReviewed === true` (optional product rule).

---

## Tab bar / step list indicators

- Process tab: find review where `tabKey === '<key>'` and `stepId === null`.
- Raw material step N: find where `tabKey === 'raw-materials'` && `stepId === N`.

---

## Errors

| HTTP | Meaning |
|------|---------|
| 403 | PATCH while `urnStatus !== 4` |
| 400 | Invalid tabKey, step not in category, missing remarks |
| 404 | Unknown URN |

---

## Out of scope

- Payment approve/reject — keep `PATCH /payments/{urn}`.
- Vendor `urn-status` update — separate flow.
- Do not call `/vendor/notifications/*`.

---

## Backend reference

- Collection: `urn_process_tab_reviews`
- Initialized (pending rows) when URN enters `urnStatus = 4`
- See `docs/backend_changes_urn_tab_review.md` in API repo
