"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTargetOlderThanSource = void 0;
exports.exactProductNamesMatch = exactProductNamesMatch;
exports.isCertifiedProductRow = isCertifiedProductRow;
exports.isSameSourceAndTargetPair = isSameSourceAndTargetPair;
exports.buildPlantMergeUrnPairValidationBlockers = buildPlantMergeUrnPairValidationBlockers;
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var plant_merge_urn_validation_constants_1 = require("../plant-merge-urn-validation.constants");
var merge_eligibility_shared_1 = require("../../helpers/merge-eligibility.shared");
var plant_merge_urn_target_util_1 = require("./plant-merge-urn-target.util");
function exactProductNamesMatch(left, right) {
    return ((0, merge_eligibility_shared_1.normalizeTrimmedValue)(String(left !== null && left !== void 0 ? left : '')) ===
        (0, merge_eligibility_shared_1.normalizeTrimmedValue)(String(right !== null && right !== void 0 ? right : '')));
}
function isCertifiedProductRow(product) {
    return Number(product.productStatus) === product_status_constants_1.PRODUCT_STATUS_CERTIFIED;
}
var plant_merge_urn_target_util_2 = require("./plant-merge-urn-target.util");
Object.defineProperty(exports, "isTargetOlderThanSource", { enumerable: true, get: function () { return plant_merge_urn_target_util_2.isTargetOlderThanSource; } });
function isSameSourceAndTargetPair(input) {
    var sourceUrn = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(input.sourceUrnNo);
    var targetUrn = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(input.targetUrnNo);
    var sourceEoi = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(input.sourceEoiNo);
    var targetEoi = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(input.targetEoiNo);
    if (input.sourceProductId &&
        input.targetProductId &&
        (0, merge_eligibility_shared_1.objectIdKey)(input.sourceProductId) === (0, merge_eligibility_shared_1.objectIdKey)(input.targetProductId)) {
        return true;
    }
    if (sourceUrn === targetUrn && sourceEoi === targetEoi) {
        return true;
    }
    return false;
}
function buildPlantMergeUrnPairValidationBlockers(source, target) {
    var blockers = [];
    if (isSameSourceAndTargetPair({
        sourceUrnNo: source.urnNo,
        targetUrnNo: target.urnNo,
        sourceEoiNo: source.eoiNo,
        targetEoiNo: target.eoiNo,
        sourceProductId: source._id,
        targetProductId: target._id,
    })) {
        blockers.push({
            code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.SAME_SOURCE_TARGET,
            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.SAME_SOURCE_TARGET,
        });
        return blockers;
    }
    if (!isCertifiedProductRow(source)) {
        blockers.push({
            code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.SOURCE_EOI_NOT_CERTIFIED,
            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.SOURCE_EOI_NOT_CERTIFIED,
        });
    }
    if (!isCertifiedProductRow(target)) {
        blockers.push({
            code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.TARGET_NOT_CERTIFIED,
            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.TARGET_NOT_CERTIFIED,
        });
    }
    if (!exactProductNamesMatch(source.productName, target.productName)) {
        blockers.push({
            code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.PRODUCT_NAME_MISMATCH,
            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.PRODUCT_NAME_MISMATCH,
        });
    }
    if ((0, merge_eligibility_shared_1.objectIdKey)(source.manufacturerId) !== (0, merge_eligibility_shared_1.objectIdKey)(target.manufacturerId)) {
        blockers.push({
            code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.MANUFACTURER_MISMATCH,
            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.MANUFACTURER_MISMATCH,
        });
    }
    if ((0, merge_eligibility_shared_1.categoryIdKey)(source.categoryId) !== (0, merge_eligibility_shared_1.categoryIdKey)(target.categoryId)) {
        blockers.push({
            code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.CATEGORY_MISMATCH,
            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.CATEGORY_MISMATCH,
        });
    }
    if (!(0, plant_merge_urn_target_util_1.isTargetOlderThanSource)(target, source)) {
        blockers.push({
            code: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.TARGET_NOT_OLDER,
            message: plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_MESSAGE.TARGET_NOT_OLDER,
        });
    }
    return blockers;
}
