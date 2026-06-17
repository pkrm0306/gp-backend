import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { matchActiveProducts } from './constants/active-product.filter';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import {
  UrnProcessTabReview,
  UrnProcessTabReviewDocument,
} from './schemas/urn-process-tab-review.schema';
import {
  PatchUrnTabReviewDto,
  VendorUrnTabReviewSlotDto,
} from './dto/urn-tab-review.dto';
import {
  ADMIN_REVIEW_URN_STATUS,
  RAW_MATERIALS_TAB_KEY,
  URN_TAB_REVIEW_STATUS,
  VENDOR_RESUBMIT_URN_STATUS,
} from './constants/urn-tab-review.constants';
import {
  apiStepIdFromStored,
  buildRequiredReviewSlots,
  isProcessTabKey,
  normalizeReviewStepId,
  parseVisibleRawMaterialSteps,
} from './helpers/urn-tab-review.util';
import { shouldUseRenewWorkflowForUrn } from '../renew/constants/renewal-urn-status.constants';
import { buildVendorUrnTabAccess } from '../common/vendor/vendor-urn-tab-access.util';
import { RenewUrnTabReviewService } from '../renew/services/renew-urn-tab-review.service';
import {
  ProcessComments,
  ProcessCommentsDocument,
} from '../process-comments/schemas/process-comments.schema';
import {
  parseSectionCommentPayload,
  type ParsedSectionCommentPayload,
} from '../process-comments/helpers/process-comments-payload.util';

