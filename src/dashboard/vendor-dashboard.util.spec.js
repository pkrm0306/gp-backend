"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vendor_dashboard_util_1 = require("./vendor-dashboard.util");
describe('vendor-dashboard.util', function () {
    it('calculates trend percent', function () {
        expect((0, vendor_dashboard_util_1.calcTrendPercent)(12, 10)).toBe(20);
        expect((0, vendor_dashboard_util_1.calcTrendPercent)(0, 0)).toBe(0);
        expect((0, vendor_dashboard_util_1.trendDirection)(5)).toBe('up');
        expect((0, vendor_dashboard_util_1.trendDirection)(-3)).toBe('down');
    });
    it('maps recent EOI statuses', function () {
        expect((0, vendor_dashboard_util_1.mapRecentEoiStatus)(2, 11).status).toBe('Certified');
        expect((0, vendor_dashboard_util_1.mapRecentEoiStatus)(3, 11).status).toBe('Rejected');
        expect((0, vendor_dashboard_util_1.mapRecentEoiStatus)(1, 6).status).toBe('Under Review');
        expect((0, vendor_dashboard_util_1.mapRecentEoiStatus)(1, 2).status).toBe('Approved');
    });
});
