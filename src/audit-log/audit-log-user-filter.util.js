"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAuditActorUserFilter = buildAuditActorUserFilter;
var mongoose_1 = require("mongoose");
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
var ACTOR_ID_FIELDS = [
    'actor.user_id',
    'performed_by.user_id',
    'actor.vendor_id',
    'actor.manufacturer_id',
];
/**
 * Matches audit rows for a selected user id, email, display name, or vendor org id.
 * Filter dropdowns may send vendorUserId or manufacturer _id, while some rows only
 * captured name/email.
 */
function buildAuditActorUserFilter(raw) {
    var _a, _b;
    var trimmed = String(raw !== null && raw !== void 0 ? raw : '').trim();
    if (!trimmed) {
        return undefined;
    }
    var clauses = [];
    for (var _i = 0, ACTOR_ID_FIELDS_1 = ACTOR_ID_FIELDS; _i < ACTOR_ID_FIELDS_1.length; _i++) {
        var field = ACTOR_ID_FIELDS_1[_i];
        clauses.push((_a = {}, _a[field] = trimmed, _a));
        if (mongoose_1.Types.ObjectId.isValid(trimmed)) {
            clauses.push((_b = {}, _b[field] = new mongoose_1.Types.ObjectId(trimmed), _b));
        }
    }
    clauses.push({
        $expr: {
            $or: ACTOR_ID_FIELDS.map(function (field) { return ({
                $eq: [{ $toString: "$".concat(field) }, trimmed],
            }); }),
        },
    });
    var exactCi = new RegExp("^".concat(escapeRegex(trimmed), "$"), 'i');
    clauses.push({ 'performed_by.email': exactCi }, { 'performed_by.name': exactCi });
    return { $or: clauses };
}
