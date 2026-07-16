"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENEWAL_URN_STATUS_ACTIVE_MAX = exports.RENEWAL_URN_STATUS_ACTIVE_MIN = void 0;
exports.normalizeTrimmedValue = normalizeTrimmedValue;
exports.objectIdKey = objectIdKey;
exports.categoryIdKey = categoryIdKey;
exports.parseObjectId = parseObjectId;
exports.buildRenewalWorkflowBlockers = buildRenewalWorkflowBlockers;
exports.isRenewalWorkflowUrnStatus = isRenewalWorkflowUrnStatus;
var mongoose_1 = require("mongoose");
var renewal_urn_status_constants_1 = require("../../renew/constants/renewal-urn-status.constants");
exports.RENEWAL_URN_STATUS_ACTIVE_MIN = 12;
exports.RENEWAL_URN_STATUS_ACTIVE_MAX = 17;
function normalizeTrimmedValue(value) {
    return String(value !== null && value !== void 0 ? value : '').trim();
}
function objectIdKey(id) {
    if (!id)
        return '';
    return id instanceof mongoose_1.Types.ObjectId ? id.toHexString() : String(id);
}
function categoryIdKey(id) {
    return objectIdKey(id);
}
function parseObjectId(value, fieldLabel) {
    var trimmed = normalizeTrimmedValue(value);
    if (!trimmed)
        return null;
    if (!mongoose_1.Types.ObjectId.isValid(trimmed)) {
        return null;
    }
    return new mongoose_1.Types.ObjectId(trimmed);
}
function buildRenewalWorkflowBlockers(label, rows, codes) {
    var _a;
    var blockers = [];
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        var urnStatus = Number((_a = row.urnStatus) !== null && _a !== void 0 ? _a : 0);
        if (urnStatus >= exports.RENEWAL_URN_STATUS_ACTIVE_MIN &&
            urnStatus <= exports.RENEWAL_URN_STATUS_ACTIVE_MAX) {
            blockers.push({
                code: codes.renewalUrnStatusActive,
                message: "".concat(label, " has an active renewal process"),
            });
            break;
        }
        if (Number(row.productRenewStatus) === renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.IN_PROGRESS) {
            blockers.push({
                code: codes.productRenewInProgress,
                message: "".concat(label, " has product renew in progress"),
            });
            break;
        }
    }
    return blockers;
}
function isRenewalWorkflowUrnStatus(urnStatus) {
    var status = Number(urnStatus !== null && urnStatus !== void 0 ? urnStatus : 0);
    return (status >= exports.RENEWAL_URN_STATUS_ACTIVE_MIN &&
        status <= exports.RENEWAL_URN_STATUS_ACTIVE_MAX);
}
