# Frontend: Summit slug removed — publish / activate

## What changed (backend)

The admin **slug field is removed**. The API **auto-generates** the public URL slug from:

- **Title** + **Year** → e.g. `GreenPro Summit` + `2026` → `greenpro-summit-2026`

On **publish** (`PATCH /admin/summits/:id/status` with `{ "status": "active" }`) or **final submit** with `basic.status: "active"`, the backend:

1. Rebuilds the slug from current title/year
2. Ensures it is unique (adds `-2`, `-3`, … only if needed)
3. Activates the summit

You do **not** send `slug` on create or update.

---

## Frontend fixes required

### 1. Remove slug from forms

- **Create:** `POST /admin/summits` body = `{ year, title, date?, location? }` only
- **Edit basic / publish:** do not include `slug` in PATCH bodies
- Remove any client-side “slug already in use” validation tied to a slug input

### 2. Remove this error handling (obsolete)

Delete UI logic that shows:

> This summit URL slug is already in use. Please contact support if this persists.

That was for manual slug entry. The API now returns **409** with:

```json
{
  "message": "Summit URL already exists",
  "errors": {
    "basic.title": "Another summit already uses this title and year. Change the title or year and try again."
  }
}
```

Map `errors['basic.title']` to the **title** field (or a general banner), not a slug field.

### 3. Publish flow

```ts
// Publish (make visible on public site)
await fetch(`${API}/admin/summits/${id}/status`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ status: 'active' }),
});
```

**Before publish**, ensure basic section has:

- `title` (min 2 chars)
- `year` (4-digit)
- `date` (`YYYY-MM-DD`)

Backend returns **400** with `errors['basic.date']` etc. if missing.

### 4. Display slug (read-only, optional)

`GET /admin/summits/:id` still returns `slug` for preview links:

```ts
const publicUrl = `/summits/${data.slug}`; // or /events/[slug] per your routes
```

Show as read-only “Public URL” if helpful — **not editable**.

### 5. Year uniqueness

Only **one summit per calendar year**. Duplicate year returns **409** on `errors['basic.year']`. Use `GET /admin/summits/meta?excludeSummitId=:id` for year dropdown (`occupiedYears`).

---

## Test checklist

1. Create summit without slug field → success
2. Fill banners/sections → **Publish** → success (no slug error)
3. Two summits same title, **different years** → both publish
4. Same title **and** same year → 409 on year or title message
5. Public site loads `GET /website/summits/{slug}` from returned slug
