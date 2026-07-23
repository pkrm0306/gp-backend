import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Inject,
  forwardRef,
  Optional,
  Logger,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from './schemas/payment-details.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { AdminListPaymentsDto } from './dto/admin-list-payments.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ProductRegistrationWorkflowService } from '../activity-log/product-registration-workflow.service';
import { uploadFile } from '../utils/upload-file.util';
import { VendorProposalApprovalDto } from './dto/vendor-proposal-approval.dto';
import {
  formatPaymentRecord,
  formatPaymentRecords,
  resolveVendorProposalApprovalStatus,
} from './payment-proposal.util';
import {
  buildVendorHistoryStatusClause,
  resolveVendorDisplayPaymentStatus,
} from './payment-overdue.util';
import {
  buildTdsFileMetadata,
  enrichPaymentByUrnResponse,
  isVendorPaymentProofEditable,
  PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE,
  PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE,
  PAYMENT_REFERENCE_UNIQUE_MESSAGE,
} from './payment-response.util';
import {
  paymentStreamSubsectionKey,
  paymentTypeToProcessType,
} from '../documents/helpers/document-version.helper';
import {
  activityLifecycleName,
  activityLifecycleResponsibility,
  ActivityLifecycleOwner,
  nextActivityLifecycleStatus,
} from '../activity-log/activity-lifecycle.constants';
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';
import { ZohoDealsService } from '../zoho/services/zoho-deals.service';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { CertificationLifecycleService } from '../product-registration/certification-lifecycle.service';
import {
  getProductsToBeCertifiedValidationError,
  normalizeProductsToBeCertifiedStorage,
  parseProductsToBeCertified,
} from '../product-registration/helpers/parse-products-to-be-certified.util';
import { ProductSoftDeleteService } from '../product-registration/services/product-soft-delete.service';
import {
  buildPaymentListMongoSort,
  parsePaymentListSort,
} from './utils/parse-payment-list-sort.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import { trackPaymentFileChange } from '../documents/helpers/product-document-version.integration';
import { RenewalOrchestrationService } from '../renew/services/renewal-orchestration.service';
import { RENEWAL_URN_STATUS } from '../renew/constants/renewal-urn-status.constants';
import { buildProductFilterForUrnStatusUpdate } from '../renew/helpers/renew-eligible-product.util';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../renew/schemas/renewal-cycle.schema';
import {
  assertRenewCycleAcceptsPayment,
  buildRenewPaymentFindFilter,
} from '../renew/helpers/renew-cycle-scope.util';
import { toRenewObjectId } from '../renew/helpers/renew-common.util';
import { RedisService } from '../common/redis/redis.service';
import { invalidateAdminDashboardCache } from '../admin/helpers/invalidate-admin-dashboard-cache.util';

