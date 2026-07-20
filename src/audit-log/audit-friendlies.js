"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUDIT_ACTION_TYPE = exports.AUDIT_MODULE_CONFIG = exports.AUDIT_MODULE = void 0;
exports.auditModuleDisplayName = auditModuleDisplayName;
/** User-facing module bucket (keep values stable for admin grids). */
exports.AUDIT_MODULE = {
    ADMIN: 'admin',
    ACTIVITY_LOG: 'activity_log',
    ARTICLE: 'article',
    CATEGORY: 'category',
    CERTIFICATION: 'certification',
    AUTH: 'auth',
    BANNER: 'banner',
    CONTACT: 'contact',
    COUNTRY: 'country',
    DASHBOARD: 'dashboard',
    DOCUMENT: 'document',
    EVENT: 'event',
    GALLERY: 'gallery',
    MANUFACTURER: 'manufacturer',
    MANUFACTURER_INQUIRY: 'manufacturer_inquiry',
    NEWSLETTER: 'newsletter',
    PARTNER: 'partner',
    PAYMENT: 'payment',
    PROCESS: 'process',
    PRODUCT: 'product',
    PROPOSAL: 'proposal',
    RAW_MATERIALS: 'raw_materials',
    RBAC: 'rbac',
    SECTOR: 'sector',
    SPOC_ALLOCATION: 'spoc_allocation',
    STANDARD: 'standard',
    STATE: 'state',
    SUMMIT: 'summit',
    TEAM_MEMBER: 'team_member',
    USER: 'user',
    WEBSITE: 'website',
    ZOHO: 'zoho',
    OTHER: 'other',
};
exports.AUDIT_MODULE_CONFIG = (_a = {},
    _a[exports.AUDIT_MODULE.ADMIN] = { value: exports.AUDIT_MODULE.ADMIN, displayName: 'Admin' },
    _a[exports.AUDIT_MODULE.ACTIVITY_LOG] = {
        value: exports.AUDIT_MODULE.ACTIVITY_LOG,
        displayName: 'Activity Log',
    },
    _a[exports.AUDIT_MODULE.ARTICLE] = {
        value: exports.AUDIT_MODULE.ARTICLE,
        displayName: 'Article',
    },
    _a[exports.AUDIT_MODULE.CATEGORY] = {
        value: exports.AUDIT_MODULE.CATEGORY,
        displayName: 'Category',
    },
    _a[exports.AUDIT_MODULE.CERTIFICATION] = {
        value: exports.AUDIT_MODULE.CERTIFICATION,
        displayName: 'Certification',
    },
    _a[exports.AUDIT_MODULE.AUTH] = { value: exports.AUDIT_MODULE.AUTH, displayName: 'Auth' },
    _a[exports.AUDIT_MODULE.BANNER] = { value: exports.AUDIT_MODULE.BANNER, displayName: 'Banner' },
    _a[exports.AUDIT_MODULE.CONTACT] = {
        value: exports.AUDIT_MODULE.CONTACT,
        displayName: 'Contact',
    },
    _a[exports.AUDIT_MODULE.COUNTRY] = {
        value: exports.AUDIT_MODULE.COUNTRY,
        displayName: 'Country',
    },
    _a[exports.AUDIT_MODULE.DASHBOARD] = {
        value: exports.AUDIT_MODULE.DASHBOARD,
        displayName: 'Dashboard',
    },
    _a[exports.AUDIT_MODULE.DOCUMENT] = {
        value: exports.AUDIT_MODULE.DOCUMENT,
        displayName: 'Document',
    },
    _a[exports.AUDIT_MODULE.EVENT] = { value: exports.AUDIT_MODULE.EVENT, displayName: 'Event' },
    _a[exports.AUDIT_MODULE.GALLERY] = {
        value: exports.AUDIT_MODULE.GALLERY,
        displayName: 'Gallery',
    },
    _a[exports.AUDIT_MODULE.MANUFACTURER] = {
        value: exports.AUDIT_MODULE.MANUFACTURER,
        displayName: 'Manufacturer',
    },
    _a[exports.AUDIT_MODULE.MANUFACTURER_INQUIRY] = {
        value: exports.AUDIT_MODULE.MANUFACTURER_INQUIRY,
        displayName: 'Manufacturer Inquiry',
    },
    _a[exports.AUDIT_MODULE.NEWSLETTER] = {
        value: exports.AUDIT_MODULE.NEWSLETTER,
        displayName: 'Newsletter',
    },
    _a[exports.AUDIT_MODULE.PARTNER] = {
        value: exports.AUDIT_MODULE.PARTNER,
        displayName: 'Partner',
    },
    _a[exports.AUDIT_MODULE.PAYMENT] = {
        value: exports.AUDIT_MODULE.PAYMENT,
        displayName: 'Payment',
    },
    _a[exports.AUDIT_MODULE.PROCESS] = {
        value: exports.AUDIT_MODULE.PROCESS,
        displayName: 'Process',
    },
    _a[exports.AUDIT_MODULE.PRODUCT] = {
        value: exports.AUDIT_MODULE.PRODUCT,
        displayName: 'Product',
    },
    _a[exports.AUDIT_MODULE.PROPOSAL] = {
        value: exports.AUDIT_MODULE.PROPOSAL,
        displayName: 'Proposal',
    },
    _a[exports.AUDIT_MODULE.RAW_MATERIALS] = {
        value: exports.AUDIT_MODULE.RAW_MATERIALS,
        displayName: 'Raw Materials',
    },
    _a[exports.AUDIT_MODULE.RBAC] = { value: exports.AUDIT_MODULE.RBAC, displayName: 'RBAC' },
    _a[exports.AUDIT_MODULE.SECTOR] = { value: exports.AUDIT_MODULE.SECTOR, displayName: 'Sector' },
    _a[exports.AUDIT_MODULE.SPOC_ALLOCATION] = {
        value: exports.AUDIT_MODULE.SPOC_ALLOCATION,
        displayName: 'SPOC Allocation',
    },
    _a[exports.AUDIT_MODULE.STANDARD] = {
        value: exports.AUDIT_MODULE.STANDARD,
        displayName: 'Standard',
    },
    _a[exports.AUDIT_MODULE.STATE] = { value: exports.AUDIT_MODULE.STATE, displayName: 'State' },
    _a[exports.AUDIT_MODULE.SUMMIT] = { value: exports.AUDIT_MODULE.SUMMIT, displayName: 'Summit' },
    _a[exports.AUDIT_MODULE.TEAM_MEMBER] = {
        value: exports.AUDIT_MODULE.TEAM_MEMBER,
        displayName: 'Team Member',
    },
    _a[exports.AUDIT_MODULE.USER] = { value: exports.AUDIT_MODULE.USER, displayName: 'User' },
    _a[exports.AUDIT_MODULE.WEBSITE] = {
        value: exports.AUDIT_MODULE.WEBSITE,
        displayName: 'Website',
    },
    _a[exports.AUDIT_MODULE.ZOHO] = { value: exports.AUDIT_MODULE.ZOHO, displayName: 'Zoho' },
    _a[exports.AUDIT_MODULE.OTHER] = { value: exports.AUDIT_MODULE.OTHER, displayName: 'Other' },
    _a);
function auditModuleDisplayName(module) {
    var _a, _b;
    if (!module) {
        return null;
    }
    return ((_b = (_a = exports.AUDIT_MODULE_CONFIG[module]) === null || _a === void 0 ? void 0 : _a.displayName) !== null && _b !== void 0 ? _b : module
        .split('_')
        .filter(Boolean)
        .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
        .join(' '));
}
exports.AUDIT_ACTION_TYPE = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    APPROVE: 'approve',
    REJECT: 'reject',
    LOGIN: 'login',
};
