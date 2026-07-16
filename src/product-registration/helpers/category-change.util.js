"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_RAW_MATERIAL_STEP_IDS = exports.RAW_MATERIAL_STEP_PURGE_TARGETS = void 0;
exports.categoryObjectIdsEqual = categoryObjectIdsEqual;
exports.resolveCategoryChangeBlockReason = resolveCategoryChangeBlockReason;
exports.maxUrnStatusForCategoryLock = maxUrnStatusForCategoryLock;
exports.resolveCategoryChangeBlockReasonForUrn = resolveCategoryChangeBlockReasonForUrn;
exports.isProductCategoryEditableForUrn = isProductCategoryEditableForUrn;
exports.isProductCategoryEditable = isProductCategoryEditable;
exports.stepsToPurgeOnCategoryChange = stepsToPurgeOnCategoryChange;
exports.retainedRawMaterialStepsOnCategoryChange = retainedRawMaterialStepsOnCategoryChange;
exports.addedRawMaterialStepsOnCategoryChange = addedRawMaterialStepsOnCategoryChange;
exports.visibleStepsForCategory = visibleStepsForCategory;
exports.formatCategoryWithRawMaterialVisibility = formatCategoryWithRawMaterialVisibility;
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var renewal_urn_status_constants_1 = require("../../renew/constants/renewal-urn-status.constants");
var category_change_constants_1 = require("../constants/category-change.constants");
var urn_tab_review_util_1 = require("./urn-tab-review.util");
/** Raw materials review steps 1–15 → Mongo collections + document section keys. */
exports.RAW_MATERIAL_STEP_PURGE_TARGETS = {
    1: {
        collections: ['raw_materials_hazardous', 'raw_materials_hazardous_products'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS],
    },
    2: {
        collections: ['raw_materials_recycled_content'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT],
    },
    3: {
        collections: ['raw_materials_regional_materials'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS],
    },
    4: {
        collections: ['raw_materials_rapidly_renewable_materials'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS],
    },
    5: {
        collections: ['raw_materials_green_supply'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY],
    },
    6: {
        collections: ['raw_materials_elimination_of_formaldehyde'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE],
    },
    7: {
        collections: ['raw_materials_recovery'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RECOVERY],
    },
    8: {
        collections: [],
        documentForms: [
            document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
        ],
    },
    9: {
        collections: ['raw_materials_elimination_of_prohibited_flame'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME],
    },
    10: {
        collections: [
            'raw_materials_elimination_of_prohibited_flame_solvents',
            'raw_materials_elimination_of_prohibited_flame_solvents_products',
        ],
        documentForms: [
            document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
            document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
        ],
    },
    11: {
        collections: ['raw_materials_reduce_environmental'],
        documentForms: [
            document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
            document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
        ],
    },
    12: {
        collections: [
            'raw_materials_utilization',
            'raw_materials_utilization_manufacturing_units',
        ],
        documentForms: [
            document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
            document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS,
        ],
    },
    13: {
        collections: ['raw_materials_optimization_of_raw_mix'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION],
    },
    14: {
        collections: ['raw_materials_additives'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ADDITIVES],
    },
    15: {
        collections: ['raw_materials_utilization_rmc'],
        documentForms: [document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS],
    },
};
exports.ALL_RAW_MATERIAL_STEP_IDS = Array.from({ length: 15 }, function (_, index) { return index + 1; });
function categoryObjectIdsEqual(left, right) {
    var a = left == null ? '' : String(left).trim();
    var b = right == null ? '' : String(right).trim();
    if (!a || !b) {
        return a === b;
    }
    return a === b;
}
function resolveCategoryChangeBlockReason(params) {
    var _a, _b;
    var productStatus = Number((_a = params.productStatus) !== null && _a !== void 0 ? _a : 0);
    var urnStatus = Number((_b = params.urnStatus) !== null && _b !== void 0 ? _b : 0);
    if (productStatus === product_status_constants_1.PRODUCT_STATUS_CERTIFIED) {
        return category_change_constants_1.CATEGORY_CHANGE_CERTIFIED_MESSAGE;
    }
    if ((0, renewal_urn_status_constants_1.isRenewalUrnStatus)(urnStatus)) {
        return category_change_constants_1.CATEGORY_CHANGE_RENEWAL_MESSAGE;
    }
    if (urnStatus >= category_change_constants_1.CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS) {
        return category_change_constants_1.CATEGORY_CHANGE_LOCKED_MESSAGE;
    }
    return null;
}
/** Highest workflow step on the URN — used to lock category after admin final submit. */
function maxUrnStatusForCategoryLock(urnStatuses) {
    if (!urnStatuses.length) {
        return 0;
    }
    return Math.max.apply(Math, urnStatuses.map(function (status) { return Number(status !== null && status !== void 0 ? status : 0); }));
}
/**
 * Category edit eligibility for a URN (all EOIs share one lock once any row hits final submit).
 */
