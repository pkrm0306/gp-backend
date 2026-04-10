# Vendor Service Analysis (`vendorService.ts`)

## Summary

- A file named exactly `vendorService.ts` does **not** exist in this repository.
- The relevant file was `src/vendors/vendors.service.ts` (`VendorsService` class).
- It was **deleted in git commit** `dec68af1f4430175bbed07f5388aab01ac220e71`.

## Where it was located

- Previous path: `src/vendors/vendors.service.ts`
- Current status: deleted from repository history after the commit above.

## When it was deleted

From git history (`git log --name-status --follow -- src/vendors/vendors.service.ts`):

1. `dc4d086c03e36237c46ce9fe4fee1189d4596410` (2026-02-19)  
   - **A** `src/vendors/vendors.service.ts` (file added)
2. `1b877a175192756e1743e8891565497aa065d38f` (2026-04-06)  
   - **M** `src/vendors/vendors.service.ts` (file modified)
3. `dec68af1f4430175bbed07f5388aab01ac220e71` (2026-04-07)  
   - **D** `src/vendors/vendors.service.ts` (file deleted)

## Why it appears to have been deleted

The deletion commit message is:

- `"prdocut registration in a single manufacturer table done"`

And the same commit removed multiple vendor-layer files:

- `src/vendors/vendors.service.ts`
- `src/vendors/vendors.controller.ts`
- `src/vendors/vendors.module.ts`
- `src/vendors/schemas/vendor.schema.ts`
- `src/vendors/dto/update-vendor.dto.ts`

In that commit, manufacturer-side files were expanded and auth/admin/dashboard wiring was updated. This strongly indicates a refactor from a separate `Vendor` collection/service to a **single manufacturer-centric model**.

## What the deleted service used to do

Before deletion, `VendorsService` handled:

- vendor CRUD (`create`, `findById`, `update`)
- vendor profile read/update/edit
- uniqueness checks for GST and phone
- password change flow via `VendorUsersService`
- cross-update behavior with `ManufacturersService`

## Current equivalent area after deletion

The logic moved to manufacturer-focused services/controllers, mainly:

- `src/manufacturers/manufacturers.service.ts`
- `src/manufacturers/manufacturers.controller.ts`
- `src/auth/auth.service.ts` (registration flow writes into manufacturer model)

Also, `vendor-users` still exists for user auth/identity linkage:

- `src/vendor-users/vendor-users.service.ts`

---

If you want, I can also generate a side-by-side mapping table:
`old VendorsService method -> new service method/path`.
