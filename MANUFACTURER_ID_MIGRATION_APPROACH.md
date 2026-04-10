# VendorUsers `manufacturerId` Migration Approach

## Your current scenario

From your screenshots:

- `vendor_users` documents currently store `vendorId`.
- `vendors` documents contain `manufacturerId`.

Now that vendor + manufacturer are being merged, the target is:

- `vendor_users` should directly store `manufacturerId`.
- Existing auth/profile logic should read `manufacturerId` first.

---

## Goal

Backfill `vendor_users.manufacturerId` using this mapping:

- `vendor_users.vendorId` -> `vendors._id`
- `vendors.manufacturerId` -> write into `vendor_users.manufacturerId`

Then phase out dependency on `vendor_users.vendorId`.

---

## Recommended phased approach (safe)

## Phase 1: Dual-read compatibility (already partly done in your code)

- Keep code that reads:
  - `manufacturerId` first
  - fallback to `vendorId` if needed
- Do **not** remove `vendorId` yet.

Why: avoids production breakage during migration.

## Phase 2: Backfill data in DB

Run a one-time migration script:

1. Find `vendor_users` where `manufacturerId` is missing and `vendorId` exists.
2. For each user:
   - lookup vendor by `_id = vendorId`
   - read `vendor.manufacturerId`
   - set `vendor_users.manufacturerId = vendor.manufacturerId`
3. Log:
   - total scanned
   - total updated
   - skipped (vendor missing)
   - skipped (vendor has no manufacturerId)

## Phase 3: Validation query

After migration, verify:

- count where `manufacturerId` missing is zero (or known exceptions)
- random sample confirms correct mapping.

## Phase 4: Switch to strict mode

After validation:

- enforce `manufacturerId` required in code paths
- stop using fallback to `vendorId` for new features
- optionally keep `vendorId` only as legacy reference for a short period.

## Phase 5 (optional cleanup)

When stable:

- remove vendor collection dependencies
- remove `vendorId` from `vendor_users` schema (only after full rollout and backups).

---

## DB safety checklist (important)

Before running migration:

- take MongoDB backup/snapshot
- run in staging first
- run with dry-run mode first (no write)
- use bulk updates in batches (for large data)
- keep migration idempotent (safe to rerun)

---

## Example Mongo aggregation to audit before migration

Use this to estimate impact:

```js
db.vendor_users.aggregate([
  {
    $match: {
      $or: [{ manufacturerId: { $exists: false } }, { manufacturerId: null }],
      vendorId: { $exists: true, $ne: null }
    }
  },
  { $count: "needs_backfill" }
]);
```

---

## Suggested migration script logic (pseudo)

```ts
for each vendorUser where manufacturerId missing and vendorId exists:
  vendor = vendors.findById(vendorUser.vendorId)
  if !vendor: log skipped_vendor_missing
  else if !vendor.manufacturerId: log skipped_manufacturer_missing
  else:
    update vendorUser set manufacturerId = vendor.manufacturerId
```

---

## Prompt you can reuse (for agent/AI implementation)

```text
Create a safe one-time MongoDB migration script in this NestJS codebase to backfill vendor_users.manufacturerId from vendors.manufacturerId.

Context:
- vendor_users currently has vendorId (legacy)
- vendors has manufacturerId
- target is vendor_users should have manufacturerId for all vendor users

Requirements:
1) Add script under src/scripts/ (TypeScript).
2) Use Nest application context and Mongoose models.
3) Only process vendor_users where manufacturerId is missing/null and vendorId exists.
4) Map:
   vendor_users.vendorId -> vendors._id
   vendors.manufacturerId -> vendor_users.manufacturerId
5) Do not overwrite existing valid manufacturerId.
6) Add dry-run mode via env flag (e.g. DRY_RUN=true) that only logs actions.
7) Log summary counters:
   scanned, updated, skipped_vendor_missing, skipped_manufacturer_missing, already_ok.
8) Make it idempotent (safe to re-run).
9) Add npm script command to run migration.
10) Provide verification queries after migration.

Also update service/auth code paths to prioritize manufacturerId and fallback to vendorId only for legacy records.
Do not remove vendorId field yet.
```

---

## Final recommendation for your case

Because your dataset clearly still has legacy `vendorId` links, run migration in this order:

1. deploy dual-read code
2. backfill `manufacturerId`
3. verify counts
4. switch frontend/backend behavior to manufacturerId-first everywhere
5. retire vendor-specific artifacts later

