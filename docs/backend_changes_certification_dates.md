# Certification validity dates (no cron)

## Trigger

When an admin approves a **certification** payment (`paymentType: certification`, `paymentStatus: 2`), `CertificationLifecycleService.applyCertificationApproval` runs inside the same Mongo transaction as the payment update.

## Fields set on `products`

| Field | Rule |
|-------|------|
| `certifiedDate` | Approval timestamp |
| `validtillDate` | Default: Dec 31 of `(year(certifiedDate) + 2)`. **Special rule (2026):** 2026-01-01..2026-04-30 → 2027-12-31, 2026-05-01..2026-12-31 → 2028-12-31 |
| `firstNotifyDate` | `validtillDate` − 2 calendar months |
| `secondNotifyDate` | `validtillDate` − 1 calendar month |
| `thirdNotifyDate` | `validtillDate` + 1 calendar month |

## Status side effects

- EOIs listed in `payment_details.productsToBeCertified` (JSON array of numeric **`productId`**, e.g. `"[101,102]"`) → `productStatus: 2` (Certified)
- Product names are **not** accepted in this field (see `docs/admin-certification-products-frontend-prompt.md`)
- Other active EOIs on the URN → `productStatus: 3` (Rejected)
- All active EOIs on the URN → `urnStatus: 11`, shared validity + notify dates

## Admin product edit

`PATCH` product update: when `validtillDate` changes, notify dates are recomputed and synced to all certified (`productStatus: 2`) products on the same `urnNo`.

## Code

- `src/product-registration/helpers/certification-dates.util.ts`
- `src/product-registration/helpers/parse-products-to-be-certified.util.ts`
- `src/product-registration/certification-lifecycle.service.ts`
- Hook: `src/payments/payments.service.ts` (`updatePaymentDetails`)

## Example

Approve on **2026-05-19** → `validtillDate` **2028-12-31** → notify dates **2028-10-31**, **2028-11-30**, **2029-01-31**.

## Out of scope

Expiry cron emails and `productStatus: 4` deactivation.
