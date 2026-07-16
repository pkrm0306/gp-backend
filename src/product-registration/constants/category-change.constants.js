"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_CHANGE_RENEWAL_MESSAGE = exports.CATEGORY_CHANGE_CERTIFIED_MESSAGE = exports.CATEGORY_CHANGE_LOCKED_MESSAGE = exports.ADMIN_FINAL_SUBMIT_URN_STATUS = exports.CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS = void 0;
/**
 * Category is locked once admin clicks **Submit Final** on the URN tab review
 * (`urnStatus` becomes 6 — "final verification pending" onward).
 */
exports.CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS = 6;
/** `urnStatus` written when admin submits final review for the URN. */
exports.ADMIN_FINAL_SUBMIT_URN_STATUS = exports.CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS;
exports.CATEGORY_CHANGE_LOCKED_MESSAGE = 'Product category cannot be changed after admin final submit. All forms have been sent for final review (urnStatus >= 6).';
exports.CATEGORY_CHANGE_CERTIFIED_MESSAGE = 'Product category cannot be changed for certified products. Category is read-only on certified product edit.';
exports.CATEGORY_CHANGE_RENEWAL_MESSAGE = 'Product category cannot be changed while the URN is in renewal workflow';
