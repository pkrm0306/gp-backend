"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeResourceStandardTypeList = normalizeResourceStandardTypeList;
exports.mergeResourceStandardTypeFilters = mergeResourceStandardTypeFilters;
/** Parse standard-type filter from query (single, comma-list, or array). */
function normalizeResourceStandardTypeList(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var source;
    if (Array.isArray(value)) {
        source = value;
    }
    else {
        var s = String(value).trim();
        if (s.startsWith('[')) {
            try {
                var parsed = JSON.parse(s);
                source = Array.isArray(parsed) ? parsed : [parsed];
            }
            catch (_a) {
                source = s.split(',');
            }
        }
        else {
            source = s.split(',');
        }
    }
    var out = source
        .map(function (v) { return String(v).trim(); })
        .filter(function (v) { return v.length > 0; });
    return out.length > 0 ? out : undefined;
}
function mergeResourceStandardTypeFilters(input) {
    var _a;
    var merged = [];
    var seen = new Set();
    var add = function (raw) {
        var t = String(raw !== null && raw !== void 0 ? raw : '').trim();
        if (!t)
            return;
        var key = t.toLowerCase();
        if (seen.has(key))
            return;
        seen.add(key);
        merged.push(t);
    };
    for (var _i = 0, _b = (_a = input.resource_standard_types) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
        var t = _b[_i];
        add(t);
    }
    add(input.resource_standard_type);
    return merged;
}
