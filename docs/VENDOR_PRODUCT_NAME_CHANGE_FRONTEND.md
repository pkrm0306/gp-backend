# Vendor — Request Product Name Change (frontend)

Backend: `POST /api/vendor/requests`, `GET /api/vendor/requests`, `GET /api/vendor/requests/form-meta`

## Required fields (show `*` in UI)

| Field | API key | Required |
|-------|---------|----------|
| New Product Name | `requestedName` | Yes |
| Reason | `reason` | Yes |
| Product | `productId` | Yes (from certified row) |

Optional: `urnNo`, `eoiNo`, `currentName` (must match latest certified name).

Read labels and messages from `GET /api/vendor/requests/form-meta`.

## Product name uniqueness

On submit, the API returns **400** if the requested name already exists on another product (or is already requested in a pending change):

```json
{
  "success": false,
  "message": "Product Name already exists. Please enter a unique Product Name.",
  "fieldErrors": {
    "requestedName": "Product Name already exists. Please enter a unique Product Name."
  }
}
```

Map `fieldErrors.requestedName` under the New Product Name input.

## Popup layout (alignment)

- Use a fixed modal width with `max-width` (e.g. `min(520px, 92vw)`) and consistent padding (`1rem 1.25rem`).
- Stack fields vertically: label → input → error; full-width inputs.
- Long **current product name**: read-only block with `word-break: break-word`, `white-space: normal`, `overflow-wrap: anywhere` (do not single-line truncate in the modal).
- On certified/admin tables, use the same wrapping on the name cell and `title={fullProductName}` for hover tooltip.

## Long product names in lists

API returns full `productName` / `currentName` / `requestedName` (no server-side truncation).

Suggested table cell CSS:

```css
.product-name-cell {
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
  max-width: 280px;
}
```

Optional “View more” if you clamp rows with `line-clamp` in compact views only.

## Example submit body

```json
{
  "productId": "66545c2f3d4f04cc8ec2ab11",
  "currentName": "12 DOOR INDUSTRIAL LOCKER SIZE:-915(W)*480(D)*1980(H)",
  "requestedName": "12 DOOR INDUSTRIAL LOCKER — revised name",
  "reason": "Corrected dimensions labelling after audit."
}
```
