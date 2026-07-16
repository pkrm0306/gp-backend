"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCEPTED_DOCUMENT_SECTION_KEYS = exports.DOCUMENT_SECTION_KEY_ALIASES = exports.DOCUMENT_SECTION_KEY_VALUES = exports.DocumentSectionKey = void 0;
exports.normalizeDocumentSectionKey = normalizeDocumentSectionKey;
var DocumentSectionKey;
(function (DocumentSectionKey) {
    DocumentSectionKey["PRODUCT_DESIGN"] = "product_design";
    DocumentSectionKey["PRODUCT_PERFORMANCE"] = "product_performance";
    DocumentSectionKey["RAW_MATERIALS_HAZARDOUS_PRODUCTS"] = "raw_materials_hazardous_products";
    DocumentSectionKey["RAW_MATERIALS_RECYCLED_CONTENT"] = "raw_materials_recycled_content";
    DocumentSectionKey["RAW_MATERIALS_REGIONAL_MATERIALS"] = "raw_materials_regional_materials";
    DocumentSectionKey["RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS"] = "raw_materials_rapidly_renewable_materials";
    DocumentSectionKey["RAW_MATERIALS_UTILIZATION"] = "raw_materials_utilization";
    DocumentSectionKey["RAW_MATERIALS_GREEN_SUPPLY"] = "raw_materials_green_supply";
    DocumentSectionKey["RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE"] = "raw_materials_elimination_of_formaldehyde";
    DocumentSectionKey["RAW_MATERIALS_RECOVERY"] = "raw_materials_recovery";
    DocumentSectionKey["RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES"] = "raw_materials_elimination_of_ozone_depleting_global_warming_substances";
    DocumentSectionKey["RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME"] = "raw_materials_elimination_of_prohibited_flame";
    DocumentSectionKey["RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS"] = "raw_materials_elimination_of_prohibited_flame_solvents";
    DocumentSectionKey["RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS"] = "raw_materials_elimination_of_prohibited_flame_solvents_products";
    DocumentSectionKey["RAW_MATERIALS_REDUCE_ENVIROMENTAL"] = "raw_materials_reduce_enviromental";
    DocumentSectionKey["RAW_MATERIALS_REDUCE_ENVIRONMENTAL"] = "raw_materials_reduce_environmental";
    DocumentSectionKey["RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS"] = "raw_materials_alternative_raw_materials";
    DocumentSectionKey["RAW_MATERIALS_RAW_MIX_OPTIMIZATION"] = "raw_materials_raw_mix_optimization";
    DocumentSectionKey["RAW_MATERIALS_ADDITIVES"] = "raw_materials_additives";
    DocumentSectionKey["RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS"] = "raw_materials_rmc_alternative_raw_materials";
    DocumentSectionKey["PROCESS_MANUFACTURING"] = "process_manufacturing";
    DocumentSectionKey["PROCESS_WASTE_MANAGEMENT"] = "process_waste_management";
    DocumentSectionKey["PROCESS_LIFE_CYCLE_APPROACH"] = "process_life_cycle_approach";
    DocumentSectionKey["PROCESS_PRODUCT_STEWARDSHIP"] = "process_product_stewardship";
    DocumentSectionKey["PROCESS_INNOVATION"] = "process_innovation";
})(DocumentSectionKey || (exports.DocumentSectionKey = DocumentSectionKey = {}));
exports.DOCUMENT_SECTION_KEY_VALUES = Object.values(DocumentSectionKey);
exports.DOCUMENT_SECTION_KEY_ALIASES = (_a = {},
    _a[DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL] = DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
    _a);
exports.ACCEPTED_DOCUMENT_SECTION_KEYS = __spreadArray(__spreadArray([], exports.DOCUMENT_SECTION_KEY_VALUES, true), Object.keys(exports.DOCUMENT_SECTION_KEY_ALIASES), true);
function normalizeDocumentSectionKey(sectionKey) {
    var key = sectionKey === null || sectionKey === void 0 ? void 0 : sectionKey.trim();
    if (!key) {
        return '';
    }
    return exports.DOCUMENT_SECTION_KEY_ALIASES[key] || key;
}
