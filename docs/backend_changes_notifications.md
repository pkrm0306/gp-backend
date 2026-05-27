# Lifecycle notifications (vendor certification workflow)

## Admin in-app API (admin portal only)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/admin/notifications` | Paginated feed + root **`unreadCount`** |
| `PATCH` | `/admin/notifications/{id}/seen` | Mark one read (`id` = MongoDB `_id`) |
| `PATCH` | `/admin/notifications/seen-all` | Mark all unread read |

Vendor routes (`/vendor/notifications/*`) are **removed**. Lifecycle events send **email** to vendors; admin bell uses `notifications` collection.

### `GET /admin/notifications`

Query: `page`, `limit`, `range` (`all` \| `today` \| `week` \| `30d` \| `90d`). Optional `seen` (`true` \| `false`) — returns **200** when used.

Response (after global interceptor):

```json
{
  "success": true,
  "data": [
    {
      "_id": "674a1b2c3d4e5f6789012345",
      "title": "New Registration",
      "message": "A New Acme Co Has Been Registered In The Portal",
      "name": "Acme Co",
      "role": "Manufacturer",
      "seen": 0,
      "seenAt": null,
      "createdAt": "2026-05-20T10:30:00.000Z"
    }
  ],
  "totalCount": 42,
  "currentPage": 1,
  "totalPages": 3,
  "unreadCount": 3
}
```

- **`unreadCount`**: unread rows matching **`range`** only (ignores `seen` query param).
- **`seen`**: `0` = unseen, `1` = seen (number per row).
- Index: `{ seen: 1, createdAt: -1 }`.

### `PATCH /admin/notifications/{id}/seen`

Returns `{ success: true, id, seen: 1 }` at root (plus `message`).

### `PATCH /admin/notifications/seen-all`

Returns `{ success: true, markedCount }`. Next `GET` must show **`unreadCount: 0`**.

---

## Templates (email)

| Code | Email | Admin feed row | Trigger |
|------|-------|----------------|---------|
| `USER_CREATED` | Yes | No | `POST /auth/register-vendor` |
| `VENDOR_REGISTRATION_COMPLETE` | Yes | Yes (after OTP) | `POST /auth/verify-otp` |
| `URN_INITIAL_APPROVED` | Yes | No | Admin `urn_status` → **2** |
| `URN_SUBMITTED_FOR_REVIEW` | Yes | Yes | Vendor `urn_status` → **4** |
| `CERTIFICATION_PAYMENT_SUBMITTED` | Yes | Yes | Certification payment submit |
| `CERTIFICATION_PAYMENT_APPROVED` | Yes | No | Admin approves certification payment |

## Admin feed copy

`src/notifications/helpers/admin-notification-messages.ts` — manufacturer name in title/message (not “Vendor”).

## Modified files (notifications)

- `src/common/schemas/notification.schema.ts` — `seen`, `seenAt`
- `src/admin/admin.service.ts` — list, mark one, mark all
- `src/admin/admin.controller.ts`
- `src/admin/helpers/admin-notification.util.ts`
- `src/common/interceptors/response.interceptor.ts` — passes `unreadCount`, `markedCount`
- `src/admin/dto/list-notifications-query.dto.ts` — optional `seen`
