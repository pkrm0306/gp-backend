# Activity Log Message Map (Current Implementation)

This document explains **which backend step writes an activity-log row** and **what message text is currently stored**.

## 1) Which fields hold the message text

Each `activity_log` row stores:

- `activity` -> main timeline message
- `next_activity` -> next step message shown in flow
- `activity_status` / `activities_id` -> numeric status used to pick message labels

## 2) Steps that write activity logs

## A. Product Registration module (`src/product-registration/product-registration.service.ts`)

1. `registerProduct(...)`  
   After successful registration commit, it logs:
   - `activity`: `Proposal Pending` (status `0`)
   - `next_activity`: `Registration Payment Pending` (status `1`)

2. `registerBulkProducts(...)`  
   Same logging as single registration:
   - `activity`: `Proposal Pending`
   - `next_activity`: `Registration Payment Pending`

3. `updateProduct(...)`  
   If `urnStatus` changes, it calls `tryLogUrnLifecycleStep(...)`, which stores:
   - `activity`: from `getActivityName(newUrnStatus)`
   - `next_activity`: from next status (`newUrnStatus + 1`, capped at `11`)

4. `updateUrnStatus(...)`  
   After URN status update, it calls `tryLogUrnLifecycleStep(...)` with the same dynamic mapping logic.

5. `adminUpdateUrnStatus(...)`  
   If `updateStatusType === 'urn_status'`, it calls `tryLogUrnLifecycleStep(...)` with the same dynamic mapping logic.

---

## B. Payments module (`src/payments/payments.service.ts`)

1. `createPayment(...)` -> `tryLogPaymentCreated(...)`  
   Stores a payment-created message (depends on payment type):
   - If `paymentType = registration` -> `activity`: `Registration fee payment record created`
   - If `paymentType = certification` -> `activity`: `Certificate fee payment record created`
   - `next_activity`: from `getActivityName(currentStatus + 1)` (capped at `11`)

2. `updatePaymentDetailsByUrn(...)` (only when `urnStatus` is provided) -> `tryLogUrnLifecycleAfterPayment(...)`  
   Stores dynamic lifecycle labels:
   - `activity`: from `getActivityName(newUrnStatus)`
   - `next_activity`: from next status (`newUrnStatus + 1`, capped at `11`)

---

## C. Direct Activity Log API (`src/activity-log/activity-log.controller.ts`)

`POST /activity-log` directly writes whatever message you send in request body:

- `activity` from payload
- `next_activity` from payload

So this endpoint is fully manual/custom message driven.

## 3) URN Status -> Message text mapping

This mapping is used by both Product Registration and Payments services (`getActivityName(...)`):

| Status | Message |
|---|---|
| 0 | Proposal Pending |
| 1 | Registration Payment Pending |
| 2 | Approve Registration Pending |
| 3 | Process Form In Progress |
| 4 | Check Process Forms |
| 5 | Vendor Response Pending |
| 6 | Final Verification Pending |
| 7 | Certificate Payment Pending |
| 8 | Approve Certificate Fee |
| 9 | Payment Rejected |
| 10 | Certification Fee Approved |
| 11 | Publish Certificate |

## 4) Where to change messages

If you want to rename timeline text, update these places:

1. `src/product-registration/product-registration.service.ts`
   - `getActivityName(...)` map
2. `src/payments/payments.service.ts`
   - `getActivityName(...)` map
   - `tryLogPaymentCreated(...)` label strings:
     - `Registration fee payment`
     - `Certificate fee payment`

## 5) Quick change checklist

1. Update message strings in both service maps (keep them consistent).
2. Update payment-created label text if needed.
3. Restart backend and run one test flow:
   - register product
   - create payment
   - move URN status
4. Check `activity_log` collection rows and verify `activity` and `next_activity` values.
