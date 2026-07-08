# Frontend: Vendor certified products — certificate download (all plants + individual)

Wire the **Download** button on the vendor **Certified Products** EOI table so it downloads **one certificate per manufacturing plant** (Units column). Also support **individual plant** downloads.

---

## APIs

All require vendor JWT (`Authorization: Bearer …`). Use `eoi._id` (MongoDB product `_id`) from the certified products list.

### 1. Download all plant certificates (EOI row Download button)

**Merged PDF (recommended default)** — one file, one page per plant:

```
GET /api/products/certificates/eoi/{productId}
```

Example: 5 units → **1 PDF with 5 pages**.

**ZIP (separate PDF per plant)**:

```
GET /api/products/certificates/eoi/{productId}?format=zip
```

Example: 5 units → **1 ZIP with 5 PDF files**.

### 2. List plants + individual download paths

```
GET /api/products/certificates/eoi/{productId}/plants
```

### 3. Download one plant certificate

```
GET /api/products/certificates/eoi/{productId}/plants/{plantId}
```

`plantId` = MongoDB `product_plants._id`.

### 4. Download all certificates for entire URN (URN row Download)

```
GET /api/products/certificates/urn/{urnNo}/download
```

Merges every certified EOI under the URN (each EOI’s plants included).

---

## Certified products list — download URLs on each EOI

`GET /api/product-registration/list?productStatus=2` (vendor certified tab) now includes on **certified** EOIs:

```json
{
  "_id": "665abc...",
  "eoiNo": "GPPMI003032",
  "productName": "Test Product 2",
  "units": 5,
  "plantCount": 5,
  "productStatus": 2,
  "statusLabel": "Certified",
  "certificateDownloadUrl": "/products/certificates/eoi/665abc...",
  "certificateZipDownloadUrl": "/products/certificates/eoi/665abc...?format=zip",
  "plantCertificatesListUrl": "/products/certificates/eoi/665abc.../plants"
}
```

---

## `GET .../plants` response

```json
{
  "message": "Plant certificates retrieved successfully",
  "data": {
    "productId": "665abc...",
    "eoiNo": "GPPMI003032",
    "productName": "Test Product 2",
    "plantCount": 5,
    "plants": [
      {
        "plantId": "665def...",
        "productPlantId": 101,
        "plantName": "Plant A",
        "location": "Hyderabad, Telangana",
        "order": 1,
        "downloadPath": "/products/certificates/eoi/665abc.../plants/665def..."
      }
    ],
    "downloads": {
      "mergedPdfPath": "/products/certificates/eoi/665abc...",
      "zipPath": "/products/certificates/eoi/665abc...?format=zip"
    }
  }
}
```

---

## UI wiring

### EOI row — Download button (primary)

On click for certified EOIs (`productStatus === 2`):

```ts
async function downloadAllPlantCertificates(eoi: CertifiedEoiRow) {
  const url =
    eoi.certificateDownloadUrl ??
    `/products/certificates/eoi/${eoi._id}`;

  await downloadAuthenticatedFile(url, {
    fallbackName: `GreenPro_Certificate_${eoi.eoiNo}.pdf`,
  });
}
```

Use a shared helper that sends the JWT and triggers browser download from the blob response.

**Optional:** Right-click or dropdown on Download:

- “Download merged PDF” → `certificateDownloadUrl`
- “Download all as ZIP” → `certificateZipDownloadUrl`

### Units column + individual downloads

When user opens EOI detail / expands plants (or `units > 1`):

1. `GET plantCertificatesListUrl`
2. Render a list: plant name, location, per-row download icon
3. Each icon calls `GET {plant.downloadPath}`

```tsx
{plants.map((plant) => (
  <Button
    key={plant.plantId}
    variant="ghost"
    onClick={() =>
      downloadAuthenticatedFile(plant.downloadPath, {
        fallbackName: `GreenPro_Certificate_${eoiNo}_${plant.plantName}.pdf`,
      })
    }
  >
    Download
  </Button>
))}
```

### URN row — Download button

```ts
downloadAuthenticatedFile(
  `/products/certificates/urn/${encodeURIComponent(urnNo)}/download`,
  { fallbackName: `Certificates_${urnNo}.pdf` },
);
```

---

## Download helper (axios example)

```ts
export async function downloadAuthenticatedFile(
  path: string,
  options?: { fallbackName?: string },
) {
  const response = await api.get(path, {
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'] ?? '';
  const match = /filename="([^"]+)"/i.exec(disposition);
  const fileName = match?.[1] ?? options?.fallbackName ?? 'download';

  const blobUrl = window.URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(blobUrl);
}
```

---

## Behaviour notes

| Units | Merged PDF | ZIP | Individual |
|-------|------------|-----|------------|
| 1 | 1 page | 1 PDF in ZIP | Same as merged |
| 5 | 1 PDF, 5 pages | ZIP with 5 PDFs | 5 separate endpoints |

- Certificates are generated per **plant** in `product_plants` (location on each PDF).
- `units` / `plantCount` on the list should match `data.plantCount` from `/plants`.
- If `/plants` returns empty but `units > 0`, show: “Plant records missing — contact support.”
- Only show Download on **Certified** (`productStatus === 2`) rows.

---

## Checklist

- [ ] EOI Download uses `certificateDownloadUrl` (merged PDF, all plants)
- [ ] Optional ZIP via `certificateZipDownloadUrl` or `?format=zip`
- [ ] Individual plant downloads via `/plants` list + per-plant GET
- [ ] URN Download uses `/certificates/urn/{urnNo}/download`
- [ ] Authenticated blob download (not plain `<a href>` without token)
- [ ] Loading state + error toast on 404
