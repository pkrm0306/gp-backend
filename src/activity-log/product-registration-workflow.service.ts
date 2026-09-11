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
  WORKFLOW_COMPLETE_NEXT,
  WORKFLOW_REJECT_TARGET,
  WorkflowPaymentHints,
  resolveExpectedPendingActivityId,
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
    const now = new Date();
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
      // Explicit timestamps so tip selection (sort by created_at) cannot stick
      // on older Pending rows when schema timestamps are unavailable.
      created_at: now,
      updated_at: now,
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

    // Newest Done per activity id supersedes older Pending for the same id
    // (append-only log never updates prior rows).
    const doneActivityIds = new Set<number>();
    for (const row of sorted) {
      if (isAuxiliaryActivityLog(row)) continue;
      const activityId = Number(row.activities_id ?? row.activity_status ?? NaN);
      if (!Number.isFinite(activityId)) continue;
      if (Number(row.status) === ActivityWorkflowItemStatus.Done) {
        doneActivityIds.add(activityId);
      }
    }

    for (const row of sorted) {
      if (isAuxiliaryActivityLog(row)) continue;
      if (Number(row.status) !== ActivityWorkflowItemStatus.Pending) continue;
      const activityId = Number(row.activities_id ?? row.activity_status ?? NaN);
      if (!Number.isFinite(activityId)) continue;
      if (doneActivityIds.has(activityId)) continue;
      return activityId;
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
   * Align workflow pending activity with business state (urnStatus + payment hints).
   * Used when URN status is advanced through existing product/payment services.
   */
  async syncToUrnStatus(
    ctx: WorkflowTransitionContext,
    previousUrnStatus: number,
    nextUrnStatus: number,
    hints?: WorkflowPaymentHints,
  ): Promise<void> {
    if (nextUrnStatus >= 12) return;

    const targetPending = resolveExpectedPendingActivityId(
      nextUrnStatus,
      hints,
    );
    if (targetPending === undefined) return;

    await this.syncTowardPendingActivity(
      ctx,
      targetPending,
      previousUrnStatus,
      nextUrnStatus,
    );
  }

  /**
   * Drive tip to an explicit pending activity id (or complete workflow when null).
   */
  async syncTowardPendingActivity(
    ctx: WorkflowTransitionContext,
    targetPending: number | null,
    previousUrnStatus = 0,
    nextUrnStatus = 0,
  ): Promise<void> {
    const urnNo = this.normalizeUrn(ctx.urnNo);
    let pendingId = await this.getCurrentPendingActivityId(urnNo);

    if (pendingId == null && nextUrnStatus === 0 && targetPending !== null) {
      await this.initializeOnProductRegistration(ctx);
      pendingId = await this.getCurrentPendingActivityId(urnNo);
      if (pendingId === targetPending) return;
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

      // Prefer forward complete over reject to avoid approve oscillation.
      if (this.shouldCompleteToReach(pendingId, targetPending)) {
        await this.completeActivity(ctx, pendingId);
      } else if (this.shouldRejectToReach(pendingId, targetPending)) {
        await this.rejectActivity(ctx, pendingId);
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

  /**
   * If activity tip drifted behind business state, advance tip to expected pending.
   * @returns true when rows were written
   */
  async reconcilePendingToUrnStatus(
    ctx: WorkflowTransitionContext,
    urnStatus: number,
    hints?: WorkflowPaymentHints,
  ): Promise<boolean> {
    if (urnStatus >= 12) return false;

    const targetPending = resolveExpectedPendingActivityId(urnStatus, hints);
    if (targetPending === undefined) return false;

    const urnNo = this.normalizeUrn(ctx.urnNo);
    const pendingId = await this.getCurrentPendingActivityId(urnNo);

    if (targetPending === null) {
      if (pendingId == null) return false;
      await this.syncTowardPendingActivity(ctx, null, urnStatus, urnStatus);
      return true;
    }

    if (pendingId === targetPending) return false;

    await this.syncTowardPendingActivity(
      ctx,
      targetPending,
      Math.max(0, urnStatus - 1),
      urnStatus,
    );
    return true;
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
    // Never reject when the target is already ahead on the complete path.
    if (this.shouldCompleteToReach(currentPending, targetPending)) return false;
    return this.shouldCompleteToReach(rejectTarget, targetPending);
  }
}
