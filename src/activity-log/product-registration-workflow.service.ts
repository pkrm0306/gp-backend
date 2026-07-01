import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
} from './schemas/activity-log.schema';
import {
  ActivityWorkflowItemStatus,
  PRODUCT_REGISTRATION_ACTIVITY_ID,
  URN_STATUS_PENDING_ACTIVITY,
  WORKFLOW_COMPLETE_NEXT,
  WORKFLOW_REJECT_TARGET,
  workflowActivityName,
  workflowActivityResponsibility,
  workflowForwardNextActivityId,
} from './activity-workflow.constants';
import { isAuxiliaryActivityLog, urnCandidates } from './activity-log.util';

export type WorkflowTransitionContext = {
  vendorId: string | Types.ObjectId;
  manufacturerId: string | Types.ObjectId;
  urnNo: string;
  session?: ClientSession;
};

@Injectable()
export class ProductRegistrationWorkflowService {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
  ) {}

  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) return id;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  private normalizeUrn(urnNo: string): string {
    return String(urnNo ?? '').trim();
  }

  private buildNextFields(activityId: number): {
    next_acitivities_id?: number;
    next_activity?: string;
    next_responsibility?: string;
  } {
    const nextId = workflowForwardNextActivityId(activityId);
    if (nextId == null) {
      return {
        next_activity: 'Workflow Completed',
        next_responsibility: undefined,
      };
    }
    return {
      next_acitivities_id: nextId,
      next_activity: workflowActivityName(nextId),
      next_responsibility: workflowActivityResponsibility(nextId),
    };
  }

  private async saveWorkflowRow(
    ctx: WorkflowTransitionContext,
    activityId: number,
    itemStatus: ActivityWorkflowItemStatus,
  ): Promise<ActivityLogDocument> {
    const urnNo = this.normalizeUrn(ctx.urnNo);
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }

    const nextFields = this.buildNextFields(activityId);
    const row = new this.activityLogModel({
      vendor_id: this.toObjectId(ctx.vendorId, 'vendor_id'),
      manufacturer_id: this.toObjectId(ctx.manufacturerId, 'manufacturer_id'),
      urn_no: urnNo,
      activities_id: activityId,
      activity: workflowActivityName(activityId),
      activity_status: activityId,
      responsibility: workflowActivityResponsibility(activityId),
      ...nextFields,
      status: itemStatus,
    });

    if (ctx.session) {
      return row.save({ session: ctx.session });
    }
    return row.save();
  }

  /** Product registered — step 0 Done, step 1 Pending. */
  async initializeOnProductRegistration(
    ctx: WorkflowTransitionContext,
  ): Promise<void> {
    const urnNo = this.normalizeUrn(ctx.urnNo);
    const existing = await this.getCurrentPendingActivityId(urnNo);
    if (existing != null) return;

    await this.saveWorkflowRow(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_REGISTRATION,
      ActivityWorkflowItemStatus.Done,
    );
    await this.saveWorkflowRow(
      ctx,
      PRODUCT_REGISTRATION_ACTIVITY_ID.PRODUCT_APPROVE_REJECT,
      ActivityWorkflowItemStatus.Pending,
    );
  }

  async getCurrentPendingActivityId(urnNo: string): Promise<number | null> {
    const normalized = this.normalizeUrn(urnNo);
    if (!normalized) return null;

    const rows = await this.activityLogModel
      .find({ urn_no: { $in: urnCandidates(normalized) } })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    const sorted = [...rows].sort((a, b) => {
      const ta = new Date(a.created_at ?? 0).getTime();
      const tb = new Date(b.created_at ?? 0).getTime();
      return tb - ta;
    });

    for (const row of sorted) {
      if (isAuxiliaryActivityLog(row)) continue;
      if (Number(row.status) === ActivityWorkflowItemStatus.Pending) {
        return Number(row.activities_id ?? row.activity_status ?? NaN);
      }
    }
    return null;
  }

  private assertCanComplete(activityId: number, pendingId: number | null): void {
    if (pendingId == null) {
      throw new BadRequestException('No pending activity to complete');
    }
    if (pendingId !== activityId) {
      throw new BadRequestException(
        `Cannot complete activity ${activityId}: current pending activity is ${pendingId}`,
      );
    }
    if (!(activityId in WORKFLOW_COMPLETE_NEXT)) {
      throw new BadRequestException(
        `Activity ${activityId} cannot be completed (workflow finished or invalid)`,
      );
    }
  }

  private assertCanReject(activityId: number, pendingId: number | null): void {
    if (pendingId == null) {
      throw new BadRequestException('No pending activity to reject');
    }
    if (pendingId !== activityId) {
      throw new BadRequestException(
        `Cannot reject activity ${activityId}: current pending activity is ${pendingId}`,
      );
    }
    if (!(activityId in WORKFLOW_REJECT_TARGET)) {
      throw new BadRequestException(
        `Activity ${activityId} does not support rejection rollback`,
      );
    }
  }

  /** Mark current activity Done and activate the next Pending activity. */
  async completeActivity(
    ctx: WorkflowTransitionContext,
    activityId: number,
  ): Promise<void> {
    const urnNo = this.normalizeUrn(ctx.urnNo);
    const pendingId = await this.getCurrentPendingActivityId(urnNo);
    this.assertCanComplete(activityId, pendingId);

    const nextId = WORKFLOW_COMPLETE_NEXT[activityId];
    if (nextId == null) {
      throw new BadRequestException(`Activity ${activityId} has no forward step`);
    }

    await this.saveWorkflowRow(ctx, activityId, ActivityWorkflowItemStatus.Done);
    await this.saveWorkflowRow(ctx, nextId, ActivityWorkflowItemStatus.Pending);
  }

  /** Roll back to the previous activity per workflow rules. */
  async rejectActivity(
    ctx: WorkflowTransitionContext,
    activityId: number,
  ): Promise<void> {
    const urnNo = this.normalizeUrn(ctx.urnNo);
    const pendingId = await this.getCurrentPendingActivityId(urnNo);
    this.assertCanReject(activityId, pendingId);

    const rollbackId = WORKFLOW_REJECT_TARGET[activityId];
    if (rollbackId == null) {
      throw new BadRequestException(`Activity ${activityId} has no reject target`);
    }

    // Rejected step stays incomplete — only re-activate the rollback activity as Pending.
    await this.saveWorkflowRow(ctx, rollbackId, ActivityWorkflowItemStatus.Pending);
  }

  /** Mark final certification approval Done — workflow completed (no pending step). */
  async completeWorkflow(ctx: WorkflowTransitionContext): Promise<void> {
    const urnNo = this.normalizeUrn(ctx.urnNo);
    const pendingId = await this.getCurrentPendingActivityId(urnNo);
    const finalId = PRODUCT_REGISTRATION_ACTIVITY_ID.APPROVE_REJECT_CERTIFICATION_FEE;

    if (pendingId === finalId) {
      await this.saveWorkflowRow(ctx, finalId, ActivityWorkflowItemStatus.Done);
      return;
    }

    if (pendingId != null) {
      throw new BadRequestException(
        `Cannot complete workflow while activity ${pendingId} is still pending`,
      );
    }
  }

  /**
   * Align workflow pending activity with `products.urnStatus` without skipping steps.
   * Used when URN status is advanced through existing product/payment services.
   */
  async syncToUrnStatus(
    ctx: WorkflowTransitionContext,
    previousUrnStatus: number,
    nextUrnStatus: number,
  ): Promise<void> {
    if (nextUrnStatus >= 12) return;

    const targetPending = URN_STATUS_PENDING_ACTIVITY[nextUrnStatus];
    if (targetPending === undefined) return;

    const urnNo = this.normalizeUrn(ctx.urnNo);
    let pendingId = await this.getCurrentPendingActivityId(urnNo);

    if (pendingId == null && nextUrnStatus === 0) {
      await this.initializeOnProductRegistration(ctx);
      return;
    }

    if (targetPending === null) {
      await this.completeWorkflow(ctx);
      return;
    }

    const maxSteps = 20;
    let steps = 0;

    while (pendingId !== targetPending && steps < maxSteps) {
      steps += 1;

      if (pendingId == null) {
        await this.initializeOnProductRegistration(ctx);
        pendingId = await this.getCurrentPendingActivityId(urnNo);
        continue;
      }

      if (this.shouldRejectToReach(pendingId, targetPending)) {
        await this.rejectActivity(ctx, pendingId);
      } else if (this.shouldCompleteToReach(pendingId, targetPending)) {
        await this.completeActivity(ctx, pendingId);
      } else {
        throw new BadRequestException(
          `Invalid workflow transition from activity ${pendingId} to target ${targetPending} (urnStatus ${previousUrnStatus}→${nextUrnStatus})`,
        );
      }

      pendingId = await this.getCurrentPendingActivityId(urnNo);
    }

    if (pendingId !== targetPending) {
      throw new InternalServerErrorException(
        'Workflow sync exceeded maximum transition steps',
      );
    }
  }

  private shouldCompleteToReach(
    currentPending: number,
    targetPending: number,
  ): boolean {
    let cursor: number | null = currentPending;
    const visited = new Set<number>();
    while (cursor != null && !visited.has(cursor)) {
      visited.add(cursor);
      if (cursor === targetPending) return true;
      const next = WORKFLOW_COMPLETE_NEXT[cursor];
      if (next == null) break;
      cursor = next;
    }
    return false;
  }

  private shouldRejectToReach(
    currentPending: number,
    targetPending: number,
  ): boolean {
    if (!(currentPending in WORKFLOW_REJECT_TARGET)) return false;
    const rejectTarget = WORKFLOW_REJECT_TARGET[currentPending];
    if (rejectTarget == null) return false;
    return this.shouldCompleteToReach(rejectTarget, targetPending);
  }
}
