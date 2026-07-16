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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENEW_ELIGIBLE_PRODUCT_STATUS = void 0;
exports.isRenewEligibleProduct = isRenewEligibleProduct;
exports.matchRenewEligibleProducts = matchRenewEligibleProducts;
exports.matchRenewUrnStatusUpdateProducts = matchRenewUrnStatusUpdateProducts;
exports.shouldLimitUrnStatusUpdateToCertifiedProducts = shouldLimitUrnStatusUpdateToCertifiedProducts;
exports.buildProductFilterForUrnStatusUpdate = buildProductFilterForUrnStatusUpdate;
exports.filterRenewEligibleProducts = filterRenewEligibleProducts;
exports.getProductStatusFromDetailsRow = getProductStatusFromDetailsRow;
exports.isRenewEligibleDetailsRow = isRenewEligibleDetailsRow;
exports.filterRenewDetailsRows = filterRenewDetailsRows;
exports.fetchRenewCertifiedEoiSet = fetchRenewCertifiedEoiSet;
exports.filterRenewRowsByCertifiedEoi = filterRenewRowsByCertifiedEoi;
var active_product_filter_1 = require("../../product-registration/constants/active-product.filter");
var product_status_constants_1 = require("../constants/product-status.constants");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
/**
 * Renewal under a URN only includes certified EOIs (`product_status === 2`).
 * Rejected (3), discontinued (4), pending (0/1), etc. are excluded from lists,
 * details, status updates, completion, and EOI-scoped renew documents.
 */
exports.RENEW_ELIGIBLE_PRODUCT_STATUS = product_status_constants_1.PRODUCT_STATUS_CERTIFIED;
function isRenewEligibleProduct(row) {
    return Number(row.productStatus) === exports.RENEW_ELIGIBLE_PRODUCT_STATUS;
}
/** Mongo match: active, non-deleted products with certified status only. */
function matchRenewEligibleProducts(criteria) {
    if (criteria === void 0) { criteria = {}; }
    return (0, active_product_filter_1.matchActiveProducts)(__assign(__assign({}, criteria), { productStatus: exports.RENEW_ELIGIBLE_PRODUCT_STATUS }));
}
/**
 * Same as {@link matchRenewEligibleProducts} — use for PATCH /renew/urn-status and any
 * renewal `urnStatus` write so rejected (3) / discontinued (4) EOIs are never updated.
 */
function matchRenewUrnStatusUpdateProducts(criteria) {
    if (criteria === void 0) { criteria = {}; }
    return matchRenewEligibleProducts(criteria);
}
/** Whether a products.urnStatus patch must be limited to certified EOIs only. */
function shouldLimitUrnStatusUpdateToCertifiedProducts(paymentType, urnStatus) {
    if (String(paymentType !== null && paymentType !== void 0 ? paymentType : '').toLowerCase() === 'renew') {
        return true;
    }
    if (urnStatus != null && (0, renewal_urn_status_constants_1.isRenewalUrnStatus)(Number(urnStatus))) {
        return true;
    }
    return false;
}
function buildProductFilterForUrnStatusUpdate(criteria, paymentType, urnStatus) {
    if (shouldLimitUrnStatusUpdateToCertifiedProducts(paymentType, urnStatus)) {
        return matchRenewUrnStatusUpdateProducts(criteria);
    }
    return (0, active_product_filter_1.matchActiveProducts)(criteria);
}
function filterRenewEligibleProducts(rows) {
    return rows.filter(isRenewEligibleProduct);
}
/** Product row from GET /products/details or renew details bundle. */
function getProductStatusFromDetailsRow(row) {
    var productDetails = row.product_details;
    if ((productDetails === null || productDetails === void 0 ? void 0 : productDetails.productStatus) != null) {
        return Number(productDetails.productStatus);
    }
    if (row.productStatus != null) {
        return Number(row.productStatus);
    }
    return null;
}
function isRenewEligibleDetailsRow(row) {
    var status = getProductStatusFromDetailsRow(row);
    if (status == null || Number.isNaN(status)) {
        return false;
    }
    return isRenewEligibleProduct({ productStatus: status });
}
function filterRenewDetailsRows(rows) {
    return rows.filter(isRenewEligibleDetailsRow);
}
/** Certified EOI numbers on a URN (for filtering per-EOI renew rows/documents). */
function fetchRenewCertifiedEoiSet(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
productModel, urnNo) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, productModel
                        .find(__assign({ urnNo: urnNo.trim() }, matchRenewEligibleProducts()))
                        .select('eoiNo')
                        .lean()
                        .exec()];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, new Set(rows
                            .map(function (row) { var _a; return String((_a = row.eoiNo) !== null && _a !== void 0 ? _a : '').trim(); })
                            .filter(function (eoiNo) { return eoiNo.length > 0; }))];
            }
        });
    });
}
/**
 * Keep URN-level rows (no eoiNo) and rows whose eoiNo is certified on this URN.
 */
function filterRenewRowsByCertifiedEoi(rows, certifiedEoiNos) {
    if (certifiedEoiNos.size === 0) {
        return [];
    }
    return rows.filter(function (row) {
        var eoiNo = row.eoiNo != null ? String(row.eoiNo).trim() : '';
        if (!eoiNo) {
            return true;
        }
        return certifiedEoiNos.has(eoiNo);
    });
}
