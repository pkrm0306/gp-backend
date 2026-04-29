# Vendor Registration Update Prompt

Use this prompt in my local codebase to apply all vendor registration fixes exactly.

## Prompt

Update my NestJS backend vendor registration flow with the following requirements and file-level changes:

### 1) Make captcha non-mandatory (temporary bypass)

- In `src/auth/dto/register-vendor.dto.ts`:
  - Make `captchaToken` optional.
  - Use `@ApiPropertyOptional()`, `@IsOptional()`, and keep `@IsString()`.
- In `src/auth/auth.service.ts` (`registerVendor`):
  - Remove captcha validation enforcement so registration should proceed even if captcha is missing/invalid.

### 2) Make manufacturing details optional during registration

- In `src/auth/dto/register-vendor.dto.ts`:
  - Make `companyName` optional (`companyName?: string`) with `@ApiPropertyOptional()` and `@IsOptional()`.
- In `src/auth/auth.service.ts` (`registerVendor`):
  - Introduce:
    - `const normalizedCompanyName = registerDto.companyName?.trim() || registerDto.email.split('@')[0]?.trim() || 'Vendor';`
  - Use `normalizedCompanyName` for:
    - `manufacturerName`
    - `vendor_name`
    - vendor user `name`

### 3) Do not persist optional manufacturer fields during registration

- In `src/auth/auth.service.ts` (`registerVendor`):
  - Do NOT send `gpInternalId` while creating manufacturer.
  - Do NOT send `manufacturerInitial` while creating manufacturer.

### 4) Schema defaults for optional manufacturer fields

- In `src/manufacturers/schemas/manufacturer.schema.ts`:
  - Set:
    - `gpInternalId` default to `undefined` (not `null`)
    - `manufacturerInitial` default to `undefined` (not `null`)
  - Keep `gpInternalId` optional and unique+sparse.

### 5) Improve duplicate handling in registration

- In `src/auth/auth.service.ts` (`registerVendor`):
  - Pre-check duplicate email in both:
    - `vendorUsersService.findByEmail(registerDto.email)`
    - `manufacturersService.findByVendorEmail(registerDto.email)` (add this method if missing)
  - Handle Mongo `11000` errors robustly:
    - Prefer `keyPattern`/`keyValue` when available.
    - Fallback to parsing index name from error message.
    - Return specific conflicts when possible:
      - `Email already exists`
      - `Phone number already exists`
      - `GP Internal ID already exists`
      - `Manufacturer initials already exist`
    - Otherwise return generic:
      - `Duplicate value found. Please use different registration details.`

### 6) Registration should not fail if email send fails

- In `src/auth/auth.service.ts` (`registerVendor`):
  - Wrap `sendRegistrationEmail` in inner `try/catch`.
  - Log warning and continue successful response if SMTP fails.

### 7) Transaction safety

- In `src/auth/auth.service.ts` (`registerVendor`):
  - Track `transactionCommitted`.
  - In `catch`, call `abortTransaction()` only when transaction is active and not committed.
  - Keep throwing known `HttpException` as-is.

### 8) Add manufacturer lookup helper

- In `src/manufacturers/manufacturers.service.ts` add:
  - `findByVendorEmail(email: string): Promise<ManufacturerDocument | null>`
  - Implementation should query `manufacturerModel.findOne({ vendor_email: email })`.

### 9) CORS fix for Render (already applied during troubleshooting)

- In `src/main.ts`:
  - Include deployment origins from env (`RENDER_EXTERNAL_URL`, `APP_URL`, `FRONTEND_URL`, `ADMIN_URL`) in allowlist.
  - Allow `https://*.onrender.com` origins in origin callback for Render-hosted Swagger/preview callers.

### 10) Exception logging for production debugging (already applied)

- In `src/common/filters/http-exception.filter.ts`:
  - Log method/path/status and full exception details server-side before sending sanitized API response.

## Post-change verification checklist

- `POST /auth/register-vendor` works when:
  - `captchaToken` is absent/empty/invalid.
  - `companyName` is absent.
- New registration no longer requires `gpInternalId` or `manufacturerInitial`.
- Duplicate conflicts return specific messages.
- SMTP failure does not convert successful registration into 500.
- No linter errors in touched files.

## Production MongoDB index/data fix (important)

If production still throws `GP Internal ID already exists`, run:

```javascript
use greenpro_db

db.manufacturers.getIndexes()
db.manufacturers.dropIndex("gpInternalId_1")

db.manufacturers.updateMany(
  { gpInternalId: null },
  { $unset: { gpInternalId: "" } }
)

db.manufacturers.updateMany(
  { manufacturerInitial: null },
  { $unset: { manufacturerInitial: "" } }
)

db.manufacturers.createIndex(
  { gpInternalId: 1 },
  { unique: true, sparse: true, name: "gpInternalId_1" }
)
```

After this, registration should stop failing on GP internal ID duplicates.
