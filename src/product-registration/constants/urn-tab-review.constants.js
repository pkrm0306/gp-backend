"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROCESS_TAB_LABELS = exports.RAW_MATERIAL_STEP_TITLES = exports.PROCESS_TAB_STEP_ID = exports.PROCESS_TAB_REVIEW_KEYS = exports.RAW_MATERIALS_TAB_KEY = exports.ADMIN_REVIEW_URN_STATUS = exports.VENDOR_RESUBMIT_URN_STATUS = exports.URN_TAB_REVIEW_STATUS = void 0;
/** Admin review: `0` = pending, `1` = approved, `2` = rejected */
exports.URN_TAB_REVIEW_STATUS = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
};
/** Admin sent URN back to vendor for corrections — vendor may edit rejected tabs only. */
exports.VENDOR_RESUBMIT_URN_STATUS = 5;
/** Admin review in progress — vendor process tabs locked. */
exports.ADMIN_REVIEW_URN_STATUS = 4;
exports.RAW_MATERIALS_TAB_KEY = 'raw-materials';
exports.PROCESS_TAB_REVIEW_KEYS = [
    'product-design',
    'product-performance',
    'manufacturing-process',
    'waste-management',
    'life-cycle-approach',
    'product-stewardship',
    'innovation',
];
/** Stored `stepId` for process tabs (API omits or sends null). */
exports.PROCESS_TAB_STEP_ID = 0;
exports.RAW_MATERIAL_STEP_TITLES = {
    1: 'Elimination of Hazardous Substances',
    2: 'Recycled Content',
    3: 'Regional Materials',
    4: 'Rapidly Renewable Materials',
    5: 'Green Supply Chain Management',
    6: 'Elimination of Formaldehyde',
    7: 'Recovery',
    8: 'Elimination of Ozone Depleting / Global Warming Substances',
    9: 'Elimination of Prohibited Flame Retardants',
    10: 'Elimination of Prohibited Flame Solvents',
    11: 'Reduce Environmental Impacts',
    12: 'Utilization of Alternative Raw Materials',
    13: 'Optimization of Raw Mix',
    14: 'Additives',
    15: 'Utilization RMC Alternative Raw Materials',
};
exports.PROCESS_TAB_LABELS = {
    'product-design': 'Product Design',
    'product-performance': 'Product Performance',
    'manufacturing-process': 'Manufacturing Process',
    'waste-management': 'Waste Management',
    'life-cycle-approach': 'Life Cycle Approach',
    'product-stewardship': 'Product Stewardship',
    innovation: 'Innovation',
};
