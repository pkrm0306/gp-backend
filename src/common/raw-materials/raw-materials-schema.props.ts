/**
 * Shared Mongoose props for raw materials partial-save (vendor ≥1 field per step).
 * Structural fields (id, urnNo, vendorId, dates) stay required on each schema.
 */

/** Was required: true on product/textarea columns — deferred until product confirms. */
export const RM_PARTIAL_TEXT = { required: false, default: '' } as const;

/** Was required: true on unit grid numbers — deferred until product confirms. */
export const RM_PARTIAL_NUMBER = { required: false, default: 0 } as const;
