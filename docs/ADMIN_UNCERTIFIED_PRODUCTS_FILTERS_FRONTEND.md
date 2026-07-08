# Admin — Un-Certified products list (country filter)

Backend:

- `POST /api/admin/products/list/filter-options` — categories, manufacturers, **countries** dropdown
- `POST /api/admin/products/list` — list; send optional `countryId`, **`state`** (text), **`city`** (text)

For the **Un-Certified Products** screen, always scope list + filter-options to pending/submitted EOIs:

```json
{ "status": [0, 1] }
```

**Countries:** `data.countries[]` includes **every country in the database** (sorted A–Z), not only countries that already have products. Use `data.countriesTotal` to verify count. Alternative: `GET /api/countries/dropdown`.

(Omitting `status` on the list also defaults to `[0, 1]`.)

## Filter UI (required behavior)

| Field     | Control          | API body field | Notes |
|-----------|------------------|----------------|-------|
| Category  | **Multiselect**  | `categoryIds` or `category_ids` | Options from `data.categories[]`. Single `categoryId` / `category_id` still works (merged). |
| Building  | **Multiselect**  | `sectorIds`, `buildingIds`, or `building_ids` | Options from `data.sectors[]` (same as `data.buildings[]`). Sector id **1** = Building. |
| Country   | **Dropdown**     | `countryId`    | Options from `data.countries[]`. Include “All countries”. |
| State   | **Text input** | `state`        | Free text; partial match on state **name** (not state id). Do **not** use a state dropdown. |
| City    | **Text input** | `city`         | Free text; partial match on any manufacturing plant city. |

Read control hints from `POST .../list/filter-options` → `data.filterControls` for labels/placeholders.

## Load filter options (once on page mount)

```http
POST /api/admin/products/list/filter-options
Authorization: Bearer <admin_jwt>
Content-Type: application/json

{ "status": [0, 1] }
```

Example response shape:

```json
{
  "message": "Filter options retrieved successfully",
  "data": {
    "categories": [{ "value": "...", "label": "..." }],
    "sectors": [{ "value": "1", "label": "Building" }],
    "buildings": [{ "value": "1", "label": "Building" }],
    "manufacturers": [{ "value": "...", "label": "..." }],
    "validTillYears": [],
    "countries": [
      { "value": "6998547b14999ba875c7d70c", "label": "India" },
      { "value": "6998547b14999ba875c7d71a", "label": "United States" }
    ],
    "filterControls": {
      "categoryIds": {
        "type": "multiselect",
        "label": "Category",
        "queryParam": "categoryIds",
        "snakeCaseQueryParam": "category_ids",
        "optionsKey": "categories"
      },
      "sectorIds": {
        "type": "multiselect",
        "label": "Building",
        "queryParam": "sectorIds",
        "snakeCaseQueryParam": "sector_ids",
        "aliases": ["buildingIds", "building_ids", "buildings"],
        "optionsKey": "sectors"
      },
      "countryId": {
        "type": "dropdown",
        "label": "Country",
        "queryParam": "countryId",
        "optionsKey": "countries"
      },
      "state": {
        "type": "text",
        "label": "State",
        "queryParam": "state",
        "placeholder": "Search by state name"
      },
      "city": {
        "type": "text",
        "label": "City",
        "queryParam": "city",
        "placeholder": "Search by city"
      }
    }
  }
}
```

Alternative for countries only: `GET /api/countries/dropdown` or `GET /api/countries` (`data[]` with `_id` + `countryName` / `country_name` / `name`).

## List request (apply filters)

Debounce state/city text (e.g. 300–400 ms). Reset `page` to `1` when any filter changes.

```http
POST /api/admin/products/list
Authorization: Bearer <admin_jwt>
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "status": [0, 1],
  "groupBy": "manufacturer",
  "category_ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "building_ids": [1, 2],
  "countryId": "6998547b14999ba875c7d70c",
  "state": "Telangana",
  "city": "Hyderabad"
}
```

Rules:

- Omit `countryId` when “All countries” is selected.
- `state_name` is an optional snake_case alias of `state`; prefer one param in the client.
- Matching is **any plant** on the EOI (not only the first plant shown in the row).
- Combine with existing filters: `search`, `categoryIds`, `manufacturerIds`, `dateFrom`, `dateTo`, `sort`.

## React-style example (conceptual)

```tsx
const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
const [categoryIds, setCategoryIds] = useState<string[]>([]);
const [sectors, setSectors] = useState<{ value: string; label: string }[]>([]);
const [buildingIds, setBuildingIds] = useState<string[]>([]);
const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
const [countryId, setCountryId] = useState('');
const [stateText, setStateText] = useState('');
const [cityText, setCityText] = useState('');

useEffect(() => {
  api.post('/admin/products/list/filter-options', { status: [0, 1] }).then((res) => {
    setCategories(res.data.data.categories ?? []);
    setSectors(res.data.data.sectors ?? res.data.data.buildings ?? []);
    setCountries(res.data.data.countries ?? []);
  });
}, []);

const listBody = {
  page,
  limit: 10,
  status: [0, 1],
  groupBy: 'manufacturer',
  ...(categoryIds.length ? { category_ids: categoryIds } : {}),
  ...(buildingIds.length ? { building_ids: buildingIds.map(Number) } : {}),
  ...(countryId ? { countryId } : {}),
  ...(stateText.trim() ? { state: stateText.trim() } : {}),
  ...(cityText.trim() ? { city: cityText.trim() } : {}),
};
api.post('/admin/products/list', listBody);
```

```tsx
{/* Category multiselect — bind selected ids to categoryIds */}
{/* Building multiselect — bind selected sector ids to buildingIds */}

<select value={countryId} onChange={(e) => setCountryId(e.target.value)}>
  <option value="">All countries</option>
  {countries.map((c) => (
    <option key={c.value} value={c.value}>
      {c.label}
    </option>
  ))}
</select>

<input
  type="text"
  placeholder="State"
  value={stateText}
  onChange={(e) => setStateText(e.target.value)}
/>

<input
  type="text"
  placeholder="City"
  value={cityText}
  onChange={(e) => setCityText(e.target.value)}
/>
```

## Do not

- Use `stateIds`, `stateId`, or `GET /api/states` dropdown for this screen.
- Send a 24-char hex string as `state` unless you intentionally want legacy ObjectId matching.

## Empty results

When filters match no plants, the API returns empty manufacturer/URN groups and `total: 0`. Show a clear “No products match these filters” message.
