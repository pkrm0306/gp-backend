# Frontend: Admin dashboard certification timing widgets

Wire the **Time at Stage** bar chart and **Avg. Time to Certification** summary card from live API data (no hard-coded demo values).

---

## APIs

### Option A — dedicated endpoint (timing only)

```
GET /api/admin/dashboard/certification-timing
Authorization: Bearer <admin JWT>
```

Query (all optional): `categoryId`, `region`, `productStatus`

### Option B — bundled with KPI cards

```
GET /api/admin/dashboard/kpi-cards
```

Returns `data.cards` (8 stat cards) **and** `data.certificationTiming`.

### Option C — full dashboard home

```
GET /api/admin/dashboard/overview
```

Returns `data.certificationTiming` alongside KPI cards, payment status, alerts, and charts.

---

## Response shape

```json
{
  "message": "Certification timing analytics retrieved successfully",
  "data": {
    "appliedFilters": { "...": "..." },
    "timeAtStage": {
      "title": "Time at Stage",
      "subtitle": "Average days spent at each stage",
      "unit": "days",
      "stages": [
        { "key": "profile", "label": "Profile", "order": 1, "avgDays": 3, "sampleCount": 8 },
        { "key": "urn", "label": "URN", "order": 2, "avgDays": 4, "sampleCount": 8 },
        { "key": "eoi", "label": "EOI", "order": 3, "avgDays": 5, "sampleCount": 8 },
        { "key": "payment", "label": "Payment", "order": 4, "avgDays": 2, "sampleCount": 8 },
        { "key": "review", "label": "Review", "order": 5, "avgDays": 12, "sampleCount": 8 },
        { "key": "verified", "label": "Verified", "order": 6, "avgDays": 8, "sampleCount": 8 },
        { "key": "certified", "label": "Certified", "order": 7, "avgDays": 6, "sampleCount": 8 }
      ]
    },
    "avgTimeToCertification": {
      "title": "Avg. Time to Certification",
      "subtitle": "End-to-end processing duration",
      "unit": "days",
      "avgDays": 20,
      "sampleCount": 8,
      "breakdown": [
        { "key": "technical", "label": "Technical", "order": 1, "avgDays": 12, "sampleCount": 8 },
        { "key": "audit", "label": "Audit", "order": 2, "avgDays": 15, "sampleCount": 8 },
        { "key": "review", "label": "Review", "order": 3, "avgDays": 22, "sampleCount": 8 }
      ]
    }
  }
}
```

---

## TypeScript types

```ts
export type CertificationTimingStageKey =
  | 'profile'
  | 'urn'
  | 'eoi'
  | 'payment'
  | 'review'
  | 'verified'
  | 'certified';

export type CertificationTimingBreakdownKey =
  | 'technical'
  | 'audit'
  | 'review';

export interface CertificationTimingStageItem {
  key: CertificationTimingStageKey;
  label: string;
  order: number;
  avgDays: number;
  sampleCount: number;
}

export interface CertificationTimingBreakdownItem {
  key: CertificationTimingBreakdownKey;
  label: string;
  order: number;
  avgDays: number;
  sampleCount: number;
}

export interface AdminDashboardCertificationTiming {
  timeAtStage: {
    title: string;
    subtitle: string;
    unit: 'days';
    stages: CertificationTimingStageItem[];
  };
  avgTimeToCertification: {
    title: string;
    subtitle: string;
    unit: 'days';
    avgDays: number;
    sampleCount: number;
    breakdown: CertificationTimingBreakdownItem[];
  };
}
```

---

## UI mapping

### Left card — Time at Stage (bar chart)

| Field | Use |
|-------|-----|
| `data.timeAtStage.title` | Card title |
| `data.timeAtStage.subtitle` | Card subtitle |
| `data.timeAtStage.stages` | X-axis categories + bar heights |
| `stage.label` | X-axis label (`Profile`, `URN`, …) |
| `stage.avgDays` | Bar height (Y-axis) |
| `stage.key === 'certified'` | Use **green** bar + tooltip highlight |
| Other stages | Use primary **blue** bars |

Tooltip on hover:

```ts
`${stage.label}\nAvg. time: ${stage.avgDays} days`
```

Sort bars by `stage.order` (already ordered in API).

Y-axis ticks: derive max from `Math.max(...stages.map(s => s.avgDays))`, round up to nearest 3 (e.g. 0d, 3d, 6d, 9d, 12d).

Empty state: if every `sampleCount === 0`, show “No certified products yet” instead of an empty chart.

### Right card — Avg. Time to Certification

| Field | Use |
|-------|-----|
| `data.avgTimeToCertification.title` | Card title |
| `data.avgTimeToCertification.subtitle` | Card subtitle |
| `data.avgTimeToCertification.avgDays` | Large centre metric → render as `{avgDays}d` |
| Centre caption | “Average across all certified products” (static UI copy) |
| `data.avgTimeToCertification.breakdown` | Three pills at bottom |

Pill row:

```tsx
{breakdown.map((item) => (
  <Pill key={item.key}>
    <span>{item.label}</span>
    <strong>{item.avgDays}d</strong>
  </Pill>
))}
```

---

## Data hook example

```ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useCertificationTiming(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'certification-timing', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/certification-timing', {
        params: filters,
      });
      return data.data as AdminDashboardCertificationTiming & {
        appliedFilters: Record<string, unknown>;
      };
    },
  });
}
```

If the dashboard page already calls `GET /admin/dashboard/overview`, read `data.certificationTiming` from that response instead of a second request.

---

## Filters

Pass the same query params as other dashboard widgets:

- `categoryId` — Mongo category `_id` or slug
- `region` — `north` | `south` | `east` | `west`
- `productStatus` — optional; `completed` narrows to active certified products

When the user changes dashboard filters, refetch timing with the same params.

---

## Backend calculation notes (for QA)

- Source: `activity_log` milestones per URN + `products.certifiedDate`
- Scope: active certified products (`productStatus: 2`, valid certificate)
- **Profile** = manufacturer registration → first product registration log
- **URN → Certified** = consecutive `activities_id` transitions (0–11)
- **End-to-end** = first registration milestone → `certifiedDate`
- **Breakdown**: Technical (forms 5–6), Audit (step 7), Review (cert fee steps 8–10)
- Values are rounded to **1 decimal**; display as whole days in UI (`Math.round(avgDays)` or `{avgDays}d`)

---

## Permissions

Requires admin JWT with at least one of:

- `dashboard.view`
- `dashboard.certification.view`

(`kpi-cards` and `overview` accept broader dashboard permissions.)

---

## Checklist

- [ ] Remove hard-coded `3d`, `20d`, etc. from dashboard mock data
- [ ] Fetch from `overview` or `certification-timing` on dashboard mount
- [ ] Re-fetch when `categoryId` / `region` filters change
- [ ] Bar chart uses `stages[].avgDays` dynamically
- [ ] Certified bar uses green styling when `key === 'certified'`
- [ ] Centre metric uses `avgTimeToCertification.avgDays`
- [ ] Bottom pills use `breakdown[]`
- [ ] Empty / zero `sampleCount` states handled gracefully
