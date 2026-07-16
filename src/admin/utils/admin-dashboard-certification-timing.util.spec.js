"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_dashboard_certification_timing_util_1 = require("./admin-dashboard-certification-timing.util");
describe('admin-dashboard-certification-timing.util', function () {
    it('maps activity ids to timing stages', function () {
        expect((0, admin_dashboard_certification_timing_util_1.mapActivityIdToTimingStage)(0)).toBe('urn');
        expect((0, admin_dashboard_certification_timing_util_1.mapActivityIdToTimingStage)(1)).toBe('eoi');
        expect((0, admin_dashboard_certification_timing_util_1.mapActivityIdToTimingStage)(4)).toBe('payment');
        expect((0, admin_dashboard_certification_timing_util_1.mapActivityIdToTimingStage)(6)).toBe('review');
        expect((0, admin_dashboard_certification_timing_util_1.mapActivityIdToTimingStage)(7)).toBe('verified');
        expect((0, admin_dashboard_certification_timing_util_1.mapActivityIdToTimingStage)(10)).toBe('certified');
    });
    it('computes stage durations from milestones', function () {
        var milestones = (0, admin_dashboard_certification_timing_util_1.buildUrnMilestones)([
            { activities_id: 0, created_at: new Date('2026-01-01') },
            { activities_id: 1, created_at: new Date('2026-01-04') },
            { activities_id: 5, created_at: new Date('2026-01-09') },
        ], new Date('2026-01-15'));
        var durations = (0, admin_dashboard_certification_timing_util_1.computeStageDurationsFromMilestones)(milestones);
        expect(durations.get('urn')).toBe(3);
        expect(durations.get('eoi')).toBe(5);
        expect(durations.get('review')).toBe(6);
    });
    it('computes end-to-end certification days', function () {
        var milestones = (0, admin_dashboard_certification_timing_util_1.buildUrnMilestones)([{ activities_id: 0, created_at: new Date('2026-01-01') }], new Date('2026-01-21'));
        expect((0, admin_dashboard_certification_timing_util_1.computeEndToEndDays)(milestones, new Date('2026-01-21'))).toBe(20);
        expect((0, admin_dashboard_certification_timing_util_1.daysBetween)(new Date('2026-01-01'), new Date('2026-01-04'))).toBe(3);
    });
});
