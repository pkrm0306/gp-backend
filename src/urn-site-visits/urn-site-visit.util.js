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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSiteVisitRecord = formatSiteVisitRecord;
function formatSiteVisitRecord(doc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var plain = typeof doc.toObject === 'function'
        ? doc.toObject()
        : __assign({}, doc);
    var id = plain._id != null ? String(plain._id) : undefined;
    var urnNo = plain.urnNo != null ? String(plain.urnNo) : undefined;
    var auditConductedOn = (_a = plain.auditConductedOn) !== null && _a !== void 0 ? _a : null;
    var _o = plain, _postalCode = _o.postalCode, _postal_code = _o.postal_code, _v = _o.__v, rest = __rest(_o, ["postalCode", "postal_code", "__v"]);
    return __assign(__assign({}, rest), { _id: id, urnNo: urnNo, urn_no: urnNo, name: plain.name, addressLine1: (_b = plain.addressLine1) !== null && _b !== void 0 ? _b : '', address_line1: (_c = plain.addressLine1) !== null && _c !== void 0 ? _c : '', addressLine2: (_d = plain.addressLine2) !== null && _d !== void 0 ? _d : '', address_line2: (_e = plain.addressLine2) !== null && _e !== void 0 ? _e : '', city: (_f = plain.city) !== null && _f !== void 0 ? _f : '', state: (_g = plain.state) !== null && _g !== void 0 ? _g : '', country: (_h = plain.country) !== null && _h !== void 0 ? _h : '', auditType: (_j = plain.auditType) !== null && _j !== void 0 ? _j : null, audit_type: (_k = plain.auditType) !== null && _k !== void 0 ? _k : null, auditConductedOn: auditConductedOn, audit_conducted_on: auditConductedOn, conductedBy: (_l = plain.conductedBy) !== null && _l !== void 0 ? _l : null, conducted_by: (_m = plain.conductedBy) !== null && _m !== void 0 ? _m : null, createdBy: plain.createdBy != null ? String(plain.createdBy) : null, updatedBy: plain.updatedBy != null ? String(plain.updatedBy) : null, createdAt: plain.createdAt, created_at: plain.createdAt, updatedAt: plain.updatedAt, updated_at: plain.updatedAt, isDeleted: Boolean(plain.isDeleted), is_deleted: Boolean(plain.isDeleted) });
}
