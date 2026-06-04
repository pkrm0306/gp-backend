# Audit Log API Documentation

There is **one public audit log endpoint**. Audit entries are **not created via API** — they are written automatically by the global HTTP interceptor on mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`).

**Swagger UI:** `http://localhost:3000/api`  
**Tag:** `Admin Audit Log`

---

## List audit log entries

### `GET /admin/audit-log`

Returns a paginated, append-only audit trail for admin/staff users. By default, it returns the latest one month of data.

### Authentication

| Header | Value |
|--------|--------|
| `Authorization` | `Bearer <JWT access token>` |

### Authorization

- Roles allowed: `admin`, `staff`
- Returns `401` if not authenticated
- Returns `403` if role is not allowed

---

## Query parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number (min: 1) |
| `limit` | number | `20` | Items per page (min: 1, max: 100) |
| `action` | string | — | Technical action code (e.g. `AUTH_LOGIN`, `PAYMENT_UPDATED`, `HTTP_MUTATION`) |
| `module` | string | — | User-facing module bucket (see module list below) |
| `action_type` | string | — | User-facing verb: `create`, `update`, `delete`, `approve`, `reject`, `login` |
| `actor_user_id` | string | — | Filter by user id (matches `actor.user_id` or `performed_by.user_id`) |
| `resource_type` | string | — | Resource type (e.g. `Product`, `Payment`, `ActivityLog`) |
| `resource_id` | string | — | Resource id |
| `urn_no` | string | — | URN number on linked resource |
| `from` | ISO date string | one month before `to`/now | Start of date range (`occurred_at >= from`) |
| `to` | ISO date string | current server time | End of date range (`occurred_at <= to`) |

Results are sorted by **`occurred_at` descending** (newest first).

---

## Example requests

```http
GET /admin/audit-log?page=1&limit=20
Authorization: Bearer <token>
```

```http
GET /admin/audit-log?module=auth&action_type=login&page=1&limit=20
Authorization: Bearer <token>
```

```http
GET /admin/audit-log?module=banner&from=2026-06-01T00:00:00.000Z&to=2026-06-03T23:59:59.999Z
Authorization: Bearer <token>
```

```http
GET /admin/audit-log?urn_no=URN-2024-001&page=1&limit=50
Authorization: Bearer <token>
```

```http
GET /admin/audit-log?actor_user_id=64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <token>
```

---

## Success response — `200 OK`

