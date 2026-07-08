# Website — Summits (public frontend integration)

Use this guide to build the **public website** summits index and detail pages. These APIs are **separate from admin** (`/admin/summits/*`). Only summits with **`status: active`** appear (legacy DB value `published` is treated as active).

**Base URL:** `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3000`). Add `/api` if your proxy uses it.

**Auth:** None required.

**Success envelope:**

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

List responses also include top-level **`pagination`** (same pattern as events).

---

## 1. Endpoints

| Purpose | Method | Path |
|--------|--------|------|
| **Summit cards / index** | `GET` | `/website/summits/list` |
| Same (alias) | `GET` | `/website/public/summits/list` |
| **Summit detail page** | `GET` | `/website/summits/:slug` |

Do **not** call `/admin/summits/*` on the public site.

---

## 2. List API — active summits only

```http
GET /website/summits/list?page=1&limit=12
```

Optional query:

| Param | Type | Default | Notes |
|-------|------|---------|--------|
| `page` | number | `1` | 1-based |
| `limit` | number | `12` | Max `50` |
| `year` | string | — | e.g. `2026` |
| `search` | string | — | title, slug, location |

### Example response

```json
{
  "success": true,
  "message": "Summits retrieved successfully",
  "data": [
    {
      "s_no": 1,
      "id": "6a1e219d36a2b90a0399791c",
      "year": "2026",
      "title": "GreenPro Summit 2026",
      "slug": "greenpro-summit-2026",
      "date": "2026-03-15",
      "location": "New Delhi",
      "coverImageUrl": "http://localhost:3000/uploads/summits/.../banner.jpg",
      "excerpt": "Short plain-text summary from About Summit..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "perPage": 12,
    "total": 3,
    "totalPages": 1
  }
}
```

### Frontend list page (`/summits` or `/events/summits`)

1. On mount, `fetch` list with `page` / `limit` (and optional `year` / `search`).
2. Render a **card grid** per row:
   - Image: `coverImageUrl` (fallback placeholder if null)
   - Title: `title`
   - Meta: `date` (format for locale), `location`, `year` badge
   - Teaser: `excerpt` (2 lines max in CSS)
   - Link: **`/summits/${slug}`** (use `slug`, not `id`)
3. Pagination: use `pagination.page`, `pagination.totalPages`, `pagination.total`.
4. Empty state when `data.length === 0` — “No summits available”.
5. **Do not show** inactive summits — the API already filters; no client-side status check needed.

```ts
const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchSummitList(params?: {
  page?: number;
  limit?: number;
  year?: string;
  search?: string;
}) {
  const q = new URLSearchParams();
  q.set('page', String(params?.page ?? 1));
  q.set('limit', String(params?.limit ?? 12));
  if (params?.year) q.set('year', params.year);
  if (params?.search) q.set('search', params.search);

  const res = await fetch(`${API}/website/summits/list?${q}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to load summits');
  const json = await res.json();
  return {
    items: json.data as SummitCard[],
    pagination: json.pagination,
  };
}

type SummitCard = {
  s_no: number;
  id: string;
  year: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  coverImageUrl: string | null;
  excerpt: string;
};
```

---

## 3. Detail API — by slug

```http
GET /website/summits/greenpro-summit-2026
```

- Returns **404** if slug missing, deleted, or **inactive**.
- `data` is the full summit document with **`visibleSections`** and **`sectionVisibility`** — render only sections that are `true` / listed in `visibleSections`.

### Key fields

| Area | Fields |
|------|--------|
| Hero | `basic.title`, `basic.date`, `basic.location`, `basic.year`, `banners[]` |
| Downloads | `industrialPdfs`, `buildingsPdfs` |
| Rich text | `aboutGreenPro`, `aboutSummit`, `agenda` → `{ title, content }` (HTML) |
| Lists | `highlights`, `areaPoints`, `eventOutcomes` (+ `*Title` fields) |
| People | `speakers[]` → `name`, `sub`, `tags`, `imageUrl` |
| Partners | `sponsors[]` → `name`, `tier`, `logoUrl` |

### Section nav

Use `data.visibleSections` (ordered keys) to build tabs or anchor nav, e.g.:

`banners` → `downloads` → `about-greenpro` → `about-summit` → `highlights` → `focused-area` → `event-outcomes` → `speakers` → `agenda` → `sponsors`

Skip sections not in the array.

```ts
export async function fetchSummitBySlug(slug: string) {
  const res = await fetch(`${API}/website/summits/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load summit');
  const json = await res.json();
  return json.data;
}
```

### Detail page route

- Next.js App Router: `app/summits/[slug]/page.tsx`
- Load `fetchSummitBySlug(params.slug)`; `notFound()` if null.

---

## 4. Admin vs website

| | Admin | Website |
|---|--------|---------|
| Base | `/admin/summits` | `/website/summits` |
| Auth | Bearer JWT | None |
| Status | `active` + `inactive` | **active only** |
| List fields | Includes `status`, counts | Card: cover, excerpt, no status |

Publishing on the admin panel: set summit to **Active** (`PATCH /admin/summits/:id/status` with `{ "status": "active" }`) before it appears on the website.

---

## 5. UI checklist

- [ ] List page uses `GET /website/summits/list` (or `/website/public/summits/list`)
- [ ] Cards link to `/summits/[slug]`
- [ ] Detail uses `GET /website/summits/:slug`
- [ ] Render HTML sections with a safe HTML renderer (e.g. DOMPurify)
- [ ] Banner carousel from `banners[]` (image only, no title overlay required)
- [ ] Speaker chips from `tags[]`
- [ ] 404 page for unknown / inactive slugs
- [ ] No admin token on these requests

---

## 6. Swagger

Open `{API_BASE}/api` → tags **Website Summits** and **Website**.
