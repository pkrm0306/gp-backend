import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../schemas/renewal-cycle.schema';
import {
  ProcessRenewManufacturing,
  ProcessRenewManufacturingDocument,
} from '../schemas/process-renew-manufacturing.schema';
import {
  ProcessRenewWasteManagement,
  ProcessRenewWasteManagementDocument,
} from '../schemas/process-renew-waste-management.schema';
import {
  ProcessRenewInnovation,
  ProcessRenewInnovationDocument,
} from '../schemas/process-renew-innovation.schema';
import {
  ProcessRenewProductPerformance,
  ProcessRenewProductPerformanceDocument,
} from '../schemas/process-renew-product-performance.schema';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { UpdateRenewUrnStatusDto } from '../dto/update-renew-urn-status.dto';
import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
} from '../constants/renewal-urn-status.constants';
import {
  RENEWAL_ACTIVITY,
  RENEWAL_NEXT_ACTIVITY,
} from '../constants/renewal-activity.constants';
import { matchRenewUrnStatusUpdateProducts } from '../helpers/renew-eligible-product.util';
import {
  assertRenewUrnStatusTransition,
  assertVendorCannotSetRenewStatus,
  RenewUrnStatusActor,
} from '../helpers/renew-urn-status-transitions.util';
import {
  renewOwnershipFields,
  resolveUrnRenewContext,
  toRenewObjectId,
} from '../helpers/renew-common.util';
import {
  buildRenewPaymentFindFilter,
  buildRenewProcessHeaderFilter,
} from '../helpers/renew-cycle-scope.util';
import {
  RenewalOrchestrationService,
  RenewCompletionResult,
} from './renewal-orchestration.service';
import { RenewUrnTabReviewService } from './renew-urn-tab-review.service';

export type RenewUrnStatusActorContext = {
  actor: RenewUrnStatusActor;
  userId: string;
  vendorOrManufacturerId?: string;
};

export type RenewUrnStatusUpdateResult = {
  urnNo: string;
  urnStatus: number;
  message: string;
  renewalCycleId?: string;
  renewCycleNo?: number;
  productRenewStatus?: number;
  renewedDate?: Date | null;
  validtillDate?: Date | null;
};

