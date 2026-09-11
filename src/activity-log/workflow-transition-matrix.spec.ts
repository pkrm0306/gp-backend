import {
  ActivityWorkflowItemStatus,
  PRODUCT_REGISTRATION_ACTIVITY_ID,
  resolveExpectedPendingActivityId,
  workflowActivityName,
  workflowActivityResponsibility,
  workflowForwardNextActivityId,
} from './activity-workflow.constants';
import { ProductRegistrationWorkflowService } from './product-registration-workflow.service';
import { Types } from 'mongoose';

/**
 * Full registration tip matrix (urnStatus + payment hints → expected Current tip).
 * This is the architectural contract Admin + Vendor must both reflect.
 */
describe('Registration workflow transition matrix', () => {
  const cases: Array<{
    urnStatus: number;
    regPay?: number;
    certPay?: number;
    expectedActivityId: number | null;
  }> = [
    { urnStatus: 0, expectedActivityId: 1 },
    { urnStatus: 1, expectedActivityId: 2 },
    { urnStatus: 2, regPay: 0, expectedActivityId: 3 },
    { urnStatus: 2, regPay: 1, expectedActivityId: 4 },
    { urnStatus: 2, regPay: 2, expectedActivityId: 4 },
    { urnStatus: 3, expectedActivityId: 5 },
    { urnStatus: 4, expectedActivityId: 7 },
    { urnStatus: 5, expectedActivityId: 5 },
    { urnStatus: 6, expectedActivityId: 8 },
    { urnStatus: 7, certPay: 0, expectedActivityId: 9 },
    { urnStatus: 7, certPay: 1, expectedActivityId: 10 },
    { urnStatus: 8, certPay: 0, expectedActivityId: 9 },
    { urnStatus: 8, certPay: 1, expectedActivityId: 10 },
    { urnStatus: 9, expectedActivityId: 10 },
    { urnStatus: 10, expectedActivityId: 10 },
    { urnStatus: 11, expectedActivityId: null },
  ];

  it.each(cases)(
    'urnStatus=$urnStatus regPay=$regPay certPay=$certPay → activity $expectedActivityId',
    ({ urnStatus, regPay, certPay, expectedActivityId }) => {
      expect(
        resolveExpectedPendingActivityId(urnStatus, {
          registrationPaymentStatus: regPay ?? null,
          certificationPaymentStatus: certPay ?? null,
        }),
      ).toBe(expectedActivityId);
    },
  );

  it('syncs the full happy-path tip chain 0→11 through structured completes', async () => {
    const vendorId = new Types.ObjectId();
    const manufacturerId = new Types.ObjectId();
    const urnNo = 'URN-MATRIX-E2E';
    const rows: Array<Record<string, unknown>> = [];
    const activityLogModel = {
      find: () => ({
        sort: () => ({
          lean: () => ({
            exec: async () => [...rows],
          }),
        }),
      }),
    };
    const service = new ProductRegistrationWorkflowService(
      activityLogModel as never,
    );
    jest
      .spyOn(service as any, 'saveWorkflowRow')
      .mockImplementation(async (_ctx: any, activityId: number, itemStatus: number) => {
        rows.push({
          urn_no: urnNo,
          activities_id: activityId,
          activity_status: activityId,
          status: itemStatus,
          created_at: new Date(Date.now() + rows.length),
        });
        return { toObject: () => rows[rows.length - 1] };
      });

    const ctx = { vendorId, manufacturerId, urnNo };
    await service.initializeOnProductRegistration(ctx);

    const advances: Array<{
      prev: number;
      next: number;
      hints?: { registrationPaymentStatus?: number; certificationPaymentStatus?: number };
    }> = [
      { prev: 0, next: 1 },
      { prev: 1, next: 2 },
      { prev: 2, next: 2, hints: { registrationPaymentStatus: 1 } },
      { prev: 2, next: 3 },
      { prev: 3, next: 4 },
      { prev: 4, next: 6 },
      { prev: 6, next: 7 },
      { prev: 7, next: 7, hints: { certificationPaymentStatus: 1 } },
      { prev: 7, next: 11 },
    ];

    for (const step of advances) {
      await service.syncToUrnStatus(ctx, step.prev, step.next, step.hints);
      const expected = resolveExpectedPendingActivityId(step.next, step.hints);
      const pending = await service.getCurrentPendingActivityId(urnNo);
      expect(pending).toBe(expected);
    }

    // Final certified tip has no pending
    expect(await service.getCurrentPendingActivityId(urnNo)).toBeNull();
  });

  it('documents Current/Next labels for each expected tip', () => {
    for (const activityId of [1, 2, 3, 4, 5, 7, 8, 9, 10]) {
      expect(workflowActivityName(activityId).length).toBeGreaterThan(3);
      expect(workflowActivityResponsibility(activityId)).toMatch(
        /Admin|Manufacturer/,
      );
      if (activityId !== 10) {
        expect(workflowForwardNextActivityId(activityId)).not.toBeNull();
      }
    }
  });
});
