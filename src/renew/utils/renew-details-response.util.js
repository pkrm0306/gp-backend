"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRenewDetailsInclude = parseRenewDetailsInclude;
exports.buildRenewDetailsHttpResponse = buildRenewDetailsHttpResponse;
function parseRenewDetailsInclude(raw) {
    var value = String(raw !== null && raw !== void 0 ? raw : '').trim().toLowerCase();
    return value === 'full' ? 'full' : 'summary';
}
function buildCompactProductDetailsList(rows) {
    return rows.map(function (row) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var productDetails = ((_a = row.product_details) !== null && _a !== void 0 ? _a : {});
        var plants = (_b = row.plants) !== null && _b !== void 0 ? _b : [];
        var eoiNo = String((_d = (_c = productDetails.eoiNo) !== null && _c !== void 0 ? _c : row.eoiNo) !== null && _d !== void 0 ? _d : '').trim();
        var plantsForEoi = eoiNo
            ? plants.filter(function (plant) { var _a; return String((_a = plant.eoiNo) !== null && _a !== void 0 ? _a : '').trim() === eoiNo; })
            : plants;
        var unitCount = Number((_g = (_f = (_e = productDetails.plantCount) !== null && _e !== void 0 ? _e : productDetails.hpUnits) !== null && _f !== void 0 ? _f : plantsForEoi.length) !== null && _g !== void 0 ? _g : 0);
        return {
            eoiNo: (_j = (_h = productDetails.eoiNo) !== null && _h !== void 0 ? _h : row.eoiNo) !== null && _j !== void 0 ? _j : null,
            productName: (_l = (_k = productDetails.productName) !== null && _k !== void 0 ? _k : row.productName) !== null && _l !== void 0 ? _l : null,
            productStatus: (_o = (_m = productDetails.productStatus) !== null && _m !== void 0 ? _m : row.productStatus) !== null && _o !== void 0 ? _o : null,
            hpUnits: unitCount,
            plantCount: unitCount,
            product_details: productDetails,
        };
    });
}
function buildVendorSummary(first) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var vendor = first.vendor;
    if (!vendor) {
        return null;
    }
    var manufacturer = first.manufacturer;
    var company = (_d = (_c = (_b = (_a = vendor.companyName) !== null && _a !== void 0 ? _a : vendor.manufacturerName) !== null && _b !== void 0 ? _b : vendor.vendor_name) !== null && _c !== void 0 ? _c : manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _d !== void 0 ? _d : null;
    return {
        _id: (_e = vendor._id) !== null && _e !== void 0 ? _e : null,
        company: company,
        contact: (_f = vendor.contactName) !== null && _f !== void 0 ? _f : company,
        email: (_h = (_g = vendor.vendor_email) !== null && _g !== void 0 ? _g : vendor.email) !== null && _h !== void 0 ? _h : null,
        phone: (_k = (_j = vendor.vendor_phone) !== null && _j !== void 0 ? _j : vendor.phone) !== null && _k !== void 0 ? _k : null,
    };
}
function buildRenewDetailsHttpResponse(result, include) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var first = ((_a = result.data[0]) !== null && _a !== void 0 ? _a : {});
    var category = (_c = (_b = result.category) !== null && _b !== void 0 ? _b : first.category) !== null && _c !== void 0 ? _c : null;
    var vendor = (_d = result.vendor) !== null && _d !== void 0 ? _d : buildVendorSummary(first);
    var urnContext = (_e = result.urnContext) !== null && _e !== void 0 ? _e : {
        urnNo: result.renewContext.urnNo,
        urnStatus: result.renewContext.urnStatus,
        productRenewStatus: result.renewContext.productRenewStatus,
        product_renew_status: result.renewContext.productRenewStatus,
        renewCycleNo: result.renewContext.renewCycleNo,
        vendorId: result.renewContext.vendorId,
        manufacturerId: result.renewContext.manufacturerId,
        renewalCycleId: result.renewContext.renewalCycleId,
    };
    var productDetailsList = include === 'full'
        ? ((_f = result.product_details_list) !== null && _f !== void 0 ? _f : buildCompactProductDetailsList(result.data))
        : result.data;
    var body = {
        success: true,
        message: 'Renew details fetched successfully',
        data: result.data,
        product_details_list: productDetailsList,
        products: result.products,
        manufacturer: result.manufacturer,
        manufacturing_details: result.manufacturing_details,
        plants: result.plants,
        plant_details: result.plant_details,
        all_renew_product_documents: result.all_renew_product_documents,
        all_urn_product_documents: result.all_urn_product_documents,
        documents: result.documents,
        renewContext: result.renewContext,
        urnContext: urnContext,
        siteVisits: result.siteVisits,
        site_visits: result.siteVisits,
    };
    if (include === 'full') {
        body.payment = (_g = result.payment) !== null && _g !== void 0 ? _g : null;
        body.payments = (_h = result.payments) !== null && _h !== void 0 ? _h : [];
        body.category = category;
        body.vendor = vendor;
        if (result.tabReviews !== undefined) {
            body.tabReviews = result.tabReviews;
        }
        if (result.processComments !== undefined) {
            body.processComments = result.processComments;
        }
    }
    return body;
}
