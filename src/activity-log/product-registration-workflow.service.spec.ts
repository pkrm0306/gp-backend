import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  ActivityWorkflowItemStatus,
  PRODUCT_REGISTRATION_ACTIVITY_ID,
} from './activity-workflow.constants';
import { ProductRegistrationWorkflowService } from './product-registration-workflow.service';

describe('ProductRegistrationWorkflowService', () => {
  const vendorId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();
  const urnNo = 'URN-202606250001';

  function createService(savedRows: Record<string, unknown>[] = []) {
    const rows = [...savedRows];
    const activityLogModel = {
      find: jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockImplementation(async () => [...rows]),
          }),
        }),
      })),
    };

    const service = new ProductRegistrationWorkflowService(activityLogModel as never);

    const saveSpy = jest
      .spyOn(service as any, 'saveWorkflowRow')
      .mockImplementation(async (_ctx: any, activityId: number, itemStatus: number) => {
        rows.push({
          urn_no: urnNo,
          activities_id: activityId,
          activity_status: activityId,
          status: itemStatus,
          created_at: new Date(Date.now() + rows.length),
        });
        return { toObject: () => rows[rows.length - 1] } as any;
      });

    return { service, rows, activityLogModel, saveSpy };
  }

  const ctx = { vendorId, manufacturerId, urnNo };

  it('initializes registration with step 0 Done and step 1 Pending', async () => {
    const { service, saveSpy } = createService();
    await service.initializeOnProductRegistration(ctx);

    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION,
      ActivityWorkflowItemStatus.Done,
    );
    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
      ActivityWorkflowItemStatus.Pending,
    );
  });

  it('completes the current pending activity and activates the next step', async () => {
    const { service, saveSpy } = createService([
      {
        urn_no: urnNo,
        activities_id: PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
        status: ActivityWorkflowItemStatus.Pending,
        created_at: new Date(),
      },
    ]);

    await service.completeActivity(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
    );

    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
      ActivityWorkflowItemStatus.Done,
    );
    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE,
      ActivityWorkflowItemStatus.Pending,
    );
  });

  it('rejects product approval by re-opening product registration as Pending', async () => {
    const { service, saveSpy } = createService([
      {
        urn_no: urnNo,
        activities_id: PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
        status: ActivityWorkflowItemStatus.Pending,
        created_at: new Date(),
      },
    ]);

    await service.rejectActivity(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
    );

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION,
      ActivityWorkflowItemStatus.Pending,
    );
  });

  it('prevents completing a non-pending activity', async () => {
    const { service } = createService([
      {
        urn_no: urnNo,
        activities_id: PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE,
        status: ActivityWorkflowItemStatus.Pending,
        created_at: new Date(),
      },
    ]);

    await expect(
      service.completeActivity(
        ctx,
        PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('syncs urn status 0→1 by completing Product Approve/Reject (not reject oscillation)', async () => {
    const { service, saveSpy, rows } = createService([
      {
        urn_no: urnNo,
        activities_id: PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
        status: ActivityWorkflowItemStatus.Pending,
        created_at: new Date(),
      },
    ]);

    await service.syncToUrnStatus(ctx, 0, 1);

    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
      ActivityWorkflowItemStatus.Done,
    );
    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE,
      ActivityWorkflowItemStatus.Pending,
    );
    expect(
      rows.filter(
        (r) =>
          r.activities_id ===
            PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION &&
          r.status === ActivityWorkflowItemStatus.Pending,
      ),
    ).toHaveLength(0);
    expect(
      rows.filter(
        (r) =>
          r.activities_id ===
            PRODUCT_REGISTRATION_ACTIVITY_ID.ASSIGN_REGISTRATION_FEE &&
          r.status === ActivityWorkflowItemStatus.Pending,
      ),
    ).toHaveLength(1);
  });

  it('syncs reject-style urn status rollback via reject when complete cannot reach target', async () => {
    const { service, saveSpy } = createService([
      {
        urn_no: urnNo,
        activities_id:
          PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW,
        status: ActivityWorkflowItemStatus.Pending,
        created_at: new Date(),
      },
    ]);

    // urnStatus 4 → 5 maps pending 7 (Review) → 5 (Process forms)
    await service.syncToUrnStatus(ctx, 4, 5);

    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS,
      ActivityWorkflowItemStatus.Pending,
    );
  });

  it('syncs urn status 4 to review pending without using legacy step 6', async () => {
    const { service, saveSpy } = createService([
      {
        urn_no: urnNo,
        activities_id: PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS,
        status: ActivityWorkflowItemStatus.Pending,
        created_at: new Date(),
      },
    ]);

    await service.syncToUrnStatus(ctx, 3, 4);

    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PROCESS_FORMS_IN_PROGRESS,
      ActivityWorkflowItemStatus.Done,
    );
    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.REVIEW_SUBMIT_FINAL_REVIEW,
      ActivityWorkflowItemStatus.Pending,
    );
  });

  it('completes workflow when urn status reaches certified (11)', async () => {
    const { service, saveSpy } = createService([
      {
        urn_no: urnNo,
        activities_id:
          PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE,
        status: ActivityWorkflowItemStatus.Pending,
        created_at: new Date(),
      },
    ]);

    await service.syncToUrnStatus(ctx, 10, 11);

    expect(saveSpy).toHaveBeenCalledWith(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE,
      ActivityWorkflowItemStatus.Done,
    );
  });
});