const TAB_KEY_TO_PROCESS_COMMENT_FIELD: Record<string, string> = {
  'product-design': 'productDesign',
  'product-performance': 'productPerformance',
  'manufacturing-process': 'manfacturingProcess',
  'waste-management': 'wasteManagement',
  'life-cycle-approach': 'lifeCycleApproach',
  'product-stewardship': 'productStewardship',
  innovation: 'productInnovation',
};
@Injectable()
export class UrnTabReviewService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(UrnProcessTabReview.name)
    private readonly reviewModel: Model<UrnProcessTabReviewDocument>,
    @InjectModel(ProcessComments.name)
    private readonly processCommentsModel: Model<ProcessCommentsDocument>,
    @Inject(forwardRef(() => RenewUrnTabReviewService))
    private readonly renewUrnTabReviewService: RenewUrnTabReviewService,
  ) {}

  async ensurePendingReviewsForUrn(urnNo: string): Promise<void> {
    const context = await this.loadUrnReviewContext(urnNo);
    const slots = buildRequiredReviewSlots(context.visibleRawMaterialSteps);

    for (const slot of slots) {
      let stepId: number;
      try {
        stepId = normalizeReviewStepId(slot.tabKey, slot.stepId);
      } catch {
        continue;
      }
      await this.reviewModel.updateOne(
        { urnNo, tabKey: slot.tabKey, stepId },
        {
          $setOnInsert: {
            urnNo,
            tabKey: slot.tabKey,
            stepId,
            reviewStatus: URN_TAB_REVIEW_STATUS.PENDING,
            reviewedBy: null,
            reviewedAt: null,
            rejectionRemarks: null,
          },
        },
        { upsert: true },
      );
    }
  }

  /**
   * Vendor panel: after admin resend (`urnStatus === 5`), which tabs/steps may use Save & Next.
   * Only sections with `reviewStatus === rejected` are editable; approved tabs are read-only.
   */
  async getVendorUrnTabReviewGuidance(urnNo: string, vendorId: string) {
    const vendorObjectId = this.toVendorObjectId(vendorId);
    const trimmedUrn = urnNo?.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }

    const product = await this.productModel
      .findOne(
        matchActiveProducts({
          urnNo: trimmedUrn,
          vendorId: vendorObjectId,
        }),
      )
      .select('urnNo urnStatus categoryId productRenewStatus')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(
        `No product found for URN: ${trimmedUrn}`,
      );
    }

    const urnStatus = Number(product.urnStatus ?? 0);
    const productRenewStatus = Number(product.productRenewStatus ?? 0);
    const tabAccess = buildVendorUrnTabAccess({
      urnNo: trimmedUrn,
      urnStatus,
      productRenewStatus,
    });

    if (shouldUseRenewWorkflowForUrn({ urnStatus, productRenewStatus })) {
      const renewGuidance =
        await this.renewUrnTabReviewService.getVendorRenewTabReviewGuidance(
          trimmedUrn,
          vendorId,
        );
      return {
        ...renewGuidance,
        tabAccess,
      };
    }

    const restrictSaveAndNext = urnStatus === VENDOR_RESUBMIT_URN_STATUS;

    if (!restrictSaveAndNext) {
      return {
        urnNo: trimmedUrn,
        urnStatus,
        restrictSaveAndNext: false,
        reviews: [] as Array<Record<string, unknown>>,
        processTabs: {} as Record<string, VendorUrnTabReviewSlotDto>,
        rawMaterialSteps: {} as Record<string, VendorUrnTabReviewSlotDto>,
        summary: null,
        tabAccess,
      };
    }

    const adminState = await this.getUrnTabReviews(trimmedUrn);
    const processTabs: Record<string, VendorUrnTabReviewSlotDto> = {};
    const rawMaterialSteps: Record<string, VendorUrnTabReviewSlotDto> = {};

    const reviews = adminState.reviews.map((row) => {
      const canSaveAndNext =
        row.reviewStatus === URN_TAB_REVIEW_STATUS.REJECTED;
      const slot: VendorUrnTabReviewSlotDto = {
        tabKey: row.tabKey,
        stepId: row.stepId,
        label:
          adminState.requiredTabs.find(
            (t) => t.tabKey === row.tabKey && t.stepId === row.stepId,
          )?.label ?? row.tabKey,
        reviewStatus: row.reviewStatus,
        rejectionRemarks:
          row.rejectionRemarks != null ? String(row.rejectionRemarks) : null,
        canSaveAndNext,
      };

      if (row.tabKey === RAW_MATERIALS_TAB_KEY && row.stepId != null) {
        rawMaterialSteps[String(row.stepId)] = slot;
      } else if (row.stepId == null) {
        processTabs[row.tabKey] = slot;
      }

      return { ...row, canSaveAndNext };
    });

    return {
      urnNo: trimmedUrn,
      urnStatus,
      restrictSaveAndNext: true,
      visibleRawMaterialSteps:
        'visibleRawMaterialSteps' in adminState
          ? adminState.visibleRawMaterialSteps
          : [],
      reviews,
      processTabs,
      rawMaterialSteps,
      summary: adminState.summary,
      tabAccess,
    };
  }

  async getVendorUrnTabAccess(urnNo: string, vendorId: string) {
    const guidance = await this.getVendorUrnTabReviewGuidance(urnNo, vendorId);
    return guidance.tabAccess ?? buildVendorUrnTabAccess({
      urnNo: guidance.urnNo,
      urnStatus: Number(guidance.urnStatus ?? 0),
    });
  }

  async getUrnTabReviews(urnNo: string, renewalCycleId?: string) {
    const context = await this.loadUrnReviewContext(urnNo);
    if (
      shouldUseRenewWorkflowForUrn({
        urnStatus: context.urnStatus,
        productRenewStatus: context.productRenewStatus,
      })
    ) {
      return this.renewUrnTabReviewService.getUrnTabReviews(urnNo, renewalCycleId);
    }
    await this.ensurePendingReviewsForUrn(urnNo);

    const stored = await this.reviewModel
      .find({ urnNo })
      .sort({ tabKey: 1, stepId: 1 })
      .lean()
      .exec();

    const sectionReviewByTabKey = await this.loadSectionReviewsByTabKey(
      urnNo,
      context.vendorId,
    );

    const requiredSlots = buildRequiredReviewSlots(context.visibleRawMaterialSteps);
    const reviews = requiredSlots.map((slot) => {
      const stepIdStored = normalizeReviewStepId(slot.tabKey, slot.stepId);
      const row = stored.find(
        (r) => r.tabKey === slot.tabKey && r.stepId === stepIdStored,
      );
      const sectionReview =
        slot.stepId == null ? sectionReviewByTabKey[slot.tabKey] ?? null : null;
      return {
        ...this.formatReviewRow(slot.tabKey, stepIdStored, row),
        sectionReview,
      };
    });

    const summary = this.buildSummary(reviews, requiredSlots.length);

    return {
      urnNo,
      urnStatus: context.urnStatus,
      categoryRawMaterialForms: context.categoryRawMaterialForms,
      visibleRawMaterialSteps: context.visibleRawMaterialSteps,
      requiredTabs: requiredSlots,
      reviews,
      sectionReviews: sectionReviewByTabKey,
      summary,
      canReview: context.urnStatus === ADMIN_REVIEW_URN_STATUS,
    };
  }

  async patchUrnTabReview(dto: PatchUrnTabReviewDto, adminUserId: string) {
    const urnNo = dto.urnNo.trim();
    const context = await this.loadUrnReviewContext(urnNo);

    if (
      shouldUseRenewWorkflowForUrn({
        urnStatus: context.urnStatus,
        productRenewStatus: context.productRenewStatus,
      })
    ) {
      return this.renewUrnTabReviewService.patchUrnTabReview(dto, adminUserId);
    }

    if (context.urnStatus !== ADMIN_REVIEW_URN_STATUS) {
      throw new ForbiddenException(
        `Tab review is only allowed when urnStatus is ${ADMIN_REVIEW_URN_STATUS} (Admin Review Pending)`,
      );
    }

    if (dto.tabKey === RAW_MATERIALS_TAB_KEY) {
      if (dto.stepId == null) {
        throw new BadRequestException('stepId is required for raw-materials');
      }
      if (!context.visibleRawMaterialSteps.includes(dto.stepId)) {
        throw new BadRequestException(
          `Raw materials step ${dto.stepId} is not enabled for this product category`,
        );
      }
    } else if (!isProcessTabKey(dto.tabKey)) {
      throw new BadRequestException(`Invalid tabKey: ${dto.tabKey}`);
    } else if (dto.stepId != null && dto.stepId !== 0) {
      throw new BadRequestException(
        'stepId must be omitted for process tabs',
      );
    }

    if (dto.decision === 'rejected') {
      const remarks = String(dto.rejectionRemarks ?? '').trim();
      if (!remarks) {
        throw new BadRequestException(
          'rejectionRemarks is required when decision is rejected',
        );
      }
    }

    const stepIdStored = normalizeReviewStepId(dto.tabKey, dto.stepId);
    const reviewStatus =
      dto.decision === 'approved'
        ? URN_TAB_REVIEW_STATUS.APPROVED
        : URN_TAB_REVIEW_STATUS.REJECTED;

    if (!Types.ObjectId.isValid(adminUserId)) {
      throw new BadRequestException('Invalid admin user id');
    }

    const now = new Date();
    const updated = await this.reviewModel
      .findOneAndUpdate(
        { urnNo, tabKey: dto.tabKey, stepId: stepIdStored },
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
          $setOnInsert: { urnNo, tabKey: dto.tabKey, stepId: stepIdStored },
        },
        { upsert: true, new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Failed to save tab review');
    }

    const requiredSlots = buildRequiredReviewSlots(
      context.visibleRawMaterialSteps,
    );
    const summary = await this.buildSummaryForUrn(urnNo, requiredSlots.length);

    return {
      urnNo,
      updatedReview: this.formatReviewRow(dto.tabKey, stepIdStored, updated),
      summary,
      quickActions: this.buildQuickActions(summary),
      /** Reserved for future timeline hook when patch writes activity rows. */
      activity: null,
    };
  }

  private formatReviewRow(
    tabKey: string,
    stepIdStored: number,
    row?: Record<string, unknown> | null,
  ) {
    const status =
      typeof row?.reviewStatus === 'number'
        ? row.reviewStatus
        : URN_TAB_REVIEW_STATUS.PENDING;

    return {
      tabKey,
      stepId: apiStepIdFromStored(tabKey, stepIdStored),
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
      if (r.reviewStatus === URN_TAB_REVIEW_STATUS.APPROVED) approved += 1;
      else if (r.reviewStatus === URN_TAB_REVIEW_STATUS.REJECTED) rejected += 1;
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

  /**
   * Lightweight summary for PATCH responses (avoids heavy `getUrnTabReviews()` refetch path).
   */
  private async buildSummaryForUrn(urnNo: string, totalRequired: number) {
    const counts = await this.reviewModel.aggregate<{ _id: number; count: number }>([
      { $match: { urnNo } },
      {
        $group: {
          _id: '$reviewStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const approved =
      counts.find((c) => c._id === URN_TAB_REVIEW_STATUS.APPROVED)?.count ?? 0;
    const rejected =
      counts.find((c) => c._id === URN_TAB_REVIEW_STATUS.REJECTED)?.count ?? 0;
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

  private buildQuickActions(summary: {
    allReviewed: boolean;
    allApproved: boolean;
    hasRejection: boolean;
  }) {
    const enableResend = summary.allReviewed && summary.hasRejection;
    const enableSubmitFinal = summary.allApproved;
    return {
      disableBoth: !summary.allReviewed,
      enableResend,
      enableSubmitFinal,
    };
  }

  private toVendorObjectId(vendorId: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(vendorId)) {
      throw new BadRequestException('Invalid vendor id');
    }
    return new Types.ObjectId(vendorId);
  }

  private async loadUrnReviewContext(urnNo: string) {
    const trimmed = urnNo?.trim();
    if (!trimmed) {
      throw new BadRequestException('urnNo is required');
    }

    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo: trimmed }))
      .select('urnNo urnStatus categoryId vendorId productRenewStatus')
      .sort({ createdDate: 1 })
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(`No product found for URN: ${trimmed}`);
    }

    const category = await this.categoryModel
      .findById(product.categoryId)
      .select('category_raw_material_forms')
      .lean()
      .exec();

    const categoryRawMaterialForms =
      category?.category_raw_material_forms ?? '';
    const visibleRawMaterialSteps = parseVisibleRawMaterialSteps(
      categoryRawMaterialForms,
    );

    return {
      urnNo: trimmed,
      urnStatus: Number(product.urnStatus ?? 0),
      productRenewStatus: Number(product.productRenewStatus ?? 0),
      vendorId: product.vendorId as Types.ObjectId,
      categoryRawMaterialForms,
      visibleRawMaterialSteps,
    };
  }

  private async loadSectionReviewsByTabKey(
    urnNo: string,
    vendorId: Types.ObjectId,
  ): Promise<Record<string, ParsedSectionCommentPayload>> {
    const comments = await this.processCommentsModel
      .findOne({ urnNo, vendorId })
      .lean()
      .exec();

    if (!comments) {
      return {};
    }

    const row = comments as Record<string, unknown>;
    const out: Record<string, ParsedSectionCommentPayload> = {};
    for (const [tabKey, field] of Object.entries(TAB_KEY_TO_PROCESS_COMMENT_FIELD)) {
      const packed = row[field];
      if (typeof packed === 'string' && packed.trim() !== '') {
        out[tabKey] = parseSectionCommentPayload(packed);
      }
    }
    return out;
  }
}