@Injectable()
export class RenewUrnStatusService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentModel: Model<PaymentDetailsDocument>,
    @InjectModel(ProcessRenewManufacturing.name)
    private readonly renewManufacturingModel: Model<ProcessRenewManufacturingDocument>,
    @InjectModel(ProcessRenewWasteManagement.name)
    private readonly renewWasteModel: Model<ProcessRenewWasteManagementDocument>,
    @InjectModel(ProcessRenewInnovation.name)
    private readonly renewInnovationModel: Model<ProcessRenewInnovationDocument>,
    @InjectModel(ProcessRenewProductPerformance.name)
    private readonly renewPerformanceModel: Model<ProcessRenewProductPerformanceDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly activityLogService: ActivityLogService,
    private readonly renewalOrchestrationService: RenewalOrchestrationService,
    private readonly renewUrnTabReviewService: RenewUrnTabReviewService,
  ) {}

  private async resolveRenewalCycle(
    urnNo: string,
    renewalCycleId?: string,
  ): Promise<RenewalCycleDocument> {
    if (renewalCycleId?.trim()) {
      const cycle = await this.renewalCycleModel.findById(renewalCycleId.trim()).exec();
      if (!cycle || cycle.urnNo !== urnNo) {
        throw new BadRequestException('renewalCycleId does not match this URN');
      }
      return cycle;
    }

    const cycle = await this.renewalCycleModel
      .findOne({ urnNo, status: RenewalCycleStatus.IN_PROGRESS })
      .sort({ cycleNo: -1 })
      .exec();

    if (!cycle) {
      throw new NotFoundException('No active renewal cycle found for this URN');
    }
    return cycle;
  }

  private async assertVendorOwnsUrn(
    urnNo: string,
    actorVendorOrManufacturerId: string,
  ): Promise<void> {
    const context = await resolveUrnRenewContext(this.productModel, urnNo);
    const actorId = actorVendorOrManufacturerId.trim();
    const owns =
      String(context.vendorId) === actorId ||
      String(context.manufacturerId) === actorId;
    if (!owns) {
      throw new ForbiddenException('Authenticated user does not own this URN');
    }
  }

  private async assertInRenewalFlow(urnNo: string, currentStatus: number): Promise<void> {
    if (
      currentStatus < RENEWAL_URN_STATUS.PAYMENT_PENDING &&
      currentStatus !== RENEWAL_URN_STATUS.COMPLETED
    ) {
      throw new BadRequestException(
        'URN is not in renewal workflow (expected urnStatus 12–17 or completed 11)',
      );
    }
  }

  private async assertProcessFormsReadyForSubmit(
    urnNo: string,
    cycle: RenewalCycleDocument,
  ): Promise<void> {
    const certifiedCount = await this.productModel.countDocuments({
      urnNo,
      ...matchRenewUrnStatusUpdateProducts(),
    });
    if (certifiedCount === 0) {
      throw new BadRequestException(
        'No certified products on this URN — cannot submit renewal for review',
      );
    }

    const renewPayment = await this.paymentModel
      .findOne({
        ...buildRenewPaymentFindFilter(urnNo, cycle),
        paymentStatus: 2,
      })
      .sort({ paymentId: -1 })
      .lean()
      .exec();

    if (!renewPayment) {
      throw new BadRequestException(
        'Renewal payment must be approved before submitting process forms for review',
      );
    }

    const headerFilter = buildRenewProcessHeaderFilter(urnNo, cycle);

    const [manufacturing, waste, innovation, performance] = await Promise.all([
      this.renewManufacturingModel.findOne(headerFilter).lean().exec(),
      this.renewWasteModel.findOne(headerFilter).lean().exec(),
      this.renewInnovationModel.findOne(headerFilter).lean().exec(),
      this.renewPerformanceModel
        .findOne({ urnNo, renewalCycleId: cycle._id })
        .lean()
        .exec(),
    ]);

    const missing: string[] = [];
    if (!manufacturing) {
      missing.push('Manufacturing Process');
    }
    if (!waste) {
      missing.push('Waste Management');
    }
    if (!innovation) {
      missing.push('Innovation');
    }

    const perfReports =
      Array.isArray(performance?.testReports) && performance.testReports.length > 0;
    const perfFiles = Number(performance?.testReportFiles ?? 0) > 0;
    if (!performance || (!perfReports && !perfFiles)) {
      missing.push('Product Performance (test reports)');
    }

    if (missing.length > 0) {
      throw new BadRequestException(
        `Complete all renewal process sections before submit for review: ${missing.join(', ')}`,
      );
    }
  }

  private async logRenewUrnStatusChange(
    urnNo: string,
    vendorId: Types.ObjectId,
    manufacturerId: Types.ObjectId,
    newStatus: number,
    responsibility: 'Vendor' | 'Admin',
    activity: string,
    nextActivity?: string,
    nextResponsibility?: string,
    nextActivitiesId?: number,
  ): Promise<void> {
    await this.activityLogService.logActivity({
      vendor_id: vendorId,
      manufacturer_id: manufacturerId,
      urn_no: urnNo,
      activities_id: newStatus,
      activity,
      activity_status: newStatus,
      responsibility,
      next_activity: nextActivity,
      next_responsibility: nextResponsibility,
      next_acitivities_id: nextActivitiesId,
    });
  }

  private isAdminRenewalCompletionRequest(
    actor: RenewUrnStatusActor,
    currentStatus: number,
    targetStatus: number,
  ): boolean {
    if (actor !== 'admin') {
      return false;
    }
    if (
      targetStatus === RENEWAL_URN_STATUS.COMPLETED &&
      currentStatus === RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING
    ) {
      return true;
    }
    if (targetStatus === RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING) {
      return (
        currentStatus === RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS ||
        currentStatus === RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING
      );
    }
    return false;
  }

  private toStatusUpdateResult(
    completion: RenewCompletionResult,
    message = 'Renewal completed',
  ): RenewUrnStatusUpdateResult {
    return {
      urnNo: completion.urnNo,
      renewalCycleId: completion.renewalCycleId,
      renewCycleNo: completion.renewCycleNo,
      urnStatus: completion.urnStatus,
      productRenewStatus: completion.productRenewStatus,
      renewedDate: completion.renewedDate,
      validtillDate: completion.validtillDate,
      message,
    };
  }

  private async finishRenewalCompletion(
    trimmedUrn: string,
    dto: UpdateRenewUrnStatusDto,
    actorContext: RenewUrnStatusActorContext,
    cycle: RenewalCycleDocument,
    currentStatus: number,
  ): Promise<RenewUrnStatusUpdateResult> {
    if (!dto.renewalCycleId?.trim()) {
      throw new BadRequestException(
        'renewalCycleId is required to complete renewal (submit for final review)',
      );
    }

    if (currentStatus === RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS) {
      await this.renewUrnTabReviewService.assertAdminQuickViewTransitionAllowed(
        trimmedUrn,
        cycle._id,
        RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
      );
    }

    const completion = await this.renewalOrchestrationService.completeRenewal(
      trimmedUrn,
      actorContext.userId,
      dto.renewalCycleId.trim(),
    );

    return this.toStatusUpdateResult(
      completion,
      'Renewal completed — final review approved',
    );
  }

  async updateRenewUrnStatus(
    dto: UpdateRenewUrnStatusDto,
    actorContext: RenewUrnStatusActorContext,
  ): Promise<RenewUrnStatusUpdateResult> {
    const trimmedUrn = dto.urnNo.trim();
    if (dto.updateStatusType !== 'urn_status') {
      throw new BadRequestException('updateStatusType must be urn_status');
    }

    const targetStatus = Number(dto.updateStatusTo);
    const cycle = await this.resolveRenewalCycle(trimmedUrn, dto.renewalCycleId);

    const sampleProduct = await this.productModel
      .findOne({ urnNo: trimmedUrn, ...matchRenewUrnStatusUpdateProducts() })
      .select('urnStatus vendorId manufacturerId productRenewStatus')
      .lean()
      .exec();

    if (!sampleProduct) {
      throw new NotFoundException(`No certified products found for URN ${trimmedUrn}`);
    }

    const currentStatus = Number(sampleProduct.urnStatus ?? 0);
    const productRenewStatus = Number(sampleProduct.productRenewStatus ?? 0);
    await this.assertInRenewalFlow(trimmedUrn, currentStatus);

    if (currentStatus === targetStatus) {
      if (
        this.isAdminRenewalCompletionRequest(
          actorContext.actor,
          currentStatus,
          targetStatus,
        ) &&
        productRenewStatus !== PRODUCT_RENEW_STATUS.RENEWED
      ) {
        return this.finishRenewalCompletion(
          trimmedUrn,
          dto,
          actorContext,
          cycle,
          currentStatus,
        );
      }
      return {
        urnNo: trimmedUrn,
        urnStatus: currentStatus,
        renewalCycleId: String(cycle._id),
        message: 'URN status unchanged',
      };
    }

    if (actorContext.actor === 'vendor') {
      if (!actorContext.vendorOrManufacturerId) {
        throw new ForbiddenException('Vendor organization ID not found in token');
      }
      await this.assertVendorOwnsUrn(trimmedUrn, actorContext.vendorOrManufacturerId);
      assertVendorCannotSetRenewStatus(targetStatus);
    }

    assertRenewUrnStatusTransition(actorContext.actor, currentStatus, targetStatus);

    if (
      actorContext.actor === 'admin' &&
      currentStatus === RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS &&
      targetStatus === RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING
    ) {
      await this.renewUrnTabReviewService.assertAdminQuickViewTransitionAllowed(
        trimmedUrn,
        cycle._id,
        targetStatus,
      );
    }

    if (
      targetStatus === RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS &&
      (currentStatus === RENEWAL_URN_STATUS.PAYMENT_APPROVED ||
        currentStatus === RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING)
    ) {
      await this.assertProcessFormsReadyForSubmit(trimmedUrn, cycle);
    }

    if (this.isAdminRenewalCompletionRequest(actorContext.actor, currentStatus, targetStatus)) {
      return this.finishRenewalCompletion(
        trimmedUrn,
        dto,
        actorContext,
        cycle,
        currentStatus,
      );
    }

    const ownership = renewOwnershipFields(
      await resolveUrnRenewContext(this.productModel, trimmedUrn),
    );
    const now = new Date();

    await this.productModel.updateMany(
      { urnNo: trimmedUrn, ...matchRenewUrnStatusUpdateProducts() },
      { $set: { urnStatus: targetStatus, updatedDate: now } },
    );

    if (targetStatus === RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS) {
      const cycleId = cycle._id as Types.ObjectId;
      await this.renewUrnTabReviewService.ensurePendingReviewsForCycle(
        trimmedUrn,
        cycleId,
      );
      if (currentStatus === RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING) {
        await this.renewUrnTabReviewService.resetRejectedReviewsToPendingForCycle(
          trimmedUrn,
          cycleId,
        );
      }
      await this.logRenewUrnStatusChange(
        trimmedUrn,
        ownership.vendorId,
        ownership.manufacturerId,
        targetStatus,
        'Vendor',
        RENEWAL_ACTIVITY.PROCESS_FORMS_SUBMITTED,
        RENEWAL_NEXT_ACTIVITY.ADMIN_REVIEW_FORMS,
        'Admin',
        RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
      );
    } else if (targetStatus === RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING) {
      await this.logRenewUrnStatusChange(
        trimmedUrn,
        ownership.vendorId,
        ownership.manufacturerId,
        targetStatus,
        'Admin',
        'Renewal process forms sent back to vendor',
        RENEWAL_NEXT_ACTIVITY.VENDOR_COMPLETE_FORMS,
        'Vendor',
        RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING,
      );
    } else if (
      targetStatus === RENEWAL_URN_STATUS.PAYMENT_APPROVED &&
      currentStatus === RENEWAL_URN_STATUS.PAYMENT_SUBMITTED
    ) {
      const renewPayment = await this.paymentModel
        .findOne(buildRenewPaymentFindFilter(trimmedUrn, cycle))
        .sort({ paymentId: -1 })
        .exec();
      const paymentId = cycle.paymentId ?? renewPayment?.paymentId;
      if (!paymentId) {
        throw new BadRequestException(
          'Renewal payment record not found — cannot approve payment for this URN',
        );
      }

      const userObjectId = toRenewObjectId(actorContext.userId, 'userId');
      const session = await this.connection.startSession();
      session.startTransaction();
      try {
        await this.renewalOrchestrationService.onRenewPaymentApproved({
          urnNo: trimmedUrn,
          paymentId,
          renewalCycleId: String(cycle._id),
          vendorId: ownership.vendorId,
          userId: userObjectId,
          session,
        });
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }

      await this.logRenewUrnStatusChange(
        trimmedUrn,
        ownership.vendorId,
        ownership.manufacturerId,
        targetStatus,
        'Admin',
        RENEWAL_ACTIVITY.PAYMENT_APPROVED,
        RENEWAL_NEXT_ACTIVITY.VENDOR_COMPLETE_FORMS,
        'Vendor',
        RENEWAL_URN_STATUS.PAYMENT_APPROVED,
      );

      return {
        urnNo: trimmedUrn,
        urnStatus: targetStatus,
        renewalCycleId: String(cycle._id),
        message: 'URN status updated',
      };
    }

    return {
      urnNo: trimmedUrn,
      urnStatus: targetStatus,
      renewalCycleId: String(cycle._id),
      message: 'URN status updated',
    };
  }
}
