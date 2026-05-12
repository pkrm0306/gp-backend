import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from './schemas/payment-details.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(PaymentDetails.name)
    private paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private activityLogService: ActivityLogService,
  ) {}

  /**
   * Certification Flow Status Mapping (URN status -> activity label)
   */
  private getActivityName(urnStatus: number): string {
    const activityMap: { [key: number]: string } = {
      0: 'Proposal Pending',
      1: 'Registration Payment',
      2: 'Approve Registration Fee',
      3: 'Process Form In Progress',
      4: 'Process Form Submitted',
      5: 'Vendor Response',
      6: 'Final Verification',
      7: 'Certificate Payment',
      8: 'Approve Certificate Fee',
      9: 'Payment Rejected',
      10: 'Approved Certificate Fee',
      11: 'Certificate Published',
    };
    return activityMap[urnStatus] || 'Unknown Activity';
  }

  /** Next timeline step id: skips 5 after 4, and 9 after 8 (resend paths use 5 / 9). */
  private getNextActivityIdForLog(currentStatus: number): number {
    if (currentStatus >= 11) return 11;
    if (currentStatus === 4) return 6;
    if (currentStatus === 8) return 10;
    return Math.min(currentStatus + 1, 11);
  }

  /** Responsibility owner by status for activity timeline rows. */
  private getResponsibilityForStatus(status: number): 'Admin' | 'Vendor' {
    switch (status) {
      case 0:
      case 2:
      case 6:
      case 8:
      case 9:
      case 10:
      case 11:
        return 'Admin';
      default:
        return 'Vendor';
    }
  }

  /** Accepts case-insensitive textual payment types and normalizes for DB enum. */
  private normalizePaymentType(
    value?: string,
  ): 'registration' | 'certification' | 'renew' {
    const raw = String(value ?? 'registration')
      .trim()
      .toLowerCase();
    if (raw === 'registration' || raw === 'register') return 'registration';
    if (raw === 'certification' || raw === 'certificate')
      return 'certification';
    if (raw === 'renew' || raw === 'renewal') return 'renew';
    throw new BadRequestException(
      'Invalid paymentType. Allowed values: registration, certification, renew',
    );
  }

  /** Canonical URN form used by this service (trim + remove trailing slashes). */
  private normalizeUrnNo(value?: string): string {
    return String(value ?? '')
      .trim()
      .replace(/\/+$/g, '');
  }

  /** Query both canonical and legacy trailing-slash URN formats. */
  private urnCandidates(urnNo: string): string[] {
    const normalized = this.normalizeUrnNo(urnNo);
    if (!normalized) return [];
    return [normalized, `${normalized}/`];
  }

  /**
   * Timeline row when payment_details is created (does not by itself change products.urnStatus).
   */
  /** Same lifecycle row shape as `ProductRegistrationService` when URN status advances via payment update. */
  private async tryLogUrnLifecycleAfterPayment(
    vendorId: string,
    manufacturerIdStr: string,
    urnNo: string,
    newUrnStatus: number,
  ): Promise<void> {
    try {
      const responsibility = this.getResponsibilityForStatus(newUrnStatus);
      const nextActivityId = this.getNextActivityIdForLog(newUrnStatus);
      const nextResponsibility =
        this.getResponsibilityForStatus(nextActivityId);
      await this.activityLogService.logActivity({
        vendor_id: vendorId,
        manufacturer_id: manufacturerIdStr,
        urn_no: urnNo,
        activities_id: newUrnStatus,
        activity: this.getActivityName(newUrnStatus),
        activity_status: newUrnStatus,
        responsibility,
        next_responsibility: nextResponsibility,
        next_acitivities_id: nextActivityId,
        next_activity:
          nextActivityId <= 11
            ? this.getActivityName(nextActivityId)
            : this.getActivityName(11),
        status: 1,
      });
    } catch (err) {
      console.error(
        '[Payment] Activity log (URN status via payment) failed:',
        err,
      );
    }
  }

  private async tryLogPaymentCreated(
    vendorId: string,
    vendorObjectId: Types.ObjectId,
    urnNo: string,
    paymentType: string,
  ): Promise<void> {
    if (!urnNo) return;
    try {
      const product = await this.productModel
        .findOne({ urnNo, vendorId: vendorObjectId })
        .select('manufacturerId urnStatus')
        .lean()
        .exec();
      if (!product) return;

      const currentStatus =
        typeof product.urnStatus === 'number' ? product.urnStatus : 0;
      const label =
        paymentType === 'certification'
          ? 'Certificate fee payment'
          : 'Registration fee payment';
      const nextId = this.getNextActivityIdForLog(currentStatus);
      const nextResp = this.getResponsibilityForStatus(nextId);

      await this.activityLogService.logActivity({
        vendor_id: vendorId,
        manufacturer_id: product.manufacturerId.toString(),
        urn_no: urnNo,
        activities_id: currentStatus,
        activity: `${label} record created`,
        activity_status: currentStatus,
        responsibility: this.getResponsibilityForStatus(currentStatus),
        next_responsibility: nextResp,
        next_acitivities_id: nextId,
        next_activity: this.getActivityName(nextId),
        status: 1,
      });
    } catch (err) {
      console.error('[Payment] Activity log (payment created) failed:', err);
    }
  }

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
   * Create payment details
   */
  async createPayment(
    createPaymentDto: CreatePaymentDto,
    vendorId: string,
    proposalFile?: Express.Multer.File,
  ): Promise<PaymentDetailsDocument> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {
        // Convert vendorId to ObjectId
        const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

        // Get next payment ID
        const paymentId = await this.sequenceHelper.getPaymentId();
        console.log(
          `[Payment Creation] Generated paymentId: ${paymentId} (attempt ${retryCount + 1})`,
        );

        // Get current date
        const now = new Date();

        // Prepare proposal file path
        let proposalFilePath: string | undefined;
        if (proposalFile) {
          proposalFilePath = `/uploads/payments/${proposalFile.filename}`;
        }

        const normalizedPaymentType = this.normalizePaymentType(
          createPaymentDto.paymentType,
        );
        const normalizedUrnNo = this.normalizeUrnNo(createPaymentDto.urnNo);
        if (!normalizedUrnNo) {
          throw new BadRequestException('URN number is required');
        }

        // Create payment data
        const paymentData = {
          paymentId,
          urnNo: normalizedUrnNo,
          vendorId: vendorObjectId,
          quoteAmount: createPaymentDto.quoteAmount,
          quoteGstAmount: createPaymentDto.quoteGstAmount,
          quoteTdsAmount: createPaymentDto.quoteTdsAmount,
          quoteTotal: createPaymentDto.quoteTotal,
          proposalFile: proposalFilePath,
          adminGstNo: createPaymentDto.adminGstNo,
          vendorGstNo: createPaymentDto.vendorGstNo,
          paymentType: normalizedPaymentType,
          paymentMode: createPaymentDto.paymentMode,
          onlinePaymentId: createPaymentDto.onlinePaymentId || 0,
          paymentReferenceNo: createPaymentDto.paymentReferenceNo,
          paymentChequeDate: createPaymentDto.paymentChequeDate
            ? new Date(createPaymentDto.paymentChequeDate)
            : undefined,
          productsToBeCertified: createPaymentDto.productsToBeCertified,
          paymentStatus: 0, // Default: 0=Created
          createdDate: now,
          updatedDate: now,
        };

        const payment = new this.paymentDetailsModel(paymentData);
        const savedPayment = await payment.save({ session });

        await session.commitTransaction();
        session.endSession();

        await this.tryLogPaymentCreated(
          vendorId,
          vendorObjectId,
          normalizedUrnNo,
          normalizedPaymentType,
        );

        return savedPayment;
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        // For validation errors, throw immediately
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          console.error('Validation error:', error.message);
          throw error;
        }

        // Check for duplicate key error (11000) - retry with new paymentId
        if (
          error.code === 11000 ||
          (error.name === 'MongoServerError' &&
            error.message?.includes('duplicate'))
        ) {
          retryCount++;
          console.error(
            `[Payment Creation] Duplicate paymentId error detected. Error code: ${error.code}, Message: ${error.message}`,
          );
          if (retryCount < maxRetries) {
            console.warn(
              `[Payment Creation] Retrying payment creation. Attempt ${retryCount + 1}/${maxRetries}...`,
            );
            // Wait a bit before retry (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 200 * retryCount),
            );
            continue; // Retry the while loop
          } else {
            console.error(
              `[Payment Creation] Failed after ${maxRetries} attempts due to duplicate paymentId`,
            );
            throw new InternalServerErrorException(
              'Failed to create payment after multiple attempts due to duplicate paymentId. Please try again.',
            );
          }
        }

        // Log the actual error for debugging
        console.error('Payment creation error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);

        // Check for specific error types
        if (
          error.name === 'CastError' ||
          error.message?.includes('Cast to ObjectId')
        ) {
          throw new BadRequestException(
            `Invalid ID format provided: ${error.message}`,
          );
        }

        // Return more detailed error message
        const errorMessage = error.message || 'Failed to create payment';
        throw new InternalServerErrorException(
          `${errorMessage}. Check server logs for details.`,
        );
      }
    }

    // Should never reach here, but just in case
    throw new InternalServerErrorException(
      'Failed to create payment after all retry attempts.',
    );
  }

  /**
   * Update payment details. If urnStatus is provided, also updates products.urnStatus for that URN
   * and creates an activity log entry.
   */
  async updatePaymentDetailsByUrn(
    urnNo: string,
    updatePaymentDto: UpdatePaymentDto,
    vendorId?: string,
    chequeOrDdFile?: Express.Multer.File,
    tdsFile?: Express.Multer.File,
  ): Promise<PaymentDetailsDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const normalizedUrn = this.normalizeUrnNo(urnNo);
      if (!normalizedUrn) {
        throw new BadRequestException('URN number is required');
      }
      if (
        updatePaymentDto.urnNo !== undefined &&
        this.normalizeUrnNo(updatePaymentDto.urnNo) !== normalizedUrn
      ) {
        throw new BadRequestException(
          'Body urnNo must match path urnNo when both are provided',
        );
      }
      const urnOptions = this.urnCandidates(normalizedUrn);

      let existingPayment: PaymentDetailsDocument | null = null;
      if (vendorId) {
        const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
        existingPayment = await this.paymentDetailsModel
          .findOne({ urnNo: { $in: urnOptions }, vendorId: vendorObjectId })
          .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
          .session(session)
          .exec();
      }
      if (!existingPayment) {
        existingPayment = await this.paymentDetailsModel
          .findOne({ urnNo: { $in: urnOptions } })
          .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
          .session(session)
          .exec();
      }

      if (!existingPayment) {
        throw new NotFoundException('Payment not found');
      }
      const effectiveVendorObjectId =
        existingPayment.vendorId as Types.ObjectId;
      const effectiveVendorId = effectiveVendorObjectId.toString();

      const now = new Date();
      const updateData: any = { updatedDate: now };

      if (updatePaymentDto.paymentMode === 'cheque_or_dd' && (!chequeOrDdFile || !tdsFile)) {
        throw new BadRequestException(
          'For paymentMode=cheque_or_dd, both cheque_or_dd_file and tds_file are required',
        );
      }

      if (updatePaymentDto.quoteAmount !== undefined) updateData.quoteAmount = updatePaymentDto.quoteAmount;
      if (updatePaymentDto.quoteGstAmount !== undefined) updateData.quoteGstAmount = updatePaymentDto.quoteGstAmount;
      if (updatePaymentDto.quoteTdsAmount !== undefined) updateData.quoteTdsAmount = updatePaymentDto.quoteTdsAmount;
      if (updatePaymentDto.quoteTotal !== undefined) updateData.quoteTotal = updatePaymentDto.quoteTotal;
      if (updatePaymentDto.adminGstNo !== undefined) updateData.adminGstNo = updatePaymentDto.adminGstNo;
      if (updatePaymentDto.vendorGstNo !== undefined) updateData.vendorGstNo = updatePaymentDto.vendorGstNo;
      if (updatePaymentDto.paymentType !== undefined) {
        updateData.paymentType = this.normalizePaymentType(
          updatePaymentDto.paymentType,
        );
      }
      if (updatePaymentDto.paymentMode !== undefined)
        updateData.paymentMode = updatePaymentDto.paymentMode;
      if (updatePaymentDto.onlinePaymentId !== undefined)
        updateData.onlinePaymentId = updatePaymentDto.onlinePaymentId;
      if (updatePaymentDto.paymentReferenceNo !== undefined)
        updateData.paymentReferenceNo = updatePaymentDto.paymentReferenceNo;
      if (updatePaymentDto.paymentChequeDate !== undefined) {
        updateData.paymentChequeDate = updatePaymentDto.paymentChequeDate
          ? new Date(updatePaymentDto.paymentChequeDate)
          : undefined;
      }
      if (chequeOrDdFile) {
        updateData.chequeOrDdFile = `/uploads/payments/${chequeOrDdFile.filename}`;
      }
      if (tdsFile) {
        updateData.tdsFile = `/uploads/payments/${tdsFile.filename}`;
      }
      if (updatePaymentDto.productsToBeCertified !== undefined) {
        updateData.productsToBeCertified =
          updatePaymentDto.productsToBeCertified;
      }
      if (updatePaymentDto.paymentStatus !== undefined)
        updateData.paymentStatus = updatePaymentDto.paymentStatus;

      const updatedPayment = await this.paymentDetailsModel
        .findOneAndUpdate({ _id: existingPayment._id }, updateData, {
          new: true,
          session,
        })
        .exec();

      if (!updatedPayment) {
        throw new NotFoundException('Payment not found after update');
      }

      let deferredUrnLog: {
        urnNo: string;
        newUrnStatus: number;
        manufacturerId: string;
      } | null = null;

      // If urnStatus is provided, update products.urnStatus for this URN; activity log after commit
      if (updatePaymentDto.urnStatus !== undefined) {
        const urnNoToUse = normalizedUrn;
        if (!urnNoToUse) {
          throw new BadRequestException(
            'URN number is required to update urnStatus',
          );
        }

        // Find any one product to get manufacturerId for activity log
        const anyProduct = await this.productModel
          .findOne({
            urnNo: { $in: urnOptions },
            vendorId: effectiveVendorObjectId,
          })
          .session(session)
          .exec();

        if (!anyProduct) {
          // Keep payment update successful even when product rows are missing for this URN.
          console.warn(
            `[Update Payment] No product found for URN ${urnNoToUse}; skipped products.urnStatus update.`,
          );
        } else {
          await this.productModel.updateMany(
            { urnNo: { $in: urnOptions }, vendorId: effectiveVendorObjectId },
            {
              $set: { urnStatus: updatePaymentDto.urnStatus, updatedDate: now },
            },
            { session },
          );

          deferredUrnLog = {
            urnNo: urnNoToUse,
            newUrnStatus: updatePaymentDto.urnStatus,
            manufacturerId: anyProduct.manufacturerId.toString(),
          };
        }
      }

      await session.commitTransaction();
      session.endSession();

      if (deferredUrnLog) {
        await this.tryLogUrnLifecycleAfterPayment(
          effectiveVendorId,
          deferredUrnLog.manufacturerId,
          deferredUrnLog.urnNo,
          deferredUrnLog.newUrnStatus,
        );
      }

      return updatedPayment;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('[Update Payment] Error:', error);
      console.error('[Update Payment] Error stack:', error.stack);

      throw new InternalServerErrorException(
        error.message ||
          'Failed to update payment. Please check the logs for details.',
      );
    }
  }

  /**
   * Get payments for a vendor with pagination, search, filtering, and sorting
   * Filtered by vendorId from authenticated user
   */
  async getPayments(listPaymentsDto: ListPaymentsDto, vendorId: string) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        paymentType,
        sort = 'desc',
      } = listPaymentsDto;

      const skip = (page - 1) * limit;
      const sortOrder = sort === 'asc' ? 1 : -1;

      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Build initial match conditions
      const initialMatchConditions: any = {
        vendorId: vendorObjectId, // Always filter by vendorId
      };

      // Status filter
      if (status !== undefined && status !== null) {
        initialMatchConditions.paymentStatus = status;
      }

      // Payment type filter
      if (paymentType) {
        initialMatchConditions.paymentType = paymentType;
      }

      // Aggregation pipeline
      const pipeline: any[] = [];

      // Stage 1: Initial $match for vendorId, status, and paymentType
      if (Object.keys(initialMatchConditions).length > 0) {
        pipeline.push({ $match: initialMatchConditions });
      }

      // Stage 2: $match for global search (searches in urnNo and paymentReferenceNo)
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(
          search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        );
        pipeline.push({
          $match: {
            $or: [{ urnNo: searchRegex }, { paymentReferenceNo: searchRegex }],
          },
        });
      }

      // Stage 3: $project formatted result
      pipeline.push({
        $project: {
          _id: 1,
          paymentId: 1,
          urnNo: 1,
          quoteAmount: 1,
          quoteGstAmount: 1,
          quoteTdsAmount: 1,
          quoteTotal: 1,
          proposalFile: 1,
          adminGstNo: 1,
          vendorGstNo: 1,
          paymentType: 1,
          paymentMode: 1,
          onlinePaymentId: 1,
          paymentReferenceNo: 1,
          paymentChequeDate: 1,
          chequeOrDdFile: 1,
          tdsFile: 1,
          productsToBeCertified: 1,
          paymentStatus: 1,
          createdDate: 1,
          updatedDate: 1,
        },
      });

      // Stage 4: Sort by createdDate
      pipeline.push({
        $sort: { createdDate: sortOrder },
      });

      // Stage 5: Use $facet for pagination and total count
      pipeline.push({
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      });

      // Execute aggregation
      const result = await this.paymentDetailsModel.aggregate(pipeline).exec();

      // Extract data and total count
      const data = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      };
    } catch (error: any) {
      console.error('[Get Payments] Error:', error);
      console.error('[Get Payments] Error stack:', error.stack);
      throw new InternalServerErrorException(
        error.message ||
          'Failed to get payments. Please check the logs for details.',
      );
    }
  }
}
