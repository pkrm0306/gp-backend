# Permission hierarchy

## Format

Permissions use `module:segments:action` (colon-separated), e.g. `products:view`, `products:certified:view`, `rbac:roles:manage`.

## Implication rule (authorization)

**Policy:** namespace prefix + **same action** (not Option B explicit graph; not wildcard tokens in DB).

A stored grant **G** implies required permission **R** when:

1. The **action** (last `:` segment) of **G** equals the action of **R**.
2. The **module path** (segments before the last `:`) of **G** is a prefix of **R**’s module path (equal, or **G** is a parent path of **R**).

Examples:

| Grant | Required | Result |
|--------|-----------|--------|
| `products:view` | `products:certified:view` | Allowed |
| `products:view` | `products:uncertified:view` | Allowed |
| `products:certified:view` | `products:uncertified:view` | Denied (siblings) |
| `products:view` | `products:add` | Denied (different actions) |
| `products:view` | `events:view` | Denied |

**View vs add/update/delete:** `*:view` only implies other `*:view` nodes under the same path prefix. Add, update, delete, and other actions are separate unless you introduce matching parent grants for those actions.

## Enforcement

- `PermissionsGuard` uses `hasEffectivePermission(storedGrants, required)` from `src/common/permissions/permission-hierarchy.ts` (shared logic for “direct or implied” checks).
- On **403**, the guard logs: `userId`, `requiredPermission`, `rawGrantCount`, and whether an exact string grant would have matched (`exactGrantMatch`), for debugging.

## Storage (role documents)

- On **POST/PATCH** role, permissions are **canonicalized** (see `RbacService.canonicalizePermission`) and **minimized**: if grant **A** implies grant **B**, **B** is dropped.
- The DB therefore stores a **minimal** set (typically parent menus only). Legacy roles that list only child permissions still work; parent-only roles now satisfy child endpoints.

## Effective permissions (UI)

- `GET /admin/rbac/staff/roles` enriches each mapping with `effectivePermissions` (and `roleId.effectivePermissions`): known keys from `PERMISSIONS` / `ALL_KNOWN_PERMISSION_VALUES` that are implied by the role’s stored grants.
- Multiple mappings for one user (if present) should be **unioned** client-side for a sidebar.

## Aliases

Cross-module aliases (e.g. legacy `contacts.view` vs `inquiries:view`) are normalized in `RbacService.canonicalizePermission` before minimization and checks. Prefer a single canonical module in new code.

## Out of scope

- **Explicit deny** (“all products except certified”) is not supported. Use narrower parent paths, separate roles, or finer permission keys.
- **Wildcard tokens** in storage (`products:*`) are not implemented; implication is computed from concrete grants.

## Product subtree reference

Documented children under **Products** (same-action subtree of `products:view`):

- `products:view` (parent)
- `products:certified:view`
- `products:uncertified:view`

Add new submenu permissions as additional path segments before the action, e.g. `products:new-tab:view`.

## Code references

- Implication helpers: `src/common/permissions/permission-hierarchy.ts`
- Constants: `src/common/constants/permissions.constants.ts` (`ALL_KNOWN_PERMISSION_VALUES`)
- Guard: `src/common/guards/permissions.guard.ts`
- RBAC persistence: `src/rbac/rbac.service.ts`
