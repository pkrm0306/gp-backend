# Frontend: Admin dashboard Visitor Analytics multi-line chart

Render the **Visitor Analytics** widget as a three-line chart — **Page Views**, **Visitors**, **Sign-ups** — from live API data.

---

## APIs

### Option A — dedicated endpoint

```
GET /api/admin/dashboard/visitor-analytics
Authorization: Bearer <admin JWT>
```

### Option B — dashboard overview

```
GET /api/admin/dashboard/overview
```

Read `data.visitorAnalytics`.

---

## Query params (optional)

| Param | Example | Effect |
|-------|---------|--------|
| `period` | `this_year`, `last_month` | Date window |
| `year` | `2026` | Filter year |
| `month` | `2` or `Feb` | Filter month |
| `granularity` | `monthly` (default), `weekly`, `quarterly` | X-axis buckets |

Default window when no period is set: **last 6 months** (monthly).

---

## Response shape

```json
{
  "message": "Visitor analytics retrieved successfully",
  "data": {
    "title": "Visitor Analytics",
    "subtitle": "Platform traffic and engagement",
    "granularity": "monthly",
    "series": [
      { "key": "pageViews", "label": "Page Views", "color": "#3B82F6", "order": 1 },
      { "key": "visitors", "label": "Visitors", "color": "#22C55E", "order": 2 },
      { "key": "signUps", "label": "Sign-ups", "color": "#8B5CF6", "order": 3 }
    ],
    "chart": [
      { "label": "Jan", "year": 2026, "month": 1, "pageViews": 12500, "visitors": 4000, "signUps": 120 },
      { "label": "Feb", "year": 2026, "month": 2, "pageViews": 13800, "visitors": 4200, "signUps": 95 },
      { "label": "Jun", "year": 2026, "month": 6, "pageViews": 18500, "visitors": 6000, "signUps": 210 }
    ],
    "totals": {
      "pageViews": 98000,
      "visitors": 28500,
      "signUps": 980
    },
    "yAxis": {
      "min": 0,
      "suggestedMax": 20000
    },
    "methodology": {
      "pageViews": "Estimated from recorded public website engagements...",
      "visitors": "Unique visitor identities per bucket...",
      "signUps": "New newsletter subscribers plus new manufacturer registrations."
    }
  }
}
```

---

## TypeScript types

```ts
export type VisitorAnalyticsSeriesKey = 'pageViews' | 'visitors' | 'signUps';

export interface VisitorAnalyticsChartPoint {
  label: string;
  year: number;
  month?: number;
  pageViews: number;
  visitors: number;
  signUps: number;
}

export interface VisitorAnalyticsSeriesMeta {
  key: VisitorAnalyticsSeriesKey;
  label: string;
  color: string;
  order: number;
}

export interface AdminDashboardVisitorAnalytics {
  title: string;
  subtitle: string;
  granularity: 'monthly' | 'weekly' | 'quarterly';
  series: VisitorAnalyticsSeriesMeta[];
  chart: VisitorAnalyticsChartPoint[];
  totals: { pageViews: number; visitors: number; signUps: number };
  yAxis: { min: number; suggestedMax: number };
  methodology: Record<VisitorAnalyticsSeriesKey, string>;
}
```

---

## UI mapping (match design mockup)

### Card header

| Field | Use |
|-------|-----|
| `data.title` | **Visitor Analytics** |
| `data.subtitle` | “Platform traffic and engagement” |

### Chart

| Setting | Value |
|---------|-------|
| Type | Multi-line chart (smooth/monotone curves) |
| X-axis | `chart[].label` (`Jan`, `Feb`, …) |
| Y-axis min | `yAxis.min` (`0`) |
| Y-axis max | `yAxis.suggestedMax` |
| Grid | Light grey dashed horizontal lines |

### Lines (use `data.series`)

| Key | Label | Colour |
|-----|-------|--------|
| `pageViews` | Page Views | `#3B82F6` (blue) |
| `visitors` | Visitors | `#22C55E` (green) |
| `signUps` | Sign-ups | `#8B5CF6` (purple) |

Map each series `dataKey` to the matching field on `chart[]`:

```ts
const lines = data.series
  .sort((a, b) => a.order - b.order)
  .map((s) => ({
    key: s.key,
    label: s.label,
    color: s.color,
    dataKey: s.key,
  }));
```

### Legend

Centered below chart — coloured dot + `series.label` for each line.

### Tooltip

```ts
`${label}\nPage Views: ${pageViews.toLocaleString()}\nVisitors: ${visitors.toLocaleString()}\nSign-ups: ${signUps.toLocaleString()}`
```

---

## Recharts example

```tsx
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function VisitorAnalyticsCard({
  data,
}: {
  data: AdminDashboardVisitorAnalytics;
}) {
  const lines = [...data.series].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chart}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              domain={[data.yAxis.min, data.yAxis.suggestedMax]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                lines.find((l) => l.key === name)?.label ?? name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) =>
                lines.find((l) => l.key === value)?.label ?? value
              }
            />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.key}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

## React Query hook

```ts
export function useVisitorAnalytics(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'visitor-analytics', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/visitor-analytics', {
        params: filters,
      });
      return data.data as AdminDashboardVisitorAnalytics;
    },
  });
}
```

Refetch when dashboard period / granularity filters change.

---

## Data notes (for QA / product)

There is **no dedicated page-view tracker** yet (website routes are excluded from audit logging). Current metrics are derived from real platform records:

| Series | Source |
|--------|--------|
| **Sign-ups** | `newsletter_subscribers` + `manufacturers` (vendor registration) |
| **Visitors** | Unique emails / inquiry submitters per month |
| **Page Views** | Engagement-weighted estimate (3× per recorded public interaction) |

`data.methodology` explains each series. Replace with Google Analytics / Plausible later without changing the chart component shape.

---

## Permissions

Requires `dashboard.view` (admin JWT).

---

## Checklist

- [ ] Remove hard-coded Jan–Jun demo lines
- [ ] Fetch from `visitor-analytics` or `overview`
- [ ] Three coloured lines using `series[].color`
- [ ] X-axis = `chart[].label`, Y-axis 0 → `yAxis.suggestedMax`
- [ ] Legend with Page Views / Visitors / Sign-ups
- [ ] Refetch on filter changes
- [ ] Empty chart state when `chart.length === 0`
