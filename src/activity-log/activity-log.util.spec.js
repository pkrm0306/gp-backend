"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var activity_log_util_1 = require("./activity-log.util");
var activity_workflow_constants_1 = require("./activity-workflow.constants");
describe('activity-log Quick View helpers', function () {
    it('detects site visit auxiliary rows by sub_activities_id', function () {
        expect((0, activity_log_util_1.isAuxiliaryActivityLog)({
            sub_activities_id: 1,
            activity: 'Approve/Reject Registration Fee',
        })).toBe(true);
    });
    it('detects legacy site visit rows by activity prefix', function () {
        expect((0, activity_log_util_1.isAuxiliaryActivityLog)({
            activity: "Admin added site visit 'Plant A' for URN URN-1",
        })).toBe(true);
    });
    it('resolves current workflow activity before auxiliary site visit row', function () {
        var current = (0, activity_log_util_1.resolveCurrentWorkflowActivityLog)([
            {
                activities_id: 4,
                activity_status: 4,
                activity: 'Approve/Reject Registration Fee',
                status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending,
                created_at: new Date('2026-01-01'),
            },
            {
                activities_id: 4,
                activity_status: 4,
                activity: "Admin added site visit 'Plant A' for URN URN-1",
                created_at: new Date('2026-01-02'),
            },
        ], 4);
        expect(current).toMatchObject({
            activities_id: 4,
            activity: 'Approve/Reject Registration Fee',
            status: activity_workflow_constants_1.ActivityWorkflowItemStatus.Pending,
        });
    });
});
