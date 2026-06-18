import {

  Injectable,

  BadRequestException,

  HttpException,

  InternalServerErrorException,

  Logger,

  NotFoundException,

} from '@nestjs/common';

import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { ClientSession, Connection, Model, Types } from 'mongoose';

import {

  Product,

  ProductDocument,

} from '../../product-registration/schemas/product.schema';

import {

  PaymentDetails,

  PaymentDetailsDocument,

} from '../../payments/schemas/payment-details.schema';

import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';

import { ActivityLogService } from '../../activity-log/activity-log.service';

import { computeNotifyDates } from '../../product-registration/helpers/certification-dates.util';

import {
  matchRenewEligibleProducts,
  RENEW_ELIGIBLE_PRODUCT_STATUS,
} from '../helpers/renew-eligible-product.util';

import {

  ProcessRenewComments,

  ProcessRenewCommentsDocument,

} from '../schemas/process-renew-comments.schema';

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

  ProcessRenewProductStewardship,

  ProcessRenewProductStewardshipDocument,

} from '../schemas/process-renew-product-stewardship.schema';

import {

  ProcessRenewProductPerformance,

  ProcessRenewProductPerformanceDocument,

} from '../schemas/process-renew-product-performance.schema';

import { RenewalCycleService } from './renewal-cycle.service';
import { RenewalCycleDocument, RenewalCycleStatus } from '../schemas/renewal-cycle.schema';
import { buildRenewProcessHeaderFilter } from '../helpers/renew-cycle-scope.util';
import { RenewDocumentPromotionService } from './renew-document-promotion.service';
import { runInTransactionIfSupported } from '../helpers/mongo-session.util';

import {

  extendValidityForRenewal,

  renewOwnershipFields,

  resolveUrnRenewContext,

  RenewUrnContext,

  toRenewObjectId,

} from '../helpers/renew-common.util';

import {

  PRODUCT_RENEW_STATUS,

  RENEWAL_URN_STATUS,

} from '../constants/renewal-urn-status.constants';

import {

  RENEWAL_ACTIVITY,

  RENEWAL_NEXT_ACTIVITY,

} from '../constants/renewal-activity.constants';



export interface OnRenewPaymentApprovedInput {
  renewalCycleId?: string;

  urnNo: string;

  paymentId: number;

  vendorId: string | Types.ObjectId;

  userId: string | Types.ObjectId;

  session: ClientSession;

}

export type RenewCompletionResult = {
  urnNo: string;
  renewalCycleId: string;
  renewCycleNo: number;
  urnStatus: number;
  productRenewStatus: number;
  renewedDate: Date | null;
  validtillDate: Date | null;
};



@Injectable()

export class RenewalOrchestrationService {
  private readonly logger = new Logger(RenewalOrchestrationService.name);

  constructor(

    @InjectModel(Product.name)

    private readonly productModel: Model<ProductDocument>,

    @InjectModel(PaymentDetails.name)

    private readonly paymentModel: Model<PaymentDetailsDocument>,

    @InjectModel(ProcessRenewComments.name)

    private readonly renewCommentsModel: Model<ProcessRenewCommentsDocument>,

    @InjectModel(ProcessRenewManufacturing.name)

    private readonly renewManufacturingModel: Model<ProcessRenewManufacturingDocument>,

    @InjectModel(ProcessRenewWasteManagement.name)

    private readonly renewWasteModel: Model<ProcessRenewWasteManagementDocument>,

    @InjectModel(ProcessRenewInnovation.name)

    private readonly renewInnovationModel: Model<ProcessRenewInnovationDocument>,

    @InjectModel(ProcessRenewProductStewardship.name)

    private readonly renewStewardshipModel: Model<ProcessRenewProductStewardshipDocument>,

    @InjectModel(ProcessRenewProductPerformance.name)

    private readonly renewPerformanceModel: Model<ProcessRenewProductPerformanceDocument>,

    @InjectConnection() private readonly connection: Connection,

    private readonly sequenceHelper: SequenceHelper,

    private readonly renewalCycleService: RenewalCycleService,

    private readonly activityLogService: ActivityLogService,

    private readonly renewDocumentPromotionService: RenewDocumentPromotionService,

  ) {}



