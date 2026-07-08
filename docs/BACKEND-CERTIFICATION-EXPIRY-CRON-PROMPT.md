# MERN implementation prompt — Certification expiry cron jobs (verified against current codebase)

**Give this entire file to the backend agent implementing scheduled expiry notifications in `cursor-greenpro-mern` (NestJS + MongoDB).**

**Legacy source:** CodeIgniter `application/controllers/CronJob.php`  
**Templates:** `email_templates/cronJob/certification_expiry_email.html`, `deactivationMail.html` (copy into this repo; not present yet)

**Status in this repo:** No cron module exists today. Notify dates and renewal completion already use `computeNotifyDates()` — cron must reuse that helper, not reimplement offsets.

---

## 1. Verified: notify dates (matches legacy intent)

Implemented in `src/product-registration/helpers/certification-dates.util.ts`:

| Field (Mongo) | Rule (calendar months from `validtillDate`, start of day) |
|---------------|-----------------------------------------------------------|
| `firstNotifyDate` | valid till − **2 months** |
| `secondNotifyDate` | valid till − **1 month** |
| `thirdNotifyDate` | valid till **+ 1 month** |

Set when:

- Admin approves **certification** payment → `computeCertificationDates()`
- **Renewal completes** (`completeRenewal`) → new `validtillDate` via `extendValidityForRenewal()` (+24 months, Dec 31 of target year), then `computeNotifyDates(newValidTill)`
- Admin **test renewal** valid-till change → `computeNotifyDates(validTillDate)` on certified EOIs
- Admin edits certified product valid till → same helper in `product-registration.service`

**Timezone for cron comparisons:** `Asia/Kolkata` — compare **YYYY-MM-DD** only (start of day in IST), not UTC midnight surprises.

---

## 2. Verified: product & renewal fields (Mongo / Nest)

Collection: **`products`** (camelCase in schema `src/product-registration/schemas/product.schema.ts`)

| Legacy (PHP prompt) | MERN field | Values |
|---------------------|------------|--------|
| `product_id` | `productId` | number |
| `product_status` | `productStatus` | **0** pending, **1** submitted, **2** certified, **3** rejected, **4** expired/discontinued (`PRODUCT_STATUS_DISCONTINUED`) |
| `product_renew_status` | `productRenewStatus` | **0** not in renew flow, **1** in progress, **2** renewed (completed cycle) |
| `validtill_date` | `validtillDate` | Date |
| `first_notify_date` | `firstNotifyDate` | Date |
| `second_notify_date` | `secondNotifyDate` | Date |
| `third_notify_date` | `thirdNotifyDate` | Date |
| — | `urnStatus` | **0–11** certification; **11** renewal completed; **12–17** active renewal workflow |
| — | `renewCycleNo` | number — matches `renewal_cycles.cycleNo` for current/last renewal |
| — | `renewedDate` | set on renewal completion |
| — | `is_deleted` | soft delete — **exclude** via `matchActiveProducts()` |

Related collection: **`renewal_cycles`** (`urnNo`, `cycleNo`, `status`: `in_progress` | `completed` | `cancelled`, `paymentId`, …)

**Do not** use legacy name `product_status = 2` in Mongoose queries — use `productStatus: 2`.

---

## 3. Critical delta: eligibility vs legacy PHP

### 3.1 Legacy `getEligibleProducts()` (baseline)

ALL of:

- `productStatus = 2` (certified)
- `productRenewStatus = 0` (not in renew flow)
- `validtillDate < today + 60 days` (expiry within next 60 days)
- Join vendor / category / manufacturer for email content

### 3.2 MERN additions (required)

Also require:

```ts
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';

// Base match
{
  ...matchActiveProducts(),
  productStatus: 2,
  productRenewStatus: 0,
  validtillDate: { $exists: true, $ne: null, $lt: thresholdDate },
}
```

**Exclude renewal-in-progress (even if `productRenewStatus` was reset to 0 on test paths):**

