# Prompt: Implement app-wide audit logging (NestJS + MongoDB)

Use this document as a **specification prompt** for implementing an **audit log** across **all feature modules** in the GreenPro MERN API. It is separate from the existing **`activity_log`** collection, which remains dedicated to **certification / URN lifecycle** milestones.

---

## Context

- **Stack:** NestJS, Mongoose, JWT auth, existing `ActivityLogModule` with collection `activity_log` (vendor/manufacturer-scoped, URN workflow).
- **Goal:** Add an **append-only audit trail** for **security and compliance**: who did what, when, on which resource, with request context—not for product timeline UX.
- **App modules to cover (import in `AppModule`):** `Auth`, `Manufacturers`, `VendorUsers`, `Partners`, `Admin`, `States`, `Categories`, `Countries`, `ProductRegistration`, `Payments`, `ActivityLog`, `ProductDesign`, `ProductPerformance`, `RawMaterialsHazardousProducts`, all `Process*` modules, `ProcessComments`, `Website`, `Dashboard`, `Sectors`, `Standards`—and any new modules.

---

## Requirements

### 1. New domain: `audit_log` collection

- **Collection name:** `audit_log` (or `audit_logs`; pick one and use consistently).
- **Immutability:** Application code must **only insert** documents. No updates or deletes via normal APIs (admin “purge” may be a separate, highly restricted batch job if ever needed).
- **Schema (minimum fields; adjust types to match project conventions):**
  - `occurred_at` — `Date` (server time; index with TTL optional later).
  - `action` — string enum or namespaced string, e.g. `AUTH_LOGIN`, `PRODUCT_URN_STATUS_UPDATED`, `PAYMENT_PATCHED`, `CATEGORY_CREATED`.
  - `outcome` — `success` | `failure` (or boolean + optional `error_code`).
  - `http_method`, `route` — optional but useful for HTTP-triggered events.
  - `status_code` — optional number for HTTP responses.
  - `actor` — subdocument or flat fields: `user_id` (ObjectId or string), `role`, `vendor_id` / `manufacturer_id` if present in JWT (nullable for anonymous routes).
  - `resource` — `type` (string, e.g. `Product`, `Payment`, `Category`), `id` (string or ObjectId), optional `urn_no` when relevant.
  - `request` — `request_id` / `correlation_id` (uuid), `ip`, `user_agent` (truncate if long).
  - `changes` — optional **sanitized** summary (e.g. list of field names changed, or small before/after for non-sensitive fields). **Do not** store passwords, tokens, full payment card data, or large blobs.
  - `metadata` — optional small JSON for extra context (keep small; index only what you query).

Add MongoDB indexes appropriate for common queries, e.g. `(resource.type, resource.id, occurred_at)`, `(actor.user_id, occurred_at)`, `(action, occurred_at)`.

### 2. `AuditLogModule` (global or imported once)

- **`AuditLogService`:** `record(entry: CreateAuditLogDto | AuditLogPayload): Promise<void>` that inserts one document.
- **Failure policy:** Logging must **not** break the main request. On DB failure: log to application logger; optionally queue retry (future). Never throw to the client solely because audit insert failed.
- **DTO / validation:** Internal DTO for typed payloads; no need to expose full audit write API to clients unless product requires an admin “replay” API later.

### 3. Cross-cutting capture (all modules)

Implement **at least one** of these patterns (prefer **A + B**):

- **A — Global HTTP interceptor** (after response): For authenticated routes, record one row per request with `method`, `route`, `status_code`, `actor` from request user, `duration_ms`, and optionally **redacted** body size hash—not full body. **Skip** or sample high-traffic read-only routes (`GET` health, static lists) via config or path allowlist to control volume.
- **B — `Audit()` decorator + interceptor or guard:** On **mutating** and **sensitive** handlers (`POST`/`PATCH`/`PUT`/`DELETE`, login, password change, role change, payment updates), attach structured `action` and `resourceType`. The interceptor reads metadata and calls `AuditLogService.record` with richer `action` than generic HTTP rows.
- **C — Service-layer helper:** `auditLog.recordFromService({ action, resource, changes, actor })` for transactions where HTTP context is insufficient (e.g. background jobs, webhooks).

Ensure **anonymous** routes (e.g. some `Website` or `Auth` login) still log **attempts** with `actor` null or partial, without leaking credentials.

### 4. Integration per module (concrete expectations)

- **Auth:** login success/failure, refresh, logout if applicable; never store password or raw token.
- **VendorUsers / Admin:** user create/update/disable, role changes.
- **Manufacturers, Partners:** create/update/delete of org records.
- **Categories, Sectors, Standards, Countries, States:** admin mutations.
- **ProductRegistration / ProductDesign / ProductPerformance / Process* / RawMaterials* / ProcessComments:** create/update/delete that affects certification data; link `urn_no` when available.
- **Payments:** create/update payment rows; action names distinct from generic HTTP log.
- **Payments + ProductRegistration:** when URN status changes via payment or admin patch, audit row should reference URN and action constant (can coexist with existing `activity_log` insert).
- **ActivityLog:** if there is a public POST to create activity rows, audit **who** inserted (admin vs system).

### 5. Security and privacy

- Redact or omit PII in `changes` unless required; prefer field names only.
- Truncate `user_agent` and any error messages stored in audit rows.
- Restrict **read** APIs for `audit_log` to **admin/super_admin** only (separate from activity log APIs if vendors can read their activity).

### 6. Observability

- Use Nest `Logger` with a prefix `[AuditLog]` for insert failures.
- Optional: include same `correlation_id` in response header for support tickets (`X-Request-Id`).

### 7. Testing

- Unit test `AuditLogService` (mock model).
- One e2e or integration test: authenticated `PATCH` triggers at least one audit document with expected `action` and `resource`.

### 8. Documentation

- Short internal enum or constants file listing all `AUDIT_ACTION_*` values.
- Swagger: only document **read** endpoints for audit if added; do not document internal write DTO as a public API unless required.

---

## Deliverables checklist

- [ ] `audit_log` Mongoose schema + indexes
- [ ] `AuditLogModule` + `AuditLogService`
- [ ] Global interceptor and/or `@Audit()` metadata + interceptor
- [ ] Registration in `AppModule` (and `exports` if other modules inject the service)
- [ ] Wired into **each** feature module’s sensitive routes or services (not only product registration)
- [ ] Admin-only `GET` audit list/filter (optional but recommended) with pagination
- [ ] Tests + note in internal docs pointing to `docs/activity-log-vs-audit-log.md` for rationale

---

## Explicit non-goals

- Do **not** merge audit events into `activity_log`.  
- Do **not** block business transactions on audit persistence.  
- Do **not** log full request/response bodies by default.

---

## One-line summary for LLM assistants

> Add a new MongoDB collection `audit_log`, an `AuditLogModule` with insert-only `AuditLogService`, a global HTTP audit interceptor (with allowlist/sampling), an optional `@Audit()` decorator for high-value actions, and call the service from sensitive flows across all existing Nest modules so every important mutation and auth event produces an append-only audit row with actor, resource, action, outcome, and request metadata—without storing secrets or breaking the main request if logging fails.
