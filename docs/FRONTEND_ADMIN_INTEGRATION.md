# Frontend integration guide — Admin panel APIs

Copy this document (or link it in your frontend repo) so admin screens wire to the backend without localStorage hacks or wrong endpoints.

**Swagger (live contract):** `{API_BASE}/api` (e.g. `http://localhost:3000/api`)

**Base URL:** Use your env var (e.g. `NEXT_PUBLIC_API_URL`). Paths below are relative to that base. If your proxy adds `/api`, prefix each path with `/api` (e.g. `/api/admin/summits/list`).

---

## 1. Global conventions

### Auth

```http
Authorization: Bearer <admin_jwt>
```

Required on all `/admin/*` routes except none under admin.

### Success envelope

Every JSON success response is wrapped:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```

**Always read `response.data.data`** if using axios and returning `response.data` from the server (i.e. `const payload = res.data.data`).

List endpoints may also expose top-level pagination when the controller returns them (summit list puts pagination inside `data`).

### Error envelope

```json
{
  "success": false,
  "message": "Slug already exists",
  "error": "Conflict"
}
```

Validation may include `fieldErrors` or nested `message` as string. Map `409` slug conflicts to `basic.slug` in the form.

### Validation pipe

- Unknown query/body fields → **400** (`forbidNonWhitelisted: true`).
- Send only documented fields.

### File URLs

Uploaded files return paths like `/uploads/summits/{id}/...` or full CDN URLs. Prefix with API origin when displaying images in the browser if relative.

---

## 2. Summit CMS (replace localStorage)

### Permissions (assign in RBAC before testing)

| Permission | Purpose |
|------------|---------|
| `summits:view` | List + GET detail |
| `summits:add` | POST create |
| `summits:update` | PATCH, section save, upload, publish |
| `summits:delete` | DELETE |

### Screen → API map

| Admin route | Action | API |
|-------------|--------|-----|
| `/dashboard/summit` | List cards | `GET /admin/summits/list` or `GET /admin/summits` |
| `/dashboard/summit/new` | Create | `POST /admin/summits` |
| Basic form dropdowns | Year + status options | `GET /admin/summits/meta` |
| `/dashboard/summit/[id]` | Load / preview | `GET /admin/summits/:id` |
| Section **Save** | One section | `PATCH /admin/summits/:id/sections/:section` |
| **Final Submit** | Full document | `PATCH /admin/summits/:id` |
| Publish | Status | `PATCH /admin/summits/:id/status` |
| Delete | Remove | `DELETE /admin/summits/:id` |
| Upload image/PDF | File | `POST /admin/summits/:id/upload` |
| Public `/events/[slug]` | Published page | `GET /website/summits/:slug` (no auth) |

### TypeScript — `SummitData`

```ts
export type SummitStatus = 'active' | 'inactive';

export type SummitSponsorTier =
  | 'Title Sponsor'
  | 'Principal'
  | 'Platinum Sponsor'
  | 'Gold Sponsor'
  | 'Silver Sponsor'
  | 'Bronze Sponsor'
  | 'Partner';