```ts
urnStatus: { $nin: [12, 13, 14, 15, 16, 17] },
```

| `urnStatus` | Cron behaviour |
|-------------|----------------|
| 0–10 | Normal certification lifecycle — eligible if other rules pass |
| **11** | Renewal **completed** — still certified; use **new** notify dates from `completeRenewal` |
| **12–17** | Active renewal — **never** expiry reminder or deactivation |
| Test renewal (`PATCH /renew/admin/test-validity`) | Sets `urnStatus = 12`, `productRenewStatus = 0` — **must** still be excluded via `urnStatus` |

**Optional URN-level guard (recommended for `deactivationMail`):**

Before `productStatus → 4`, skip if:

```ts
await renewalCycleModel.exists({ urnNo, status: 'in_progress' });
```

Prevents deactivating EOIs while any renewal cycle is open on that URN.

### 3.3 `renewCycleNo` — logging & validation (not a filter on first notify)

- **Do not** require `renewCycleNo` for cron eligibility.
- **Do** persist on each `cron_email_logs` row: `urnNo`, `renewCycleNo`, `urnStatus`, `productRenewStatus`, `renewalCycleId` (if an in-progress cycle exists) for audit.
- After **renewal completes**, `renewCycleNo` reflects completed cycle; notify dates are recalculated — cron uses new `firstNotifyDate` / `secondNotifyDate` / `thirdNotifyDate` (typically years in the future). No special case beyond normal date equality.

### 3.4 Alignment with vendor renew list API

`GET` renew list (`product-registration.service.getRenewList`) uses:

- `productStatus: 2`
- `validtillDate < today + 60 days`
- **Does not** filter `productRenewStatus` or `urnStatus`

**Recommendation:** Keep cron **stricter** than renew list (legacy + renewal exclusions). Optionally align renew list in a separate task.

---

## 4. Cron jobs (behaviour 1:1 + MERN guards)

### Job A: `before2month` (daily ~09:00 IST)

1. Load eligible products (section 3).
2. Load `certification_expiry_email.html`; replace placeholders:
   - `@year@` → current year (IST)
   - `@LOGO@`, `@PAGEHEADER@`, `@SOCIAL_FB@`, `@SOCIAL_TW@`, `@SOCIAL_IN@` → `${APP_BASE_URL}/email_templates/cronJob/...`
3. For each product where **`firstNotifyDate` date (IST) === today**:
   - Send to `trim(vendor.vendorEmail)`
   - Subject: `Product Expiry Notification!`
   - **Internal copy** to env `CRON_EXPIRY_INTERNAL_CC` (default `sheshikumar.bheemreddy@cii.in`)
4. **Do not** send legacy test mail to `sagarmiraki@gmail.com`.
5. Idempotency: `cron_email_logs` unique `(productId, jobType: 'before2month', notifyDate: today)`.

### Job B: `weeklyMail` (daily ~09:00 IST)

Same template as Job A (**no `@year@`** in legacy weekly job).

For each eligible product where **all** hold (IST dates):

- `today > secondNotifyDate`
- `today < thirdNotifyDate`
- `daysBetween(secondNotifyDate, today) === 7` (exactly 7 calendar days after second notify date — match legacy PHP `daysBetween` semantics)

Send to vendor only (no internal CC). Subject: `Product Expiry Notification!`

Idempotency: `(productId, jobType: 'weeklyMail', weekAnchor: secondNotifyDate ISO date)` or `(productId, jobType, sentAt date)` once per 7-day window.

### Job C: `deactivationMail` (daily ~10:00 IST)

1. Eligible products (section 3) + URN in-progress cycle guard.
2. Load `deactivationMail.html`; placeholders:
   - `@productRegistrationyear@` → year of `(today − 24 months)` (IST)
   - `@currentYear@` → current year
   - asset URLs as Job A
