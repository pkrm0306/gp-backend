"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryIdFromForm = CategoryIdFromForm;
var class_transformer_1 = require("class-transformer");
/**
 * Multipart form sends category_id as a string; normalizes to integer.
 * Empty / null / undefined → undefined.
 * Non-numeric → NaN so @IsInt fails.
 */
function CategoryIdFromForm() {
    return (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }
        if (typeof value === 'number' && Number.isInteger(value)) {
            return value;
        }
        var n = parseInt(String(value).trim(), 10);
        return Number.isFinite(n) ? n : Number.NaN;
    });
}