export interface SummitData {
  id: string;
  basic: {
    year: string;
    title: string;
    slug: string;
    date: string; // YYYY-MM-DD
    location: string;
    status: SummitStatus; // active | inactive (not draft/published)
  };
  banners: Array<{
    id: string;
    sortOrder: number;
    imageUrl: string;
  }>;
  industrialPdfs: Array<{
    id: string;
    sortOrder: number;
    title: string;
    fileUrl: string;
    fileName: string;
  }>;
  buildingsPdfs: Array<{
    id: string;
    sortOrder: number;
    title: string;
    fileUrl: string;
    fileName: string;
  }>;
  aboutGreenPro: { title: string; content: string };
  aboutSummit: { title: string; content: string };
  highlightsTitle: string;
  highlights: Array<{ id: string; sortOrder: number; text: string }>;
  focusedAreaTitle: string;
  areaPoints: Array<{ id: string; sortOrder: number; text: string }>;
  eventOutcomesTitle: string;
  eventOutcomes: Array<{ id: string; sortOrder: number; text: string }>;
  speakers: Array<{
    id: string;
    sortOrder: number;
    name: string;
    sub: string;
    tags: string[];
    imageUrl: string;
  }>;
  /** Rich text (Quill HTML), same shape as aboutGreenPro / aboutSummit */
  agenda: { title: string; content: string };
  sponsorsTitle: string;
  sponsors: Array<{
    id: string;
    sortOrder: number;
    name: string;
    tier: SummitSponsorTier;
    logoUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
  visibleSections?: string[];
  sectionVisibility?: Record<string, boolean>;
}

export interface SummitListItem {
  id: string;
  year: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  status: SummitStatus;
  coverImageUrl: string | null;
  speakerCount: number;
  sponsorCount: number;
  bannerCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Basic information — year dropdown & status

Load options once (create + edit forms):

```http
GET /admin/summits/meta
```

```json
{
  "data": {
    "years": [{ "value": "2028", "label": "2028" }, { "value": "2027", "label": "2027" }],
    "statuses": [
      { "value": "active", "label": "Active" },
      { "value": "inactive", "label": "Inactive" }
    ]
  }
}
```

- **Year:** `<select>` bound to `basic.year` — send the string `"2026"`, not free text.
- **Year is unique:** only one non-deleted summit per calendar year. Duplicate year on create/update returns **409** with `errors['basic.year']` (same shape as slug conflicts).
- **Status:** `active` = visible on public `/events/[slug]`; `inactive` = admin only.
- Legacy `draft` / `published` in old data are mapped to `inactive` / `active` in API responses.

Activate / deactivate: `PATCH /admin/summits/:id/status` with `{ "status": "active" }` or `"inactive"`.

Before **active**, backend requires: `title`, `slug`, `date`, `year`.

### Section keys (for PATCH section URL)

```
basic | banners | downloads | about-greenpro | about-summit | highlights | focused-area | event-outcomes | speakers | agenda | sponsors
```

### Recommended `summitApi.ts`

```ts
const base = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// List response: data is an ARRAY (not { items }). Also: pagination, total, page at top level.
// const items = json.data;
// const total = json.pagination?.total ?? json.total;

export async function listSummits(token: string, params?: {
  search?: string;
  status?: 'active' | 'inactive';
  year?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.status) q.set('status', params.status);
  if (params?.year) q.set('year', params.year);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.sort) q.set('sort', params.sort ?? 'updated_at_desc');
  const res = await fetch(`${base}/admin/summits/list?${q}`, {
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  const items = (Array.isArray(json.data) ? json.data : json.data?.items) as SummitListItem[];
  return {
    items,
    total: json.pagination?.total ?? json.total ?? items.length,
    page: json.pagination?.page ?? json.page ?? 1,
    limit: json.pagination?.limit ?? json.limit ?? 20,
    totalPages: json.pagination?.totalPages ?? json.totalPages ?? 1,
  };
}

export async function getSummit(token: string, id: string) {
  const res = await fetch(`${base}/admin/summits/${id}`, {
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as SummitData;
}

export async function createSummit(
  token: string,
  body: { year: string; title: string; slug?: string; date?: string; location?: string },
) {
  const res = await fetch(`${base}/admin/summits`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, status: 'inactive' }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as SummitData;
}

export async function updateSummit(token: string, id: string, payload: Partial<SummitData>) {
  const res = await fetch(`${base}/admin/summits/${id}`, {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as SummitData;
}

export async function saveSummitSection(
  token: string,
  id: string,
  section: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`${base}/admin/summits/${id}/sections/${section}`, {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as { section: string; data: SummitData; updatedAt: string };
}

export async function setSummitStatus(token: string, id: string, status: 'active' | 'inactive') {
  const res = await fetch(`${base}/admin/summits/${id}/status`, {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as SummitData;
}

export async function deleteSummit(token: string, id: string) {
  const res = await fetch(`${base}/admin/summits/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function uploadSummitFile(
  token: string,
  id: string,
  type: 'banner' | 'speaker' | 'sponsor' | 'pdf_industrial' | 'pdf_buildings',
  file: File,
  itemId?: string,
) {
  const q = new URLSearchParams({ type });
  if (itemId) q.set('itemId', itemId);
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${base}/admin/summits/${id}/upload?${q}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as { url: string; fileName: string; type: string; itemId: string | null };
}

export async function getPublicSummit(slug: string) {
  const res = await fetch(`${base}/website/summits/${encodeURIComponent(slug)}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data as SummitData;
}
```

### Upload flow (do not send base64 in JSON)

1. User picks file on banner/speaker/sponsor/PDF row.
2. `POST .../upload?type=banner&itemId={row.id}` with `FormData` field `file`.
3. Put returned `url` into `imageUrl` / `logoUrl` / `fileUrl` on that row.
4. `PATCH .../sections/banners` (or relevant section) with updated array.

### Section PATCH bodies (send only that section’s fields)

| Section | Body shape |
|---------|------------|
| `basic` | `{ year, title, slug, date, location, status }` or `{ basic: { year, title, ... } }` (both accepted) |
| `banners` | `{ banners: [...] }` |
| `downloads` | `{ industrialPdfs: [...], buildingsPdfs: [...] }` |
| `about-greenpro` | `{ title, content }` |
| `about-summit` | `{ title, content }` |
| `highlights` | `{ highlightsTitle, highlights: [...] }` |
| `focused-area` | `{ focusedAreaTitle, areaPoints: [...] }` (same row shape as highlights) |
| `event-outcomes` | `{ eventOutcomesTitle, eventOutcomes: [...] }` (same as highlights) |
| `speakers` | `{ speakers: [...] }` — each speaker **must include `tags`** (string array) |

**Speaker row shape (keep `tags` in the UI):**

```json
{
  "id": "sp1",
  "sortOrder": 0,
  "name": "Dr. Jane Doe",
  "sub": "CEO, Example Corp",
  "tags": ["Sustainability", "Green buildings"],
  "imageUrl": "https://.../speaker.jpg"
}
```

Tags accept an array or comma-separated string on save; API always returns `tags: string[]`.
| `agenda` | `{ title, content }` — HTML rich text (like about-greenpro), not a bullet list |
| `sponsors` | `{ sponsorsTitle, sponsors: [...] }` |

### Publish rules

Before `status: "active"`, backend requires: `title`, valid `slug`, `date`, and `year`. Show validation errors on the basic section.

### Public page — hide empty sections (tabs not mandatory)

Every `GET /website/summits/:slug` and `GET /admin/summits/:id` includes:

```json
{
  "visibleSections": ["banners", "highlights", "speakers"],
  "sectionVisibility": {
    "basic": true,
    "banners": true,
    "downloads": false,
    "about-greenpro": false,
    "highlights": true,
    "focused-area": false,
    "event-outcomes": false,
    "speakers": true,
    "agenda": false,
    "sponsors": false
  }
}
```

**Public `/events/[slug]`:** Only render nav/sections listed in `visibleSections` (order is already correct). Hero/header always uses `basic` (title, date, location). **Admin edit UI:** still show all tabs for editing; use `visibleSections` only for **Preview** and the live public site.

Empty rules (summary): rich-text needs HTML body text; lists need at least one non-empty row; **banners need image only** (no title/subheading); downloads need a PDF URL; speakers need name/image/**tags**; sponsors need name/logo.

### Pitfalls

- Do not use `localStorage` for summits in production.
- Do not store base64 images in PATCH body — use upload endpoint.
- Generate stable `id` per array row (UUID); backend fills missing ids on save.
- Keep `sortOrder` in sync with drag-and-drop order (0, 1, 2, …).
- Sponsor `tier` must be exact enum string (see `SummitSponsorTier`).
- Preview admin page: same `GET /admin/summits/:id` as edit (draft allowed).
- Public page: only `GET /website/summits/:slug` for published.

---

## 3. Revenue Analytics dashboard

| Widget | API |
|--------|-----|
| Donut + fee breakdown | `GET /admin/dashboard/revenue?period=last_month` |
| Same (alias) | `GET /admin/dashboard/revenue-analytics` |

**Period values:** `this_week`, `last_week`, `this_month`, `last_month`, `this_quarter`, `this_year`, `last_year`  
Aliases: `week`, `month`, `year`, `last_month`, `Last Month`

**Use in UI:**

- Donut centre: `data.distribution.totalRevenue`
- Segments: `data.distribution.segments[]` → `label`, `amount`, `percentage`, `count`
- Line chart: `data.weeklyComparison.buckets[]` → `week`, `currentAmount`, `previousAmount`

**Permissions:** `dashboard:view` or `payments:view`

---

## 4. Admin Payment History

| Screen | API |
|--------|-----|
| Admin payment table | `GET /admin/payments/list?page=1&limit=50&sort=createdAt:desc` |
| Vendor payments | `GET /payments` (vendor token only) |

- Omit `status` query to show all statuses.
- Optional filter: `manufacturerId`, `search`, `paymentType`.
- Rows include `manufacturerName`, `urnNo`, `quoteTotal`, `paymentType`.

**Permission:** `payments:view`

---

## 5. Next.js proxy (optional)

```js
// next.config.js — adjust target to your API
async rewrites() {
  return [
    { source: '/api/admin/:path*', destination: 'http://localhost:3000/admin/:path*' },
    { source: '/api/website/:path*', destination: 'http://localhost:3000/website/:path*' },
  ];
}
```

Then `NEXT_PUBLIC_API_URL = '/api'` in the frontend.

---

## 6. Pre-launch checklist

- [ ] RBAC roles include `summits:*` for summit admins
- [ ] Summit list loads from API (not localStorage)
- [ ] Create redirects to `/dashboard/summit/[id]` with returned `id`
- [ ] Section Save calls section PATCH; Final Submit calls full PATCH
- [ ] Files uploaded via multipart before saving section with URLs
- [ ] Public `/events/[slug]` uses `GET /website/summits/:slug`
- [ ] Revenue page uses `distribution` + `weeklyComparison`
- [ ] Payment History uses `/admin/payments/list`
- [ ] 401 → login; 403 → “no permission”; 409 slug → inline field error
