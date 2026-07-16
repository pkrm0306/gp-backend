"use strict";
/**
 * Merge sector id inputs from multipart / JSON bodies (admin multiselect).
 * Accepts: **sectors** (array or JSON string), repeated **sectors[]**, **sector_ids** / **sectorIds**,
 * optional legacy single **sector**.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSectorIdsFromFormObject = mergeSectorIdsFromFormObject;
exports.hasExplicitSectorAssignmentFields = hasExplicitSectorAssignmentFields;
function mergeSectorIdsFromFormObject(obj) {
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
        for (var _c = 0, _d = s
            .split(/[\s,;]+/)
            .map(function (p) { return p.trim(); })
            .filter(Boolean); _c < _d.length; _c++) {
            var part = _d[_c];
            parseOne(part);
        }
    };
    consumeArrayLike(o.sectors);
    consumeArrayLike(o['sectors[]']);
    consumeArrayLike(o.sector_ids);
    consumeArrayLike(o['sector_ids[]']);
    consumeArrayLike(o.sectorIds);
    consumeArrayLike(o['sectorIds[]']);
    if (o.sector !== undefined && o.sector !== null && o.sector !== '') {
        parseOne(typeof o.sector === 'number'
            ? o.sector
            : parseInt(String(o.sector).trim(), 10));
    }
    if (o.sector_id !== undefined && o.sector_id !== null && o.sector_id !== '') {
        parseOne(typeof o.sector_id === 'number'
            ? o.sector_id
            : parseInt(String(o.sector_id).trim(), 10));
    }
    return out;
}
var SECTOR_ASSIGNMENT_BODY_KEYS = [
    'sector',
    'sector_id',
    'sectors',
    'sectors[]',
    'sector_ids',
    'sector_ids[]',
    'sectorIds',
    'sectorIds[]',
    /** Legacy admin multipart aliases (same numeric ids as sectors). */
    'category_id',
    'category_ids',
    'category_ids[]',
    'categoryIds',
    'categoryIds[]',
];
/** True if the multipart body explicitly includes any sector assignment field. */
function hasExplicitSectorAssignmentFields(body) {
    if (!body || typeof body !== 'object') {
        return false;
    }
    return SECTOR_ASSIGNMENT_BODY_KEYS.some(function (k) {
        return Object.prototype.hasOwnProperty.call(body, k);
    });
}
