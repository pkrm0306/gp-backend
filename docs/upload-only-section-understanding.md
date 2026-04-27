# Upload-Only Section: Implementation Understanding

This note explains how a section should work when it needs **only document upload** (no text fields).

## 1) Minimal request contract

For an upload-only section, request can be:

- `urnNo` (required)
- file field (required), for example `supportingFile`
- optional file label, for example `supportingFileName`

Recommended content type:

- `multipart/form-data`

## 2) Backend flow (what should happen)

1. Authenticate vendor using `JwtAuthGuard`.
2. Read `vendorId` from token (do not trust vendorId from body).
3. Accept file via interceptor (`FileInterceptor`/`AnyFilesInterceptor`).
4. Save physical file to:
   - `uploads/urns/{urnNo}/{generated-file-name}`
5. Insert one metadata row in `all_product_documents`.

## 3) What to store in `all_product_documents`

For each uploaded file, save:

- `productDocumentId` (sequence)
- `vendorId` (from token)
- `urnNo`
- `documentForm` (section key, e.g. `raw_materials_xyz`)
- `documentFormSubsection` (e.g. `supporting_documents`)
- `formPrimaryId` (section primary id or linked record id)
- `documentName` (stored name)
- `documentOriginalName` (original upload name)
- `documentLink` (e.g. `uploads/urns/URN-.../file.pdf`)
- `createdDate`, `updatedDate`

## 4) If there is no section data table

Two valid approaches:

- **A. Keep a lightweight section table row** (recommended in current project pattern)
  - create one section row per URN/vendor
  - use its id as `formPrimaryId`
- **B. Use document table only**
  - no extra section table row
  - set a stable link strategy for `formPrimaryId` (if required by your reporting)

In this codebase, most sections already have their own table, so approach A is consistent.

## 5) How file is retrieved later

Files are not usually fetched by a dedicated "documents list" endpoint per section.
They are included via aggregation in:

- `GET /products/details/{urn_no}`

This API uses `all_product_documents` lookups by:

- `urnNo`
- `documentForm` (section key)
- `isDeleted != true`

So for upload-only sections, ensure the product-details aggregation includes that section's `*_documents` array.

## 6) Delete behavior

Use:

- `DELETE /documents/:documentId?urnNo=...&sectionKey=...`

This soft-deletes metadata row (and optionally physical file), with vendor ownership + urn + section checks.

## 7) Example upload-only API shape

- `POST /raw-materials-some-section`
  - body (multipart): `urnNo`, `supportingFile`, optional `supportingFileName`
  - response: success + section payload + inserted document metadata (optional)

This is enough to support full upload/retrieve/delete lifecycle even when section has no text fields.

