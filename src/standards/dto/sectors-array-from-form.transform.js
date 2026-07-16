"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorsArrayFromForm = SectorsArrayFromForm;
var class_transformer_1 = require("class-transformer");
/**
 * Multipart may send **sectors** as a string, JSON array string, or string[].
 * Empty / null / undefined → undefined.
 */
function SectorsArrayFromForm() {
    return (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }
        if (Array.isArray(value)) {
            var nums = [];
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var x = value_1[_i];
                if (x === '' || x === null || x === undefined)
                    continue;
                if (typeof x === 'number' && Number.isInteger(x) && x >= 1) {
                    nums.push(x);
                    continue;
                }
                var n_1 = parseInt(String(x).trim(), 10);
                if (Number.isFinite(n_1) && Number.isInteger(n_1) && n_1 >= 1) {
                    nums.push(n_1);
                }
            }
            return nums.length ? nums : undefined;
        }
        if (typeof value === 'number' && Number.isInteger(value) && value >= 1) {
            return [value];
        }
        var s = String(value).trim();
        if (!s)
            return undefined;
        if (s.startsWith('[')) {
            try {
                var arr = JSON.parse(s);
                if (Array.isArray(arr)) {
                    var nums = [];
                    for (var _b = 0, arr_1 = arr; _b < arr_1.length; _b++) {
                        var x = arr_1[_b];
                        var n_2 = typeof x === 'number' && Number.isInteger(x)
                            ? x
                            : parseInt(String(x).trim(), 10);
                        if (Number.isFinite(n_2) && Number.isInteger(n_2) && n_2 >= 1) {
                            nums.push(n_2);
                        }
                    }
                    return nums.length ? nums : undefined;
                }
            }
            catch (_c) {
                return undefined;
            }
        }
        var n = parseInt(s, 10);
        if (Number.isFinite(n) && Number.isInteger(n) && n >= 1) {
            return [n];
        }
        return undefined;
    });
}
