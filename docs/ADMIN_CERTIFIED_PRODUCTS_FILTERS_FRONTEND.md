# Admin — Certified products table (filters)

Backend:

- `POST /api/admin/products/list/filter-options` — categories, manufacturers, countries, **valid till month/year picker hint**
- `POST /api/admin/products/list` — list; send optional filters below

Default certified scope: body includes `"status": [2]`.

## Filter UI (required behavior)

| Field      | Control              | API body field | Notes |
|------------|----------------------|----------------|-------|
| Valid Till | **Month + year picker** | `validTillMonthYear` or `valid_till` | `YYYY-MM` only (no day). Do **not** use year-only dropdown / `validTillYears` on certified screen. |
| Country    | **Dropdown**         | `countryId`    | Options from `data.countries[]`. |
| State      | **Text input**       | `state`        | Free text; partial match on state name. |
| City       | **Text input**       | `city`         | Free text; partial match on city. |

Alternative: separate month + year controls → send `validTillMonth` (1–12) and `validTillYear` together.

Optional **month/year range** instead of single month:

- `validTillFrom` / `valid_till_from` — start (inclusive, `YYYY-MM`)
- `validTillTo` / `valid_till_to` — end (inclusive, `YYYY-MM`)

## Filter options

```http
POST /api/admin/products/list/filter-options
Authorization: Bearer <admin_jwt>
Content-Type: application/json

{ "status": [2] }
```

```json
{
  "data": {
    "categories": [{ "value": "...", "label": "..." }],
    "manufacturers": [{ "value": "...", "label": "..." }],
    "countries": [{ "value": "...", "label": "India" }],
    "filterControls": {
      "validTillMonthYear": {
        "type": "monthYearPicker",
        "label": "Valid Till",
        "queryParam": "validTillMonthYear",
        "snakeCaseQueryParam": "valid_till_month_year",
        "format": "YYYY-MM",
        "monthQueryParam": "validTillMonth",
        "yearQueryParam": "validTillYear"
      },
      "countryId": { "type": "dropdown", "queryParam": "countryId", "optionsKey": "countries" },
      "state": { "type": "text", "queryParam": "state", "placeholder": "Search by state name" },
      "city": { "type": "text", "queryParam": "city", "placeholder": "Search by city" }
    }
  }
}
```

`data.validTillYears` is legacy — **do not** bind it on the certified products UI.

## List request

Reset `page` to `1` when the month/year picker changes.

```http
POST /api/admin/products/list
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "status": [2],
  "groupBy": "manufacturer",
  "valid_till": "2026-12",
  "countryId": "<mongoId>",
  "state": "Telangana",
  "city": "Hyderabad"
}
```

Matches EOIs whose `validtillDate` falls in the selected calendar month (Asia/Kolkata).

## Example (React)

```tsx
const [validTillMonthYear, setValidTillMonthYear] = useState(''); // "2026-12"
const [countryId, setCountryId] = useState('');
const [stateText, setStateText] = useState('');
const [city, setCity] = useState('');

const listBody = {
  page,
  limit: 10,
  status: [2],
  groupBy: 'manufacturer',
  ...(validTillMonthYear ? { valid_till: validTillMonthYear } : {}),
  ...(countryId ? { countryId } : {}),
  ...(stateText.trim() ? { state: stateText.trim() } : {}),
  ...(city.trim() ? { city: city.trim() } : {}),
};

// Use a month+year picker (not type="date")
<input
  type="month"
  value={validTillMonthYear}
  onChange={(e) => setValidTillMonthYear(e.target.value)}
/>
```

## Do not

- Use `validTillYears` / year multiselect on certified products (use month+year picker).
- Send full dates (`YYYY-MM-DD`) — backend normalizes to month+year but the UI should use `YYYY-MM`.
- Use `stateIds` or state dropdown.
