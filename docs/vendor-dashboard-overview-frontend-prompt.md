# Frontend: Vendor panel dashboard overview

Wire the vendor dashboard home page from a **single overview API** — KPI cards, charts, recent EOIs table, and recent activity feed.

---

## API

```
GET /api/vendor/dashboard/overview
Authorization: Bearer <vendor JWT>
```

Requires completed vendor profile (same rules as existing `GET /api/vendor/dashboard`).

---

## Response shape

```json
{
  "message": "Vendor dashboard overview retrieved successfully",
  "data": {
    "kpiCards": [
      {
        "key": "totalProducts",
        "label": "Total Products",
        "value": 124,
        "trendPercent": 12,
        "trendDirection": "up",
        "format": "number"
      },
      {
        "key": "pendingApprovals",
        "label": "Pending Approvals",
        "value": 18,
        "trendPercent": -3,
        "trendDirection": "down",
        "format": "number"
      },
      {
        "key": "eoisSubmitted",
        "label": "EOIs Submitted",
        "value": 67,
        "trendPercent": 8,
        "trendDirection": "up",
        "format": "number"
      },
      {
        "key": "urnsGenerated",
        "label": "URNs Generated",
        "value": 52,
        "trendPercent": 15,
        "trendDirection": "up",
        "format": "number"
      },
      {
        "key": "certifiedProducts",
        "label": "Certified Products",
        "value": 38,
        "trendPercent": 5,
        "trendDirection": "up",
        "format": "number"
      },
      {
        "key": "paymentsDue",
        "label": "Payments Due",
        "value": 145000,
        "trendPercent": 0,
        "trendDirection": "flat",
        "format": "currency",
        "currency": "INR",
        "subLabel": "3 pending invoices"
      }
    ],
    "registrationCertificationTrend": {
      "title": "Registration & Certification Trend",
      "subtitle": "Monthly overview for current year",
      "year": 2026,
      "chart": [
        { "label": "Jan", "month": 1, "year": 2026, "registrations": 8, "certifications": 2 },
        { "label": "Apr", "month": 4, "year": 2026, "registrations": 10, "certifications": 4 }
      ],
      "yAxis": { "min": 0, "suggestedMax": 24 }
    },
    "productStatus": {
      "title": "Product Status",
      "subtitle": "Distribution overview",
      "total": 86,
      "chart": [
        { "key": "certified", "label": "Certified", "count": 38, "color": "#22C55E" },
        { "key": "pending", "label": "Pending", "count": 24, "color": "#3B82F6" },
        { "key": "underReview", "label": "Under Review", "count": 18, "color": "#F59E0B" },
        { "key": "rejected", "label": "Rejected", "count": 6, "color": "#EF4444" }
      ]
    },
    "productsByCategory": {
      "title": "Products by Category",
      "subtitle": "Top product categories",
      "chart": [
        { "name": "Cement", "count": 32 },
        { "name": "Steel", "count": 28 }
      ],
      "xAxis": { "min": 0, "suggestedMax": 32 }
    },
    "recentEois": {
      "title": "Recent EOIs",
      "subtitle": "Latest expression of interest submissions",
      "viewAllPath": "/vendor/products",
      "items": [
        {
          "productId": 101,
          "eoiNo": "GPABC001",
          "productName": "Eco Cement Grade A",
          "categoryName": "Cement",
          "date": "2024-03-15",
          "status": "Under Review",
          "statusKey": "under_review",
          "statusVariant": "warning",
          "urnNo": "URN-20260305124230"
        }
      ]
    },
    "recentActivity": {
      "title": "Recent Activity",
      "subtitle": "Last 7 days",
      "days": 7,
      "items": [
        {
          "id": "665abc...",
          "type": "productApproval",
          "message": "Product 'Eco Cement Grade A' approved",
          "occurredAt": "2026-06-14T09:00:00.000Z",
          "relativeTimeLabel": "2 hours ago",
          "metadata": { "urnNo": "URN-...", "productName": "Eco Cement Grade A" }
        }
      ]
    }
  }
}
```

---

## TypeScript types

Copy from `src/dashboard/vendor-dashboard.types.ts` or mirror:

```ts
export interface VendorDashboardOverview {
  kpiCards: VendorDashboardKpiCard[];
  registrationCertificationTrend: { /* ... */ };
  productStatus: { /* ... */ };
  productsByCategory: { /* ... */ };
  recentEois: { /* ... */ };
  recentActivity: { /* ... */ };
}
```

