"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichUrnDetailRowsWithSharedProcessData = enrichUrnDetailRowsWithSharedProcessData;
var SHARED_URN_OBJECT_KEYS = [
    'urn_assessment_report',
    'urnAssessmentReport',
    'category',
    'manufacturer',
    'vendor',
    'product_design',
    'product_performance',
    'process_manufacturing',
    'process_waste_management',
    'process_life_cycle_approach',
    'process_product_stewardship',
    'process_innovation',
    'process_comments',
    'process_final_review',
];
var SHARED_URN_ARRAY_KEYS = [
    'plants',
    'payments',
    'product_design_measures',
    'product_design_documents',
    'product_performance_test_reports',
    'product_performance_documents',
    'process_manufacturing_documents',
    'process_mp_manufacturing_units',
    'process_waste_management_documents',
    'process_wm_manufacturing_units',
    'process_life_cycle_approach_documents',
    'process_product_stewardship_documents',
    'process_innovation_documents',
    'all_renew_product_documents',
    'all_urn_product_documents',
    'raw_materials_hazardous_products',
    'raw_materials_hazardous_products_documents',
    'raw_materials_additives',
    'raw_materials_additives_documents',
    'raw_materials_recycled_content',
    'raw_materials_recycled_content_documents',
    'raw_materials_regional_materials',
    'raw_materials_regional_materials_documents',
    'raw_materials_rapidly_renewable_materials',
    'raw_materials_rapidly_renewable_materials_documents',
    'raw_materials_recovery',
    'raw_materials_recovery_documents',
    'raw_materials_elimination_of_ozone_depleting_global_warming_substances',
    'raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents',
    'raw_materials_elimination_of_prohibited_flame',
    'raw_materials_elimination_of_prohibited_flame_documents',
    'raw_materials_elimination_of_prohibited_flame_solvents',
    'raw_materials_elimination_of_prohibited_flame_solvents_documents',
    'raw_materials_reduce_environmental',
    'raw_materials_reduce_environmental_documents',
    'raw_materials_green_supply',
    'raw_materials_green_supply_documents',
    'raw_materials_alternative_raw_materials',
    'raw_materials_alternative_raw_materials_documents',
    'raw_materials_raw_mix_optimization',
    'raw_materials_raw_mix_optimization_documents',
    'raw_materials_elimination_of_formaldehyde',
    'raw_materials_elimination_of_formaldehyde_documents',
    'raw_materials_utilization',
    'raw_materials_utilization_documents',
    'raw_materials_utilization_manufacturing_units',
    'raw_materials_utilization_rmc',
    'raw_materials_rmc_alternative_raw_materials_documents',
    'raw_materials_documents_bucket',
];
function isEmptyValue(value) {
    if (value == null)
        return true;
    if (typeof value === 'string')
        return value.trim() === '';
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
function mergeObjectsPreferFilled(base, incoming) {
    var merged = __assign({}, base);
    for (var _i = 0, _a = Object.entries(incoming); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var current = merged[key];
        if (isEmptyValue(current) && !isEmptyValue(value)) {
            merged[key] = value;
            continue;
        }
        if (value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            current &&
            typeof current === 'object' &&
            !Array.isArray(current)) {
            merged[key] = mergeObjectsPreferFilled(current, value);
        }
    }
    return merged;
}
function dedupeArrayByKey(arr, keyFields) {
    var seen = new Set();
    var out = [];
    var _loop_1 = function (entry) {
        if (!entry || typeof entry !== 'object')
            return "continue";
        var key = keyFields
            .map(function (field) { var _a; return String((_a = entry[field]) !== null && _a !== void 0 ? _a : ''); })
            .join('|');
        if (!key || seen.has(key))
            return "continue";
        seen.add(key);
        out.push(entry);
    };
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var entry = arr_1[_i];
        _loop_1(entry);
    }
    return out;
}
function pickBestObject(rows, key) {
    var best = null;
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        var value = row[key];
        if (isEmptyValue(value))
            continue;
        if (isEmptyValue(best)) {
            best = value;
            continue;
        }
        if (value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            best &&
            typeof best === 'object' &&
            !Array.isArray(best)) {
            best = mergeObjectsPreferFilled(best, value);
        }
    }
    return best;
}
function pickMergedArray(rows, key) {
    var merged = [];
    for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
        var row = rows_2[_i];
        var value = row[key];
        if (!Array.isArray(value) || value.length === 0)
            continue;
        merged.push.apply(merged, value);
    }
    if (key.includes('document')) {
        return dedupeArrayByKey(merged, [
            '_id',
            'productDocumentId',
            'documentLink',
            'documentName',
        ]);
    }
    return dedupeArrayByKey(merged, ['_id', 'processMpManufacturingUnitId', 'processWmManufacturingUnitId']);
}
/**
 * When multiple EOIs share one URN, copy shared process/category data onto every row
 * so vendor/admin clients always see saved form data after resend.
 */
function enrichUrnDetailRowsWithSharedProcessData(rows) {
    if (rows.length <= 1)
        return rows;
    var shared = {};
    for (var _i = 0, SHARED_URN_OBJECT_KEYS_1 = SHARED_URN_OBJECT_KEYS; _i < SHARED_URN_OBJECT_KEYS_1.length; _i++) {
        var key = SHARED_URN_OBJECT_KEYS_1[_i];
        var value = pickBestObject(rows, key);
        if (!isEmptyValue(value)) {
            shared[key] = value;
        }
    }
    for (var _a = 0, SHARED_URN_ARRAY_KEYS_1 = SHARED_URN_ARRAY_KEYS; _a < SHARED_URN_ARRAY_KEYS_1.length; _a++) {
        var key = SHARED_URN_ARRAY_KEYS_1[_a];
        var value = pickMergedArray(rows, key);
        if (value.length > 0) {
            shared[key] = value;
        }
    }
    return rows.map(function (row) {
        var next = __assign({}, row);
        for (var _i = 0, _a = Object.entries(shared); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (isEmptyValue(next[key])) {
                next[key] = value;
            }
            else if (Array.isArray(value) &&
                Array.isArray(next[key]) &&
                next[key].length < value.length) {
                next[key] = value;
            }
            else if (value &&
                typeof value === 'object' &&
                !Array.isArray(value) &&
                next[key] &&
                typeof next[key] === 'object' &&
                !Array.isArray(next[key])) {
                next[key] = mergeObjectsPreferFilled(next[key], value);
            }
        }
        return next;
    });
}
