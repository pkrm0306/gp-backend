import {
  isAuxiliaryActivityLog,
  resolveCurrentWorkflowActivityLog,
} from './activity-log.util';
import { ActivityWorkflowItemStatus } from './activity-workflow.constants';

describe('activity-log Quick View helpers', () => {
  it('detects site visit auxiliary rows by sub_activities_id', () => {
    expect(
      isAuxiliaryActivityLog({
        sub_activities_id: 1,
        activity: 'Approve/Reject Registration Fee',
      }),
    ).toBe(true);
  });

  it('detects legacy site visit rows by activity prefix', () => {
    expect(
      isAuxiliaryActivityLog({
        activity: "Admin added site visit 'Plant A' for URN URN-1",
      }),
    ).toBe(true);
  });

  it('resolves current workflow activity before auxiliary site visit row', () => {
    const current = resolveCurrentWorkflowActivityLog(
      [
        {
          activities_id: 4,
          activity_status: 4,
          activity: 'Approve/Reject Registration Fee',
          status: ActivityWorkflowItemStatus.Pending,
          created_at: new Date('2026-01-01'),
        },
        {
          activities_id: 4,
          activity_status: 4,
          activity: "Admin added site visit 'Plant A' for URN URN-1",
          created_at: new Date('2026-01-02'),
        },
      ],
      4,
    );

    expect(current).toMatchObject({
      activities_id: 4,
      activity: 'Approve/Reject Registration Fee',
      status: ActivityWorkflowItemStatus.Pending,
    });
  });

  it('reopens activity after Done when a newer Pending exists (reject/resend)', () => {
    const current = resolveCurrentWorkflowActivityLog(
      [
        {
          activities_id: 5,
          activity_status: 5,
          activity: 'Process Forms in Progress',
          status: ActivityWorkflowItemStatus.Done,
          created_at: new Date('2026-01-01'),
        },
        {
          activities_id: 7,
          activity_status: 7,
          activity: 'Review & Submit for Final Review',
          status: ActivityWorkflowItemStatus.Pending,
          created_at: new Date('2026-01-02'),
        },
        {
          activities_id: 5,
          activity_status: 5,
          activity: 'Process Forms in Progress',
          status: ActivityWorkflowItemStatus.Pending,
          created_at: new Date('2026-01-03'),
        },
      ],
      5,
    );

    expect(current).toMatchObject({
      activities_id: 5,
      status: ActivityWorkflowItemStatus.Pending,
    });
  });
});