---

## Page layout (match mockups)

```
┌─────────────────────────────────────────────────────────────┐
│  [6 KPI cards in responsive grid]                           │
├──────────────────────────┬──────────────────────────────────┤
│ Registration & Cert Trend│ Product Status (donut)           │
├──────────────────────────┴──────────────────────────────────┤
│ Products by Category (bar) │ Recent EOIs (table)            │
├─────────────────────────────────────────────────────────────┤
│ Recent Activity (list)                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. KPI cards (top row)

Six cards from `data.kpiCards` in this order:

| key | Label | Format |
|-----|-------|--------|
| `totalProducts` | Total Products | number |
| `pendingApprovals` | Pending Approvals | number |
| `eoisSubmitted` | EOIs Submitted | number |
| `urnsGenerated` | URNs Generated | number |
| `certifiedProducts` | Certified Products | number |
| `paymentsDue` | Payments Due | currency (INR) |

Each card:

- **Value:** `value` — format currency as `₹1,45,000` when `format === 'currency'`
- **Trend:** `+{trendPercent}%` green when `trendDirection === 'up'`, red when `down`
- **Sub-label:** `subLabel` (e.g. “3 pending invoices” on Payments Due)

---

## 2. Registration & Certification Trend (area/line chart)

- Title / subtitle from API
- X-axis: `chart[].label` (Jan–Dec)
- Two series:
  - **Registrations** — green — `registrations`
  - **Certifications** — blue — `certifications`
- Y-axis: `0` → `yAxis.suggestedMax`
- Use smooth curves + light gradient fill under lines (Recharts `Area` or `Line`)

---

## 3. Product Status (donut chart)

- Slices from `productStatus.chart`
- Centre label optional: `productStatus.total`
- Colours from `slice.color`
- Legend: Certified / Pending / Under Review / Rejected with counts

---

## 4. Products by Category (horizontal bar chart)

- Y-axis: `chart[].name`
- X-axis: `chart[].count`, max = `xAxis.suggestedMax`
- Bar colour: green (`#22C55E`)
- Top 6 categories from API

---

## 5. Recent EOIs (table)

| Column | Field |
|--------|-------|
| EOI Number | `eoiNo` (green monospace) |
| Product | `productName` (bold) |
| Category | `categoryName` |
| Date | `date` (YYYY-MM-DD) |
| Status | badge from `status` + `statusVariant` |
| Action | eye icon → `/vendor/products/{productId}` or URN detail |

Status badge colours:

| statusVariant | Style |
|---------------|-------|
| `success` | green (Approved, Certified) |
| `warning` | yellow (Under Review, Pending) |
| `danger` | red (Rejected) |

**View All →** link to `recentEois.viewAllPath`

---

## 6. Recent Activity (list)

Header: `title` + `subtitle` (“Last 7 days”) right-aligned.

Each `recentActivity.items[]` row:

| type | Icon | Background |
|------|------|------------|
| `productApproval` | check | light green |
| `submission` | document | light blue |
| `payment` | credit card | light green |
| `requirement` | exclamation | light yellow |
| `alert` | bell | light yellow |

- Primary text: `message`
- Secondary: `relativeTimeLabel` (or format `occurredAt` client-side)

---

## React Query hook

```ts
export function useVendorDashboardOverview() {
  return useQuery({
    queryKey: ['vendor', 'dashboard', 'overview'],
    queryFn: async () => {
      const { data } = await api.get('/vendor/dashboard/overview');
      return data.data as VendorDashboardOverview;
    },
  });
}
```

Single fetch on vendor dashboard mount — pass sections to child components.

---

## Legacy endpoint

`GET /api/vendor/dashboard` still returns legacy counts + `progressTracking` for URN stepper widgets. Use **overview** for the new home layout; keep legacy endpoint if other pages depend on it.

---

## Checklist

- [ ] Replace all hard-coded dashboard mock numbers
- [ ] One `GET /vendor/dashboard/overview` on page load
- [ ] 6 KPI cards with trend colours
- [ ] Registration vs certification dual-line/area chart
- [ ] Product status donut
- [ ] Horizontal category bar chart
- [ ] Recent EOIs table with status badges + view action
- [ ] Recent activity list with type-based icons
- [ ] Handle empty states (`chart.length === 0`, no activity items)
- [ ] 403 → redirect to complete profile flow