```json
{
  "success": true,
  "message": "Audit log retrieved",
  "data": [
    {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d1",
      "occurred_at": "2026-06-03T06:30:00.000Z",
      "action": "AUTH_LOGIN",
      "outcome": "success",
      "module": "auth",
      "action_type": "login",
      "entity_name": "admin@example.com",
      "description": "Signed in successfully",
      "performed_by": {
        "email": "admin@example.com"
      },
      "http_method": "POST",
      "route": "/auth/login",
      "status_code": 200,
      "request": {
        "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
        "ip": "::1",
        "user_agent": "Mozilla/5.0 ..."
      },
      "metadata": {
        "duration_ms": 396,
        "body_fields": ["email"]
      },
      "new_values": null,
      "user_display": "admin@example.com",
      "action_display": "login"
    }
  ],
  "meta": {
    "totalCount": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "from": "2026-05-03T06:30:00.000Z",
    "to": "2026-06-03T06:30:00.000Z"
  },
  "pagination": {
    "totalCount": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  },
  "totalCount": 142,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

## Response fields

### Top-level

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |
| `message` | string | `"Audit log retrieved"` |
| `data` | array | Audit log entries |
| `pagination.totalCount` | number | Total matching records |
| `pagination.page` | number | Current page |
| `pagination.limit` | number | Page size |
| `pagination.totalPages` | number | Total pages |
| `totalCount` | number | Total matching records, repeated at top level for list UI compatibility |
| `page` | number | Current page, repeated at top level |
| `limit` | number | Page size, repeated at top level |
| `totalPages` | number | Total pages, repeated at top level |
| `meta.totalCount` | number | Total matching records |
| `meta.page` | number | Current page |
| `meta.limit` | number | Page size |
| `meta.totalPages` | number | Total pages |
| `meta.from` | string (ISO date) | Effective start date used by the query |
| `meta.to` | string (ISO date) | Effective end date used by the query |

### Each item in `data`

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | MongoDB document id |
| `occurred_at` | string (ISO date) | When the action happened |
| `action` | string | Stable technical action code |
| `outcome` | `"success"` \| `"failure"` | Whether the HTTP request succeeded |
| `module` | string | User-facing module bucket |
| `action_type` | string | User-facing verb |
| `entity_name` | string | Related entity label (email, name, URN, id, etc.) |
| `description` | string | Human-readable summary |
| `performed_by` | object | Who performed the action |
| `performed_by.user_id` | string | User id |
| `performed_by.name` | string | User name |
| `performed_by.email` | string | User email |
| `old_values` | object | Previous values (when captured) |
| `new_values` | object \| null | New values (sanitized body snapshot), returned as `null` when absent. Known id fields are enriched to display names in the API response. `updateStatusTo` is shown as the certification status label. |
| `http_method` | string | `POST`, `PUT`, `PATCH`, `DELETE` |
| `route` | string | Request path |
| `status_code` | number | HTTP status code |
| `actor` | object | JWT actor context |
| `actor.user_id` | string | Authenticated user id |
| `actor.role` | string | User role |
| `actor.vendor_id` | string | Vendor id (if applicable) |
| `actor.manufacturer_id` | string | Manufacturer id (if applicable) |
| `resource` | object | Linked resource |
| `resource.type` | string | e.g. `Product`, `Payment` |
| `resource.id` | string | Resource identifier |
| `resource.urn_no` | string | URN when relevant |
| `request.correlation_id` | string | Request trace id (`X-Request-Id`) |
| `request.ip` | string | Client IP |
| `request.user_agent` | string | Browser/client user agent |
| `changes` | object | Optional change summary |
| `metadata` | object | Extra context (`duration_ms`, `body_fields`, `error_message`) |
| `user_display` | string \| null | Convenience field for UI: name → email → user_id |
| `action_display` | string \| null | Same as `action_type`, for UI columns |

---

## Module values (`module`)

| Value | Covers |
|-------|--------|
| `admin` | General admin routes under `/admin` |
| `activity_log` | Certification activity log writes |
| `article` | Website articles |
| `auth` | Login, register, OTP, password reset |
| `banner` | Website banners |
| `category` | Categories |
| `certification` | URN status changes |
| `contact` | Contact form submissions |
| `country` | Countries |
| `dashboard` | Vendor/admin dashboard |
| `document` | Document uploads/deletes |
| `event` | Website events |
| `gallery` | Website gallery |
| `manufacturer` | Manufacturer CRUD |
| `manufacturer_inquiry` | Manufacturer inquiry form |
| `newsletter` | Newsletter subscriptions |
| `partner` | Partners |
| `payment` | Payments |
| `process` | Process-* certification steps |
| `product` | Product registration/design/performance |
| `raw_materials` | Raw materials steps |
| `rbac` | Role/permission management |
| `sector` | Sectors |
| `standard` | Standards |
| `state` | States |
| `summit` | Summits |
| `team_member` | Team members |
| `user` | Vendor user actions |
| `website` | Other website content |
| `zoho` | Zoho webhooks/integration |
| `other` | Unmapped routes (fallback) |

---

## Action type values (`action_type`)

| Value | Meaning |
|-------|---------|
| `create` | POST created something |
| `update` | PUT/PATCH changed something |
| `delete` | DELETE removed something |
| `approve` | Certification/URN approved or advanced |
| `reject` | Certification/URN rejected |
| `login` | User sign-in |

---

## `new_values.updateStatusTo` labels

When `new_values` contains `updateStatusTo`, the API response maps the numeric status to:

| Value | Label |
|-------|-------|
| `0` | `Proposal Pending` |
| `1` | `Registration Payment Pending` |
| `2` | `Approve Registration Payment Pending` |
| `3` | `Process Form In Progress` |
| `4` | `Check Process Forms` |
| `5` | `Vendor Response Pending` |
| `6` | `Final Verification Pending` |
| `7` | `Certificate Payment Pending` |
| `8` | `Approve Certificate Fee` |
| `9` | `Payment Rejected` |
| `11` | `Certification Fee Approved` |

---

## Technical action codes (`action`)

| Code | When used |
|------|-----------|
| `AUTH_LOGIN` | `POST /auth/login` |
| `AUTH_REFRESH` | `POST /auth/refresh` (skipped from logging) |
| `AUTH_REGISTER_VENDOR` | `POST /auth/register-vendor` |
| `AUTH_VERIFY_OTP` | `POST /auth/verify-otp` |
| `AUTH_FORGOT_PASSWORD` | `POST /auth/forgot-password` |
| `PAYMENT_CREATED` | `POST /payments` |
| `PAYMENT_UPDATED` | `PATCH /payments/:urn` |
| `PRODUCT_URN_STATUS_UPDATED` | URN status PATCH routes |
| `ACTIVITY_LOG_CREATED` | `POST /activity-log` |
| `HTTP_MUTATION` | Default for other mutating routes |

---

## Error responses

| Status | When |
|--------|------|
| `401 Unauthorized` | Missing or invalid JWT |
| `403 Forbidden` | Authenticated but not `admin` or `staff` |
| `400 Bad Request` | Invalid query params (e.g. bad date format, limit > 100) |

---

## Important notes

1. **Read-only API** — There is no `POST /admin/audit-log`. Entries are inserted automatically by the audit interceptor.
2. **GET requests are not audited** — Only `POST`, `PUT`, `PATCH`, `DELETE` create audit rows.
3. **Website routes are not audited** — Routes under `/website` are intentionally skipped.
4. **Sensitive data is excluded** — Passwords, tokens, OTP, etc. are never stored in `new_values` or metadata.
5. **Append-only** — Documents in `audit_log` are never updated or deleted by normal app code.
6. **Admin grid columns** — Recommended display: `occurred_at` | `user_display` | `module` | `action_type` | `description` | `request.ip`

---

## Suggested admin UI filters

| Filter UI | Query param |
|-----------|-------------|
| Module dropdown | `module` |
| Action dropdown | `action_type` |
| User search | `actor_user_id` |
| URN search | `urn_no` |
| Date range | `from`, `to` |
| Pagination | `page`, `limit` |

---

## Related docs

- [Activity log vs audit log](./activity-log-vs-audit-log.md)
- [Audit log implementation prompt](./audit-log-implementation-prompt.md)
