"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOGGLEABLE_DISCONTINUE_STATUSES = exports.PRODUCT_STATUS_DISCONTINUED = exports.PRODUCT_STATUS_REJECTED = exports.PRODUCT_STATUS_CERTIFIED = exports.PRODUCT_STATUS_SUBMITTED = exports.PRODUCT_STATUS_PENDING = void 0;
/** EOI / product lifecycle status codes used across certification and renewal flows. */
exports.PRODUCT_STATUS_PENDING = 0;
exports.PRODUCT_STATUS_SUBMITTED = 1;
exports.PRODUCT_STATUS_CERTIFIED = 2;
exports.PRODUCT_STATUS_REJECTED = 3;
exports.PRODUCT_STATUS_DISCONTINUED = 4;
exports.TOGGLEABLE_DISCONTINUE_STATUSES = [
    exports.PRODUCT_STATUS_CERTIFIED,
    exports.PRODUCT_STATUS_DISCONTINUED,
];