const PAYMENT_REFERENCE_MAX_LENGTH = 50;
const PAYMENT_REFERENCE_ALPHANUMERIC = /^[a-zA-Z0-9]+$/;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(PaymentDetails.name)
    private paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private activityLogService: ActivityLogService,
    private readonly productRegistrationWorkflowService: ProductRegistrationWorkflowService,
    private readonly zohoDealsService: ZohoDealsService,
    private readonly lifecycleNotification: LifecycleNotificationService,
    private readonly certificationLifecycle: CertificationLifecycleService,
    private readonly productSoftDeleteService: ProductSoftDeleteService,
    private readonly documentVersioningService: DocumentVersioningService,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => RenewalOrchestrationService))
    @Optional()
    private readonly renewalOrchestration?: RenewalOrchestrationService,
  ) {}

  private resolveZohoPaymentAmount(payment: PaymentDetailsDocument): number {
    return Number(payment.quoteTotal ?? payment.quoteAmount ?? 0);
  }

  private async syncPaymentToZohoDeal(
    payment: PaymentDetailsDocument,
    manufacturerId: string,
  ): Promise<void> {
    await this.zohoDealsService.updateDealPaymentDetails({
      manufacturerId,
      quoteNumber: payment.paymentId,
      gstin: payment.vendorGstNo || payment.adminGstNo,
      amount: this.resolveZohoPaymentAmount(payment),
      transactionNumber: payment.paymentReferenceNo,
      paymentMode: payment.paymentMode,
    });
  }

  /**
   * Certification Flow Status Mapping (URN status -> activity label)
   */
  private getActivityName(urnStatus: number): string {
    return activityLifecycleName(urnStatus);
  }

  /** Next timeline step id from the canonical activity lifecycle. */
  private getNextActivityIdForLog(currentStatus: number): number {
    return nextActivityLifecycleStatus(currentStatus);
  }

  /** Responsibility owner by status for activity timeline rows. */
  private getResponsibilityForStatus(status: number): ActivityLifecycleOwner {
    return activityLifecycleResponsibility(status);
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

  private isAdminPortalRole(role?: string): boolean {
    return role === 'admin' || role === 'staff';
  }

  private isVendorPortalRole(role?: string): boolean {
    return role === 'vendor' || role === 'partner';
  }

  private idsEqual(
    a?: Types.ObjectId | string | null,
    b?: Types.ObjectId | string | null,
  ): boolean {
    if (a == null || b == null) {
      return false;
    }
    return String(a) === String(b);
  }

  /**
   * Vendor org for a URN comes from active products (not the admin user who created the payment).
   */
  private async resolveUrnOwnerVendorObjectId(
    urnNo: string,
    session?: ClientSession,
  ): Promise<Types.ObjectId> {
    const urnOptions = this.urnCandidates(urnNo);
    const query = this.productModel
      .findOne(matchActiveProducts({ urnNo: { $in: urnOptions } }))
      .select('vendorId manufacturerId')
      .sort({ createdDate: 1 });
    if (session) {
      query.session(session);
    }
    const product = await query.lean().exec();
    if (!product) {
      throw new NotFoundException(`No products found for URN: ${urnNo}`);
    }
    const ownerId = product.vendorId ?? product.manufacturerId;
    if (!ownerId) {
      throw new NotFoundException(
        `URN ${urnNo} has no vendor organization on file`,
      );
    }
    return ownerId instanceof Types.ObjectId
      ? ownerId
      : this.toObjectId(String(ownerId), 'vendorId');
  }

  /** Resolve an active URN product row for either vendorId or manufacturerId org id. */
  private findUrnProductForOrg(
    urnNo: string,
    orgObjectId: Types.ObjectId,
    select = 'manufacturerId vendorId urnStatus productName',
  ) {
    const urnOptions = this.urnCandidates(urnNo);
    return this.productModel
      .findOne(
        matchActiveProducts({
          urnNo: { $in: urnOptions },
          $or: [{ vendorId: orgObjectId }, { manufacturerId: orgObjectId }],
        }),
      )
      .select(select)
      .lean()
      .exec();
  }

  private async assertCallerOwnsUrn(
    urnNo: string,
    callerVendorId: string,
  ): Promise<{
    vendorObjectId: Types.ObjectId;
    product: {
      manufacturerId: Types.ObjectId;
      vendorId: Types.ObjectId;
      urnStatus?: number;
    };
  }> {
    const urnOptions = this.urnCandidates(urnNo);
    const callerObjectId = this.toObjectId(callerVendorId, 'vendorId');
    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo: { $in: urnOptions } }))
      .select('manufacturerId vendorId urnStatus')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(`No products found for URN: ${urnNo}`);
    }

    const ownerVendorId = product.vendorId ?? product.manufacturerId;
    const ownerManufacturerId = product.manufacturerId ?? product.vendorId;
    const ownsUrn =
      this.idsEqual(ownerVendorId, callerObjectId) ||
      this.idsEqual(ownerManufacturerId, callerObjectId);

    if (!ownsUrn) {
      throw new ForbiddenException('You do not have access to this URN');
    }

    return {
      vendorObjectId: callerObjectId,
      product: {
        manufacturerId: product.manufacturerId as Types.ObjectId,
        vendorId: product.vendorId as Types.ObjectId,
        urnStatus: product.urnStatus,
      },
    };
  }

  private paymentToPlain(
    payment: PaymentDetailsDocument,
  ): Record<string, unknown> {
    return (
      typeof (payment as PaymentDetailsDocument & { toObject?: () => object })
        .toObject === 'function'
        ? payment.toObject()
        : { ...(payment as unknown as Record<string, unknown>) }
    ) as Record<string, unknown>;
  }

  private async resolveTdsFileMetadataForPayment(payment: {
    urnNo: string;
    paymentType?: string | null;
    renewalCycleId?: Types.ObjectId | string | null;
    tdsFile?: string | null;
  }) {
    const tdsFile = String(payment.tdsFile ?? '').trim();
    if (!tdsFile) {
      return null;
    }

    try {
      const latest = await this.documentVersioningService.getLatestDocumentMetadata(
        {
          urnNo: payment.urnNo,
          processType: paymentTypeToProcessType(payment.paymentType),
          renewalCycleId: payment.renewalCycleId
            ? String(payment.renewalCycleId)
            : null,
          sectionKey: 'payment',
          subsectionKey: paymentStreamSubsectionKey(payment.paymentType),
          slotKey: 'tdsFile',
        },
      );
      return buildTdsFileMetadata(tdsFile, {
        originalName: latest.latestVersion.originalName as string | null,
        storedName: latest.latestVersion.storedName as string | null,
        mimeType: latest.latestVersion.mimeType as string | null,
        sizeBytes: latest.latestVersion.sizeBytes as number | null,
        filePath: latest.latestVersion.filePath as string | null,
      });
    } catch {
      return buildTdsFileMetadata(tdsFile);
    }
  }

  private async formatPaymentForApi(
    payment: PaymentDetailsDocument | Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const plain =
      typeof (payment as PaymentDetailsDocument).toObject === 'function'
        ? this.paymentToPlain(payment as PaymentDetailsDocument)
        : { ...(payment as Record<string, unknown>) };
    const tdsFileMetadata = await this.resolveTdsFileMetadataForPayment({
      urnNo: String(plain.urnNo ?? ''),
      paymentType: String(plain.paymentType ?? 'registration'),
      renewalCycleId: plain.renewalCycleId as Types.ObjectId | string | null,
      tdsFile: String(plain.tdsFile ?? plain.tds_file ?? ''),
    });
    return enrichPaymentByUrnResponse(plain, {
      tdsFileMetadata,
      referenceNumberMustBeUnique: true,
    });
  }

  private async findPaymentRecordForUrn(
    normalizedUrn: string,
    options?: {
      paymentType?: string;
      renewalCycleId?: string;
      session?: ClientSession;
    },
  ): Promise<PaymentDetailsDocument | null> {
    const urnOptions = this.urnCandidates(normalizedUrn);
    const paymentTypeHint =
      options?.paymentType !== undefined
        ? this.normalizePaymentType(options.paymentType)
        : undefined;
    const paymentQuery: Record<string, unknown> = {
      urnNo: { $in: urnOptions },
    };
    if (paymentTypeHint) {
      paymentQuery.paymentType = paymentTypeHint;
    }

    const renewCycleIdHint = String(options?.renewalCycleId ?? '').trim();

    if (paymentTypeHint === 'renew' || renewCycleIdHint) {
      if (!renewCycleIdHint) {
        throw new BadRequestException(
          'renewalCycleId is required when loading renew payments',
        );
      }
      const cycle = await this.renewalCycleModel
        .findById(renewCycleIdHint)
        .session(options?.session ?? null)
        .exec();
      if (!cycle || cycle.urnNo !== normalizedUrn) {
        throw new BadRequestException(
          'renewalCycleId does not match this URN',
        );
      }
      return this.paymentDetailsModel
        .findOne(buildRenewPaymentFindFilter(normalizedUrn, cycle))
        .session(options?.session ?? null)
        .exec();
    }

    let existingPayment = await this.paymentDetailsModel
      .findOne(paymentQuery)
      .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
      .session(options?.session ?? null)
      .exec();

    if (!existingPayment && paymentTypeHint) {
      existingPayment = await this.paymentDetailsModel
        .findOne({ urnNo: { $in: urnOptions } })
        .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
        .session(options?.session ?? null)
        .exec();
      if (existingPayment?.paymentType === 'renew' && !renewCycleIdHint) {
        throw new BadRequestException(
          'renewalCycleId is required when loading renew payments',
        );
      }
    }

    return existingPayment;
  }

  private async findPaymentForVendorUrn(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    paymentType: string,
    session?: ClientSession,
  ): Promise<PaymentDetailsDocument | null> {
    const urnOptions = this.urnCandidates(urnNo);
    const vendorIdString = vendorObjectId.toString();
    const query = this.paymentDetailsModel
      .findOne({
        urnNo: { $in: urnOptions },
        paymentType,
        $or: [
          { vendorId: vendorObjectId },
          { $expr: { $eq: [{ $toString: '$vendorId' }, vendorIdString] } },
        ],
      })
      .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 });
    if (session) {
      query.session(session);
    }
    return query.exec();
  }

  private isVendorPaymentProofPayload(
    dto: UpdatePaymentDto,
    chequeOrDdFile?: Express.Multer.File,
    tdsFile?: Express.Multer.File,
  ): boolean {
    return (
      dto.paymentMode !== undefined ||
      dto.paymentReferenceNo !== undefined ||
      dto.paymentChequeDate !== undefined ||
      !!chequeOrDdFile ||
      !!tdsFile
    );
  }

  private validateSupportingDocumentForPaymentSubmission(params: {
    dto: UpdatePaymentDto;
    existingPayment: PaymentDetailsDocument;
    tdsFile?: Express.Multer.File;
    actorRole?: string;
    vendorProofUpdate: boolean;
  }): void {
    if (!this.isVendorPortalRole(params.actorRole)) {
      return;
    }
    const submittingPayment =
      params.vendorProofUpdate || params.dto.paymentStatus === 1;
    if (!submittingPayment) {
      return;
    }
    const existingSupportingDocument = String(
      params.existingPayment.tdsFile ?? '',
    ).trim();
    if (!this.hasUploadedFile(params.tdsFile) && !existingSupportingDocument) {
      throw new BadRequestException('Supporting Document is required.');
    }
  }

  private hasUploadedFile(file?: Express.Multer.File): boolean {
    return Boolean(
      file &&
      (String(file.originalname ?? '').trim() ||
        (file.size ?? 0) > 0 ||
        (file.buffer?.length ?? 0) > 0),
    );
  }

  private normalizePaymentReferenceNo(value?: string): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    const reference = String(value).trim();
    if (!reference) {
      return undefined;
    }
    if (reference.length > PAYMENT_REFERENCE_MAX_LENGTH) {
      throw new BadRequestException(
        `Transaction Reference Number must not exceed ${PAYMENT_REFERENCE_MAX_LENGTH} characters`,
      );
    }
    if (!PAYMENT_REFERENCE_ALPHANUMERIC.test(reference)) {
      throw new BadRequestException(
        'Transaction Reference Number must be alphanumeric',
      );
    }
    return reference;
  }

  private async assertPaymentReferenceNoUnique(
    paymentReferenceNo: string,
    excludePaymentId?: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
    const escaped = paymentReferenceNo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const filter: Record<string, unknown> = {
      paymentReferenceNo: { $regex: `^${escaped}$`, $options: 'i' },
    };
    if (excludePaymentId) {
      filter._id = { $ne: excludePaymentId };
    }

    let query = this.paymentDetailsModel.findOne(filter).select('_id').lean();
    if (session) {
      query = query.session(session);
    }

    const existing = await query.exec();
    if (existing) {
      throw new BadRequestException(PAYMENT_REFERENCE_UNIQUE_MESSAGE);
    }
  }

  private validateVendorPaymentProofMutationAllowed(params: {
    existingPayment: PaymentDetailsDocument;
    updatePaymentDto: UpdatePaymentDto;
    vendorProofUpdate: boolean;
  }): void {
    const currentStatus = Number(params.existingPayment.paymentStatus ?? 0);
    const requestedStatus = params.updatePaymentDto.paymentStatus;
    const isSubmittingPayment =
      params.vendorProofUpdate || requestedStatus === 1;
    const isRevertingToDraft = requestedStatus === 0 && currentStatus >= 1;

    if (
      isRevertingToDraft &&
      currentStatus !== 3
    ) {
      throw new BadRequestException(PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE);
    }

    if (!isSubmittingPayment && requestedStatus === undefined) {
      return;
    }

    if (currentStatus === 1 && isSubmittingPayment) {
      throw new BadRequestException(PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE);
    }

    if (currentStatus === 2 && (isSubmittingPayment || params.vendorProofUpdate)) {
      throw new BadRequestException(PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE);
    }

    if (
      currentStatus === 0 &&
      isSubmittingPayment &&
      !isVendorPaymentProofEditable(params.existingPayment)
    ) {
      throw new BadRequestException(
        'Approve the proposal before submitting payment details',
      );
    }
  }

  private clearVendorPaymentProofFields(updateData: Record<string, unknown>): void {
    updateData.paymentMode = null;
    updateData.paymentReferenceNo = null;
    updateData.paymentChequeDate = null;
    updateData.tdsFile = null;
    updateData.chequeOrDdFile = null;
  }

  private isAdminQuoteFieldsUpdate(dto: UpdatePaymentDto): boolean {
    return (
      dto.quoteAmount !== undefined ||
      dto.quoteGstAmount !== undefined ||
      dto.quoteTdsAmount !== undefined ||
      dto.quoteTotal !== undefined ||
      dto.adminGstNo !== undefined ||
      dto.vendorGstNo !== undefined
    );
  }

  private async logTimelineEntry(
    vendorId: string,
    manufacturerId: string,
    urnNo: string,
    entry: {
      activity: string;
      responsibility: ActivityLifecycleOwner;
      next_activity: string;
      next_responsibility: ActivityLifecycleOwner;
      activities_id?: number;
      activity_status?: number;
    },
    urnStatusFallback = 0,
  ): Promise<void> {
    try {
      const activitiesId = entry.activities_id ?? urnStatusFallback;
      const activityStatus = entry.activity_status ?? activitiesId;
      await this.activityLogService.logActivity({
        vendor_id: vendorId,
        manufacturer_id: manufacturerId,
        urn_no: urnNo,
        activities_id: activitiesId,
        activity: entry.activity,
        activity_status: activityStatus,
        responsibility: entry.responsibility,
        next_responsibility: entry.next_responsibility,
        next_activity: entry.next_activity,
        next_acitivities_id: this.getNextActivityIdForLog(activitiesId),
        status: 0,
      });
    } catch (err) {
      console.error('[Payment] Timeline activity log failed:', err);
    }
  }

  private async logAdminPaymentRejected(
    vendorId: string,
    manufacturerId: string,
    urnNo: string,
    paymentType: string,
    paymentRejectionRemarks: string,
    urnStatus: number,
  ): Promise<void> {
    const isCertification = paymentType === 'certification';
    const activityLabel = isCertification
      ? 'Approve/Reject Certification Fee'
      : 'Approve/Reject Registration Fee';
    await this.logTimelineEntry(
      vendorId,
      manufacturerId,
      urnNo,
      {
        activity: activityLabel,
        responsibility: 'Admin',
        next_activity: isCertification
          ? 'Certification Fee Payment'
          : 'Approve/Reject Registration Fee Proposal and make payment',
        next_responsibility: 'Manufacturer',
        activities_id: urnStatus,
        activity_status: urnStatus,
      },
      urnStatus,
    );
    console.info('[Payment] admin_payment_rejected', {
      urnNo,
      paymentType,
      paymentStatus: 3,
      paymentRejectionRemarks,
    });
  }

  private applyPaymentStatusUpdate(
    updateData: Record<string, unknown>,
    updatePaymentDto: UpdatePaymentDto,
    existingPayment: PaymentDetailsDocument,
    actorRole?: string,
  ): {
    adminRejectedPayment: boolean;
    adminApprovedPayment: boolean;
    paymentRejectionRemarks?: string;
  } {
    if (updatePaymentDto.paymentStatus === undefined) {
      return { adminRejectedPayment: false, adminApprovedPayment: false };
    }

    const newStatus = updatePaymentDto.paymentStatus;
    const currentStatus = Number(existingPayment.paymentStatus ?? 0);

    if (newStatus === 3) {
      if (!this.isAdminPortalRole(actorRole)) {
        throw new ForbiddenException(
          'Only admin portal users can reject a submitted payment',
        );
      }
      if (currentStatus !== 1) {
        throw new BadRequestException(
          'Payment can only be rejected when it is pending admin review (paymentStatus 1)',
        );
      }
      const remarks = String(
        updatePaymentDto.paymentRejectionRemarks ?? '',
      ).trim();
      if (!remarks) {
        throw new BadRequestException(
          'paymentRejectionRemarks is required when rejecting payment (paymentStatus 3)',
        );
      }
      if (remarks.length > 500) {
        throw new BadRequestException(
          'paymentRejectionRemarks must not exceed 500 characters',
        );
      }
      updateData.paymentStatus = 3;
      updateData.paymentRejectionRemarks = remarks;
      return {
        adminRejectedPayment: true,
        adminApprovedPayment: false,
        paymentRejectionRemarks: remarks,
      };
    }

    if (newStatus === 2) {
      if (!this.isAdminPortalRole(actorRole)) {
        throw new ForbiddenException(
          'Only admin portal users can approve a submitted payment',
        );
      }
      updateData.paymentStatus = 2;
      updateData.paymentRejectionRemarks = undefined;
      return { adminRejectedPayment: false, adminApprovedPayment: true };
    }

    updateData.paymentStatus = newStatus;
    return { adminRejectedPayment: false, adminApprovedPayment: false };
  }

  /** Query both canonical and legacy trailing-slash URN formats. */
  private urnCandidates(urnNo: string): string[] {
    const normalized = this.normalizeUrnNo(urnNo);
    if (!normalized) return [];
    return [normalized, `${normalized}/`];
  }

  /** Expand distinct product URNs to include legacy trailing-slash variants. */
  private expandUrnListForQuery(urnNos: string[]): string[] {
    const set = new Set<string>();
    for (const raw of urnNos) {
      for (const candidate of this.urnCandidates(String(raw ?? ''))) {
        if (candidate) set.add(candidate);
      }
    }
    return [...set];
  }

  /**
   * All organization ids linked to this vendor login (closure over products).
   * Connects manufacturerId / vendorId pairs used inconsistently across URNs.
   */
  private async resolveVendorOrganizationIds(
    vendorId: string,
  ): Promise<Types.ObjectId[]> {
    const primary = this.toObjectId(vendorId, 'vendorId');
    const idSet = new Set<string>([primary.toString()]);

    for (let round = 0; round < 8; round += 1) {
      const oids = [...idSet].map((id) => new Types.ObjectId(id));
      const products = await this.productModel
        .find({
          $or: [{ vendorId: { $in: oids } }, { manufacturerId: { $in: oids } }],
        })
        .select('vendorId manufacturerId')
        .lean()
        .exec();

      let expanded = false;
      for (const product of products) {
        for (const raw of [product.vendorId, product.manufacturerId]) {
          if (raw == null) continue;
          const s = String(raw).trim();
          if (Types.ObjectId.isValid(s) && !idSet.has(s)) {
            idSet.add(s);
            expanded = true;
          }
        }
      }
      if (!expanded) {
        break;
      }
    }

    return [...idSet].map((id) => new Types.ObjectId(id));
  }

  /** Every URN that belongs to the vendor org (all registrations, not a single URN). */
  private async resolveAllVendorUrns(
    organizationIds: Types.ObjectId[],
  ): Promise<string[]> {
    if (organizationIds.length === 0) {
      return [];
    }

    const orgFilter = {
      $or: [
        { vendorId: { $in: organizationIds } },
        { manufacturerId: { $in: organizationIds } },
      ],
    };

    const orgIdStrings = organizationIds.map((id) => id.toString());

    const [productUrns, paymentUrns] = await Promise.all([
      this.productModel.distinct('urnNo', orgFilter).exec(),
      this.paymentDetailsModel
        .distinct('urnNo', {
          $or: [
            { vendorId: { $in: organizationIds } },
            {
              $expr: {
                $in: [{ $toString: '$vendorId' }, orgIdStrings],
              },
            },
          ],
        })
        .exec(),
    ]);

    return this.expandUrnListForQuery(
      [...(productUrns ?? []), ...(paymentUrns ?? [])].map((u) =>
        String(u ?? ''),
      ),
    );
  }

  /**
   * Vendor payment list: all rows on any owned URN (registration + certification + renew).
   * URN is authoritative — payment.vendorId may differ from the JWT manufacturerId.
   */
  private buildVendorPaymentsListMatch(
    organizationIds: Types.ObjectId[],
    urnNos: string[],
  ): Record<string, unknown> {
    if (urnNos.length > 0) {
      return { urnNo: { $in: urnNos } };
    }

    const orgIdStrings = organizationIds.map((id) => id.toString());
    return {
      $or: [
        { vendorId: { $in: organizationIds } },
        {
          $expr: {
            $in: [{ $toString: '$vendorId' }, orgIdStrings],
          },
        },
      ],
    };
  }

  /** Certification payments must store numeric `productId` values only (JSON array string). */
  private validateCertificationProductsField(
    raw: string | null | undefined,
    options: { required?: boolean } = {},
  ): void {
    const trimmed = String(raw ?? '').trim();
    if (!trimmed) {
      if (options.required) {
        const message = getProductsToBeCertifiedValidationError('');
        if (message) {
          throw new BadRequestException(message);
        }
      }
      return;
    }
    const message = getProductsToBeCertifiedValidationError(trimmed);
    if (message) {
      throw new BadRequestException(message);
    }
  }

  /** Persist certification selection as JSON numeric productId array, e.g. `"[101,102]"`. */
  private normalizeCertificationProductsField(raw: string): string {
    try {
      return normalizeProductsToBeCertifiedStorage(raw);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
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
    previousUrnStatus: number,
  ): Promise<void> {
    try {
      await this.productRegistrationWorkflowService.syncToUrnStatus(
        {
          vendorId,
          manufacturerId: manufacturerIdStr,
          urnNo,
        },
        previousUrnStatus,
        newUrnStatus,
      );
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
    hasProposalFile = false,
  ): Promise<void> {
    if (!urnNo) return;
    try {
      const urnOptions = this.urnCandidates(urnNo);
      const product = await this.productModel
        .findOne({
          urnNo: { $in: urnOptions },
          vendorId: vendorObjectId,
        })
        .select('manufacturerId urnStatus')
        .lean()
        .exec();
      if (!product) return;

      const urnStatus =
        typeof product.urnStatus === 'number' ? product.urnStatus : 0;
      const manufacturerId = product.manufacturerId.toString();

      if (hasProposalFile && paymentType === 'registration') {
        await this.logTimelineEntry(
          vendorId,
          manufacturerId,
          urnNo,
          {
            activity: 'Assign Registration Fee',
            responsibility: 'Admin',
            next_activity:
              'Approve/Reject Registration Fee Proposal and make payment',
            next_responsibility: 'Manufacturer',
            activities_id: urnStatus,
            activity_status: urnStatus,
          },
          urnStatus,
        );
        return;
      }

      const label =
        paymentType === 'certification'
          ? 'Assign Certification Fee'
          : 'Assign Registration Fee';
      await this.logTimelineEntry(
        vendorId,
        manufacturerId,
        urnNo,
        {
          activity: label,
          responsibility: 'Admin',
          next_activity:
            paymentType === 'certification'
              ? 'Certification Fee Payment'
              : 'Approve/Reject Registration Fee Proposal and make payment',
          next_responsibility: 'Manufacturer',
          activities_id: urnStatus,
          activity_status: urnStatus,
        },
        urnStatus,
      );
    } catch (err) {
      console.error('[Payment] Activity log (payment created) failed:', err);
    }
  }

  private tryNotifyPaymentProposalReady(
    urnNo: string,
    vendorObjectId: Types.ObjectId,
    paymentId: number,
    paymentType: 'registration' | 'certification' | 'renew',
    quoteTotal?: number | string,
  ): void {
    this.findUrnProductForOrg(urnNo, vendorObjectId, 'manufacturerId')
      .then(async (product) => {
        if (!product?.manufacturerId) {
          console.warn(
            `[Payment] Proposal ready notification skipped — no product for ${urnNo}`,
          );
          return;
        }
        const manufacturer = await this.manufacturerModel
          .findById(product.manufacturerId)
          .select('manufacturerName vendor_name vendor_email')
          .lean()
          .exec();
        console.log(
          `[Payment] Registration fee proposal notification for ${urnNo} (paymentId=${paymentId})`,
        );
        return this.lifecycleNotification.notifyPaymentProposalReady({
          manufacturerId: product.manufacturerId.toString(),
          urnNo,
          paymentId,
          paymentType,
          quoteTotal,
          vendorEmail: String(manufacturer?.vendor_email ?? '').trim() || undefined,
          manufacturerName:
            String(manufacturer?.manufacturerName ?? '').trim() ||
            String(manufacturer?.vendor_name ?? '').trim() ||
            undefined,
        });
      })
      .catch((err) =>
        console.warn(
          '[Payment] Proposal ready notification failed:',
          (err as Error)?.message,
        ),
      );
  }

  /**
   * Vendor PRODUCT_REJECTED when certification fee creation auto-rejects
   * products not selected in productsToBeCertified (productStatus 0/1/2 → 3).
   */
  private tryNotifyCertificationFeeAutoRejected(
    urnNo: string,
    products: Array<{
      manufacturerId?: Types.ObjectId | string;
      productName?: string;
      productId?: number;
      eoiNo?: string;
    }>,
  ): void {
    const reason = 'Auto-rejected: not selected for certification fee';
    for (const product of products) {
      const manufacturerId = String(product.manufacturerId ?? '').trim();
      if (!manufacturerId) {
        console.warn(
          `[Payment] Auto-reject notify skipped — missing manufacturerId urn=${urnNo} productId=${product.productId}`,
        );
        continue;
      }
      const productName =
        String(product.productName ?? '').trim() ||
        String(product.eoiNo ?? '').trim() ||
        (product.productId != null ? `Product ${product.productId}` : urnNo);
      this.lifecycleNotification
        .notifyProductRejected({
          manufacturerId,
          urnNo,
          productName,
          reason,
        })
        .catch((err) =>
          console.warn(
            `[Payment] Auto-reject product notification failed urn=${urnNo} product=${productName}:`,
            (err as Error)?.message,
          ),
        );
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
    actorRole?: string,
  ): Promise<Record<string, unknown>> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {
        const normalizedUrnNo = this.normalizeUrnNo(createPaymentDto.urnNo);
        if (!normalizedUrnNo) {
          throw new BadRequestException('URN number is required');
        }

        const urnOwnerObjectId = await this.resolveUrnOwnerVendorObjectId(
          normalizedUrnNo,
          session,
        );
        const callerObjectId = this.toObjectId(vendorId, 'vendorId');

        if (
          this.isVendorPortalRole(actorRole) &&
          !this.idsEqual(urnOwnerObjectId, callerObjectId)
        ) {
          throw new ForbiddenException(
            'You can only create payments for your own URN registrations',
          );
        }

        const vendorObjectId = urnOwnerObjectId;

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
          proposalFilePath = (await uploadFile(proposalFile, 'payments'))
            .fileUrl;
        }

        const normalizedPaymentType = this.normalizePaymentType(
          createPaymentDto.paymentType,
        );

        let renewalCycleObjectId: Types.ObjectId | undefined;
        if (normalizedPaymentType === 'renew') {
          let cycleIdRaw = String(
            createPaymentDto.renewalCycleId ?? '',
          ).trim();
          if (!cycleIdRaw) {
            if (!this.renewalOrchestration) {
              throw new BadRequestException(
                'renewalCycleId is required when paymentType is renew',
              );
            }
            const opened =
              await this.renewalOrchestration.resolveInProgressRenewalCycleForPayment(
                normalizedUrnNo,
                String(vendorObjectId),
                session,
              );
            cycleIdRaw = String(opened._id);
          }
          const cycle = await assertRenewCycleAcceptsPayment(
            this.renewalCycleModel,
            normalizedUrnNo,
            cycleIdRaw,
          );
          renewalCycleObjectId = toRenewObjectId(
            String(cycle._id),
            'renewalCycleId',
          );
          const existingForCycle = await this.paymentDetailsModel
            .findOne(buildRenewPaymentFindFilter(normalizedUrnNo, cycle))
            .session(session)
            .exec();
          if (existingForCycle) {
            throw new BadRequestException(
              `A renew payment already exists for renewal cycle ${cycle.cycleNo}`,
            );
          }
        }

        let productsToBeCertified: string | undefined;
        if (normalizedPaymentType === 'certification') {
          if (!String(createPaymentDto.productsToBeCertified ?? '').trim()) {
            throw new BadRequestException(
              getProductsToBeCertifiedValidationError(''),
            );
          }
          productsToBeCertified = this.normalizeCertificationProductsField(
            createPaymentDto.productsToBeCertified!,
          );
        } else if (createPaymentDto.productsToBeCertified !== undefined) {
          productsToBeCertified = createPaymentDto.productsToBeCertified;
        }

        let selectedProductIds: number[] = [];
        let rejectedProductIds: number[] = [];
        let resequenceApplied = false;
        let updatedSequenceCount = 0;
        let autoRejectedProducts: Array<{
          manufacturerId?: Types.ObjectId | string;
          productName?: string;
          productId?: number;
          eoiNo?: string;
        }> = [];

        if (normalizedPaymentType === 'certification') {
          const parsed = parseProductsToBeCertified(productsToBeCertified);
          selectedProductIds = [...new Set(parsed.productIds)];
          if (selectedProductIds.length === 0) {
            throw new BadRequestException(
              'productsToBeCertified must contain at least one numeric productId',
            );
          }

          const urnProducts = await this.productModel
            .find(
              matchActiveProducts({
                urnNo: normalizedUrnNo,
                vendorId: vendorObjectId,
              }),
              {
                _id: 1,
                productId: 1,
                manufacturerId: 1,
                productStatus: 1,
                productName: 1,
                eoiNo: 1,
              },
            )
            .session(session)
            .exec();

          if (!urnProducts.length) {
            throw new NotFoundException(
              `No active products found for URN ${normalizedUrnNo}`,
            );
          }

          const urnProductIds = new Set(
            urnProducts
              .map((p) => Number(p.productId))
              .filter((id) => Number.isFinite(id)),
          );
          const mismatches = selectedProductIds.filter(
            (id) => !urnProductIds.has(id),
          );
          if (mismatches.length > 0) {
            throw new BadRequestException(
              `productsToBeCertified includes productId(s) not under URN ${normalizedUrnNo}: ${mismatches.join(', ')}`,
            );
          }

          const unselected = urnProducts.filter((p) => {
            const pid = Number(p.productId);
            if (!Number.isFinite(pid)) return false;
            return (
              !selectedProductIds.includes(pid) &&
              [0, 1, 2].includes(Number(p.productStatus ?? 0))
            );
          });
          rejectedProductIds = unselected
            .map((p) => Number(p.productId))
            .filter((id) => Number.isFinite(id));

          if (unselected.length > 0) {
            await this.productModel
              .updateMany(
                {
                  _id: { $in: unselected.map((p) => p._id) },
                },
                {
                  $set: {
                    productStatus: 3,
                    rejectedDetails:
                      'Auto-rejected: not selected for certification fee',
                    rejectedAt: now,
                    updatedDate: now,
                  },
                },
                { session },
              )
              .exec();

            autoRejectedProducts = unselected.map((p) => ({
              manufacturerId: p.manufacturerId,
              productName: p.productName,
              productId: Number(p.productId),
              eoiNo: p.eoiNo != null ? String(p.eoiNo) : undefined,
            }));

            // Re-number remaining active EOIs (pending/submitted/certified).
            // Rejected products keep their original eoiNo — no conflict with active rows.
            const manufacturerIds = [
              ...new Set(
                urnProducts
                  .map((p) => String(p.manufacturerId ?? '').trim())
                  .filter(Boolean),
              ),
            ];
            for (const manufacturerId of manufacturerIds) {
              updatedSequenceCount +=
                await this.productSoftDeleteService.resequenceForManufacturerInSession(
                  manufacturerId,
                  session,
                );
            }
            resequenceApplied = updatedSequenceCount > 0;
          }
        }

        const normalizedPaymentReferenceNo = this.normalizePaymentReferenceNo(
          createPaymentDto.paymentReferenceNo,
        );
        if (normalizedPaymentReferenceNo) {
          await this.assertPaymentReferenceNoUnique(
            normalizedPaymentReferenceNo,
            undefined,
            session,
          );
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
          ...(renewalCycleObjectId
            ? { renewalCycleId: renewalCycleObjectId }
            : {}),
          paymentMode: createPaymentDto.paymentMode,
          onlinePaymentId: createPaymentDto.onlinePaymentId || 0,
          paymentReferenceNo: normalizedPaymentReferenceNo,
          paymentChequeDate: createPaymentDto.paymentChequeDate
            ? new Date(createPaymentDto.paymentChequeDate)
            : undefined,
          productsToBeCertified,
          paymentStatus: 0, // Default: 0=Created
          vendorProposalApprovalStatus: 0,
          proposalRejectionRemarks: undefined,
          createdDate: now,
          updatedDate: now,
        };

        const payment = new this.paymentDetailsModel(paymentData);
        const savedPayment = await payment.save({ session });

        if (normalizedPaymentType === 'renew' && renewalCycleObjectId) {
          await this.renewalCycleModel.updateOne(
            { _id: renewalCycleObjectId },
            {
              $set: {
                paymentId: savedPayment.paymentId,
                updatedAt: now,
              },
            },
            { session },
          );
        }

        if (proposalFilePath) {
          await trackPaymentFileChange(this.documentVersioningService, {
            urnNo: normalizedUrnNo,
            paymentId: savedPayment._id,
            field: 'proposalFile',
            userId: vendorObjectId,
            filePath: proposalFilePath,
            file: proposalFile,
            action: 'added',
            paymentType: normalizedPaymentType,
            ...(normalizedPaymentType === 'renew' && renewalCycleObjectId
              ? { renewalCycleId: renewalCycleObjectId }
              : {}),
            session,
          });
        }

        await session.commitTransaction();
        session.endSession();

        await this.tryLogPaymentCreated(
          vendorId,
          vendorObjectId,
          normalizedUrnNo,
          normalizedPaymentType,
          Boolean(proposalFilePath),
        );
        if (
          proposalFilePath &&
          (normalizedPaymentType === 'registration' ||
            normalizedPaymentType === 'certification')
        ) {
          this.tryNotifyPaymentProposalReady(
            normalizedUrnNo,
            vendorObjectId,
            savedPayment.paymentId,
            normalizedPaymentType,
            savedPayment.quoteTotal,
          );
        }
        if (autoRejectedProducts.length > 0) {
          this.tryNotifyCertificationFeeAutoRejected(
            normalizedUrnNo,
            autoRejectedProducts,
          );
        }
        const response = await this.formatPaymentForApi(savedPayment);
        if (normalizedPaymentType === 'certification') {
          return {
            ...response,
            selectedProductIds,
            rejectedProductIds,
            resequenceApplied,
            updatedSequenceCount,
          };
        }
        return response;
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        // For validation errors, throw immediately
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException ||
          error instanceof ForbiddenException
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
   * Get payment details for a URN (vendor/admin payment form load).
   */
  async getPaymentByUrn(
    urnNo: string,
    options?: {
      vendorId?: string;
      actorRole?: string;
      paymentType?: string;
      renewalCycleId?: string;
    },
  ): Promise<Record<string, unknown>> {
    const normalizedUrn = this.normalizeUrnNo(urnNo);
    if (!normalizedUrn) {
      throw new BadRequestException('URN number is required');
    }

    const payment = await this.findPaymentRecordForUrn(normalizedUrn, {
      paymentType: options?.paymentType,
      renewalCycleId: options?.renewalCycleId,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (options?.vendorId && this.isVendorPortalRole(options.actorRole)) {
      const callerObjectId = this.toObjectId(options.vendorId, 'vendorId');
      const urnOwnerObjectId =
        await this.resolveUrnOwnerVendorObjectId(normalizedUrn);
      if (
        !this.idsEqual(urnOwnerObjectId, callerObjectId) &&
        !this.idsEqual(payment.vendorId, callerObjectId)
      ) {
        throw new ForbiddenException(
          'You do not have access to this URN payment',
        );
      }
    }

    return this.formatPaymentForApi(payment);
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
    proposalFile?: Express.Multer.File,
    actorRole?: string,
  ): Promise<Record<string, unknown>> {
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

      const paymentTypeHint =
        updatePaymentDto.paymentType !== undefined
          ? this.normalizePaymentType(updatePaymentDto.paymentType)
          : undefined;

      const renewCycleIdHint = String(
        updatePaymentDto.renewalCycleId ?? '',
      ).trim();

      let existingPayment = await this.findPaymentRecordForUrn(normalizedUrn, {
        paymentType: paymentTypeHint,
        renewalCycleId: renewCycleIdHint || undefined,
        session,
      });

      if (!existingPayment) {
        throw new NotFoundException('Payment not found');
      }

      const urnOwnerObjectId = await this.resolveUrnOwnerVendorObjectId(
        normalizedUrn,
        session,
      );

      if (vendorId && this.isVendorPortalRole(actorRole)) {
        const callerObjectId = this.toObjectId(vendorId, 'vendorId');
        if (
          !this.idsEqual(urnOwnerObjectId, callerObjectId) &&
          !this.idsEqual(existingPayment.vendorId, callerObjectId)
        ) {
          throw new ForbiddenException(
            'You do not have access to this URN payment',
          );
        }
      }

      if (!this.idsEqual(existingPayment.vendorId, urnOwnerObjectId)) {
        existingPayment = await this.paymentDetailsModel
          .findByIdAndUpdate(
            existingPayment._id,
            { $set: { vendorId: urnOwnerObjectId, updatedDate: new Date() } },
            { new: true, session },
          )
          .exec();
        if (!existingPayment) {
          throw new NotFoundException('Payment not found after vendor sync');
        }
      }

      const effectiveVendorObjectId = urnOwnerObjectId;
      const effectiveVendorId = effectiveVendorObjectId.toString();
      const paymentPlain = this.paymentToPlain(existingPayment);
      const currentApproval = resolveVendorProposalApprovalStatus(paymentPlain);
      const paymentType =
        updatePaymentDto.paymentType !== undefined
          ? this.normalizePaymentType(updatePaymentDto.paymentType)
          : existingPayment.paymentType;

      const now = new Date();
      const updateData: any = { updatedDate: now };
      if (renewCycleIdHint && paymentType === 'renew') {
        updateData.renewalCycleId = toRenewObjectId(
          renewCycleIdHint,
          'renewalCycleId',
        );
      }
      let trackedProposalPath: string | undefined;
      let trackedProposalAction: 'added' | 'replaced' = 'added';
      let trackedChequePath: string | undefined;
      let trackedChequeAction: 'added' | 'replaced' = 'added';
      let trackedTdsPath: string | undefined;
      let trackedTdsAction: 'added' | 'replaced' = 'added';

      if (proposalFile) {
        if (!this.isAdminPortalRole(actorRole)) {
          throw new ForbiddenException(
            'Only admin portal users can upload a proposal document',
          );
        }

        const previousProposal = existingPayment.proposalFile;
        const newProposalPath = (await uploadFile(proposalFile, 'payments'))
          .fileUrl;

        if (
          currentApproval === 2 &&
          this.isAdminQuoteFieldsUpdate(updatePaymentDto) &&
          !proposalFile
        ) {
          throw new BadRequestException(
            'Vendor rejected the proposal document. Upload a revised proposal file before updating amounts.',
          );
        }

        if (currentApproval === 2) {
          updateData.previousProposalFile = previousProposal;
          updateData.proposalRejectionRemarks = undefined;
          updateData.vendorProposalApprovalStatus = 0;
          updateData.paymentStatus = 0;
          this.clearVendorPaymentProofFields(updateData);
        } else if (currentApproval === 1) {
          updateData.previousProposalFile = previousProposal;
          updateData.vendorProposalApprovalStatus = 0;
          this.clearVendorPaymentProofFields(updateData);
        } else {
          updateData.vendorProposalApprovalStatus = 0;
          this.clearVendorPaymentProofFields(updateData);
        }

        updateData.proposalFile = newProposalPath;
        trackedProposalPath = newProposalPath;
        trackedProposalAction = previousProposal ? 'replaced' : 'added';
      } else if (
        currentApproval === 2 &&
        this.isAdminQuoteFieldsUpdate(updatePaymentDto)
      ) {
        throw new BadRequestException(
          'Vendor rejected the proposal document. Upload a revised proposal file before updating amounts.',
        );
      }

      const vendorProofUpdate = this.isVendorPaymentProofPayload(
        updatePaymentDto,
        chequeOrDdFile,
        tdsFile,
      );
      if (
        vendorProofUpdate &&
        paymentType === 'registration' &&
        currentApproval !== 1
      ) {
        throw new BadRequestException(
          'Approve the proposal before submitting payment details',
        );
      }

      this.validateSupportingDocumentForPaymentSubmission({
        dto: updatePaymentDto,
        existingPayment,
        tdsFile,
        actorRole,
        vendorProofUpdate,
      });

      if (this.isVendorPortalRole(actorRole)) {
        this.validateVendorPaymentProofMutationAllowed({
          existingPayment,
          updatePaymentDto,
          vendorProofUpdate,
        });
      }

      if (
        updatePaymentDto.paymentMode === 'cheque_or_dd' &&
        (!chequeOrDdFile || !tdsFile)
      ) {
        throw new BadRequestException(
          'For paymentMode=cheque_or_dd, both cheque_or_dd_file and tds_file are required',
        );
      }

      if (updatePaymentDto.quoteAmount !== undefined)
        updateData.quoteAmount = updatePaymentDto.quoteAmount;
      if (updatePaymentDto.quoteGstAmount !== undefined)
        updateData.quoteGstAmount = updatePaymentDto.quoteGstAmount;
      if (updatePaymentDto.quoteTdsAmount !== undefined)
        updateData.quoteTdsAmount = updatePaymentDto.quoteTdsAmount;
      if (updatePaymentDto.quoteTotal !== undefined)
        updateData.quoteTotal = updatePaymentDto.quoteTotal;
      if (updatePaymentDto.adminGstNo !== undefined)
        updateData.adminGstNo = updatePaymentDto.adminGstNo;
      if (updatePaymentDto.vendorGstNo !== undefined)
        updateData.vendorGstNo = updatePaymentDto.vendorGstNo;
      if (updatePaymentDto.paymentType !== undefined) {
        updateData.paymentType = this.normalizePaymentType(
          updatePaymentDto.paymentType,
        );
      }
      if (updatePaymentDto.paymentMode !== undefined)
        updateData.paymentMode = updatePaymentDto.paymentMode;
      if (updatePaymentDto.onlinePaymentId !== undefined)
        updateData.onlinePaymentId = updatePaymentDto.onlinePaymentId;
      if (updatePaymentDto.paymentReferenceNo !== undefined) {
        const normalizedPaymentReferenceNo = this.normalizePaymentReferenceNo(
          updatePaymentDto.paymentReferenceNo,
        );
        if (normalizedPaymentReferenceNo) {
          await this.assertPaymentReferenceNoUnique(
            normalizedPaymentReferenceNo,
            existingPayment._id,
            session,
          );
        }
        updateData.paymentReferenceNo = normalizedPaymentReferenceNo;
      }
      if (updatePaymentDto.paymentChequeDate !== undefined) {
        updateData.paymentChequeDate = updatePaymentDto.paymentChequeDate
          ? new Date(updatePaymentDto.paymentChequeDate)
          : undefined;
      }
      if (chequeOrDdFile) {
        const previousCheque = existingPayment.chequeOrDdFile;
        updateData.chequeOrDdFile = (
          await uploadFile(chequeOrDdFile, 'payments')
        ).fileUrl;
        trackedChequePath = updateData.chequeOrDdFile;
        trackedChequeAction = previousCheque ? 'replaced' : 'added';
      }
      if (tdsFile) {
        const previousTds = existingPayment.tdsFile;
        updateData.tdsFile = (await uploadFile(tdsFile, 'payments')).fileUrl;
        trackedTdsPath = updateData.tdsFile;
        trackedTdsAction = previousTds ? 'replaced' : 'added';
      }
      const paymentStatusUpdate = this.applyPaymentStatusUpdate(
        updateData,
        updatePaymentDto,
        existingPayment,
        actorRole,
      );
      let certifiedProductsForNotify = 0;

      const certificationProductsRequired =
        paymentType === 'certification' &&
        (paymentStatusUpdate.adminApprovedPayment ||
          updatePaymentDto.paymentStatus === 2 ||
          (this.isVendorPortalRole(actorRole) &&
            (vendorProofUpdate || updatePaymentDto.paymentStatus === 1)));

      const certificationProductsRaw =
        updatePaymentDto.productsToBeCertified !== undefined
          ? updatePaymentDto.productsToBeCertified
          : certificationProductsRequired
            ? existingPayment.productsToBeCertified
            : undefined;

      if (
        paymentType === 'certification' &&
        (updatePaymentDto.productsToBeCertified !== undefined ||
          certificationProductsRequired)
      ) {
        this.validateCertificationProductsField(certificationProductsRaw, {
          required: certificationProductsRequired,
        });
        if (
          updatePaymentDto.productsToBeCertified !== undefined &&
          String(updatePaymentDto.productsToBeCertified).trim()
        ) {
          updateData.productsToBeCertified =
            this.normalizeCertificationProductsField(
              updatePaymentDto.productsToBeCertified,
            );
        }
      } else if (updatePaymentDto.productsToBeCertified !== undefined) {
        updateData.productsToBeCertified =
          updatePaymentDto.productsToBeCertified;
      }

      const updatedPayment = await this.paymentDetailsModel
        .findOneAndUpdate({ _id: existingPayment._id }, updateData, {
          new: true,
          session,
        })
        .exec();

      if (!updatedPayment) {
        throw new NotFoundException('Payment not found after update');
      }

      const resolvedPaymentType = updatedPayment.paymentType ?? paymentType;
      const trackRenewalCycleId =
        String(resolvedPaymentType).toLowerCase() === 'renew'
          ? (updatedPayment.renewalCycleId ?? null)
          : undefined;
      if (trackedProposalPath) {
        await trackPaymentFileChange(this.documentVersioningService, {
          urnNo: normalizedUrn,
          paymentId: updatedPayment._id,
          field: 'proposalFile',
          userId: effectiveVendorObjectId,
          filePath: trackedProposalPath,
          file: proposalFile,
          action: trackedProposalAction,
          paymentType: resolvedPaymentType,
          renewalCycleId: trackRenewalCycleId,
          session,
        });
      }
      if (trackedChequePath) {
        await trackPaymentFileChange(this.documentVersioningService, {
          urnNo: normalizedUrn,
          paymentId: updatedPayment._id,
          field: 'chequeOrDdFile',
          userId: effectiveVendorObjectId,
          filePath: trackedChequePath,
          file: chequeOrDdFile,
          action: trackedChequeAction,
          paymentType: resolvedPaymentType,
          renewalCycleId: trackRenewalCycleId,
          session,
        });
      }
      if (trackedTdsPath) {
        await trackPaymentFileChange(this.documentVersioningService, {
          urnNo: normalizedUrn,
          paymentId: updatedPayment._id,
          field: 'tdsFile',
          userId: effectiveVendorObjectId,
          filePath: trackedTdsPath,
          file: tdsFile,
          action: trackedTdsAction,
          paymentType: resolvedPaymentType,
          renewalCycleId: trackRenewalCycleId,
          session,
        });
      }

      let deferredUrnLog: {
        urnNo: string;
        newUrnStatus: number;
        previousUrnStatus: number;
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

        const urnStatusProductFilter = buildProductFilterForUrnStatusUpdate(
          { urnNo: { $in: urnOptions }, vendorId: effectiveVendorObjectId },
          resolvedPaymentType,
          updatePaymentDto.urnStatus,
        );

        const anyProduct = await this.productModel
          .findOne(urnStatusProductFilter)
          .session(session)
          .exec();

        if (!anyProduct) {
          console.warn(
            `[Update Payment] No eligible product found for URN ${urnNoToUse}; skipped products.urnStatus update.`,
          );
        } else {
          await this.productModel.updateMany(
            urnStatusProductFilter,
            {
              $set: { urnStatus: updatePaymentDto.urnStatus, updatedDate: now },
            },
            { session },
          );

          deferredUrnLog = {
            urnNo: urnNoToUse,
            newUrnStatus: updatePaymentDto.urnStatus,
            previousUrnStatus: Number(anyProduct.urnStatus ?? 0),
            manufacturerId: anyProduct.manufacturerId.toString(),
          };
        }
      }

      if (
        paymentStatusUpdate.adminApprovedPayment &&
        paymentType === 'certification'
      ) {
        const productsRaw =
          updatedPayment.productsToBeCertified ??
          existingPayment.productsToBeCertified;
        const certificationResult =
          await this.certificationLifecycle.applyCertificationApproval({
            urnNoOptions: urnOptions,
            vendorId: effectiveVendorObjectId,
            productsToBeCertifiedRaw: productsRaw,
            approvedAt: now,
            session,
          });
        certifiedProductsForNotify = Number(
          certificationResult?.certifiedCount ?? 0,
        );
      }

      const previousPaymentStatus = Number(existingPayment.paymentStatus ?? 0);
      const newPaymentStatus = Number(updatedPayment.paymentStatus ?? 0);
      const renewPaymentSubmitted =
        paymentType === 'renew' &&
        this.isVendorPortalRole(actorRole) &&
        previousPaymentStatus !== 1 &&
        newPaymentStatus === 1;

      if (renewPaymentSubmitted) {
        const renewUrnFilter = buildProductFilterForUrnStatusUpdate(
          { urnNo: { $in: urnOptions }, vendorId: effectiveVendorObjectId },
          'renew',
          RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
        );
        await this.productModel.updateMany(
          renewUrnFilter,
          {
            $set: {
              urnStatus: RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
              updatedDate: now,
            },
          },
          { session },
        );
      }

      if (
        paymentStatusUpdate.adminApprovedPayment &&
        paymentType === 'renew' &&
        this.renewalOrchestration
      ) {
        await this.renewalOrchestration.onRenewPaymentApproved({
          urnNo: normalizedUrn,
          paymentId: updatedPayment.paymentId,
          renewalCycleId: updatedPayment.renewalCycleId
            ? String(updatedPayment.renewalCycleId)
            : updatePaymentDto.renewalCycleId,
          vendorId: effectiveVendorObjectId,
          userId: effectiveVendorObjectId,
          session,
        });
        // urnStatus + productRenewStatus: certified EOIs only — set in onRenewPaymentApproved
      }

      await session.commitTransaction();
      session.endSession();

      if (
        paymentStatusUpdate.adminApprovedPayment ||
        paymentStatusUpdate.adminRejectedPayment
      ) {
        void invalidateAdminDashboardCache(this.redisService, this.logger);
      }

      if (deferredUrnLog) {
        await this.tryLogUrnLifecycleAfterPayment(
          effectiveVendorId,
          deferredUrnLog.manufacturerId,
          deferredUrnLog.urnNo,
          deferredUrnLog.newUrnStatus,
          deferredUrnLog.previousUrnStatus,
        );
        if (
          deferredUrnLog.newUrnStatus === 2 &&
          deferredUrnLog.previousUrnStatus < 2 &&
          !paymentStatusUpdate.adminRejectedPayment
        ) {
          this.lifecycleNotification
            .notifyUrnInitialApproved({
              manufacturerId: deferredUrnLog.manufacturerId,
              urnNo: deferredUrnLog.urnNo,
            })
            .catch((err) =>
              console.warn(
                '[Payment] URN registration approved notification failed:',
                (err as Error)?.message,
              ),
            );
        }
      }

      if (proposalFile) {
        const anyProduct = await this.findUrnProductForOrg(
          normalizedUrn,
          effectiveVendorObjectId,
          'manufacturerId urnStatus',
        );
        if (anyProduct) {
          const urnStatus =
            typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
          await this.logTimelineEntry(
            effectiveVendorId,
            anyProduct.manufacturerId.toString(),
            normalizedUrn,
            {
              activity:
                currentApproval === 2
                  ? 'Assign Registration Fee'
                  : 'Assign Registration Fee',
              responsibility: 'Admin',
              next_activity:
                'Approve/Reject Registration Fee Proposal and make payment',
              next_responsibility: 'Manufacturer',
              activities_id: urnStatus,
              activity_status: urnStatus,
            },
            urnStatus,
          );
          if (
            paymentType === 'registration' ||
            paymentType === 'certification'
          ) {
            this.tryNotifyPaymentProposalReady(
              normalizedUrn,
              effectiveVendorObjectId,
              updatedPayment.paymentId,
              paymentType,
              updatedPayment.quoteTotal,
            );
          }
        }
      }

      if (
        vendorProofUpdate &&
        this.isVendorPortalRole(actorRole) &&
        paymentType === 'registration'
      ) {
        const anyProduct = await this.productModel
          .findOne({
            urnNo: { $in: urnOptions },
            vendorId: effectiveVendorObjectId,
          })
          .select('manufacturerId urnStatus')
          .lean()
          .exec();
        if (anyProduct) {
          const urnStatus =
            typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
          await this.logTimelineEntry(
            effectiveVendorId,
            anyProduct.manufacturerId.toString(),
            normalizedUrn,
            {
              activity:
                'Approve/Reject Registration Fee Proposal and make payment',
              responsibility: 'Manufacturer',
              next_activity: 'Approve/Reject Registration Fee',
              next_responsibility: 'Admin',
              activities_id: urnStatus,
              activity_status: urnStatus,
            },
            urnStatus,
          );
        }
      }

      const certificationSubmitted =
        paymentType === 'certification' &&
        this.isVendorPortalRole(actorRole) &&
        previousPaymentStatus !== 1 &&
        newPaymentStatus === 1 &&
        (vendorProofUpdate || updatePaymentDto.paymentStatus === 1);

      if (certificationSubmitted) {
        const anyProduct = await this.productModel
          .findOne({
            urnNo: { $in: urnOptions },
            vendorId: effectiveVendorObjectId,
          })
          .select('manufacturerId urnStatus')
          .lean()
          .exec();
        if (anyProduct) {
          const urnStatus =
            typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
          await this.logTimelineEntry(
            effectiveVendorId,
            anyProduct.manufacturerId.toString(),
            normalizedUrn,
            {
              activity: 'Certification Fee Payment',
              responsibility: 'Manufacturer',
              next_activity: 'Approve/Reject Certification Fee',
              next_responsibility: 'Admin',
              activities_id: urnStatus,
              activity_status: urnStatus,
            },
            urnStatus,
          );
          this.lifecycleNotification
            .notifyCertificationPaymentSubmitted({
              manufacturerId: anyProduct.manufacturerId.toString(),
              urnNo: normalizedUrn,
              paymentId: updatedPayment.paymentId,
              quoteTotal: updatedPayment.quoteTotal,
            })
            .catch((err) =>
              console.warn(
                '[Payment] Certification submitted notification failed:',
                (err as Error)?.message,
              ),
            );
        }
      }

      if (paymentStatusUpdate.adminApprovedPayment) {
        const anyProduct = await this.productModel
          .findOne({
            urnNo: { $in: urnOptions },
            vendorId: effectiveVendorObjectId,
          })
          .select('manufacturerId urnStatus productName')
          .lean()
          .exec();
        if (anyProduct) {
          const urnStatus =
            typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
          const isCertification = paymentType === 'certification';
          await this.logTimelineEntry(
            effectiveVendorId,
            anyProduct.manufacturerId.toString(),
            normalizedUrn,
            {
              activity: isCertification
                ? 'Approve/Reject Certification Fee'
                : 'Approve/Reject Registration Fee',
              responsibility: 'Admin',
              next_activity: isCertification
                ? 'Approve/Reject Certification Fee'
                : 'Process Forms in Progress',
              next_responsibility: 'Manufacturer',
              activities_id: urnStatus,
              activity_status: urnStatus,
            },
            urnStatus,
          );
          await this.syncPaymentToZohoDeal(
            updatedPayment,
            anyProduct.manufacturerId.toString(),
          ).catch((error: any) => {
            console.warn(
              `[Update Payment] Zoho deal payment update failed for ${normalizedUrn}:`,
              error?.message || error,
            );
          });
          if (isCertification) {
            this.lifecycleNotification
              .notifyCertificationPaymentApproved({
                manufacturerId: anyProduct.manufacturerId.toString(),
                urnNo: normalizedUrn,
                paymentId: updatedPayment.paymentId,
              })
              .catch((err) =>
                console.warn(
                  '[Payment] Certification approved notification failed:',
                  (err as Error)?.message,
                ),
              );
            // One PRODUCT_APPROVED for fee-approve flow (payment already set productStatus=2,
            // so later admin product_status/urn_status patches must not notify again).
            if (certifiedProductsForNotify > 0) {
              this.lifecycleNotification
                .notifyProductCertified({
                  manufacturerId: anyProduct.manufacturerId.toString(),
                  urnNo: normalizedUrn,
                  productName: String(anyProduct.productName ?? normalizedUrn),
                })
                .catch((err) =>
                  console.warn(
                    '[Payment] Product certified notification failed:',
                    (err as Error)?.message,
                  ),
                );
            }
          } else if (
            paymentType === 'registration' ||
            paymentType === 'renew'
          ) {
            this.lifecycleNotification
              .notifyRegistrationPaymentApproved({
                manufacturerId: anyProduct.manufacturerId.toString(),
                urnNo: normalizedUrn,
                paymentId: updatedPayment.paymentId,
                paymentType,
              })
              .catch((err) =>
                console.warn(
                  '[Payment] Registration/renew payment approved notification failed:',
                  (err as Error)?.message,
                ),
              );
          }
        }
      }

      if (paymentStatusUpdate.adminRejectedPayment) {
        const anyProduct = await this.productModel
          .findOne({
            urnNo: { $in: urnOptions },
            vendorId: effectiveVendorObjectId,
          })
          .select('manufacturerId urnStatus')
          .lean()
          .exec();
        if (anyProduct) {
          const urnStatus =
            typeof anyProduct.urnStatus === 'number' ? anyProduct.urnStatus : 0;
          if (paymentStatusUpdate.paymentRejectionRemarks) {
            await this.logAdminPaymentRejected(
              effectiveVendorId,
              anyProduct.manufacturerId.toString(),
              normalizedUrn,
              paymentType,
              paymentStatusUpdate.paymentRejectionRemarks,
              urnStatus,
            );
          }
          this.lifecycleNotification
            .notifyRegistrationPaymentRejected({
              manufacturerId: anyProduct.manufacturerId.toString(),
              urnNo: normalizedUrn,
              paymentId: updatedPayment.paymentId,
              paymentType: String(paymentType ?? 'registration'),
              remarks: paymentStatusUpdate.paymentRejectionRemarks,
            })
            .catch((err) =>
              console.warn(
                '[Payment] Payment rejected notification failed:',
                (err as Error)?.message,
              ),
            );
        }
      }

      return this.formatPaymentForApi(updatedPayment);
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
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
   * Vendor approves or rejects admin registration-fee proposal for a URN.
   */
  async setVendorProposalApproval(
    urnNo: string,
    vendorId: string,
    dto: VendorProposalApprovalDto,
    actorRole?: string,
  ): Promise<Record<string, unknown>> {
    if (this.isAdminPortalRole(actorRole)) {
      throw new ForbiddenException(
        'Proposal approval is for the vendor portal only. Admins create or revise proposals via POST/PATCH /payments with proposal_file; vendors approve here with a vendor login.',
      );
    }
    if (!this.isVendorPortalRole(actorRole)) {
      throw new ForbiddenException(
        'Only vendor or partner users can approve or reject registration fee proposals',
      );
    }

    const normalizedUrn = this.normalizeUrnNo(urnNo);
    if (!normalizedUrn) {
      throw new BadRequestException('URN number is required');
    }

    const paymentType = this.normalizePaymentType(dto.paymentType);
    if (paymentType !== 'registration') {
      throw new BadRequestException(
        'Proposal approval is only supported for registration payments',
      );
    }

    const status = dto.vendorProposalApprovalStatus;
    if (status !== 1 && status !== 2) {
      throw new BadRequestException(
        'vendorProposalApprovalStatus must be 1 (approve) or 2 (reject)',
      );
    }

    const { vendorObjectId, product } = await this.assertCallerOwnsUrn(
      normalizedUrn,
      vendorId,
    );
    const urnOptions = this.urnCandidates(normalizedUrn);
    const urnOwnerObjectId =
      await this.resolveUrnOwnerVendorObjectId(normalizedUrn);

    let payment = await this.paymentDetailsModel
      .findOne({
        urnNo: { $in: urnOptions },
        paymentType,
      })
      .sort({ updatedDate: -1, createdDate: -1, paymentId: -1 })
      .exec();

    if (!payment) {
      throw new NotFoundException(
        `No ${paymentType} payment found for URN: ${normalizedUrn}`,
      );
    }

    if (!this.idsEqual(payment.vendorId, urnOwnerObjectId)) {
      payment = await this.paymentDetailsModel
        .findByIdAndUpdate(
          payment._id,
          { $set: { vendorId: urnOwnerObjectId, updatedDate: new Date() } },
          { new: true },
        )
        .exec();
      if (!payment) {
        throw new NotFoundException('Payment not found after vendor sync');
      }
    }

    const paymentPlain = this.paymentToPlain(payment);
    if (!String(paymentPlain.proposalFile ?? '').trim()) {
      throw new BadRequestException(
        'No proposal document on this payment; cannot approve or reject',
      );
    }

    const currentApproval = resolveVendorProposalApprovalStatus(paymentPlain);
    const paymentStatus = Number(payment.paymentStatus ?? 0);
    if (![0, 3].includes(paymentStatus)) {
      throw new BadRequestException(
        'Proposal review is not available for the current payment status',
      );
    }

    if (currentApproval === 2) {
      throw new BadRequestException(
        'Proposal was rejected. Wait for admin to upload a revised proposal document before approving.',
      );
    }

    if (currentApproval === 1 && status === 1) {
      throw new BadRequestException('Proposal is already approved');
    }

    if (currentApproval !== 0) {
      throw new BadRequestException(
        'Proposal cannot be updated in the current approval state',
      );
    }

    const remarks =
      status === 2
        ? String(dto.proposalRejectionRemarks ?? '').trim() || undefined
        : undefined;

    const now = new Date();
    const updated = await this.paymentDetailsModel
      .findByIdAndUpdate(
        payment._id,
        {
          $set: {
            vendorProposalApprovalStatus: status,
            proposalRejectionRemarks: remarks,
            updatedDate: now,
          },
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Payment not found after update');
    }

    const urnStatus =
      typeof product.urnStatus === 'number' ? product.urnStatus : 0;
    if (status === 1) {
      await this.logTimelineEntry(
        vendorId,
        product.manufacturerId.toString(),
        normalizedUrn,
        {
          activity: 'Approve/Reject Registration Fee Proposal and make payment',
          responsibility: 'Manufacturer',
          next_activity: 'Approve/Reject Registration Fee',
          next_responsibility: 'Manufacturer',
          activities_id: urnStatus,
          activity_status: urnStatus,
        },
        urnStatus,
      );
    } else {
      const activityLabel = remarks
        ? `Approve/Reject Registration Fee Proposal and make payment: ${remarks}`
        : 'Approve/Reject Registration Fee Proposal and make payment';
      await this.logTimelineEntry(
        vendorId,
        product.manufacturerId.toString(),
        normalizedUrn,
        {
          activity: activityLabel,
          responsibility: 'Manufacturer',
          next_activity: 'Assign Registration Fee',
          next_responsibility: 'Admin',
          activities_id: urnStatus,
          activity_status: urnStatus,
        },
        urnStatus,
      );
    }

    return this.formatPaymentForApi(updated);
  }

  private buildPaymentListQueryClauses(
    listPaymentsDto: ListPaymentsDto,
    baseMatch: Record<string, unknown>,
    options?: {
      skipSearchClause?: boolean;
      vendorHistoryStatusFilter?: boolean;
    },
  ): Record<string, unknown> {
    const { search, status, paymentType, from, to } = listPaymentsDto;
    const andClauses: Record<string, unknown>[] = [baseMatch];

    if (status !== undefined && status !== null) {
      andClauses.push(
        options?.vendorHistoryStatusFilter &&
          (status === 0 || status === 1 || status === 2)
          ? buildVendorHistoryStatusClause(status)
          : { paymentStatus: status },
      );
    }
    if (paymentType) {
      andClauses.push({ paymentType });
    }
    if (!options?.skipSearchClause && search && search.trim() !== '') {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      andClauses.push({
        $or: [{ urnNo: searchRegex }, { paymentReferenceNo: searchRegex }],
      });
    }

    const createdRange = this.buildCreatedDateRangeFilter(from, to);
    if (createdRange) {
      andClauses.push({ createdDate: createdRange });
    }

    return andClauses.length === 1 ? andClauses[0] : { $and: andClauses };
  }

  /** Inclusive createdDate window from optional `from` / `to` query params. */
  private buildCreatedDateRangeFilter(
    fromRaw?: string,
    toRaw?: string,
  ): Record<string, Date> | null {
    const fromDay = String(fromRaw ?? '').trim();
    const toDay = String(toRaw ?? '').trim();
    if (!fromDay && !toDay) return null;

    const range: Record<string, Date> = {};
    if (fromDay) {
      const from = new Date(fromDay);
      if (Number.isNaN(from.getTime())) {
        throw new BadRequestException('from must be a valid date');
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(fromDay)) {
        from.setHours(0, 0, 0, 0);
      }
      range.$gte = from;
    }
    if (toDay) {
      const to = new Date(toDay);
      if (Number.isNaN(to.getTime())) {
        throw new BadRequestException('to must be a valid date');
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(toDay)) {
        to.setHours(23, 59, 59, 999);
      }
      range.$lte = to;
    }
    if (range.$gte && range.$lte && range.$gte > range.$lte) {
      throw new BadRequestException('from must be before or equal to to');
    }
    return range;
  }

  private async enrichPaymentsWithManufacturer(
    payments: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    const vendorIds = [
      ...new Set(
        payments
          .map((p) => String(p.vendorId ?? '').trim())
          .filter((id) => Types.ObjectId.isValid(id)),
      ),
    ].map((id) => new Types.ObjectId(id));

    if (vendorIds.length === 0) {
      return payments.map((p) => ({
        ...p,
        manufacturerId: p.vendorId != null ? String(p.vendorId) : null,
        manufacturerName: null,
        vendorName: null,
        vendorEmail: null,
      }));
    }

    const manufacturers = await this.manufacturerModel
      .find({ _id: { $in: vendorIds } })
      .select('manufacturerName vendor_name vendor_email')
      .lean()
      .exec();

    const byId = new Map(manufacturers.map((m) => [String(m._id), m]));

    return payments.map((p) => {
      const mfg = byId.get(String(p.vendorId ?? ''));
      return {
        ...p,
        manufacturerId: p.vendorId != null ? String(p.vendorId) : null,
        manufacturerName:
          (mfg?.manufacturerName as string | undefined) ??
          (mfg?.vendor_name as string | undefined) ??
          null,
        vendorName: (mfg?.vendor_name as string | undefined) ?? null,
        vendorEmail: (mfg?.vendor_email as string | undefined) ?? null,
      };
    });
  }

  private async queryPaymentsPaginated(
    listPaymentsDto: ListPaymentsDto,
    baseMatch: Record<string, unknown>,
    options?: {
      skipSearchClause?: boolean;
      vendorHistoryStatusFilter?: boolean;
    },
  ) {
    const { page = 1, limit = 50, sort = 'desc' } = listPaymentsDto;
    const skip = (page - 1) * limit;
    const mongoSort = buildPaymentListMongoSort(parsePaymentListSort(sort));
    const query = this.buildPaymentListQueryClauses(
      listPaymentsDto,
      baseMatch,
      options,
    );

    const [totalCount, amountAgg, paidAmountAgg, rows] = await Promise.all([
      this.paymentDetailsModel.countDocuments(query).exec(),
      this.paymentDetailsModel
        .aggregate<{ totalAmount: number }>([
          { $match: query },
          {
            $group: {
              _id: null,
              totalAmount: {
                $sum: {
                  $convert: {
                    input: { $ifNull: ['$quoteTotal', 0] },
                    to: 'double',
                    onError: 0,
                    onNull: 0,
                  },
                },
              },
            },
          },
        ])
        .exec(),
      this.paymentDetailsModel
        .aggregate<{ totalAmount: number }>([
          {
            $match: {
              $and: [query, { paymentStatus: 2 }],
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: {
                $sum: {
                  $convert: {
                    input: { $ifNull: ['$quoteTotal', 0] },
                    to: 'double',
                    onError: 0,
                    onNull: 0,
                  },
                },
              },
            },
          },
        ])
        .exec(),
      this.paymentDetailsModel
        .find(query)
        .sort(mongoSort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    const totalAmountAll = Number(amountAgg[0]?.totalAmount ?? 0);
    const totalPaidAmount = Number(paidAmountAgg[0]?.totalAmount ?? 0);

    const data = formatPaymentRecords(rows as Record<string, unknown>[]).map(
      (payment) =>
        options?.vendorHistoryStatusFilter
          ? {
              ...payment,
              vendorDisplayPaymentStatus: resolveVendorDisplayPaymentStatus(
                Number(payment.paymentStatus ?? 0),
                payment.createdDate ?? payment.created_date,
              ),
              vendor_display_payment_status: resolveVendorDisplayPaymentStatus(
                Number(payment.paymentStatus ?? 0),
                payment.createdDate ?? payment.created_date,
              ),
            }
          : payment,
    );
    const enriched = await this.enrichPaymentsWithManufacturer(data);

    return {
      data: enriched,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        /** Paid (`paymentStatus` 2) sum — primary banner total. */
        totalAmount: Number.isFinite(totalPaidAmount) ? totalPaidAmount : 0,
        totalPaidAmount: Number.isFinite(totalPaidAmount) ? totalPaidAmount : 0,
        totalAmountAll: Number.isFinite(totalAmountAll) ? totalAmountAll : 0,
      },
    };
  }

  /**
   * Admin payment history — all vendors, or one manufacturer when `manufacturerId` is set.
   * Uses the same URN-based rules as the vendor portal list.
   */
  async getAdminPayments(listPaymentsDto: AdminListPaymentsDto) {
    try {
      const manufacturerId = listPaymentsDto.manufacturerId?.trim();

      if (manufacturerId) {
        const scoped = await this.getPayments(listPaymentsDto, manufacturerId);
        const data = await this.enrichPaymentsWithManufacturer(
          scoped.data as Record<string, unknown>[],
        );
        return {
          data,
          pagination: scoped.pagination,
          meta: {
            ...scoped.meta,
            scope: 'manufacturer',
            manufacturerId,
          },
        };
      }

      const { search } = listPaymentsDto;
      let baseMatch: Record<string, unknown> = {};

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(
          search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        );
        const matchingManufacturers = await this.manufacturerModel
          .find({
            $or: [
              { manufacturerName: searchRegex },
              { vendor_name: searchRegex },
              { vendor_email: searchRegex },
            ],
          })
          .select('_id')
          .lean()
          .exec();

        const manufacturerIds = matchingManufacturers.map((m) => m._id);

        baseMatch = {
          $or: [
            { urnNo: searchRegex },
            { paymentReferenceNo: searchRegex },
            ...(manufacturerIds.length > 0
              ? [{ vendorId: { $in: manufacturerIds } }]
              : []),
          ],
        };
      }

      const result = await this.queryPaymentsPaginated(
        listPaymentsDto,
        baseMatch,
        search?.trim() ? { skipSearchClause: true } : undefined,
      );

      return {
        ...result,
        meta: {
          scope: 'platform',
          manufacturerId: null,
        },
      };
    } catch (error: any) {
      console.error('[Get Admin Payments] Error:', error);
      throw new InternalServerErrorException(
        error.message ||
          'Failed to get admin payment history. Please check the logs for details.',
      );
    }
  }

  /**
   * Get payments for a vendor with pagination, search, filtering, and sorting
   * Filtered by vendorId from authenticated user
   */
  async getPayments(listPaymentsDto: ListPaymentsDto, vendorId: string) {
    try {
      const organizationIds = await this.resolveVendorOrganizationIds(vendorId);
      const urnNos = await this.resolveAllVendorUrns(organizationIds);

      const baseMatch = this.buildVendorPaymentsListMatch(
        organizationIds,
        urnNos,
      );

      const result = await this.queryPaymentsPaginated(listPaymentsDto, baseMatch, {
        vendorHistoryStatusFilter: true,
      });

      return {
        ...result,
        meta: {
          organizationIds: organizationIds.map((id) => id.toString()),
          urnCount: urnNos.length,
          scope: 'vendor',
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
