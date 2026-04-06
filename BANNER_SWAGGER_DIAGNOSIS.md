# Banner API Swagger Diagnosis

## What I checked

- `src/app.module.ts` includes `AdminModule` in `imports`, so the controller that owns banner routes is mounted.
- `src/admin/admin.controller.ts` contains banner endpoints:
  - `GET /admin/banner/list`
  - `POST /admin/banner`
  - `POST /admin/banner/delete`
  - `DELETE /admin/banner/delete`
  - `GET /admin/banner/:id`
- Swagger bootstrap in `src/main.ts` uses `SwaggerModule.createDocument(app, config)` without excluding modules/controllers.
- Runtime Swagger JSON at `http://localhost:3000/api-json` currently includes:
  - `/admin/banner/list`
  - `/admin/banner`
  - `/admin/banner/delete`
  - `/admin/banner/{id}`

## Conclusion

Banner APIs are **present in Swagger**, but under the **`Admin` tag** (because the controller has `@ApiTags('Admin')`), not under a separate `Banner` tag/group.

## Why it may look "missing" after merge

1. Looking for a separate "Banner" section instead of the "Admin" section.
2. Swagger UI tab was not refreshed after restart/build and still shows old doc state.
3. Different server instance/port being opened in browser than the one you tested.
4. Running an old build in another process (less likely here, since current `/api-json` already includes banner paths).

## Quick verification steps (no code changes)

1. Open `http://localhost:3000/api-json` and search for `/admin/banner`.
2. In Swagger UI (`/api`), expand the **Admin** tag and look for `banner/*` routes.
3. Hard refresh Swagger page (`Ctrl + F5`) to avoid stale UI.
4. Ensure only one backend is active on port `3000` (or open Swagger on the actual running port).
