"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_dashboard_stats_service_1 = require("./admin-dashboard-stats.service");
describe('AdminDashboardStatsService rejection trend', function () {
    var service = Object.create(admin_dashboard_stats_service_1.AdminDashboardStatsService.prototype);
    var suggestMax = service.suggestRejectionTrendYMax.bind(service);
    it('keeps y-axis max at 1 for low counts', function () {
        expect(suggestMax(0)).toBe(1);
        expect(suggestMax(1)).toBe(1);
    });
    it('scales y-axis max for larger counts', function () {
        expect(suggestMax(3)).toBe(4);
        expect(suggestMax(7)).toBe(10);
    });
});
