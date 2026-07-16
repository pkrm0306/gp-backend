"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermissionParts = parsePermissionParts;
exports.impliesPermission = impliesPermission;
exports.hasEffectivePermission = hasEffectivePermission;
exports.expandEffectivePermissions = expandEffectivePermissions;
exports.minimizePermissionSet = minimizePermissionSet;
exports.wouldExactMatchAllow = wouldExactMatchAllow;
/** Split `module:...:action` into module segments and terminal action. */
function parsePermissionParts(permission) {
    var parts = String(permission || '')
        .trim()
        .toLowerCase()
        .split(':')
        .filter(Boolean);
    if (parts.length < 2) {
        return { moduleSegments: parts, action: parts[parts.length - 1] || '' };
    }
    var action = parts[parts.length - 1];
    var moduleSegments = parts.slice(0, -1);
    return { moduleSegments: moduleSegments, action: action };
}
/** Whether grant `granted` implies `required` (direct match or parent prefix + same action). */
function impliesPermission(granted, required) {
    var g = parsePermissionParts(granted);
    var r = parsePermissionParts(required);
    if (!g.action || !r.action || g.action !== r.action)
        return false;
    if (g.moduleSegments.length > r.moduleSegments.length)
        return false;
    for (var i = 0; i < g.moduleSegments.length; i++) {
        if (g.moduleSegments[i] !== r.moduleSegments[i])
            return false;
    }
    return true;
}
/** True if `userGrants` contains a grant that implies `requiredPermission`. */
function hasEffectivePermission(userGrants, requiredPermission) {
    var req = String(requiredPermission || '').trim().toLowerCase();
    if (!req)
        return false;
    for (var _i = 0, userGrants_1 = userGrants; _i < userGrants_1.length; _i++) {
        var raw = userGrants_1[_i];
        var g = String(raw || '').trim().toLowerCase();
        if (!g)
            continue;
        if (impliesPermission(g, req))
            return true;
    }
    return false;
}
/**
 * Expand a set of grants to include every permission that is implied by the grants
 * but is not necessarily listed. Used for APIs that need the full effective set
 * (e.g. sidebar). If `allKnownPermissions` is provided, expansion is limited to that set.
 */
function expandEffectivePermissions(grants, allKnownPermissions) {
    var grantSet = new Set(Array.from(grants, function (g) { return String(g || '').trim().toLowerCase(); }).filter(Boolean));
    if (allKnownPermissions) {
        var out = new Set();
        for (var _i = 0, allKnownPermissions_1 = allKnownPermissions; _i < allKnownPermissions_1.length; _i++) {
            var k = allKnownPermissions_1[_i];
            var key = String(k || '').trim().toLowerCase();
            if (!key)
                continue;
            if (hasEffectivePermission(grantSet, key))
                out.add(key);
        }
        for (var _a = 0, grantSet_1 = grantSet; _a < grantSet_1.length; _a++) {
            var g = grantSet_1[_a];
            out.add(g);
        }
        return Array.from(out).sort();
    }
    // Without a known universe, effective set is exactly what was granted (normalized).
    return Array.from(grantSet).sort();
}
/**
 * Remove permissions implied by other permissions in the same set (minimal storage).
 */
function minimizePermissionSet(permissions) {
    var normalized = Array.from(new Set(permissions
        .map(function (p) { return String(p || '').trim().toLowerCase(); })
        .filter(Boolean)));
    var minimal = [];
    var _loop_1 = function (p) {
        var impliedByOther = normalized.some(function (q) { return q !== p && impliesPermission(q, p); });
        if (!impliedByOther)
            minimal.push(p);
    };
    for (var _i = 0, normalized_1 = normalized; _i < normalized_1.length; _i++) {
        var p = normalized_1[_i];
        _loop_1(p);
    }
    return minimal.sort();
}
/** For logging: would `required` be allowed if we only had exact matches (no hierarchy)? */
function wouldExactMatchAllow(userGrants, requiredPermission) {
    var req = String(requiredPermission || '').trim().toLowerCase();
    var set = new Set(Array.from(userGrants, function (g) { return String(g || '').trim().toLowerCase(); }).filter(Boolean));
    return set.has(req);
}
