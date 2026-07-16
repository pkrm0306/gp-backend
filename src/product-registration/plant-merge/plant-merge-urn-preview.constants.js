"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLANT_MERGE_URN_PREVIEW_FAILURE = exports.PLANT_MERGE_URN_PREVIEW_STATUS = void 0;
exports.PLANT_MERGE_URN_PREVIEW_STATUS = {
    READY: 'READY',
    NO_TARGET: 'NO_TARGET',
    BLOCKED: 'BLOCKED',
};
exports.PLANT_MERGE_URN_PREVIEW_FAILURE = {
    NO_CERTIFIED_ON_SOURCE: 'Source URN has no certified products to evaluate for plant merge targets',
    NO_MATCHING_TARGET: 'No certified product found with the same product name, manufacturer, and category on another URN',
    SOURCE_NO_PLANTS: 'Source EOI has no active manufacturing plants to copy',
    BRAND_NEW_PRODUCT: 'Source product is newer than any matching certified product on another URN',
};
