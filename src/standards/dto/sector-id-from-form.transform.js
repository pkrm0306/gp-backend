"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorIdFromForm = SectorIdFromForm;
var class_transformer_1 = require("class-transformer");
/**
 * Multipart sends **sector** as a string; normalize to integer.
 * Empty / null / undefined → undefined.
 */
function SectorIdFromForm() {
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
