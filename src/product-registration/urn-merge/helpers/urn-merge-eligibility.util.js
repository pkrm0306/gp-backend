"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE = exports.objectIdKey = exports.categoryIdKey = void 0;
exports.normalizeUrnMergeNo = normalizeUrnMergeNo;
exports.buildOwnershipMismatchBlocker = buildOwnershipMismatchBlocker;
exports.buildRenewalBlockers = buildRenewalBlockers;
exports.findEoiCollisions = findEoiCollisions;
exports.selectCertifiedProductsToMove = selectCertifiedProductsToMove;
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var merge_eligibility_shared_1 = require("../../helpers/merge-eligibility.shared");
Object.defineProperty(exports, "categoryIdKey", { enumerable: true, get: function () { return merge_eligibility_shared_1.categoryIdKey; } });
Object.defineProperty(exports, "objectIdKey", { enumerable: true, get: function () { return merge_eligibility_shared_1.objectIdKey; } });
function normalizeUrnMergeNo(value) {
    return (0, merge_eligibility_shared_1.normalizeTrimmedValue)(value);
}
exports.URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE = 'Source and Target URNs must belong to the same Manufacturer and Vendor.';
function buildOwnershipMismatchBlocker(source, target) {
    var hasVendorMismatch = (0, merge_eligibility_shared_1.objectIdKey)(source.vendorId) !== (0, merge_eligibility_shared_1.objectIdKey)(target.vendorId);
    var hasManufacturerMismatch = (0, merge_eligibility_shared_1.objectIdKey)(source.manufacturerId) !== (0, merge_eligibility_shared_1.objectIdKey)(target.manufacturerId);
    if (!hasVendorMismatch && !hasManufacturerMismatch) {
        return [];
    }
    return [
        {
            code: hasVendorMismatch ? 'VENDOR_MISMATCH' : 'MANUFACTURER_MISMATCH',
            message: exports.URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
        },
    ];
}
function buildRenewalBlockers(urnLabel, rows) {
    return (0, merge_eligibility_shared_1.buildRenewalWorkflowBlockers)(urnLabel, rows, {
        renewalUrnStatusActive: 'RENEWAL_URN_STATUS_ACTIVE',
        productRenewInProgress: 'PRODUCT_RENEW_IN_PROGRESS',
    });
}
function findEoiCollisions(targetEoiNos, eoisToMove) {
    var collisions = eoisToMove
        .map(function (row) { var _a; return String((_a = row.eoiNo) !== null && _a !== void 0 ? _a : '').trim(); })
        .filter(function (eoiNo) { return eoiNo && targetEoiNos.has(eoiNo); });
    if (collisions.length === 0) {
        return [];
    }
    return [
        {
            code: 'EOI_COLLISION',
            message: "Target URN already has EOI number(s): ".concat(collisions.join(', ')),
        },
    ];
}
function selectCertifiedProductsToMove(sourceProducts, moveAllCertifiedEois, productIds) {
    var certified = sourceProducts.filter(function (p) { return Number(p.productStatus) === product_status_constants_1.PRODUCT_STATUS_CERTIFIED; });
    if (moveAllCertifiedEois !== false) {
        return certified;
    }
    var idSet = new Set((productIds !== null && productIds !== void 0 ? productIds : []).map(function (id) { return Number(id); }));
    return certified.filter(function (p) { return idSet.has(Number(p.productId)); });
}
