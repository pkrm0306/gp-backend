"use strict";
/**
 * Vendor dashboard — Applications & URNs table display labels.
 * Source of truth: products.productStatus, products.urnStatus (productType = 0).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProductApproval = mapProductApproval;
exports.mapCertification = mapCertification;
exports.mapOverall = mapOverall;
exports.mapSiteVisit = mapSiteVisit;
exports.formatUrnForDisplay = formatUrnForDisplay;
exports.buildVendorApplicationRow = buildVendorApplicationRow;
function mapProductApproval(productStatus) {
    if (productStatus === 3)
        return 'Rejected';
    if (productStatus === 0)
        return 'Pending';
    return 'Approved';
}
function mapCertification(productStatus) {
    return productStatus === 2 ? 'Certified' : 'Not certified';
}
function mapOverall(productStatus) {
    if (productStatus === 2) {
        return { overall: 'Certified', overall_variant: 'certified' };
    }
    if (productStatus === 3) {
        return { overall: 'Rejected', overall_variant: 'rejected' };
    }
    return { overall: 'Pending', overall_variant: 'pending' };
}
/** Site visit column — derived from URN lifecycle (no dedicated DB field). */
function mapSiteVisit(urnStatus) {
    if (urnStatus >= 6)
        return 'Completed';
    if (urnStatus === 5)
        return 'In progress';
    return null;
}
function formatUrnForDisplay(urnNo) {
    var v = String(urnNo !== null && urnNo !== void 0 ? urnNo : '').trim();
    return v.length > 0 ? v : null;
}
function formatValidTillDate(value) {
    if (value == null || value === '')
        return null;
    var d = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(d.getTime()))
        return null;
    return d.toISOString();
}
function buildVendorApplicationRow(input) {
    var _a, _b, _c, _d;
    var product_status = Number((_a = input.productStatus) !== null && _a !== void 0 ? _a : 0);
    var urn_status = Number((_b = input.urnStatus) !== null && _b !== void 0 ? _b : 0);
    var _e = mapOverall(product_status), overall = _e.overall, overall_variant = _e.overall_variant;
    return {
        product_id: input.productId,
        urn_no: formatUrnForDisplay(input.urnNo),
        eoi_no: String((_c = input.eoiNo) !== null && _c !== void 0 ? _c : '').trim(),
        product_name: String((_d = input.productName) !== null && _d !== void 0 ? _d : '').trim(),
        product_approval: mapProductApproval(product_status),
        site_visit: mapSiteVisit(urn_status),
        certification: mapCertification(product_status),
        overall: overall,
        overall_variant: overall_variant,
        product_status: product_status,
        urn_status: urn_status,
        validtill_date: formatValidTillDate(input.validtillDate),
    };
}