3. For each product where **`thirdNotifyDate` date (IST) ≤ today**:
   - **Skip** if `urnStatus` in 12–17 or in-progress `renewal_cycles` row exists for `urnNo`
   - Else `updateOne`: `productStatus = 4`, `updatedDate = now` (do **not** change `productRenewStatus` unless product spec says otherwise — legacy only set status 4)
   - Email vendor: subject `Product Deactivate Notification!`
4. Idempotency: `(productId, jobType: 'deactivationMail')` — never deactivate or email twice.

---

## 5. Vendor deduplication

Legacy SQL grouped by `vendor_id`. If one vendor has multiple eligible EOIs on the same day:

- **Option A (legacy-safe):** one email per **product** row (multiple emails per vendor possible).
- **Option B (preferred UX):** one email per **vendor per job per day** listing all expiring EOIs.

**Default for MERN:** Option A unless product owner confirms Option B. Document choice in README.

---

## 6. NestJS technical design (this repo)

### 6.1 Module layout

```
src/cron/
  cron.module.ts
  cron.controller.ts          # POST triggers, CRON_SECRET guard
  cron.scheduler.ts           # @nestjs/schedule or node-cron
  certification-expiry/
    certification-expiry-query.service.ts   # getEligibleProducts()
    certification-expiry-template.service.ts
    jobs/
      before2month.job.ts
      weekly-mail.job.ts
      deactivation-mail.job.ts
  schemas/
    cron-email-log.schema.ts
```

Register `CronModule` in `app.module.ts`.

### 6.2 Reuse existing services

| Need | Use |
|------|-----|
| Send mail | `EmailService` (`src/common/services/email.service.ts`) — env: `SMTP_*`, `MAIL_FROM` |
| Notify math | `computeNotifyDates` / date helpers from `certification-dates.util.ts` |
| Active products | `matchActiveProducts()` |
| Renewal constants | `PRODUCT_RENEW_STATUS`, `RENEWAL_URN_STATUS`, `isRenewalUrnStatus()` |
| IST date | new `cron-date.util.ts` — `todayIsoInTimeZone('Asia/Kolkata')`, `isSameCalendarDay(a, b, tz)` |

### 6.3 HTTP triggers (protected)

```
POST /api/cron/certification-expiry/before2month
POST /api/cron/certification-expiry/weekly-mail
POST /api/cron/certification-expiry/deactivation-mail
```

Header: `Authorization: Bearer ${CRON_SECRET}` (same pattern as other internal jobs).

Response: `{ success, jobType, processed, sent, skipped, failed, errors[] }`.

### 6.4 `cron_email_logs` schema

```ts
{
  productId: number,
  urnNo: string,
  eoiNo?: string,
  jobType: 'before2month' | 'weeklyMail' | 'deactivationMail',
  notifyDate?: string,       // IST YYYY-MM-DD that triggered send
  vendorId: ObjectId,
  renewCycleNo?: number,
  urnStatus?: number,
  productRenewStatus?: number,
  sentAt: Date,
  meta?: Record<string, unknown>,
}
```

Index: `{ productId: 1, jobType: 1, notifyDate: 1 }` unique sparse.

### 6.5 Static assets

Copy from PHP app:

- `email_templates/cronJob/*.html`
- Images referenced by templates

Serve at `/email_templates/...` or mount under `public/` with `APP_BASE_URL` (e.g. `https://api.greenpro.com`).

---

## 7. Environment variables

```env
APP_BASE_URL=https://your-api-or-cdn-host
CRON_SECRET=...
CRON_EXPIRY_INTERNAL_CC=sheshikumar.bheemreddy@cii.in
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=no-reply@greenpro.com
TZ=Asia/Kolkata
```

---

## 8. Crontab (production)

