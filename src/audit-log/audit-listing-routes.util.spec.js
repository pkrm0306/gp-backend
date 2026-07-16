"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audit_listing_routes_util_1 = require("./audit-listing-routes.util");
describe('isListingAuditPath', function () {
    it('matches common list endpoints', function () {
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/api/admin/products/list')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/api/admin/products/list/filter-options')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/admin/banner/list')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/admin/payments/list')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/website/public/products/certified/list/legacy')).toBe(true);
    });
    it('matches audit log read APIs', function () {
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/admin/audit-log')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/admin/audit-log/filters')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/admin/audit-log/665f1a2b3c4d5e6f7a8b9c0d1')).toBe(true);
    });
    it('matches search, export, and dropdown helpers', function () {
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/countries/search')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/admin/team-member/search/by-name')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/api/sectors/export')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/countries/dropdown')).toBe(true);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/website/public/products/certified/filter-options')).toBe(true);
    });
    it('does not match mutating business routes', function () {
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/payments')).toBe(false);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/payments/urn-1')).toBe(false);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/api/admin/products/urn-status')).toBe(false);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/product-design')).toBe(false);
        expect((0, audit_listing_routes_util_1.isListingAuditPath)('/categories/1')).toBe(false);
    });
});
