"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLANT_MERGE_STATUS = exports.PLANT_MERGE_STRATEGY_URN_COPY = exports.PLANT_MERGE_STRATEGY_ABSORB = exports.PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS = void 0;
/** Mongo collection names reconciled when plants are merged (URN-level unit rows). */
exports.PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS = [
    'process_mp_manufacturing_units',
    'process_wm_manufacturing_units',
    'raw_materials_utilization_manufacturing_units',
];
exports.PLANT_MERGE_STRATEGY_ABSORB = 'absorb_soft_delete_source';
/** Copy source product plants onto a target product (URN-level merge). */
exports.PLANT_MERGE_STRATEGY_URN_COPY = 'urn_copy_plants';
exports.PLANT_MERGE_STATUS = {
    COMPLETED: 'completed',
};
