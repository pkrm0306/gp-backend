# Frontend: Admin products export when filters return zero rows

## Backend behavior (implemented)

`POST /api/admin/products/export` now **always returns a file download**, even when the current filters match **0 rows**.

- Default: Excel (`.xlsx`)
- Optional body field: `format: "csv"` for CSV
- Response headers:
  - `X-Export-Row-Count` — number of data rows (0 when empty)
  - `X-Export-Has-Data` — `"true"` or `"false"`
- File content when empty: **table headings only** (no data rows)

## Frontend fix required

If export still does nothing when the list shows “No data found”, the **frontend is likely blocking the API call** before download.

### Do NOT block export on empty list

Remove guards like:

```ts
if (!total || total === 0) {
  toast.error('No data to export');
  return;
}
```

Always call export with the **same filter body** used for `POST /api/admin/products/list`.

### Download helper (blob)

```ts
export async function exportAdminProducts(
  token: string,
  filters: Record<string, unknown>,
  format: 'xlsx' | 'csv' = 'xlsx',
) {
  const response = await fetch('/api/admin/products/export', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...filters, format }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || 'Export failed');
  }

  const rowCount = Number(response.headers.get('X-Export-Row-Count') ?? '0');
  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') ?? '';
  const match = disposition.match(/filename="([^"]+)"/);
  const fileName =
    match?.[1] ??
    `admin-products-export.${format === 'csv' ? 'csv' : 'xlsx'}`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);

  if (rowCount === 0) {
    toast.info('Export downloaded with headers only (no rows matched your filters).');
  }
}
```

### Axios example

```ts
const response = await api.post(
  '/api/admin/products/export',
  { ...filters, format: 'xlsx' },
  { responseType: 'blob' },
);

const rowCount = Number(response.headers['x-export-row-count'] ?? 0);
// trigger download from response.data Blob (same as above)
```

## Test checklist

1. Apply filters that return **0 rows** on the list screen.
2. Click **Export**.
3. Browser downloads `.xlsx` or `.csv`.
4. Open file → first row shows column headings; no data rows below.
