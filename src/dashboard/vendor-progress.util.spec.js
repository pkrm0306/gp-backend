"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vendor_progress_util_1 = require("./vendor-progress.util");
describe('vendor-progress.util', function () {
    it('always returns 11 certification journey steps (renewal excluded)', function () {
        var steps = (0, vendor_progress_util_1.buildDynamicProgressSteps)(0, []);
        expect(steps).toHaveLength(vendor_progress_util_1.CERTIFICATION_JOURNEY_STEP_COUNT);
        expect(steps.some(function (step) { return /renewal/i.test(step.label); })).toBe(false);
    });
    it('marks only completed steps for urnStatus 3', function () {
        var statuses = (0, vendor_progress_util_1.resolveJourneyStepStatuses)(3);
        expect(statuses.filter(function (status) { return status === 'completed'; })).toHaveLength(3);
        expect(statuses[3]).toBe('active');
        expect(statuses.slice(4).every(function (status) { return status === 'pending'; })).toBe(true);
    });
    it('marks all steps complete when urnStatus is certified (11)', function () {
        var statuses = (0, vendor_progress_util_1.resolveJourneyStepStatuses)(11);
        expect(statuses.every(function (status) { return status === 'completed'; })).toBe(true);
    });
    it('maps urnStatus 4 to review step as active with legacy submission complete', function () {
        var _a, _b, _c, _d;
        var steps = (0, vendor_progress_util_1.buildDynamicProgressSteps)(4, []);
        expect((_a = steps[6]) === null || _a === void 0 ? void 0 : _a.label).toBe('Process Forms Submission');
        expect((_b = steps[6]) === null || _b === void 0 ? void 0 : _b.status).toBe('completed');
        expect((_c = steps[7]) === null || _c === void 0 ? void 0 : _c.status).toBe('active');
        expect((_d = steps[8]) === null || _d === void 0 ? void 0 : _d.status).toBe('pending');
    });
    it('computes percent complete from completed steps only', function () {
        var _a, _b;
        var tracking = (0, vendor_progress_util_1.buildVendorProgressTracking)({
            urnNo: 'URN-TEST-001',
            urnStatus: 3,
            activityLogs: [],
        });
        expect(tracking.progressSteps).toHaveLength(vendor_progress_util_1.CERTIFICATION_JOURNEY_STEP_COUNT);
        expect(tracking.percentComplete).toBe(27);
        expect((_a = tracking.nextStep) === null || _a === void 0 ? void 0 : _a.activitiesId).toBe(3);
        expect((_b = tracking.latestStepCompleted) === null || _b === void 0 ? void 0 : _b.activitiesId).toBe(2);
    });
});
