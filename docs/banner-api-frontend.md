# Banner API — frontend contract (`imageSource`)

All **admin** routes below assume the global API prefix (e.g. `/admin/...`) and a **Bearer JWT** (or your project’s `x-access-token` / `access_token` workarounds for multipart).

Successful JSON responses are wrapped by the global interceptor as:

```json
{
  "success": true,
  "message": "…",
  "data": …
}
```

Errors use `success: false` with `message` / `error` per your `HttpExceptionFilter`.

---

## `imageSource` enum

| Value             | Meaning                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `binary_upload`   | Image came from a **multipart file** (see accepted field names below). |
| `manual_url`      | Image came from the **`imageUrl`** form field (full `http(s)` URL or `/uploads/...` path). |

The **server sets** `imageSource` in the controller from a real uploaded file vs URL, then passes it into the service as an explicit argument (it is **not** inferred from client-supplied `imageSource` in the form). Optional body `imageSource` is **ignored** for persistence on create; on edit it is only updated when you supply a new file or a non-empty `imageUrl`.

**Legacy rows** without `imageSource` in the database are returned as `manual_url`.

---

## TypeScript (shared)

```ts
export type BannerImageSource = 'binary_upload' | 'manual_url';

/** One row from GET list or public list */
export interface BannerListItem {
  s_no: number;
  id: string;
  imageUrl: string;
  imageSource: BannerImageSource;
  heading: string;
  title: string;
  sequenceNumber: number;
  description: string;
  status: 'active' | 'inactive';
  is_active: boolean;
}

/** GET by id — no status booleans in this payload */
export interface BannerDetail {
  id: string;
  imageUrl: string;
  imageSource: BannerImageSource;
  heading: string;
  title: string;
  sequenceNumber: number;
  description: string;
  status: 'active' | 'inactive';
}

/** POST create / PATCH edit success `data` */
export interface BannerWriteResult extends BannerListItem {
  createdAt?: string;
  updatedAt?: string;
}
```

---

## `POST /admin/banner` — create

- **Content-Type:** `multipart/form-data`
- **Max file size:** 5 MB (image only)

### Image file field names (multipart)

The backend accepts **one** non-empty image file from the **first** matching field (in order):

1. `image`  
2. `bannerImage`  
3. `banner_image`  
4. `file`

Use **`image`** unless your UI library defaults to another name. Empty parts are ignored so `imageSource` stays correct.

### Form fields

| Field             | Required | Notes |
| ----------------- | -------- | ----- |
| `image` / `bannerImage` / `banner_image` / `file` | *One of* file **or** `imageUrl` | Binary; max 5 MB; image MIME types when `originalname` is set. |
| `imageUrl`        | *One of* above | String: full `https://…` / `http://…` **or** path starting with **`/uploads/`**. |
| `title`           | Yes | Alias accepted: `heading`. |
| `description`     | Yes | Alias: `bannerDescription`. |
| `sequenceNumber`  | No | Aliases: `sequence`, `displayOrder`, `order`. |
| `status`          | No | `active` / `inactive` / `1` / `0`. |
| `imageSource`     | No | Ignored for persistence; server derives from file vs `imageUrl`. |

### Example responses (`data`)

**Multipart file used**

```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "id": "674a…",
    "imageUrl": "/uploads/banners/banner-173….jpg",
    "imageSource": "binary_upload",
    "heading": "Summer sale",
    "title": "Summer sale",
    "sequenceNumber": 1,
    "description": "…",
    "status": "active",
    "is_active": true,
    "createdAt": "2026-05-21T…",
    "updatedAt": "2026-05-21T…"
  }
}
```

**URL / path only (no file)**

```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "id": "674a…",
    "imageUrl": "https://cdn.example.com/banner.jpg",
    "imageSource": "manual_url",
    "heading": "Summer sale",
    "title": "Summer sale",
    "sequenceNumber": 1,
    "description": "…",
    "status": "active",
    "is_active": true,
    "createdAt": "2026-05-21T…",
    "updatedAt": "2026-05-21T…"
  }
}
```

---

## `PATCH /admin/banner/:id` or `PATCH /admin/banner/:id/edit` — edit

- **Content-Type:** `multipart/form-data`
- Body must include at least **`title`**, **`sequenceNumber`**, and **`description`** (validator requirement), plus any fields you want to change.

### Image / source behaviour

| Client sends                         | `imageSource` stored                          |
| ------------------------------------ | --------------------------------------------- |
| New file on **`image`**, **`bannerImage`**, **`banner_image`**, or **`file`** | `binary_upload` (and `imageUrl` updated)      |
| Non-empty `imageUrl` (no new file)   | `manual_url`                                  |
| Neither (only text/status edits)     | Previous `imageSource` **unchanged**          |

### Form fields (typical)

| Field            | Notes |
| ---------------- | ----- |
| `image` / `bannerImage` / `banner_image` / `file` | Optional; same rules as create. |
| `imageUrl`       | Optional; must match URL/`/uploads/` rule when sent. |
| `title`          | Alias: `heading`. |
| `description`    | |
| `sequenceNumber` | |
| `status`         | |
| `imageSource`    | Optional; not used to infer — server sets from `image` / `imageUrl` as above. |

### Success `data`

Same shape as **create** (`BannerWriteResult`): includes `imageSource`, `imageUrl`, `createdAt` / `updatedAt`, etc.

---

## `GET /admin/banner/list` — vendor’s banners

### Response `data`

`data` is **`BannerListItem[]`** (see type above). Each row includes **`imageUrl`** and **`imageSource`**.

```json
{
  "success": true,
  "message": "Banners retrieved successfully",
  "data": [
    {
      "s_no": 1,
      "id": "674a…",
      "imageUrl": "/uploads/banners/banner-….jpg",
      "imageSource": "binary_upload",
      "heading": "Welcome",
      "title": "Welcome",
      "sequenceNumber": 1,
      "description": "…",
      "status": "active",
      "is_active": true
    }
  ]
}
```

---

## `GET /admin/banner/:id` — single banner (view modal)

### Response `data`

`data` is **`BannerDetail`** — includes **`imageSource`**. (No `is_active` / `s_no` on this handler.)

```json
{
  "success": true,
  "message": "Banner retrieved successfully",
  "data": {
    "id": "674a…",
    "imageUrl": "https://…",
    "imageSource": "manual_url",
    "heading": "Welcome",
    "title": "Welcome",
    "sequenceNumber": 1,
    "description": "…",
    "status": "active"
  }
}
```

---

## Public website — `GET /website/public/banners` (and aliases)

Same **`BannerListItem`** shape as admin list, but:

- **No auth**
- **`imageUrl`** is normalized to an **absolute** URL using the request origin (e.g. `https://api.example.com/uploads/...`).
- **`imageSource`** is still present on each item (same enum).

```json
{
  "success": true,
  "message": "Banners retrieved successfully",
  "data": [
    {
      "s_no": 1,
      "id": "674a…",
      "imageUrl": "https://your-host/uploads/banners/banner-….jpg",
      "imageSource": "binary_upload",
      "heading": "Welcome",
      "title": "Welcome",
      "sequenceNumber": 1,
      "description": "…",
      "status": "active",
      "is_active": true
    }
  ]
}
```

---

## UI hints

1. **Badges / copy:** `binary_upload` → e.g. “Uploaded”; `manual_url` → “External URL” or “Link”.
2. **Edit form:** If `imageSource === 'manual_url'`, show URL input as primary; if `binary_upload`, show last file preview + option to replace file or switch to URL.
3. **Do not** rely on client-sent `imageSource` for security or billing — always trust the API’s returned value after save.
