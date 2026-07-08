# Website — Team members sectors (public frontend integration)

Use this guide to update the **public website** team / about page so it uses **sector** data from the backend. Backend change is already deployed on the API: `GET /website/team-members/list` now returns sector fields on every active team member.

**Base URL:** `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3000`). Add `/api` only if your Next.js proxy rewrites require it.

**Auth:** None.

**Success envelope:**

```json
{
  "success": true,
  "message": "Success",
  "data": [ ]
}
```

---

## 1. Endpoint

| Purpose | Method | Path |
|--------|--------|------|
| All active team members (website) | `GET` | `/website/team-members/list` |

Do **not** use `/admin/team-members/*` on the public site.

**Optional legacy endpoint (avoid for new work):** `GET /api/team-members/by-category/:categoryId` filters by old category ids. Prefer sector filtering client-side from the single list response below.

---

## 2. Response shape (each item in `data`)

```json
{
  "s_no": 1,
  "id": "507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "designation": "Director",
  "email": "jane@example.com",
  "mobile": "+919876543210",
  "displayOrder": 1,
  "team": "administrative",
  "image": "http://localhost:3000/uploads/team-members/photo.jpg",
  "facebookUrl": "",
  "twitterUrl": "",
  "linkedinUrl": "",
  "sector_ids": [1, 3],
  "sectorIds": [1, 3],
  "sector_id": 1,
  "sector_name": "Building",
  "sectors": [
    { "id": 1, "name": "Building" },
    { "id": 3, "name": "Consumer Products" }
  ]
}
```

### Field notes

| Field | Type | Use on frontend |
|-------|------|-----------------|
| `displayOrder` | number | Sort within a section (ascending). Backend list is already sorted; re-sort after client filters if needed. |
| `team` | string | **Internal org team** — one of `administrative`, `technical`, `finance`, `marketing`. Not the same as product sector. |
| `sector_ids` / `sectorIds` | `number[]` | **Filter keys.** A member can belong to multiple sectors. |
| `sector_id` | `number \| null` | Primary sector (first in `sector_ids`), or `null` if none assigned. |
| `sector_name` | `string \| null` | Label for primary sector only. |
| `sectors` | `{ id, name }[]` | **Preferred for UI labels** (badges, tabs, tooltips). |
| `image` | `string \| null` | Full URL or site-relative path; handle null with placeholder avatar. |

### Fixed sector id → name map (CMS)

These ids are stable; you may hardcode for tabs/filters without a separate API call:

| id | name |
|----|------|
| 1 | Building |
| 2 | Industries |
| 3 | Consumer Products |
| 4 | Facility Services |

Members with **no** sectors: `sector_ids: []`, `sector_id: null`, `sector_name: null`, `sectors: []`. Decide UX: hide from sector tabs, show under “All”, or show in an “Unassigned” bucket.

---

## 3. What to implement

### 3.1 Types

Add/update a shared type, e.g. `WebsiteTeamMember`:

```ts
export type TeamMemberSector = { id: number; name: string };

export type WebsiteTeamMember = {
  s_no: number;
  id: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  displayOrder: number;
  team: 'administrative' | 'technical' | 'finance' | 'marketing' | string;
  image: string | null;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  sector_ids: number[];
  sectorIds: number[];
  sector_id: number | null;
  sector_name: string | null;
  sectors: TeamMemberSector[];
};

export const TEAM_MEMBER_SECTOR_OPTIONS = [
  { id: 1, name: 'Building' },
  { id: 2, name: 'Industries' },
  { id: 3, name: 'Consumer Products' },
  { id: 4, name: 'Facility Services' },
] as const;
```

### 3.2 API client

- Fetch: `GET ${API_URL}/website/team-members/list`
- Parse `response.data` (array). Guard: `Array.isArray(data) ? data : []`.
- Do not assume old responses include sector fields; treat missing `sectors` as `[]`.

### 3.3 Sector filtering (tabs / pills)

If the team page has sector tabs (Building, Industries, Consumer Products, Facility Services):

```ts
function membersForSector(
  members: WebsiteTeamMember[],
  sectorId: number,
): WebsiteTeamMember[] {
  return members
    .filter((m) => m.sector_ids?.includes(sectorId))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.s_no - b.s_no);
}
```

- **“All” tab:** show every member sorted by `displayOrder`.
- **Sector tab:** show members where `sector_ids` includes that id.
- **Multi-sector member:** appears on **each** relevant tab (do not dedupe globally unless design requires it).

### 3.4 UI display

- Show one or more sector badges using `member.sectors.map(s => s.name)`.
- Prefer `sectors` over `sector_name` when showing all assigned sectors.
- Keep existing card fields (name, designation, image, social links, email/phone if shown).

### 3.5 Do not confuse `team` vs `sectors`

- `team` = admin grouping (administrative / technical / finance / marketing).
- `sectors` = product areas for the public website.
- Only change sector-related UI unless product explicitly asks to filter by `team`.

---

## 4. Suggested file touch list (adjust paths to your repo)

| Area | Action |
|------|--------|
| `lib/api/teamMembers.ts` (or similar) | Extend response type; no query params needed. |
| Team / About page component | Wire sector tabs to `sector_ids` filter. |
| Team member card | Render `sectors` as chips/badges. |
| Constants | Add `TEAM_MEMBER_SECTOR_OPTIONS` (table above). |

---

## 5. Test plan

1. Call `GET /website/team-members/list` locally and confirm each item has `sector_ids` and `sectors`.
2. Assign a member **Consumer Products (3)** and **Facility Services (4)** in admin; confirm they appear on both sector tabs on the website.
3. Member with empty sectors: confirm “All” still lists them; sector tabs behave per chosen UX.
4. Sort: within a tab, order matches `displayOrder` from admin.
5. Regression: images and social links still render; empty state when `data: []`.

---

## 6. Example fetch (React)

```ts
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/website/team-members/list`);
const json = await res.json();
const members: WebsiteTeamMember[] = Array.isArray(json?.data) ? json.data : [];
```

---

## 7. Out of scope

- Admin team member CRUD (already supports sectors in admin portal).
- `GET /admin/team-members/sectors` — admin-only; website can use the hardcoded id map above.
