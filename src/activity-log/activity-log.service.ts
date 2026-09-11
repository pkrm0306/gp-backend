import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
} from './schemas/activity-log.schema';
import { ActivityLogAccessService } from './activity-log-access.service';
import { ProductRegistrationWorkflowService } from './product-registration-workflow.service';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../payments/schemas/payment-details.schema';
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';
import {
  ActivityLogCaller,
  formatActivityLogRow,
  isAuxiliaryActivityLog,
  normalizeUrnNo,
  resolveCurrentWorkflowActivityLog,
  urnCandidates,
} from './activity-log.util';
import { WorkflowPaymentHints } from './activity-workflow.constants';

export interface LogActivityInput {
  vendor_id: string | Types.ObjectId;
  manufacturer_id: string | Types.ObjectId;
  urn_no: string;
  activities_id: number;
  activity: string;
  activity_status: number;
  sub_activities_id?: number;
  responsibility: string;
  next_responsibility?: string;
  next_acitivities_id?: number;
  next_activity?: string;
  status?: number;
}

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
    private readonly activityLogAccessService: ActivityLogAccessService,
    private readonly productRegistrationWorkflowService: ProductRegistrationWorkflowService,
  ) {}

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  /**
   * Log an activity
   * Automatically sets created_at and updated_at timestamps
   */
  async logActivity(data: LogActivityInput): Promise<ActivityLogDocument> {
    try {
      // Convert IDs to ObjectId
      const vendorObjectId = this.toObjectId(data.vendor_id, 'vendor_id');
      const manufacturerObjectId = this.toObjectId(
        data.manufacturer_id,
        'manufacturer_id',
      );

      // Prepare activity log data
      const activityLogData = {
        vendor_id: vendorObjectId,
        manufacturer_id: manufacturerObjectId,
        urn_no: data.urn_no,
        activities_id: data.activities_id,
        activity: data.activity,
        activity_status: data.activity_status,
        sub_activities_id: data.sub_activities_id,
        responsibility: data.responsibility,
        next_responsibility: data.next_responsibility,
        next_acitivities_id: data.next_acitivities_id,
        next_activity: data.next_activity,
        // Timeline entries represent the next actionable step by default.
        status: data.status ?? 0,
        // created_at and updated_at will be automatically set by Mongoose timestamps
      };

      const activityLog = new this.activityLogModel(activityLogData);
      const savedActivityLog = await activityLog.save();

      return savedActivityLog;
    } catch (error: any) {
      console.error('[Activity Log] Error logging activity:', error);
      console.error('[Activity Log] Error stack:', error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message ||
          'Failed to log activity. Please check the logs for details.',
      );
    }
  }

  /**
   * Get all activity logs for a specific URN
   * Sorted by created_at ascending for timeline display
   */
  async getActivityLogsByUrn(urnNo: string): Promise<ActivityLogDocument[]> {
    const normalized = normalizeUrnNo(urnNo);
    if (!normalized) {
      throw new BadRequestException('URN number is required');
    }
    try {
      return this.activityLogModel
        .find({ urn_no: { $in: urnCandidates(normalized) } })
        .sort({ created_at: 1 })
        .exec();
    } catch (error: any) {
      console.error(
        '[Activity Log] Error getting activity logs by URN:',
        error,
      );
      console.error('[Activity Log] Error stack:', error.stack);

      throw new InternalServerErrorException(
        error.message ||
          'Failed to get activity logs. Please check the logs for details.',
      );
    }
  }

  /**
   * Timeline for admin or vendor — vendor may only read owned URNs.
   */
  async getActivityLogsByUrnForCaller(
    urnNo: string,
    user?: ActivityLogCaller,
  ): Promise<{
    allEntries: Record<string, unknown>[];
    workflowEntries: Record<string, unknown>[];
    auxiliaryEvents: Record<string, unknown>[];
    currentActivity: Record<string, unknown> | null;
  }> {
    const normalized =
      await this.activityLogAccessService.assertCallerCanReadUrnLogs(
        urnNo,
        user,
      );
    return this.buildUrnActivityLogPayload(normalized);
  }

  /** Quick View / admin URN details — workflow activity without auth caller check. */
  async getQuickViewActivityForUrn(
    urnNo: string,
  ): Promise<Record<string, unknown> | null> {
    const normalized = normalizeUrnNo(urnNo);
    if (!normalized) {
      return null;
    }
    const payload = await this.buildUrnActivityLogPayload(normalized);
    return payload.currentActivity;
  }

  private async buildUrnActivityLogPayload(normalizedUrn: string): Promise<{
    allEntries: Record<string, unknown>[];
    workflowEntries: Record<string, unknown>[];
    auxiliaryEvents: Record<string, unknown>[];
    currentActivity: Record<string, unknown> | null;
  }> {
    let urnStatus =
      await this.activityLogAccessService.resolveMaxUrnWorkflowStatus(
        normalizedUrn,
      );

    // Heal tip when urnStatus already advanced but activity_log lagged (stale
    // process / swallowed sync). Registration only (< 12); renew is separate.
    if (urnStatus < 12) {
      await this.tryReconcileWorkflowTip(normalizedUrn, urnStatus);
      // Re-read after self-heal (e.g. fee on file while urnStatus was still 1).
      urnStatus =
        await this.activityLogAccessService.resolveMaxUrnWorkflowStatus(
          normalizedUrn,
        );
    }

    const rows = await this.getActivityLogsByUrn(normalizedUrn);
    const allEntries = rows.map((row) => formatActivityLogRow(row));
    const workflowEntries = allEntries.filter(
      (row) => !isAuxiliaryActivityLog(row),
    );
    const auxiliaryEvents = allEntries.filter((row) =>
      isAuxiliaryActivityLog(row),
    );
    return {
      allEntries,
      workflowEntries,
      auxiliaryEvents,
      currentActivity: resolveCurrentWorkflowActivityLog(rows, urnStatus),
    };
  }

  private async tryReconcileWorkflowTip(
    normalizedUrn: string,
    urnStatus: number,
  ): Promise<void> {
    try {
      const options = urnCandidates(normalizedUrn);
      const product = await this.productModel
        .findOne(matchActiveProducts({ urnNo: { $in: options } }))
        .select('vendorId manufacturerId urnNo urnStatus')
        .lean()
        .exec();
      if (!product?.vendorId || !product?.manufacturerId) return;

      const paymentState = await this.loadPaymentStateForUrn(options);
      let effectiveUrnStatus = Number(product.urnStatus ?? urnStatus);

      // Self-heal: registration fee payment exists but urnStatus never left Assign Fee (1).
      // Common when fee was created before advanceUrnStatusAfterFeeAssigned was deployed.
      if (
        effectiveUrnStatus === 1 &&
        paymentState.registrationFeeAssigned
      ) {
        await this.productModel.updateMany(
          matchActiveProducts({ urnNo: { $in: options } }),
          { $set: { urnStatus: 2, updatedDate: new Date() } },
        );
        effectiveUrnStatus = 2;
        this.logger.warn(
          `Healed urnStatus 1→2 for ${normalizedUrn} (registration fee already on file)`,
        );
      }

      // Self-heal: certification fee payment exists but still at Assign Cert Fee (6).
      if (
        effectiveUrnStatus === 6 &&
        paymentState.certificationFeeAssigned
      ) {
        await this.productModel.updateMany(
          matchActiveProducts({ urnNo: { $in: options } }),
          { $set: { urnStatus: 7, updatedDate: new Date() } },
        );
        effectiveUrnStatus = 7;
        this.logger.warn(
          `Healed urnStatus 6→7 for ${normalizedUrn} (certification fee already on file)`,
        );
      }

      const hints: WorkflowPaymentHints = {
        registrationPaymentStatus: paymentState.registrationPaymentStatus,
        certificationPaymentStatus: paymentState.certificationPaymentStatus,
      };
      const healed =
        await this.productRegistrationWorkflowService.reconcilePendingToUrnStatus(
          {
            vendorId: product.vendorId,
            manufacturerId: product.manufacturerId,
            urnNo: String(product.urnNo ?? normalizedUrn),
          },
          effectiveUrnStatus,
          hints,
        );
      if (healed) {
        this.logger.warn(
          `Reconciled activity_log tip for ${normalizedUrn} to urnStatus=${effectiveUrnStatus} hints=${JSON.stringify(hints)}`,
        );
      }
    } catch (err) {
      this.logger.error(
        `Failed to reconcile activity_log tip for ${normalizedUrn}`,
        err instanceof Error ? err.stack : err,
      );
    }
  }

  private async loadPaymentStateForUrn(urnOptions: string[]): Promise<{
    registrationPaymentStatus: number | null;
    certificationPaymentStatus: number | null;
    registrationFeeAssigned: boolean;
    certificationFeeAssigned: boolean;
  }> {
    const payments = await this.paymentDetailsModel
      .find({ urnNo: { $in: urnOptions } })
      .select('paymentType paymentStatus quoteTotal quoteAmount proposalFile')
      .lean()
      .exec();
    let registrationPaymentStatus: number | null = null;
    let certificationPaymentStatus: number | null = null;
    let registrationFeeAssigned = false;
    let certificationFeeAssigned = false;
    for (const row of payments) {
      const type = String(row.paymentType ?? '').toLowerCase();
      const status = Number(row.paymentStatus ?? 0);
      const hasQuote =
        Number(row.quoteTotal ?? row.quoteAmount ?? 0) > 0 ||
        Boolean(String((row as { proposalFile?: string }).proposalFile ?? '').trim());
      if (type === 'registration') {
        registrationPaymentStatus = Math.max(
          registrationPaymentStatus ?? 0,
          status,
        );
        if (hasQuote || status >= 0) {
          // Any registration payment_details row means admin assigned a fee record.
          registrationFeeAssigned = true;
        }
      } else if (type === 'certification') {
        certificationPaymentStatus = Math.max(
          certificationPaymentStatus ?? 0,
          status,
        );
        if (hasQuote || status >= 0) {
          certificationFeeAssigned = true;
        }
      }
    }
    return {
      registrationPaymentStatus,
      certificationPaymentStatus,
      registrationFeeAssigned,
      certificationFeeAssigned,
    };
  }
}
