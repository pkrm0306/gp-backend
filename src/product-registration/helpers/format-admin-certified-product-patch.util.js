"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeValidTillForApiResponse = normalizeValidTillForApiResponse;
exports.formatAdminCertifiedProductPatchResponse = formatAdminCertifiedProductPatchResponse;
var upload_file_util_1 = require("../../utils/upload-file.util");
var category_change_constants_1 = require("../constants/category-change.constants");
/** Normalize valid-till from DB / Mongoose for admin PATCH responses. */
function normalizeValidTillForApiResponse(value) {
    if (value == null)
        return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value.toISOString();
    }
    var text = String(value).trim();
    if (!text)
        return null;
    var parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? text : parsed.toISOString();
}
/** Flat PATCH payload aligned with admin list EOI rows (includes valid-till aliases). */
function formatAdminCertifiedProductPatchResponse(product, toMongoIdString) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var mongoId = toMongoIdString(product._id);
    var validTillIso = normalizeValidTillForApiResponse((_b = (_a = product.validtillDate) !== null && _a !== void 0 ? _a : product.validTillDate) !== null && _b !== void 0 ? _b : product.valid_till_date);
    var productImageRaw = (_c = product.productImage) !== null && _c !== void 0 ? _c : product.product_image;
    var productImage = productImageRaw != null && String(productImageRaw).trim() !== ''
        ? (0, upload_file_util_1.resolveStoredUploadUrl)(String(productImageRaw).trim()) || null
        : null;
    return {
        _id: mongoId,
        productMongoId: mongoId,
        productName: (_d = product.productName) !== null && _d !== void 0 ? _d : null,
        productDetails: (_e = product.productDetails) !== null && _e !== void 0 ? _e : null,
        urnNo: (_f = product.urnNo) !== null && _f !== void 0 ? _f : null,
        eoiNo: (_g = product.eoiNo) !== null && _g !== void 0 ? _g : null,
        categoryId: toMongoIdString(product.categoryId),
        productImage: productImage,
        productImageUrl: productImage,
        productStatus: Number((_h = product.productStatus) !== null && _h !== void 0 ? _h : 0),
        validtillDate: validTillIso,
        validTill: validTillIso,
        validTillDate: validTillIso,
        valid_till_date: validTillIso,
        updatedDate: (_j = product.updatedDate) !== null && _j !== void 0 ? _j : null,
        categoryEditable: false,
        categoryChangeBlockReason: category_change_constants_1.CATEGORY_CHANGE_CERTIFIED_MESSAGE,
    };
}
