"use strict";
/**
 * Shared Mongoose props for raw materials partial-save (vendor ≥1 field per step).
 * Structural fields (id, urnNo, vendorId, dates) stay required on each schema.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RM_PARTIAL_NUMBER = exports.RM_PARTIAL_TEXT = void 0;
/** Was required: true on product/textarea columns — deferred until product confirms. */
exports.RM_PARTIAL_TEXT = { required: false, default: '' };
/** Was required: true on unit grid numbers — deferred until product confirms. */
exports.RM_PARTIAL_NUMBER = { required: false, default: null };
