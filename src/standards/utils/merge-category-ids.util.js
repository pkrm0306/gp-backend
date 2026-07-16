"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCategoryIdsFromFormObject = mergeCategoryIdsFromFormObject;
exports.hasExplicitCategoryIdFields = hasExplicitCategoryIdFields;
/**
 * Merge category id inputs from multipart / JSON bodies (admin parity).
 * Accepts: category_ids (array or JSON string), categoryIds (JSON array string or comma list),
 * legacy category_id (single). Order preserved, duplicates removed (first occurrence wins).
 */
function mergeCategoryIdsFromFormObject(obj) {
    if (!obj || typeof obj !== 'object') {
        return [];
    }
    var o = obj;
    var out = [];
    var seen = new Set();
    var pushId = function (n) {
        if (!Number.isInteger(n) || n < 1)
            return;
        if (seen.has(n))
            return;
        seen.add(n);
        out.push(n);
    };
    var parseOne = function (v) {
        if (v === '' || v === null || v === undefined)
            return;
        if (typeof v === 'number' && Number.isInteger(v)) {
            pushId(v);
            return;
        }
        var n = parseInt(String(v).trim(), 10);
        if (Number.isFinite(n) && Number.isInteger(n) && n >= 1) {
            pushId(n);
        }
    };
    var consumeArrayLike = function (raw) {
        if (raw === undefined || raw === null)
            return;
        if (Array.isArray(raw)) {
            for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
                var x = raw_1[_i];
                parseOne(x);
            }
            return;
        }
        var s = String(raw).trim();
        if (!s)
            return;
        if (s.startsWith('[')) {
            try {
                var arr = JSON.parse(s);
                if (Array.isArray(arr)) {
                    for (var _a = 0, arr_1 = arr; _a < arr_1.length; _a++) {
                        var x = arr_1[_a];
                        parseOne(x);
                    }
                }
            }
            catch (_b) {
                /* ignore */
            }
            return;
        }
        for (var _c = 0, _d = s.split(/[\s,;]+/).map(function (p) { return p.trim(); }).filter(Boolean); _c < _d.length; _c++) {
            var part = _d[_c];
            parseOne(part);
        }
    };
    consumeArrayLike(o.category_ids);
    consumeArrayLike(o['category_ids[]']);
    consumeArrayLike(o.categoryIds);
    consumeArrayLike(o['categoryIds[]']);
    if (o.category_id !== undefined && o.category_id !== null && o.category_id !== '') {
        parseOne(typeof o.category_id === 'number'
            ? o.category_id
            : parseInt(String(o.category_id).trim(), 10));
    }
    return out;
}
/**
 * True when the body sends **only** category assignment fields (misuse).
 * Admin UI may send `category_ids` as a legacy alias alongside `sectors` — ignore in that case.
 */
function hasExplicitCategoryIdFields(body) {
    if (!body || mergeCategoryIdsFromFormObject(body).length === 0) {
        return false;
    }
    var keys = Object.keys(body);
    var hasSectorAlias = keys.some(function (k) {
        return /^(sectors(\[\])?|sector_ids(\[\])?|sectorIds(\[\])?|sector_id|sector)$/i.test(k);
    });
    return !hasSectorAlias;
}
