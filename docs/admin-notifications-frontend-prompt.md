# Admin portal — notifications frontend update prompt

Copy this into your **admin** repo agent / task. Backend: `cursor-greenpro-mern` (Nest). UI: `admin/` on port `3004` (or your env).

---

## Goal

Wire the admin bell and notifications page to **`/admin/notifications` only** (never `/vendor/notifications/*`). Use numeric **`seen`**: **`0` = unseen**, **`1` = seen**.

---

## API base

- Base URL: same as other admin APIs (e.g. `http://localhost:3000`).
- Auth: `Authorization: Bearer <admin-jwt>` on every call.
- Responses are wrapped by the global interceptor:

```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "totalCount": 42,
  "currentPage": 1,
  "totalPages": 3,
  "unreadCount": 3
}
```

---

## Endpoints

| Action | Method | Path |
|--------|--------|------|
| List (bell + page) | `GET` | `/admin/notifications` |
| Mark one read | `PATCH` | `/admin/notifications/{_id}/seen` |
| Mark all read | `PATCH` | `/admin/notifications/seen-all` |

`{_id}` = MongoDB ObjectId string from list item (24 hex chars), field **`_id`** or **`id`** (both are the same string).

---

## `GET /admin/notifications`

### Query (all optional)

| Param | Example | Notes |
|-------|---------|--------|
| `page` | `1` | Default `1` |
| `limit` | `20` / `8` / `50` | Bell dropdown: `8`; dashboard poll: `50`; page: `20` |
| `range` | `all` | `all` \| `today` \| `week` \| `30d` \| `90d` |
| `seen` | — | **Do not send** unless you need a filter. If sent: `true` / `false` (HTTP boolean), not `0`/`1`. |

**Do not use** `?seen=false` for the badge — use root **`unreadCount`**.

### List item shape

```ts
type AdminNotification = {
  _id: string;
  id: string; // same as _id
  title: string;
  message: string;
  name: string;       // display name, e.g. manufacturer
  role: string;       // e.g. "Manufacturer" | "Admin"
  type: string;
  source: string;
  seen: 0 | 1;        // 0 = unseen, 1 = seen
  seenAt: string | null;
  createdAt: string;
  referenceType?: string | null;
  referenceId?: string | null;
  actorName?: string | null;
};
```

### Read state helpers

```ts
export const isUnread = (n: { seen: number }) => n.seen === 0;
export const isRead = (n: { seen: number }) => n.seen === 1;
```

**Do not** treat `seen` as boolean. Legacy rows may exist in DB as `0`/`1` only.

### Bell badge

```ts
const res = await api.get('/admin/notifications', {
  params: { range: 'all', page: 1, limit: 50 },
});
const unreadCount = res.unreadCount ?? 0; // root level, not inside data
```

---

## `PATCH /admin/notifications/{_id}/seen`

When user clicks one item in the bell (before navigation):

```ts
await api.patch(`/admin/notifications/${notification._id}/seen`);
// Response root:
// { success: true, id: "...", seen: 1 }
```

Then decrement local badge or refetch `GET` for accurate `unreadCount`.

---

## `PATCH /admin/notifications/seen-all`

When user opens **`/dashboard/notifications`** (full page) or “Read all”:

```ts
const res = await api.patch('/admin/notifications/seen-all');
// { success: true, markedCount: 3 }
```

Then `GET` again; expect **`unreadCount: 0`** and every row **`seen: 1`**.

**Fallback** (only if `seen-all` returns 404): loop `PATCH .../{_id}/seen` for each item with `seen === 0`.

---

## Suggested changes in `admin/lib/notifications.ts`

1. **Remove** any `GET /vendor/notifications` or `PATCH /vendor/notifications/...` URLs.
2. **Parse** list from `response.data` (array), pagination from `totalCount`, `currentPage`, `totalPages`, badge from **`response.unreadCount`**.
3. **Normalize** `seen` when parsing (defensive):

```ts
function normalizeSeen(raw: unknown): 0 | 1 {
  if (raw === 1 || raw === '1' || raw === true) return 1;
  return 0;
}
```

4. **Mark one**: `PATCH /admin/notifications/${_id}/seen` using `_id` from the row (not `referenceId`).
5. **Mark all on page open**: call `seen-all` once per visit (guard with a ref so pagination does not re-trigger mark-all).
6. **Types**: `seen: 0 | 1` everywhere; remove `boolean` for `seen`.

---

## UI behavior checklist

| User action | API |
|-------------|-----|
| App load / bell poll (60s) | `GET ...?range=all&page=1&limit=50` → show `unreadCount` |
| Open bell dropdown | `GET ...&limit=8` |
| Click one notification | `PATCH .../{_id}/seen` → navigate to notifications page |
| Open notifications page | `PATCH .../seen-all` then `GET ...&page=1&limit=20` |
| Change time filter / page | `GET` only |

Style unread rows: `seen === 0` (e.g. bold / green dot). Read: `seen === 1`.

---

## Common bugs to fix

| Bug | Fix |
|-----|-----|
| Badge stuck | Read **`unreadCount`** from GET root, not `data.length` or `?seen=false` |
| PATCH 404 | Use Mongo **`_id`** from list; restart backend if route missing |
| `Cannot PATCH` | Ensure path is `/admin/notifications/...` not `/vendor/...` |
| Treating `seen` as boolean | Use **`0` / `1`** only |
| Mark-all on every page change | Only on first mount of notifications page |

---

## Acceptance (manual)

1. 3 unread in DB → GET shows `unreadCount: 3`, each item `seen: 0`.
2. PATCH one id → GET shows `unreadCount: 2`, that row `seen: 1`.
3. PATCH seen-all → GET shows `unreadCount: 0`, all `seen: 1`.
4. Vendor token → admin notification routes return 401/403.

---

## Backend doc

See `docs/backend_changes_notifications.md` in the API repo for server-side details.