function resolveCategoryChangeBlockReasonForUrn(params) {
    var _a;
    if (params.anyProductCertified ||
        Number((_a = params.productStatus) !== null && _a !== void 0 ? _a : 0) === product_status_constants_1.PRODUCT_STATUS_CERTIFIED) {
        return category_change_constants_1.CATEGORY_CHANGE_CERTIFIED_MESSAGE;
    }
    var urnStatus = maxUrnStatusForCategoryLock(params.urnStatuses);
    return resolveCategoryChangeBlockReason({
        productStatus: params.productStatus,
        urnStatus: urnStatus,
    });
}
function isProductCategoryEditableForUrn(params) {
    return resolveCategoryChangeBlockReasonForUrn(params) == null;
}
function isProductCategoryEditable(params) {
    return resolveCategoryChangeBlockReason(params) == null;
}
function stepsToPurgeOnCategoryChange(previousCategoryRawMaterialForms, newCategoryRawMaterialForms) {
    var previousVisible = visibleStepsForCategory(previousCategoryRawMaterialForms);
    var newVisibleSet = new Set(visibleStepsForCategory(newCategoryRawMaterialForms));
    // Remove only criteria that applied to the old category but not the new one.
    return previousVisible.filter(function (stepId) { return !newVisibleSet.has(stepId); });
}
/** Raw material steps whose vendor data is kept when both categories include the step. */
function retainedRawMaterialStepsOnCategoryChange(previousCategoryRawMaterialForms, newCategoryRawMaterialForms) {
    var previousVisible = visibleStepsForCategory(previousCategoryRawMaterialForms);
    var newVisibleSet = new Set(visibleStepsForCategory(newCategoryRawMaterialForms));
    return previousVisible.filter(function (stepId) { return newVisibleSet.has(stepId); });
}
/** New criteria in the target category that the vendor still needs to complete. */
function addedRawMaterialStepsOnCategoryChange(previousCategoryRawMaterialForms, newCategoryRawMaterialForms) {
    var newVisible = visibleStepsForCategory(newCategoryRawMaterialForms);
    var previousVisibleSet = new Set(visibleStepsForCategory(previousCategoryRawMaterialForms));
    return newVisible.filter(function (stepId) { return !previousVisibleSet.has(stepId); });
}
function visibleStepsForCategory(categoryRawMaterialForms) {
    return (0, urn_tab_review_util_1.parseVisibleRawMaterialSteps)(categoryRawMaterialForms);
}
/** Category payload for URN details — includes raw-material step visibility for vendor UI. */
function formatCategoryWithRawMaterialVisibility(category) {
    var _a, _b, _c, _d, _e;
    if (!category) {
        return null;
    }
    var name = (_b = (_a = category.categoryName) !== null && _a !== void 0 ? _a : category.category_name) !== null && _b !== void 0 ? _b : null;
    var categoryRawMaterialForms = String((_d = (_c = category.category_raw_material_forms) !== null && _c !== void 0 ? _c : category.categoryRawMaterialForms) !== null && _d !== void 0 ? _d : '').trim();
    return {
        _id: category._id,
        categoryId: category._id,
        categoryName: name,
        category_name: name,
        sector: (_e = category.sector) !== null && _e !== void 0 ? _e : null,
        category_raw_material_forms: categoryRawMaterialForms || null,
        visibleRawMaterialSteps: visibleStepsForCategory(categoryRawMaterialForms || null),
    };
}