```cron
0 9  * * *  curl -sS -H "Authorization: Bearer $CRON_SECRET" https://api.example.com/api/cron/certification-expiry/before2month
0 9  * * *  curl -sS -H "Authorization: Bearer $CRON_SECRET" https://api.example.com/api/cron/certification-expiry/weekly-mail
0 10 * * *  curl -sS -H "Authorization: Bearer $CRON_SECRET" https://api.example.com/api/cron/certification-expiry/deactivation-mail
```

---

## 9. Acceptance tests (include renewal scenarios)

### 9.1 Baseline expiry (no renewal)

| Step | Expect |
|------|--------|
| Certified product, `productRenewStatus=0`, `urnStatus=10`, `firstNotifyDate=today` | Job A sends vendor + internal CC |
| Same, `thirdNotifyDate=today` | Job C sets `productStatus=4`, deactivation email |

### 9.2 Renewal in progress — must skip

| Step | Expect |
|------|--------|
| `urnStatus=14`, `productRenewStatus=1`, `firstNotifyDate=today` | Job A **no send** |
| `urnStatus=12`, `productRenewStatus=0` (test renewal) | Job A/C **no send** |
| `renewal_cycles` in_progress for URN, `thirdNotifyDate=today` | Job C **no deactivate** |

### 9.3 Renewal completed — new cycle

| Step | Expect |
|------|--------|
| Complete renewal → `urnStatus=11`, `productRenewStatus=2`, new `validtillDate` + notify dates | Old expiry window irrelevant |
| `renewCycleNo` updated on products | Logs show new cycle no |
| `firstNotifyDate` far in future | Job A does not fire until that date |

### 9.4 Idempotency

| Step | Expect |
|------|--------|
| Run Job A twice same day for same product | Second run skipped (log exists) |

### 9.5 Weekly window

| Step | Expect |
|------|--------|
| `secondNotifyDate` = D, today = D+7, today < `thirdNotifyDate` | Job B sends once |
| today = D+8 | Job B does not send (not day 7) |

---

## 10. Deliverables checklist

- [x] `certification-expiry-query.service.ts` — eligible query with renewal exclusions
- [x] `certification-expiry-template.service.ts` — load + replace placeholders
- [x] `certification-expiry.service.ts` — three jobs
- [x] `cron-email-log` schema + idempotency
- [x] Protected POST routes — see `docs/BACKEND-CERTIFICATION-EXPIRY-CRON-TESTING.md`
- [x] Fallback HTML templates in `email_templates/cronJob/`
- [x] Unit tests: `src/cron/utils/cron-date.util.spec.ts`
- [ ] Copy full legacy HTML + images from PHP app (optional)
- [ ] `@nestjs/schedule` in-process scheduler (optional; use crontab + curl today)

---

## 11. Related docs in this repo

| Doc | Topic |
|-----|--------|
| `docs/BACKEND-RENEW-TEST-VALIDITY.md` | Test renewal resets `urnStatus=12`, new cycle |
| `docs/BACKEND-RENEW-CYCLE-SCOPED-PAYMENTS.md` | Payments/docs per `renewalCycleId` |
| `docs/BACKEND-RENEW-COMPLETE-ON-FINAL-REVIEW.md` | Completion sets dates + `productRenewStatus=2` |
| `src/product-registration/helpers/certification-dates.util.spec.ts` | Notify date examples |

---

## 12. Quick reference (updated)

| Job | Trigger (IST) | Action |
|-----|----------------|--------|
| `before2month` | `firstNotifyDate === today` | Expiry warning → vendor + internal CC |
| `weeklyMail` | Between 2nd & 3rd notify, **day 7** after `secondNotifyDate` | Weekly reminder → vendor |
| `deactivationMail` | `thirdNotifyDate ≤ today` | `productStatus = 4` + email — **unless** renewal active (12–17 or in-progress cycle) |

**Renewal rule of thumb:** Cron talks to **certified EOIs not in an active renewal workflow**. `renewCycleNo` is for audit and post-renewal tracking; **`urnStatus` 12–17** is the hard exclude for all three jobs.
