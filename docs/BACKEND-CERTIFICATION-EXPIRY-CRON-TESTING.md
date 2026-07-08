# Testing certification expiry cron jobs

## 1. Configure `.env`

```env
CRON_SECRET=local-dev-cron-secret-change-me
CRON_EXPIRY_INTERNAL_CC=internal-cc@greenpro.test
APP_BASE_URL=http://localhost:3000

# Mailtrap (already in this project):
SMTP_SERVER_HOST=sandbox.smtp.mailtrap.io
SMTP_SERVER_PORT=2525
SMTP_SERVER_USER=<your-mailtrap-user>
SMTP_SERVER_PASS=<your-mailtrap-pass>
SMTP_SERVER_FROM=noreply@greenpro.com

# Must be false — only one EMAIL_DISABLED line in .env (duplicate true at end of file blocks all mail)
EMAIL_DISABLED=false
```

With Mailtrap, **any** `to` address is captured in your Mailtrap inbox. Vendor `vendorEmail` from Mongo + internal CC both appear there.

`EMAIL_DISABLED=true` skips SMTP (jobs still update DB / logs).

Restart API after changes: `npm run start:dev`

---

## 2. Manual trigger (curl / Postman)

All routes require:

```http
Authorization: Bearer <CRON_SECRET>
```

| Job | Method | URL |
|-----|--------|-----|
| First notify | `POST` | `http://localhost:3000/api/cron/certification-expiry/before2month` |
| Weekly | `POST` | `http://localhost:3000/api/cron/certification-expiry/weekly-mail` |
| Deactivation | `POST` | `http://localhost:3000/api/cron/certification-expiry/deactivation-mail` |

**PowerShell:**

```powershell
$secret = "local-dev-cron-secret-change-me"
$headers = @{ Authorization = "Bearer $secret" }
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/cron/certification-expiry/before2month" -Headers $headers
```

**curl:**

```bash
curl -sS -X POST \
  -H "Authorization: Bearer local-dev-cron-secret-change-me" \
  http://localhost:3000/api/cron/certification-expiry/before2month
```

Response shape:

```json
{
  "success": true,
  "message": "before2month job finished",
  "data": {
    "success": true,
    "jobType": "before2month",
    "processed": 1,
    "sent": 1,
    "skipped": 5,
    "failed": 0,
    "deactivated": 0,
    "errors": []
  }
}
```

Wrong/missing secret → `401 Invalid cron authorization`.

---

## 3. Seed a test product in MongoDB

Pick a certified EOI (`productStatus: 2`) or use your test URN.

### Job A — first notify today

```javascript
// mongosh
const today = new Date();
today.setHours(0, 0, 0, 0);
db.products.updateOne(
  { urnNo: "URN-20260528142848", productStatus: 2 },
  {
    $set: {
      productRenewStatus: 0,
      urnStatus: 10,
      validtillDate: new Date("2026-08-01"),
      firstNotifyDate: today,
      secondNotifyDate: new Date("2026-07-01"),
      thirdNotifyDate: new Date("2026-09-01"),
      updatedDate: new Date(),
    },
  }
);
```

Run `POST .../before2month`. Expect `sent: 1` (or `skipped` if `cron_email_logs` already has today's row).

Verify log:

```javascript
db.cron_email_logs.find({ jobType: "before2month" }).sort({ sentAt: -1 }).limit(5);
```

### Job B — weekly (day 7 after second notify)

Set `secondNotifyDate` to **7 calendar days ago** (IST), `thirdNotifyDate` in the future, then run `weekly-mail`.

### Job C — deactivation

Set `thirdNotifyDate` to today or past, `urnStatus` not in 12–17, no `renewal_cycles` with `status: "in_progress"` for that URN:

```javascript
db.products.updateOne(
  { urnNo: "URN-TEST", productStatus: 2 },
  {
    $set: {
      productRenewStatus: 0,
      urnStatus: 10,
      thirdNotifyDate: new Date(),
      updatedDate: new Date(),
    },
  }
);
```

Run `POST .../deactivation-mail`. Product should become `productStatus: 4`.

---

## 4. Renewal exclusions (must skip)

| Setup | Job | Expect |
|-------|-----|--------|
| `urnStatus: 12`, `firstNotifyDate: today` | before2month | `skipped`, no email |
| `renewal_cycles` in_progress + `thirdNotifyDate: today` | deactivation-mail | `skipped`, status stays 2 |

---

## 5. Idempotency

Run the same job twice on the same day → second run `skipped` increases, `sent` does not double.

Delete log to re-test:

```javascript
db.cron_email_logs.deleteOne({
  productId: 12345,
  jobType: "before2month",
  notifyDate: "2026-06-15",
});
```

---

## 6. Unit tests

```bash
npx jest src/cron/utils/cron-date.util.spec.ts
npm run build
```

---

## 7. Production crontab

```cron
0 9  * * *  curl -sS -H "Authorization: Bearer $CRON_SECRET" https://YOUR_API/api/cron/certification-expiry/before2month
0 9  * * *  curl -sS -H "Authorization: Bearer $CRON_SECRET" https://YOUR_API/api/cron/certification-expiry/weekly-mail
0 10 * * *  curl -sS -H "Authorization: Bearer $CRON_SECRET" https://YOUR_API/api/cron/certification-expiry/deactivation-mail
```

---

## 8. Copy legacy HTML (optional)

Replace placeholders in `email_templates/cronJob/*.html` with full PHP templates and add image assets (`logo.png`, etc.) under `email_templates/cronJob/`. Fallback HTML is used if files are missing.
