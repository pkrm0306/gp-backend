# Frontend: Admin dashboard Rejection Trend area chart

Render the **Rejection Trend** widget as a red area chart — monthly rejected product volume — using live API data (no hard-coded Feb/Mar demo values).

---

## APIs

### Option A — dedicated endpoint (recommended for lazy-loaded chart)

```
GET /api/admin/dashboard/rejection-trend
Authorization: Bearer <admin JWT>
```

### Option B — bundled in dashboard overview

```
GET /api/admin/dashboard/overview
```

Read `data.charts.rejectionTrend`.

### Option C — dashboard stats bundle

```
GET /api/admin/dashboard/stats
```

Read `data.rejectionTrend`.

---

## Query params (all optional)

| Param | Example | Effect |
|-------|---------|--------|
| `period` | `this_year`, `last_month`, `this_month` | Limits rejection dates to window |
| `year` | `2026` | Filter by year |
| `month` | `2` or `Feb` | Filter by month |
| `granularity` | `monthly` (default), `weekly`, `quarterly` | Bucket size |
| `categoryId` | category `_id` or slug | Scope to category |
| `region` | `north` \| `south` \| `east` \| `west` | Scope to region |

When no `period` / `year` is sent, all rejected products are bucketed by rejection date (full history).

---

## Response shape

```json
{
  "message": "Rejection trend retrieved successfully",
  "data": {
    "appliedFilters": { "...": "..." },
    "title": "Rejection Trend",
    "subtitle": "Monthly rejected product volume",
    "unit": "products",
    "granularity": "monthly",
    "totals": {
      "rejectedInRange": 2,
      "totalRejected": 5
    },
    "chart": [
      { "label": "Feb", "year": 2026, "month": 2, "count": 1 },
      { "label": "Mar", "year": 2026, "month": 3, "count": 1 }
    ],
    "yAxis": {
      "min": 0,
      "suggestedMax": 1
    }
  }
}
```

---

## TypeScript types

```ts
export interface DashboardRejectionTrendPoint {
  label: string;
  year: number;
  month?: number;
  quarter?: number;
  week?: number;
  count: number;
}

export interface AdminDashboardRejectionTrend {
  title: string;
  subtitle: string;
  unit: 'products';
  granularity: 'monthly' | 'weekly' | 'quarterly';
  totals: {
    rejectedInRange: number;
    totalRejected: number;
  };
  chart: DashboardRejectionTrendPoint[];
  yAxis: {
    min: number;
    suggestedMax: number;
  };
}
```

---

## UI mapping (match design mockup)

### Card header

| Field | Use |
|-------|-----|
| `data.title` | **Rejection Trend** (bold) |
| `data.subtitle` | Grey subtitle under title |

### Chart type

**Area chart** (line + filled gradient under the curve).

| Setting | Value |
|---------|-------|
| Line colour | Red (`#EF4444` / `hsl(0 84% 60%)`) |
| Area fill | Red gradient, top → bottom fade to transparent/white |
| Grid | Light grey dashed horizontal lines |
| Y-axis min | `data.yAxis.min` (always `0`) |
| Y-axis max | `data.yAxis.suggestedMax` |
| Y-axis ticks | 4–5 ticks from 0 to max (e.g. `0, 0.25, 0.5, 0.75, 1` when max is 1) |
| X-axis | `chart[].label` (`Feb`, `Mar`, …) |

### Data series

```ts
const points = data.chart.map((p) => ({
  x: p.label,
  y: p.count,
}));
```

Use `count` as the Y value (integer product count). When `suggestedMax === 1`, the flat line at `1` matches the design.

### Tooltip

```ts
`${label}\nRejected: ${count} product${count === 1 ? '' : 's'}`
```

### Empty state

If `chart.length === 0` or all `count === 0`:

- Show flat line at `0` OR
- Show empty-state copy: “No rejections in this period”

---

## Recharts example

```tsx
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function RejectionTrendCard({ data }: { data: AdminDashboardRejectionTrend }) {
  const yMax = data.yAxis.suggestedMax;
  const tickCount = yMax <= 1 ? 5 : 5;
  const ticks =
    yMax <= 1
      ? [0, 0.25, 0.5, 0.75, 1]
      : Array.from({ length: tickCount }, (_, i) =>
          Math.round((yMax / (tickCount - 1)) * i),
        );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.chart}>
            <defs>
              <linearGradient id="rejectionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              domain={[0, yMax]}
              ticks={ticks}
              tickLine={false}
              axisLine={false}
              allowDecimals={yMax <= 4}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value} product${value === 1 ? '' : 's'}`,
                'Rejected',
              ]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#rejectionFill)"
              dot={{ r: 3, fill: '#EF4444' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

## React Query hook

```ts
export function useRejectionTrend(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'rejection-trend', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/rejection-trend', {
        params: filters,
      });
      return data.data as AdminDashboardRejectionTrend;
    },
  });
}
```

Refetch when dashboard period / year / category / region filters change (same params as other dashboard widgets).

---

## Backend notes (for QA)

- Counts products with `productStatus: 3` (Rejected)
- Date bucket: `rejectedAt` if set, else `updatedDate` (legacy rows)
- `totals.rejectedInRange` = count in filtered date window
- `totals.totalRejected` = all rejected products in current snapshot (ignores date window)
- `yAxis.suggestedMax` is at least `1` so the chart never collapses when counts are low

---

## Permissions

Requires admin JWT with at least one of:

- `dashboard.view`
- `dashboard.products.view`
- `dashboard.certification.view`

---

## Checklist

- [ ] Remove hard-coded Feb/Mar rejection demo data
- [ ] Fetch from `rejection-trend` or `overview` on dashboard mount
- [ ] Area chart with red line + gradient fill
- [ ] Y-axis uses `yAxis.suggestedMax`; show decimal ticks when max ≤ 1
- [ ] X-axis uses `chart[].label`
- [ ] Refetch on dashboard filter changes
- [ ] Empty / zero-data state handled
