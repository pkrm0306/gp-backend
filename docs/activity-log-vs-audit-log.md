# Activity log vs audit log — one table or two?

This note captures how **activity log** (what you added for the certification / URN lifecycle) differs from a broader **audit log**, and whether they should live in the same MongoDB collection or in separate ones.

## How they differ (conceptually)

| Aspect | Activity log (lifecycle / workflow) | Audit log (security & compliance) |
|--------|--------------------------------------|-----------------------------------|
| **Primary purpose** | Explain *where a business process is* (stages, milestones, vendor/admin steps). | Prove *who did what, when*, on *which resource*, from *where*, with *what changed*. |
| **Typical consumers** | Product screens, timelines, ops dashboards (“EOI submitted → payment done → …”). | Security reviews, dispute resolution, regulators, internal investigations. |
| **Data shape** | Often tied to a **URN**, **stage name/code**, maybe milestone order; may be user-readable summaries. | Often **actor** (user id, role), **action** (create/update/delete/login), **resource** (type + id), **before/after** or **diff**, **IP**, **user agent**, **request id**, **success/failure**. |
| **Retention & access** | May be shown to vendors for “their” URN; product-centric. | Usually **append-only**, stricter access, longer retention, rarely editable. |
| **Volume** | Bounded by workflow events per URN. | Can be **very high** (every API touch, every field change if you log diffs). |

They overlap when a workflow step is also an auditable action (e.g. “admin approved step 5”). That overlap does **not** mean they must share one physical table—but you can **reference** the same `requestId` or `correlationId` in both if you split them.

## Same table: pros and cons

**Pros**

- One write path and one place to query “everything that happened for this URN.”
- Simpler for a small app with few event types.

**Cons**

- **Schema tension**: lifecycle rows want `urnStatus`, `milestone`, `activity_status`; audit rows want `resourceType`, `resourceId`, `diff`, `ip`, `outcome`. One collection either becomes sparse (many null fields) or a vague “JSON blob” that is hard to index and report on.
- **Security**: audit data often must not be visible the same way as product activity (e.g. vendor must not see other users’ admin audit trails).
- **Performance & retention**: audit volume can dwarf workflow events; mixing them complicates TTL, archiving, and indexing.
- **Compliance**: auditors expect immutable, purpose-built audit trails—not mixed with product narrative events.

## Separate tables (collections): pros and cons

**Pros**

- **Clear contracts**: `activity_log` stays optimized for URN/workflow queries; `audit_log` for actor/action/resource/time.
- **Independent scaling**: index audit by `(actorId, createdAt)` or `(resourceType, resourceId)` without polluting product queries.
- **Clear authorization**: different guards and admin-only APIs per collection.

**Cons**

- Two write helpers / two repositories (small ongoing cost).
- “Full story” for an incident may require joining by time range or `requestId`—acceptable and common.

## Recommendation for your app (certification flow + app-wide actions)

**Use two collections** (or two clearly separated logical models), with a shared optional **`correlationId` / `requestId`** when both are written for the same HTTP request:

1. **`activity_log` (existing)**  
   Keep it focused on **business process tracking** for certification / URN lifecycle (and similar product workflows). Events are meaningful to product owners and sometimes vendors.

2. **`audit_log` (new)**  
   Capture **generic, append-only** records for actions across the app: authentication events, CRUD on sensitive entities, admin overrides, payment changes, role changes, exports, etc. Design fields for **querying and proving** behavior, not for timeline UX.

When a single user action both advances the workflow **and** should be audited, you can:

- Write **one activity row** and **one audit row** in the same request, sharing `correlationId`, or  
- Write only the audit row with `metadata` pointing at the URN and new status—**if** you do not need a separate human-readable lifecycle line. Usually **both** is clearest for ops.

## Practical schema sketch (audit log)

Fields worth considering (adjust names to your conventions):

- `occurredAt` (Date, server time)  
- `actorUserId`, `actorRole`, `actorVendorId` / `manufacturerId` (nullable)  
- `action` (enum string, e.g. `PRODUCT_URN_STATUS_UPDATED`)  
- `resourceType`, `resourceId` (e.g. `Product`, ObjectId or URN string)  
- `outcome` (`success` / `failure`), `httpStatus` or `errorCode`  
- `requestId`, `ip`, `userAgent`  
- `changes` (optional structured before/after or patch summary—be careful with PII and size)  
- `metadata` (small JSON for non-indexed context)

Ensure **immutability** (no updates/deletes in app code; only inserts) and **retention policy** early.

## Summary

- **Activity log** = product/workflow narrative, often URN-centric, UX-friendly.  
- **Audit log** = security and compliance trail, actor-centric, append-only, app-wide.  

**Prefer separate collections** so neither purpose weakens the other. Link them with a correlation id when both apply to the same operation.
