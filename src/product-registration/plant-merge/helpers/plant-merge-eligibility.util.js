"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePlantNameKey = normalizePlantNameKey;
exports.buildPlantDuplicateKey = buildPlantDuplicateKey;
exports.buildPlantIdentityKey = buildPlantIdentityKey;
exports.derivePlantLocationLabel = derivePlantLocationLabel;
exports.buildProductRenewalBlockers = buildProductRenewalBlockers;
exports.validateSourcePlantSelection = validateSourcePlantSelection;
exports.validateRemainingPlantCount = validateRemainingPlantCount;
exports.isCertifiedProduct = isCertifiedProduct;
exports.plantBelongsToProduct = plantBelongsToProduct;
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var merge_eligibility_shared_1 = require("../../helpers/merge-eligibility.shared");
function normalizePlantNameKey(value) {
    return (0, merge_eligibility_shared_1.normalizeTrimmedValue)(String(value !== null && value !== void 0 ? value : '')).toLowerCase();
}
function buildPlantDuplicateKey(plant) {
    var _a, _b, _c;
    return [
        (0, merge_eligibility_shared_1.normalizeTrimmedValue)(String((_a = plant.eoiNo) !== null && _a !== void 0 ? _a : '')).toLowerCase(),
        normalizePlantNameKey(plant.plantName),
        (0, merge_eligibility_shared_1.normalizeTrimmedValue)(String((_c = (_b = plant.plantLocation) !== null && _b !== void 0 ? _b : plant.city) !== null && _c !== void 0 ? _c : '')).toLowerCase(),
    ].join('|');
}
/** Plant identity on a single product (name + location), used when copying plants to a target EOI. */
function buildPlantIdentityKey(plant) {
    var _a, _b;
    return [
        normalizePlantNameKey(plant.plantName),
        (0, merge_eligibility_shared_1.normalizeTrimmedValue)(String((_b = (_a = plant.plantLocation) !== null && _a !== void 0 ? _a : plant.city) !== null && _b !== void 0 ? _b : '')).toLowerCase(),
    ].join('|');
}
function derivePlantLocationLabel(plant) {
    var _a, _b, _c, _d;
    var city = (0, merge_eligibility_shared_1.normalizeTrimmedValue)((_a = plant.city) !== null && _a !== void 0 ? _a : '');
    var location = (0, merge_eligibility_shared_1.normalizeTrimmedValue)((_b = plant.plantLocation) !== null && _b !== void 0 ? _b : '');
    var state = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(String((_c = plant.stateName) !== null && _c !== void 0 ? _c : ''));
    var parts = [location || city, state].filter(Boolean);
    if (parts.length > 0) {
        return parts.join(', ');
    }
    return (0, merge_eligibility_shared_1.normalizeTrimmedValue)((_d = plant.plantName) !== null && _d !== void 0 ? _d : '');
}
function buildProductRenewalBlockers(productLabel, product) {
    return (0, merge_eligibility_shared_1.buildRenewalWorkflowBlockers)(productLabel, [product], {
        renewalUrnStatusActive: 'RENEWAL_URN_STATUS_ACTIVE',
        productRenewInProgress: 'PRODUCT_RENEW_IN_PROGRESS',
    });
}
function validateSourcePlantSelection(targetPlantId, sourcePlantIds) {
    var blockers = [];
    var normalizedTarget = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(targetPlantId);
    var normalizedSources = sourcePlantIds
        .map(function (id) { return (0, merge_eligibility_shared_1.normalizeTrimmedValue)(id); })
        .filter(Boolean);
    if (normalizedSources.length === 0) {
        blockers.push({
            code: 'NO_SOURCES_SELECTED',
            message: 'Select at least one source plant to absorb',
        });
        return blockers;
    }
    var uniqueSources = new Set(normalizedSources);
    if (uniqueSources.size !== normalizedSources.length) {
        blockers.push({
            code: 'SAME_PLANT',
            message: 'Duplicate source plant ids in request',
        });
    }
    if (normalizedTarget && uniqueSources.has(normalizedTarget)) {
        blockers.push({
            code: 'TARGET_IN_SOURCE_LIST',
            message: 'Target plant cannot also be listed as a source plant',
        });
    }
    return blockers;
}
function validateRemainingPlantCount(activePlantCount, sourceCount) {
    var plantCountAfter = activePlantCount - sourceCount;
    if (plantCountAfter < 1) {
        return [
            {
                code: 'MIN_PLANTS_REQUIRED',
                message: 'At least one manufacturing plant must remain on the EOI after merge',
            },
        ];
    }
    return [];
}
function isCertifiedProduct(product) {
    return Number(product.productStatus) === product_status_constants_1.PRODUCT_STATUS_CERTIFIED;
}
function plantBelongsToProduct(plant, productObjectId) {
    return (0, merge_eligibility_shared_1.objectIdKey)(plant.productId) === (0, merge_eligibility_shared_1.objectIdKey)(productObjectId);
}
