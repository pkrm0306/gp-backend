/**
 * Hierarchical permissions (single source of truth for implication rules).
 *
 * **Implication rule (namespace prefix + same action):**
 * A grant `G` implies required permission `R` when:
 * - the **action** (last `:` segment) of `G` equals the action of `R`, and
 * - the **module path** (all segments before the last `:`) of `G` is a strict
 *   prefix path of `R`'s module path (equal path or `G`'s path is a parent of `R`'s).
 *
 * Examples:
 * - `products:view` ⇒ `products:certified:view` (view subtree under `products`)
 * - `products:certified:view` ⇏ `products:uncertified:view` (siblings)
 * - `products:view` ⇏ `products:add` (different actions)
 *
 * **Storage:** Roles are normalized to a **minimal** set on create/update (redundant
 * child permissions are stripped when a covering parent grant exists).
 *
 * **Explicit deny / “all products except certified”:** not supported; use finer-grained
 * parents or separate roles (documented in docs/permission-hierarchy.md).
 */

/** Split `module:...:action` into module segments and terminal action. */
export function parsePermissionParts(permission: string): {
  moduleSegments: string[];
  action: string;
} {
  const parts = String(permission || '')
    .trim()
    .toLowerCase()
    .split(':')
    .filter(Boolean);
  if (parts.length < 2) {
    return { moduleSegments: parts, action: parts[parts.length - 1] || '' };
  }
  const action = parts[parts.length - 1];
  const moduleSegments = parts.slice(0, -1);
  return { moduleSegments, action };
}

/** Whether grant `granted` implies `required` (direct match or parent prefix + same action). */
export function impliesPermission(granted: string, required: string): boolean {
  const g = parsePermissionParts(granted);
  const r = parsePermissionParts(required);
  if (!g.action || !r.action || g.action !== r.action) return false;
  if (g.moduleSegments.length > r.moduleSegments.length) return false;
  for (let i = 0; i < g.moduleSegments.length; i++) {
    if (g.moduleSegments[i] !== r.moduleSegments[i]) return false;
  }
  return true;
}

/** True if `userGrants` contains a grant that implies `requiredPermission`. */
export function hasEffectivePermission(
  userGrants: Iterable<string>,
  requiredPermission: string,
): boolean {
  const req = String(requiredPermission || '').trim().toLowerCase();
  if (!req) return false;
  for (const raw of userGrants) {
    const g = String(raw || '').trim().toLowerCase();
    if (!g) continue;
    if (impliesPermission(g, req)) return true;
  }
  return false;
}

/**
 * Expand a set of grants to include every permission that is implied by the grants
 * but is not necessarily listed. Used for APIs that need the full effective set
 * (e.g. sidebar). If `allKnownPermissions` is provided, expansion is limited to that set.
 */
export function expandEffectivePermissions(
  grants: Iterable<string>,
  allKnownPermissions?: Iterable<string>,
): string[] {
  const grantSet = new Set(
    Array.from(grants, (g) => String(g || '').trim().toLowerCase()).filter(Boolean),
  );
  if (allKnownPermissions) {
    const out = new Set<string>();
    for (const k of allKnownPermissions) {
      const key = String(k || '').trim().toLowerCase();
      if (!key) continue;
      if (hasEffectivePermission(grantSet, key)) out.add(key);
    }
    for (const g of grantSet) out.add(g);
    return Array.from(out).sort();
  }
  // Without a known universe, effective set is exactly what was granted (normalized).
  return Array.from(grantSet).sort();
}

/**
 * Remove permissions implied by other permissions in the same set (minimal storage).
 */
export function minimizePermissionSet(permissions: string[]): string[] {
  const normalized = Array.from(
    new Set(
      permissions
        .map((p) => String(p || '').trim().toLowerCase())
        .filter(Boolean),
    ),
  );
  const minimal: string[] = [];
  for (const p of normalized) {
    const impliedByOther = normalized.some((q) => q !== p && impliesPermission(q, p));
    if (!impliedByOther) minimal.push(p);
  }
  return minimal.sort();
}

/** For logging: would `required` be allowed if we only had exact matches (no hierarchy)? */
export function wouldExactMatchAllow(
  userGrants: Iterable<string>,
  requiredPermission: string,
): boolean {
  const req = String(requiredPermission || '').trim().toLowerCase();
  const set = new Set(
    Array.from(userGrants, (g) => String(g || '').trim().toLowerCase()).filter(Boolean),
  );
  return set.has(req);
}
