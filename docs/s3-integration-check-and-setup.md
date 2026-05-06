# S3 Integration Check and Setup Guide

This file helps you:
- verify whether S3 is already integrated
- verify whether S3 is currently active at runtime
- enable S3 if it is not active

## Current status in this project

S3 integration code is already present in backend code:
- `src/config/s3.config.ts`
- `src/utils/upload-file.util.ts`
- `src/standards/standards.service.ts`
- `src/categories/categories.controller.ts` + `src/categories/categories.service.ts`
- `src/admin/admin.controller.ts` (manufacturer/banner/event/team-member image uploads)
- `src/product-design/product-design.service.ts`
- `src/product-performance/product-performance.service.ts`
- `src/process-life-cycle-approach/process-life-cycle-approach.service.ts`
- dependency exists: `@aws-sdk/client-s3` in `package.json`

But S3 is active only when these env vars are set:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`

If any one is missing, upload falls back to local disk (`uploads/...`).

---

## 1) Quick check: is S3 active right now?

### A. Check env values inside running API container

```powershell
docker exec -it greenpro_api_dev sh -c "printenv | grep -E '^AWS_(ACCESS_KEY_ID|SECRET_ACCESS_KEY|REGION|S3_BUCKET)='"
```

If this returns nothing, S3 is not configured in runtime.

### B. Test a standards upload behavior

In this codebase, standards upload switches automatically:
- if S3 configured -> `storage_type = "s3"` and `file_url` is S3 URL
- if not configured -> `storage_type = "local"` and `file_url` is `/uploads/...`

After uploading one standard, check DB row fields:
- `storage_type`
- `file_url`
- `s3_key`

Expected:
- S3 active: `storage_type: "s3"`, non-empty `s3_key`, URL like `https://<bucket>.s3.<region>.amazonaws.com/...`
- S3 inactive: `storage_type: "local"`

---

## 2) Enable S3 (if inactive)

## Step A: create AWS resources

1. Create S3 bucket in your target region.
2. Disable public bucket write access.
3. Decide access strategy:
   - private objects + signed URLs (recommended), or
   - public read bucket/object policy (simpler, less secure).

## Step B: create IAM user/policy

Grant only required bucket permissions, for example:
- `s3:PutObject`
- `s3:GetObject`
- `s3:DeleteObject`
- `s3:ListBucket` (optional but useful)

Scope to your bucket only.

## Step C: set env vars in `.env`

Add:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
```

Important:
- Do not commit real keys to git.
- Prefer using deployment secrets/CI secrets for production.

## Step D: restart API container

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build api
```

## Step E: verify again

1. Upload one standard file.
2. Confirm DB row has:
   - `storage_type: "s3"`
   - non-empty `s3_key`
   - S3-based `file_url`

---

## 3) Troubleshooting

- **Still saving as local**
  - AWS env vars not available inside container.
  - Re-check with `printenv` command above.

- **AccessDenied from S3**
  - IAM policy missing permissions or wrong bucket ARN.

- **Wrong region error**
  - `AWS_REGION` does not match bucket region.

- **Upload success but URL not accessible**
  - Bucket/object public-read not allowed (expected for private buckets).
  - Use signed URLs or CloudFront depending on your access design.

---

## 4) Optional next improvement

S3 switching is now used across standards, categories, admin image uploads
(manufacturer/banner/event/team member), and key URN document sections
(product design, product performance, process life-cycle approach).

Some raw/process document modules still use local URN copy logic and can be migrated next by replacing their `saveFileToUrnFolder(...)` implementations with `uploadFile(...)`.
