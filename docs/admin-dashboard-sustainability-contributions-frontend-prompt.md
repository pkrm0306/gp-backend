# Frontend: Admin dashboard Sustainability Contributions widget

Render the **Sustainability Contributions** card with four horizontal progress bars — Energy Saved, Water Saved, Recyclability, Carbon Offset — from live API data.

---

## APIs

### Option A — dedicated endpoint

```
GET /api/admin/dashboard/sustainability-contributions
Authorization: Bearer <admin JWT>
```

### Option B — dashboard overview (single fetch)

```
GET /api/admin/dashboard/overview
```

Read `data.sustainabilityContributions`.

---

## Query params (optional)

| Param | Example | Effect |
|-------|---------|--------|
| `categoryId` | category `_id` or slug | Scope to certified products in category |
| `region` | `north` \| `south` \| `east` \| `west` | Scope to region |

---

## Response shape

```json
{
  "message": "Sustainability contributions retrieved successfully",
  "data": {
    "appliedFilters": { "...": "..." },
    "title": "Sustainability Contributions",
    "subtitle": "Environmental impact from certified products",
    "unit": "percent",
    "totals": {
      "certifiedUrns": 12,
      "certifiedProducts": 28
    },
    "items": [
      { "key": "energySaved", "label": "Energy Saved", "order": 1, "percent": 85, "color": "#22C55E", "sampleCount": 9 },
      { "key": "waterSaved", "label": "Water Saved", "order": 2, "percent": 72, "color": "#3B82F6", "sampleCount": 8 },
      { "key": "recyclability", "label": "Recyclability", "order": 3, "percent": 68, "color": "#8B5CF6", "sampleCount": 11 },
      { "key": "carbonOffset", "label": "Carbon Offset", "order": 4, "percent": 92, "color": "#4ADE80", "sampleCount": 7 }
    ]
  }
}
```

---

## TypeScript types

```ts
export type SustainabilityContributionKey =
  | 'energySaved'
  | 'waterSaved'
  | 'recyclability'
  | 'carbonOffset';

export interface SustainabilityContributionItem {
  key: SustainabilityContributionKey;
  label: string;
  order: number;
  percent: number;
  color: string;
  sampleCount: number;
}

export interface AdminDashboardSustainabilityContributions {
  title: string;
  subtitle: string;
  unit: 'percent';
  totals: {
    certifiedUrns: number;
    certifiedProducts: number;
  };
  items: SustainabilityContributionItem[];
}
```

---

## UI mapping (match design mockup)

### Card header

| Field | Use |
|-------|-----|
| `data.title` | **Sustainability Contributions** (bold) |
| `data.subtitle` | Grey subtitle: “Environmental impact from certified products” |

### Progress rows

Sort `data.items` by `order`. For each item:

| Element | Source |
|---------|--------|
| Left label | `item.label` |
| Right value | `{item.percent}%` (bold, right-aligned) |
| Bar fill width | `item.percent%` |
| Bar fill colour | `item.color` |
| Track background | Light grey (`#E5E7EB` / `bg-muted`) |

### Layout (Tailwind example)

```tsx
export function SustainabilityContributionsCard({
  data,
}: {
  data: AdminDashboardSustainabilityContributions;
}) {
  const rows = [...data.items].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {rows.map((item) => (
          <div key={item.key} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold text-foreground">{item.percent}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

### Colour reference (from API)

| Key | Label | Default colour |
|-----|-------|----------------|
| `energySaved` | Energy Saved | `#22C55E` (green) |
| `waterSaved` | Water Saved | `#3B82F6` (blue) |
| `recyclability` | Recyclability | `#8B5CF6` (purple) |
| `carbonOffset` | Carbon Offset | `#4ADE80` (light green) |

Use `item.color` from the API so backend can tune colours without a frontend deploy.

### Empty state

When all `percent === 0` or `totals.certifiedProducts === 0`:

- Show zero-width bars
- Optional caption: “No sustainability data from certified products yet”

---

## React Query hook

```ts
export function useSustainabilityContributions(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'sustainability-contributions', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/sustainability-contributions', {
        params: filters,
      });
      return data.data as AdminDashboardSustainabilityContributions;
    },
  });
}
```

If the dashboard already loads `GET /admin/dashboard/overview`, use `data.sustainabilityContributions` instead of a second request.

Refetch when `categoryId` / `region` filters change.

---

## Backend calculation notes (for QA)

Metrics are averaged from **active certified products** (`productStatus: 2`, valid certificate):

| Widget label | Data source |
|--------------|-------------|
| **Energy Saved** | Positive `calculateBulkSec` / `calculateBulkStec` from `process_mp_manufacturing_units` |
| **Water Saved** | Positive `calculateBulkSwc` from `process_mp_manufacturing_units` |
| **Recyclability** | `yeardata3` from `raw_materials_recycled_content` + `raw_materials_recovery`; max recycled % from `raw_materials_utilization_rmc` |
| **Carbon Offset** | `yeardata3` from `raw_materials_rapidly_renewable_materials`; renewable energy fields / `renewableEnergyUtilization` from manufacturing units |

All values are clamped **0–100** and rounded to whole percentages.

---

## Permissions

Requires admin JWT with at least one of:

- `dashboard.view`
- `dashboard.products.view`
- `dashboard.certification.view`

---

## Checklist

- [ ] Remove hard-coded 85% / 72% / 68% / 92% demo values
- [ ] Fetch from `sustainability-contributions` or `overview`
- [ ] Four rows with label + percent + coloured progress bar
- [ ] Bar width = `item.percent%`, colour = `item.color`
- [ ] Refetch on dashboard filter changes
- [ ] Empty state when no certified product data