  async seedAllRenewHeaders(

    context: RenewUrnContext,

    session: ClientSession,

    cycle?: RenewalCycleDocument | null,

  ): Promise<void> {

    const ownership = renewOwnershipFields(context);

    const trimmedUrn = ownership.urnNo;

    const now = new Date();

    const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle ?? null);

    const cycleId = cycle?._id;



    const seedHeaderIfMissing = async (

      findExisting: () => Promise<unknown>,

      createRow: () => Promise<unknown>,

    ) => {

      if (await findExisting()) {

        return;

      }

      await createRow();

    };



    if (cycleId) {
      await seedHeaderIfMissing(
        () =>
          this.renewCommentsModel
            .findOne({ urnNo: trimmedUrn, renewalCycleId: cycleId })
            .session(session)
            .exec(),
        async () => {
          const processRenewCommentsId =
            await this.sequenceHelper.getProcessRenewCommentsId();
          await this.renewCommentsModel.create(
            [
              {
                processRenewCommentsId,
                urnNo: trimmedUrn,
                renewalCycleId: cycleId,
                vendorId: ownership.vendorId,
                manufacturerId: ownership.manufacturerId,
                updatedDate: now,
              },
            ],
            { session },
          );
        },
      );
    }

    await seedHeaderIfMissing(
      () =>
        this.renewManufacturingModel
          .findOne(headerFilter)
          .session(session)
          .exec(),
      async () => {
        const processRenewManufacturingId =
          await this.sequenceHelper.getProcessRenewManufacturingId();
        await this.renewManufacturingModel.findOneAndUpdate(
          headerFilter,
          {
            $setOnInsert: {
              processRenewManufacturingId,
              urnNo: trimmedUrn,
              ...(cycleId ? { renewalCycleId: cycleId } : {}),
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              energyConservationSupportingDocuments: 0,
              energyConsumptionDocuments: 0,
              processManufacturingStatus: 0,
              createdDate: now,
              updatedDate: now,
            },
          },
          { upsert: true, session, new: true },
        );
      },
    );



    await seedHeaderIfMissing(
      () =>
        this.renewWasteModel.findOne(headerFilter).session(session).exec(),
      async () => {
        const processRenewWasteManagementId =
          await this.sequenceHelper.getProcessRenewWasteManagementId();
        await this.renewWasteModel.findOneAndUpdate(
          headerFilter,
          {
            $setOnInsert: {
              processRenewWasteManagementId,
              urnNo: trimmedUrn,
              ...(cycleId ? { renewalCycleId: cycleId } : {}),
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              wmSupportingDocuments: 0,
              processWasteManagementStatus: 0,
              createdDate: now,
              updatedDate: now,
            },
          },
          { upsert: true, session, new: true },
        );
      },
    );

    await seedHeaderIfMissing(
      () =>
        this.renewInnovationModel.findOne(headerFilter).session(session).exec(),
      async () => {
        const processRenewInnovationId =
          await this.sequenceHelper.getProcessRenewInnovationId();
        await this.renewInnovationModel.findOneAndUpdate(
          headerFilter,
          {
            $setOnInsert: {
              processRenewInnovationId,
              urnNo: trimmedUrn,
              ...(cycleId ? { renewalCycleId: cycleId } : {}),
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              innovationImplementationDocuments: 0,
              processInnovationStatus: 0,
              createdDate: now,
              updatedDate: now,
            },
          },
          { upsert: true, session, new: true },
        );
      },
    );



    await seedHeaderIfMissing(

      () =>

        this.renewStewardshipModel

          .findOne({ urnNo: trimmedUrn })

          .session(session)

          .exec(),

      async () => {

        const processRenewProductStewardshipId =

          await this.sequenceHelper.getProcessRenewProductStewardshipId();

        await this.renewStewardshipModel.create(

          [

            {

              processRenewProductStewardshipId,

              urnNo: trimmedUrn,

              vendorId: ownership.vendorId,

              manufacturerId: ownership.manufacturerId,

              seaSupportingDocuments: 0,

              qmSupportingDocuments: 0,

              eprSupportingDocuments: 0,

              productStewardshipStatus: 0,

              createdDate: now,

              updatedDate: now,

            },

          ],

          { session },

        );

      },

    );



    if (!cycleId) {
      throw new BadRequestException(
        'renewalCycleId is required to seed renew process headers (including product performance)',
      );
    }

