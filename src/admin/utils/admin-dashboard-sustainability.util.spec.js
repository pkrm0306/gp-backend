"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_dashboard_sustainability_util_1 = require("./admin-dashboard-sustainability.util");
describe('admin-dashboard-sustainability.util', function () {
    it('averages positive percentages', function () {
        expect((0, admin_dashboard_sustainability_util_1.averagePositivePercent)([80, 90, -5, 0])).toBe(85);
        expect((0, admin_dashboard_sustainability_util_1.averagePositivePercent)([])).toBe(0);
    });
    it('clamps percent values', function () {
        expect((0, admin_dashboard_sustainability_util_1.clampPercent)(120)).toBe(100);
        expect((0, admin_dashboard_sustainability_util_1.clampPercent)(-10)).toBe(0);
    });
    it('reads max recycled percent from RMC row', function () {
        expect((0, admin_dashboard_sustainability_util_1.maxRecycledPercentFromRmcRow)({
            percentYear1Recycled: 10,
            percentYear3Recycled: 68,
        })).toBe(68);
    });
    it('scores renewable carbon utilization', function () {
        expect((0, admin_dashboard_sustainability_util_1.renewableCarbonScore)({ renewableEnergyUtilization: 'yes' })).toBe(100);
        expect((0, admin_dashboard_sustainability_util_1.renewableCarbonScore)({
            reWind: 40,
            offsiteRenewablePower: 30,
        })).toBe(70);
    });
});
