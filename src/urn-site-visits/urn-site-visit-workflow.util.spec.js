"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urn_site_visit_workflow_util_1 = require("./urn-site-visit-workflow.util");
describe('resolveSiteVisitUrnStatusAfterCreate', function () {
    it('moves process-form-in-progress (3) to site-visit-in-progress (5)', function () {
        expect((0, urn_site_visit_workflow_util_1.resolveSiteVisitUrnStatusAfterCreate)(3)).toEqual({
            shouldUpdate: true,
            nextStatus: 5,
        });
    });
    it('does not change status after vendor submit for review (4)', function () {
        expect((0, urn_site_visit_workflow_util_1.resolveSiteVisitUrnStatusAfterCreate)(4)).toEqual({
            shouldUpdate: false,
            nextStatus: 4,
        });
    });
    it('does not downgrade later workflow stages (6+)', function () {
        expect((0, urn_site_visit_workflow_util_1.resolveSiteVisitUrnStatusAfterCreate)(6)).toEqual({
            shouldUpdate: false,
            nextStatus: 6,
        });
    });
    it('does not bump early payment stages (0–2)', function () {
        for (var _i = 0, _a = [0, 1, 2]; _i < _a.length; _i++) {
            var status_1 = _a[_i];
            expect((0, urn_site_visit_workflow_util_1.resolveSiteVisitUrnStatusAfterCreate)(status_1)).toEqual({
                shouldUpdate: false,
                nextStatus: status_1,
            });
        }
    });
});
