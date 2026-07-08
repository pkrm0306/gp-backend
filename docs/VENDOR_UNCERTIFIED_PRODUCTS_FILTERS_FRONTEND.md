# Vendor — Uncertified products list (location filters)

Backend:

- `GET /api/product-registration/list/filter-options` — countries dropdown only
- `GET /api/product-registration/list` — list with optional `countryId`, `state`, `city`

Default list status is still **Pending (0) + Submitted (1)** unless you override `productStatusList`.

## Filter UI (required behavior)

| Field   | Control        | API param     | Notes |
|---------|----------------|---------------|-------|
| Country | **Dropdown**   | `countryId`   | Options from filter-options `data.countries[]` (`value` = Mongo `_id`, `label` = name). Include empty “All countries”. |
| State   | **Text input** | `state`       | Free text; partial match on state **name** (not state id). Do **not** use a state dropdown. |
| City    | **Text input** | `city`        | Free text; partial match on city. |

Read control hints from `GET .../list/filter-options` → `data.filterControls` if you want to drive labels/placeholders from the API.

## Load filter options (once on page mount)

```http
GET /api/product-registration/list/filter-options
Authorization: Bearer <vendor_jwt>
```

Example response shape:

```json
{
  "message": "Filter options retrieved successfully",
  "data": {
    "countries": [
      { "value": "6998547b14999ba875c7d70c", "label": "India" }
    ],
    "filterControls": {
      "countryId": { "type": "dropdown", "queryParam": "countryId", "optionsKey": "countries" },
      "state": { "type": "text", "queryParam": "state", "placeholder": "Search by state name" },
      "city": { "type": "text", "queryParam": "city", "placeholder": "Search by city" }
    }
  }
}
```

**Countries:** `data.countries[]` is the **full database list** (A–Z), not scoped to your products. Use `GET /api/countries/dropdown` if you only need the dropdown.

## List request (apply filters)

Debounce state/city text (e.g. 300–400 ms). Reset `page` to `1` when any filter changes.

```http
GET /api/product-registration/list?page=1&limit=10&productStatusList=0,1&countryId=<mongoId>&state=Telangana&city=Hyderabad
Authorization: Bearer <vendor_jwt>
```

Rules:

- Omit empty params (do not send `countryId=` when “All”).
- `state_name` is an optional snake_case alias of `state`; prefer one param in the client.
- Matching is **any plant** on the EOI (not only the first plant shown in the row).
- Combine with existing params: `search`, `categoryId`, `dateFrom`, `dateTo`, `sort`.

## React-style example (conceptual)

```tsx
// State
const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
const [countryId, setCountryId] = useState('');
const [stateText, setStateText] = useState('');
const [cityText, setCityText] = useState('');

useEffect(() => {
  api.get('/product-registration/list/filter-options').then((res) => {
    setCountries(res.data.data.countries ?? []);
  });
}, []);

// On filter change → refetch list
const params = {
  page,
  limit: 10,
  productStatusList: '0,1',
  ...(countryId ? { countryId } : {}),
  ...(stateText.trim() ? { state: stateText.trim() } : {}),
  ...(cityText.trim() ? { city: cityText.trim() } : {}),
};
api.get('/product-registration/list', { params });
```

```tsx
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

- Load states by country for this screen — **state is always a text field** on vendor and admin lists.
- Send a 24-char hex string as `state` on the vendor list (always use state name text).

## Empty results

When filters match no plants, the API returns `data: []` and `pagination.totalCount: 0`. Show a clear “No products match these filters” message.
