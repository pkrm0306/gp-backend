import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../schemas/renewal-cycle.schema';
import {
  UrnRenewTabReview,
  UrnRenewTabReviewDocument,
} from '../schemas/urn-renew-tab-review.schema';
import { PatchUrnTabReviewDto } from '../../product-registration/dto/urn-tab-review.dto';
import {
  RENEW_ADMIN_REVIEW_URN_STATUS,
  RENEW_PROCESS_TAB_STEP_ID,
  RENEW_TAB_REVIEW_STATUS,
  RENEW_VENDOR_RESUBMIT_URN_STATUS,
  buildRenewRequiredReviewSlots,
  isRenewProcessTabKey,
} from '../constants/renew-urn-tab-review.constants';
import { isTabReviewSlotAlreadyDecided } from '../../product-registration/helpers/urn-tab-review.util';
import { matchRenewEligibleProducts } from '../helpers/renew-eligible-product.util';
import {
  isRenewalUrnStatus,
  RENEWAL_URN_STATUS,
} from '../constants/renewal-urn-status.constants';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { renewOwnershipFields, resolveUrnRenewContext } from '../helpers/renew-common.util';

@Injectable()
export class RenewUrnTabReviewService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(UrnRenewTabReview.name)
    private readonly reviewModel: Model<UrnRenewTabReviewDocument>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async resolveRenewalCycleId(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<Types.ObjectId> {
    if (renewalCycleId?.trim()) {
      const cycle = await this.renewalCycleModel
        .findById(renewalCycleId.trim())
        .exec();
      if (!cycle || cycle.urnNo !== urnNo.trim()) {
        throw new BadRequestException('renewalCycleId does not match this URN');
      }
      return cycle._id as Types.ObjectId;
    }

    const cycle = await this.renewalCycleModel
      .findOne({ urnNo: urnNo.trim(), status: RenewalCycleStatus.IN_PROGRESS })
      .sort({ cycleNo: -1 })
      .exec();

    if (!cycle) {
      throw new BadRequestException(
        'renewalCycleId is required when no active renewal cycle exists for this URN',
      );
    }
    return cycle._id as Types.ObjectId;
  }

  /**
   * After vendor resubmit (urnStatus 16→15), reopen rejected renewal sections for admin re-review.
   */
  async resetRejectedReviewsToPendingForCycle(
    urnNo: string,
    renewalCycleId: Types.ObjectId,
  ): Promise<number> {
    const trimmed = urnNo.trim();
    const result = await this.reviewModel
      .updateMany(
        {
          urnNo: trimmed,
          renewalCycleId,
          reviewStatus: RENEW_TAB_REVIEW_STATUS.REJECTED,
        },
        {
          $set: {
            reviewStatus: RENEW_TAB_REVIEW_STATUS.PENDING,
            reviewedBy: null,
            reviewedAt: null,
            rejectionRemarks: null,
          },
        },
      )
      .exec();
    return result.modifiedCount ?? 0;
  }

  async ensurePendingReviewsForCycle(
    urnNo: string,
    renewalCycleId: Types.ObjectId,
  ): Promise<void> {
    for (const slot of buildRenewRequiredReviewSlots()) {
      await this.reviewModel.updateOne(
        {
          urnNo,
          renewalCycleId,
          tabKey: slot.tabKey,
          stepId: RENEW_PROCESS_TAB_STEP_ID,
        },
        {
          $setOnInsert: {
            urnNo,
            renewalCycleId,
            tabKey: slot.tabKey,
            stepId: RENEW_PROCESS_TAB_STEP_ID,
            reviewStatus: RENEW_TAB_REVIEW_STATUS.PENDING,
            reviewedBy: null,
            reviewedAt: null,
            rejectionRemarks: null,
          },
        },
        { upsert: true },
      );
    }
  }

  async reconcileStaleRejectedReviewsAfterVendorResubmit(
    urnNo: string,
    renewalCycleId: Types.ObjectId,
  ): Promise<number> {
    const trimmed = urnNo.trim();
    const rejected = await this.reviewModel
      .find({
        urnNo: trimmed,
        renewalCycleId,
        reviewStatus: RENEW_TAB_REVIEW_STATUS.REJECTED,
      })
      .select('reviewedAt')
      .lean()
      .exec();
    if (rejected.length === 0) {
      return 0;
    }

    const product = await this.productModel
      .findOne({ urnNo: trimmed, ...matchRenewEligibleProducts() })
      .select('updatedDate')
      .sort({ updatedDate: -1 })
      .lean()
      .exec();
    const productUpdatedAt = product?.updatedDate
      ? new Date(product.updatedDate as Date)
      : null;
    if (!productUpdatedAt || Number.isNaN(productUpdatedAt.getTime())) {
      return 0;
    }

    let maxRejectedReviewedAt: Date | null = null;
    for (const row of rejected) {
      const reviewedAt = row.reviewedAt ? new Date(row.reviewedAt as Date) : null;
      if (!reviewedAt || Number.isNaN(reviewedAt.getTime())) {
        continue;
      }
      if (!maxRejectedReviewedAt || reviewedAt > maxRejectedReviewedAt) {
        maxRejectedReviewedAt = reviewedAt;
      }
    }

    if (!maxRejectedReviewedAt || productUpdatedAt <= maxRejectedReviewedAt) {
      return 0;
    }

    return this.resetRejectedReviewsToPendingForCycle(trimmed, renewalCycleId);
  }

  async getUrnTabReviews(urnNo: string, renewalCycleId?: string) {
    const trimmedUrn = urnNo.trim();
    const cycleId = await this.resolveRenewalCycleId(trimmedUrn, renewalCycleId);
    const urnStatus = await this.loadUrnStatus(trimmedUrn);

    if (!isRenewalUrnStatus(urnStatus)) {
      throw new BadRequestException(
        'URN is not in renewal workflow — use certification tab review',
      );
    }

    await this.ensurePendingReviewsForCycle(trimmedUrn, cycleId);
    if (urnStatus === RENEW_ADMIN_REVIEW_URN_STATUS) {
      await this.reconcileStaleRejectedReviewsAfterVendorResubmit(
        trimmedUrn,
        cycleId,
      );
    }

    const stored = await this.reviewModel
      .find({ urnNo: trimmedUrn, renewalCycleId: cycleId })
      .sort({ tabKey: 1 })
      .lean()
      .exec();

    const requiredSlots = buildRenewRequiredReviewSlots();
    const reviews = requiredSlots.map((slot) => {
      const row = stored.find(
        (r) =>
          r.tabKey === slot.tabKey &&
          r.stepId === RENEW_PROCESS_TAB_STEP_ID,
      );
      return this.formatReviewRow(slot.tabKey, row);
    });

    const summary = this.buildSummary(reviews, requiredSlots.length);

    return {
      urnNo: trimmedUrn,
      renewalCycleId: String(cycleId),
      urnStatus,
      requiredTabs: requiredSlots,
      reviews,
      summary,
      canReview: urnStatus === RENEW_ADMIN_REVIEW_URN_STATUS,
      quickActions: this.buildQuickActions(summary),
    };
  }

  async patchUrnTabReview(dto: PatchUrnTabReviewDto, adminUserId: string) {
    const urnNo = dto.urnNo.trim();
    const cycleId = await this.resolveRenewalCycleId(urnNo, dto.renewalCycleId);
    const urnStatus = await this.loadUrnStatus(urnNo);

    if (urnStatus !== RENEW_ADMIN_REVIEW_URN_STATUS) {
      throw new ForbiddenException(
        `Renewal tab review is only allowed when urnStatus is ${RENEW_ADMIN_REVIEW_URN_STATUS} (Check process forms)`,
      );
    }

    if (!isRenewProcessTabKey(dto.tabKey)) {
      throw new BadRequestException(`Invalid renewal tabKey: ${dto.tabKey}`);
    }
    if (dto.stepId != null && dto.stepId !== 0) {
      throw new BadRequestException('stepId must be omitted for renewal process tabs');
    }

    if (dto.decision === 'rejected') {
      const remarks = String(dto.rejectionRemarks ?? '').trim();
      if (!remarks) {
        throw new BadRequestException(
          'rejectionRemarks is required when decision is rejected',
        );
      }
    }

    if (!Types.ObjectId.isValid(adminUserId)) {
      throw new BadRequestException('Invalid admin user id');
    }

    const existing = await this.reviewModel
      .findOne({
        urnNo,
        renewalCycleId: cycleId,
        tabKey: dto.tabKey,
        stepId: RENEW_PROCESS_TAB_STEP_ID,
      })
      .select('reviewStatus')
      .lean()
      .exec();

    if (isTabReviewSlotAlreadyDecided(existing?.reviewStatus)) {
      throw new ConflictException('This section has already been reviewed');
    }

    const reviewStatus =
      dto.decision === 'approved'
        ? RENEW_TAB_REVIEW_STATUS.APPROVED
        : RENEW_TAB_REVIEW_STATUS.REJECTED;

    const now = new Date();
    const updated = await this.reviewModel
      .findOneAndUpdate(
        {
          urnNo,
          renewalCycleId: cycleId,
          tabKey: dto.tabKey,
          stepId: RENEW_PROCESS_TAB_STEP_ID,
        },
        {
          $set: {
            reviewStatus,
            reviewedBy: new Types.ObjectId(adminUserId),
            reviewedAt: now,
            rejectionRemarks:
              dto.decision === 'rejected'
                ? String(dto.rejectionRemarks ?? '').trim()
                : null,
          },
          $setOnInsert: {
            urnNo,
            renewalCycleId: cycleId,
            tabKey: dto.tabKey,
            stepId: RENEW_PROCESS_TAB_STEP_ID,
          },
        },
        { upsert: true, new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Failed to save renewal tab review');
    }

    const requiredCount = buildRenewRequiredReviewSlots().length;
    const summary = await this.buildSummaryForCycle(urnNo, cycleId, requiredCount);

    await this.logTabReviewDecision(urnNo, dto.tabKey, dto.decision, urnStatus);

    return {
      urnNo,
      renewalCycleId: String(cycleId),
      updatedReview: this.formatReviewRow(dto.tabKey, updated),
      summary,
      quickActions: this.buildQuickActions(summary),
      activity: null,
    };
  }

  /** Used by PATCH /renew/urn-status before 15→16 and 15→17. */
  async assertAdminQuickViewTransitionAllowed(
    urnNo: string,
    renewalCycleId: Types.ObjectId | string,
    targetStatus: number,
  ): Promise<void> {
    const cycleObjectId =
      renewalCycleId instanceof Types.ObjectId
        ? renewalCycleId
        : await this.resolveRenewalCycleId(urnNo, String(renewalCycleId));

    const requiredCount = buildRenewRequiredReviewSlots().length;
    const summary = await this.buildSummaryForCycle(
      urnNo.trim(),
      cycleObjectId,
      requiredCount,
    );

    if (targetStatus === RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING) {
      if (!summary.allApproved) {
        throw new BadRequestException(
          'Cannot submit for final review until all renewal process sections are approved',
        );
      }
      return;
    }

    if (targetStatus === RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING) {
      if (!summary.allReviewed || !summary.hasRejection || summary.allApproved) {
        throw new BadRequestException(
          'Cannot resend to vendor until all sections are reviewed and at least one is rejected',
        );
      }
    }
  }

  async getVendorRenewTabReviewGuidance(
    urnNo: string,
    vendorId: string,
    renewalCycleId?: string,
  ) {
    const vendorObjectId = this.toVendorObjectId(vendorId);
    const trimmedUrn = urnNo?.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }

    const product = await this.productModel
      .findOne({
        urnNo: trimmedUrn,
        vendorId: vendorObjectId,
        ...matchRenewEligibleProducts(),
      })
      .select('urnNo urnStatus')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(`No product found for URN: ${trimmedUrn}`);
    }

    const urnStatus = Number(product.urnStatus ?? 0);
    const restrictSaveAndNext = urnStatus === RENEW_VENDOR_RESUBMIT_URN_STATUS;

    if (!restrictSaveAndNext) {
      return {
        urnNo: trimmedUrn,
        urnStatus,
        restrictSaveAndNext: false,
        reviews: [] as Array<Record<string, unknown>>,
        processTabs: {} as Record<string, unknown>,
        rawMaterialSteps: {} as Record<string, unknown>,
        rejectedDocumentSlotKeys: [] as string[],
        summary: null,
      };
    }

    const adminState = await this.getUrnTabReviews(trimmedUrn, renewalCycleId);
    const processTabs: Record<string, unknown> = {};

    const reviews = adminState.reviews.map((row) => {
      const canSaveAndNext =
        row.reviewStatus === RENEW_TAB_REVIEW_STATUS.REJECTED;
      const slot = {
        tabKey: row.tabKey,
        stepId: row.stepId,
        label:
          adminState.requiredTabs.find((t) => t.tabKey === row.tabKey)?.label ??
          row.tabKey,
        reviewStatus: row.reviewStatus,
        rejectionRemarks: row.rejectionRemarks,
        canSaveAndNext,
      };
      if (row.stepId == null) {
        processTabs[row.tabKey] = slot;
      }
      return { ...row, canSaveAndNext };
    });

    return {
      urnNo: trimmedUrn,
      urnStatus,
      renewalCycleId: adminState.renewalCycleId,
      restrictSaveAndNext: true,
      reviews,
      processTabs,
      rawMaterialSteps: {} as Record<string, unknown>,
      rejectedDocumentSlotKeys: [] as string[],
      summary: adminState.summary,
    };
  }

  private formatReviewRow(
    tabKey: string,
    row?: Record<string, unknown> | null,
  ) {
    const status =
      typeof row?.reviewStatus === 'number'
        ? row.reviewStatus
        : RENEW_TAB_REVIEW_STATUS.PENDING;

    return {
      tabKey,
      stepId: null as number | null,
      reviewStatus: status,
      rejectionRemarks: row?.rejectionRemarks ?? null,
      reviewedBy: row?.reviewedBy ? String(row.reviewedBy) : null,
      reviewedAt: row?.reviewedAt ?? null,
    };
  }

  private buildSummary(
    reviews: Array<{ reviewStatus: number }>,
    totalRequired: number,
  ) {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    for (const r of reviews) {
      if (r.reviewStatus === RENEW_TAB_REVIEW_STATUS.APPROVED) approved += 1;
      else if (r.reviewStatus === RENEW_TAB_REVIEW_STATUS.REJECTED) rejected += 1;
      else pending += 1;
    }
    return {
      totalRequired,
      pending,
      approved,
      rejected,
      allReviewed: pending === 0,
      allApproved: totalRequired > 0 && approved === totalRequired,
      hasRejection: rejected > 0,
    };
  }

  private async buildSummaryForCycle(
    urnNo: string,
    renewalCycleId: Types.ObjectId,
    totalRequired: number,
  ) {
    const counts = await this.reviewModel.aggregate<{ _id: number; count: number }>(
      [
        { $match: { urnNo, renewalCycleId } },
        { $group: { _id: '$reviewStatus', count: { $sum: 1 } } },
      ],
    );

    const approved =
      counts.find((c) => c._id === RENEW_TAB_REVIEW_STATUS.APPROVED)?.count ?? 0;
    const rejected =
      counts.find((c) => c._id === RENEW_TAB_REVIEW_STATUS.REJECTED)?.count ?? 0;
    const pending = Math.max(totalRequired - approved - rejected, 0);

    return {
      totalRequired,
      pending,
      approved,
      rejected,
      allReviewed: pending === 0,
      allApproved: totalRequired > 0 && approved === totalRequired,
      hasRejection: rejected > 0,
    };
  }

  buildQuickActions(summary: {
    allReviewed: boolean;
    allApproved: boolean;
    hasRejection: boolean;
  }) {
    const enableResend =
      summary.allReviewed && summary.hasRejection && !summary.allApproved;
    const enableSubmitFinal = summary.allReviewed && summary.allApproved;
    return {
      disableBoth: !summary.allReviewed,
      enableResend,
      enableSubmitFinal,
    };
  }

  private async loadUrnStatus(urnNo: string): Promise<number> {
    const product = await this.productModel
      .findOne({ urnNo, ...matchRenewEligibleProducts() })
      .select('urnStatus')
      .lean()
      .exec();
    if (!product) {
      throw new NotFoundException(`No product found for URN: ${urnNo}`);
    }
    return Number(product.urnStatus ?? 0);
  }

  private toVendorObjectId(vendorId: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(vendorId)) {
      throw new BadRequestException('Invalid vendor id');
    }
    return new Types.ObjectId(vendorId);
  }

  private async logTabReviewDecision(
    urnNo: string,
    tabKey: string,
    decision: 'approved' | 'rejected',
    urnStatus: number,
  ): Promise<void> {
    try {
      const context = await resolveUrnRenewContext(this.productModel, urnNo);
      const ownership = renewOwnershipFields(context);
      const label =
        buildRenewRequiredReviewSlots().find((s) => s.tabKey === tabKey)?.label ??
        tabKey;

      await this.activityLogService.logActivity({
        vendor_id: ownership.vendorId,
        manufacturer_id: ownership.manufacturerId,
        urn_no: urnNo,
        activities_id: urnStatus,
        activity:
          decision === 'rejected'
            ? `Renewal section rejected: ${label}`
            : `Renewal section approved: ${label}`,
        activity_status: urnStatus,
        responsibility: 'Admin',
        next_responsibility: 'Admin',
        next_acitivities_id: urnStatus,
        next_activity: 'Renewal process review',
      });
    } catch {
      /* activity log is best-effort */
    }
  }
}