    await seedHeaderIfMissing(
      () =>
        this.renewPerformanceModel
          .findOne(headerFilter)
          .session(session)
          .exec(),
      async () => {
        const processRenewProductPerformanceId =
          await this.sequenceHelper.getProcessRenewProductPerformanceId();
        await this.renewPerformanceModel.findOneAndUpdate(
          headerFilter,
          {
            $setOnInsert: {
              processRenewProductPerformanceId,
              urnNo: trimmedUrn,
              renewalCycleId: cycleId,
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              testReportFiles: 0,
              renewalType: 0,
              productPerformanceStatus: 0,
              createdDate: now,
              updatedDate: now,
            },
          },
          { upsert: true, session, new: true },
        );
      },
    );
  }



  async onRenewPaymentApproved(

    input: OnRenewPaymentApprovedInput,

  ): Promise<void> {

    const trimmedUrn = input.urnNo.trim();

    const context = await resolveUrnRenewContext(this.productModel, trimmedUrn);

    const ownership = renewOwnershipFields(context);

    const userObjectId = toRenewObjectId(input.userId, 'userId');

    const now = new Date();



    const anyProduct = await this.productModel

      .findOne({ urnNo: trimmedUrn, ...matchRenewEligibleProducts() })

      .session(input.session)

      .exec();



    if (!anyProduct) {

      throw new NotFoundException(`No products found for URN ${trimmedUrn}`);

    }



    let cycle: RenewalCycleDocument | null = null;
    const cycleIdRaw = String(input.renewalCycleId ?? '').trim();
    if (cycleIdRaw) {
      cycle = await this.renewalCycleService.resolveCycleForProductUpdate(
        trimmedUrn,
        cycleIdRaw,
        input.session,
      );
    } else {
      cycle = await this.renewalCycleService.getActiveInProgressCycle(
        trimmedUrn,
        input.session,
      );
    }

    const productRenewStatus = Number(anyProduct.productRenewStatus);
    if (productRenewStatus === PRODUCT_RENEW_STATUS.RENEWED) {
      if (!cycle || cycle.status !== RenewalCycleStatus.IN_PROGRESS) {
        throw new BadRequestException('URN renewal is already completed');
      }
    }

    if (!cycle) {
      cycle = await this.openNextRenewalCycle(
        trimmedUrn,
        ownership,
        userObjectId,
        anyProduct.urnStatus,
        input.paymentId,
        input.session,
      );
    } else if (input.paymentId && !cycle.paymentId) {
      cycle.paymentId = input.paymentId;
      cycle.updatedAt = now;
      cycle.updatedBy = userObjectId;
      await cycle.save({ session: input.session });
    }

    if (!cycle?._id) {
      throw new BadRequestException(
        'renewalCycleId is required for renew payment approval',
      );
    }

    await this.seedAllRenewHeaders(context, input.session, cycle);



    await this.productModel.updateMany(

      { urnNo: trimmedUrn, ...matchRenewEligibleProducts() },

      {

        $set: {

          urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,

          productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,

          renewCycleNo: cycle.cycleNo,

          updatedDate: now,

        },

      },

      { session: input.session },

    );

  }



  /**
   * Open the next renewal cycle for a URN (cycle 1 or N+1 after prior completion).
   * Resets product renew state so payment / process tabs can run again.
   */
  private async openNextRenewalCycle(
    urnNo: string,
    ownership: { vendorId: Types.ObjectId; manufacturerId: Types.ObjectId },
    userId: Types.ObjectId,
    urnStatusAtStart: number | undefined,
    paymentId: number | undefined,
    session?: ClientSession,
  ): Promise<RenewalCycleDocument> {
    const trimmedUrn = urnNo.trim();
    const now = new Date();

    const cycle = await this.renewalCycleService.closeInProgressAndCreateNextCycle({
      urnNo: trimmedUrn,
      vendorId: ownership.vendorId,
      manufacturerId: ownership.manufacturerId,
      paymentId,
      urnStatusAtStart: urnStatusAtStart ?? RENEWAL_URN_STATUS.PAYMENT_PENDING,
      userId,
      session,
    });

    await this.productModel.updateMany(
      { urnNo: trimmedUrn, ...matchRenewEligibleProducts() },
      {
        $set: {
          urnStatus: RENEWAL_URN_STATUS.PAYMENT_PENDING,
          productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
          renewCycleNo: cycle.cycleNo,
          updatedDate: now,
        },
        $unset: { renewedDate: '' },
      },
      session ? { session } : {},
    );

    return cycle;
  }

  /** Return active cycle or open the next one — used when creating renew payments. */
  async resolveInProgressRenewalCycleForPayment(
    urnNo: string,
    userId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<RenewalCycleDocument> {
    const trimmedUrn = urnNo.trim();
    const active = await this.renewalCycleService.getActiveInProgressCycle(
      trimmedUrn,
      session,
    );
    if (active) {
      return active;
    }

    const context = await resolveUrnRenewContext(this.productModel, trimmedUrn);
    const ownership = renewOwnershipFields(context);
    const userObjectId = toRenewObjectId(userId, 'userId');

    const anyProduct = session
      ? await this.productModel
          .findOne({ urnNo: trimmedUrn, ...matchRenewEligibleProducts() })
          .session(session)
          .exec()
      : await this.productModel
          .findOne({ urnNo: trimmedUrn, ...matchRenewEligibleProducts() })
          .exec();

    if (!anyProduct) {
      throw new NotFoundException(`No products found for URN ${trimmedUrn}`);
    }

    if (Number(anyProduct.productStatus) !== RENEW_ELIGIBLE_PRODUCT_STATUS) {
      throw new BadRequestException('Only certified products can be renewed');
    }

    const productRenewStatus = Number(anyProduct.productRenewStatus);
    if (productRenewStatus === PRODUCT_RENEW_STATUS.IN_PROGRESS) {
      throw new BadRequestException('Renewal is already in progress');
    }

    return this.openNextRenewalCycle(
      trimmedUrn,
      ownership,
      userObjectId,
      RENEWAL_URN_STATUS.PAYMENT_PENDING,
      undefined,
      session,
    );
  }



  async startRenewalCycle(

    urnNo: string,

    userId: string | Types.ObjectId,

    paymentId?: number,

  ): Promise<void> {

    const trimmedUrn = urnNo.trim();

    const context = await resolveUrnRenewContext(this.productModel, trimmedUrn);

    const ownership = renewOwnershipFields(context);

    const userObjectId = toRenewObjectId(userId, 'userId');

    const now = new Date();



    const anyProduct = await this.productModel

      .findOne({ urnNo: trimmedUrn, ...matchRenewEligibleProducts() })

      .exec();



    if (!anyProduct) {

      throw new NotFoundException(`No products found for URN ${trimmedUrn}`);

    }



    if (Number(anyProduct.productStatus) !== RENEW_ELIGIBLE_PRODUCT_STATUS) {

      throw new BadRequestException('Only certified products can be renewed');

    }



    const productRenewStatus = Number(anyProduct.productRenewStatus);
    if (productRenewStatus === PRODUCT_RENEW_STATUS.IN_PROGRESS) {
      throw new BadRequestException('Renewal is already in progress');
    }

    const existingActive = await this.renewalCycleService.getActiveInProgressCycle(
      trimmedUrn,
    );
    if (existingActive) {
      throw new BadRequestException(
        `An in-progress renewal cycle already exists for URN ${trimmedUrn}`,
      );
    }

    const session = await this.connection.startSession();

    session.startTransaction();



    try {

      const cycle = await this.openNextRenewalCycle(
        trimmedUrn,
        ownership,
        userObjectId,
        RENEWAL_URN_STATUS.PAYMENT_PENDING,
        paymentId,
        session,
      );



      await session.commitTransaction();

      session.endSession();



      await this.activityLogService.logActivity({

        vendor_id: ownership.vendorId,

        manufacturer_id: ownership.manufacturerId,

        urn_no: trimmedUrn,

        activities_id: RENEWAL_URN_STATUS.PAYMENT_PENDING,

        activity: RENEWAL_ACTIVITY.CYCLE_STARTED,

        activity_status: RENEWAL_URN_STATUS.PAYMENT_PENDING,

        responsibility: 'Admin',

        next_activity: RENEWAL_NEXT_ACTIVITY.VENDOR_SUBMIT_PAYMENT,

        next_responsibility: 'Vendor',

        next_acitivities_id: RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,

      });

    } catch (error) {

      await session.abortTransaction();

      session.endSession();

      throw error;

    }

  }



  async completeRenewal(
    urnNo: string,
    userId: string | Types.ObjectId,
    renewalCycleId?: string,
  ): Promise<RenewCompletionResult> {

    const trimmedUrn = urnNo.trim();

    const userObjectId = toRenewObjectId(userId, 'userId');

    const now = new Date();



    const products = await this.productModel

      .find({ urnNo: trimmedUrn, ...matchRenewEligibleProducts() })

      .exec();



    if (products.length === 0) {

      throw new NotFoundException(`No products found for URN ${trimmedUrn}`);

    }



    try {
      const completedCycle = await runInTransactionIfSupported(
        this.connection,
        async (session) => {
          const cycleForUpdate = await this.renewalCycleService.resolveCycleForProductUpdate(
            trimmedUrn,
            renewalCycleId,
            session,
          );

          for (const product of products) {
            const currentValidTill = product.validtillDate ?? now;
            const newValidTill = extendValidityForRenewal(currentValidTill);
            const notifyDates = computeNotifyDates(newValidTill);

            await this.productModel.updateOne(
              { _id: product._id },
              {
                $set: {
                  urnStatus: 11,
                  productRenewStatus: PRODUCT_RENEW_STATUS.RENEWED,
                  renewCycleNo: cycleForUpdate.cycleNo,
                  renewedDate: now,
                  validtillDate: newValidTill,
                  firstNotifyDate: notifyDates.firstNotifyDate,
                  secondNotifyDate: notifyDates.secondNotifyDate,
                  thirdNotifyDate: notifyDates.thirdNotifyDate,
                  updatedDate: now,
                },
              },
              session ? { session } : {},
            );
          }

          return renewalCycleId?.trim()
            ? await this.renewalCycleService.completeCycleById(
                trimmedUrn,
                renewalCycleId.trim(),
                userObjectId,
                session,
              )
            : await this.renewalCycleService.completeCycle(
                trimmedUrn,
                userObjectId,
                session,
              );
        },
      );

      if (renewalCycleId?.trim()) {
        try {
          await this.renewDocumentPromotionService.promoteRenewDocumentsForCompletedCycle(
            trimmedUrn,
            renewalCycleId.trim(),
            userObjectId,
          );
        } catch (promotionError) {
          this.logger.warn(
            `Renew document promotion failed for URN ${trimmedUrn} (renewal still completed)`,
            promotionError instanceof Error ? promotionError.stack : String(promotionError),
          );
        }
      }

      const anyProduct = products[0];

      try {
        await this.activityLogService.logActivity({
          vendor_id: anyProduct.vendorId,
          manufacturer_id: anyProduct.manufacturerId,
          urn_no: trimmedUrn,
          activities_id: RENEWAL_URN_STATUS.COMPLETED,
          activity: RENEWAL_ACTIVITY.RENEWAL_COMPLETED,
          activity_status: RENEWAL_URN_STATUS.COMPLETED,
          responsibility: 'Admin',
          next_activity: RENEWAL_NEXT_ACTIVITY.CERTIFICATE_PUBLISHED,
          next_responsibility: 'Admin',
        });
      } catch (logError) {
        this.logger.warn(
          `Activity log failed after renewal completion for URN ${trimmedUrn}`,
          logError instanceof Error ? logError.stack : String(logError),
        );
      }

      const refreshed = await this.productModel
        .findOne({ _id: anyProduct._id })
        .select('urnStatus productRenewStatus renewCycleNo renewedDate validtillDate')
        .lean()
        .exec();

      return {
        urnNo: trimmedUrn,
        renewalCycleId: String(completedCycle._id),
        renewCycleNo: Number(
          refreshed?.renewCycleNo ?? completedCycle.cycleNo ?? 0,
        ),
        urnStatus: Number(refreshed?.urnStatus ?? RENEWAL_URN_STATUS.COMPLETED),
        productRenewStatus: Number(
          refreshed?.productRenewStatus ?? PRODUCT_RENEW_STATUS.RENEWED,
        ),
        renewedDate: refreshed?.renewedDate ?? now,
        validtillDate: refreshed?.validtillDate ?? null,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Failed to complete renewal for URN ${trimmedUrn}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message || 'Failed to complete renewal'
          : 'Failed to complete renewal',
      );
    }
  }

}


