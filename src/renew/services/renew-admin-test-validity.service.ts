import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { computeNotifyDates } from '../../product-registration/helpers/certification-dates.util';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { AdminRenewTestValidityDto } from '../dto/admin-renew-test-validity.dto';
import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
} from '../constants/renewal-urn-status.constants';
import { RENEWAL_NEXT_ACTIVITY } from '../constants/renewal-activity.constants';
import {
  matchRenewUrnStatusUpdateProducts,
} from '../helpers/renew-eligible-product.util';
import { runInTransactionIfSupported } from '../helpers/mongo-session.util';
import {
  renewOwnershipFields,
  resolveUrnRenewContext,
  toRenewObjectId,
} from '../helpers/renew-common.util';
import { RenewalCycleService } from './renewal-cycle.service';

export type RenewTestValidityResult = {
  success: true;
  urnNo: string;
  validTillDate: string;
  urnStatus: number;
  productRenewStatus: number;
  renewCycleNo: number;
  renewContext: Record<string, unknown>;
};

@Injectable()
export class RenewAdminTestValidityService {
  private readonly logger = new Logger(RenewAdminTestValidityService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly renewalCycleService: RenewalCycleService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async applyTestValidity(
    dto: AdminRenewTestValidityDto,
    userId: string,
  ): Promise<RenewTestValidityResult> {
    const startNewCycle = dto.startNewRenewalCycle !== false;
    if (!startNewCycle) {
      throw new BadRequestException(
        'startNewRenewalCycle must be true for test renewal; use renew-validity without a new cycle for validity-only updates',
      );
    }

    const urnNo = String(dto.urnNo ?? '').trim();
    if (!urnNo) {
      throw new BadRequestException('urnNo is required');
    }

    const parsed = new Date(dto.validTillDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        'validTillDate must be a valid date (YYYY-MM-DD or ISO)',
      );
    }
    const normalizedDate = parsed.toISOString().slice(0, 10);
    const validTillDate = new Date(`${normalizedDate}T00:00:00.000Z`);
    const notifyDates = computeNotifyDates(validTillDate);
    const now = new Date();
    const userObjectId = toRenewObjectId(userId, 'userId');

    const context = await resolveUrnRenewContext(this.productModel, urnNo);
    const ownership = renewOwnershipFields(context);

    const certifiedCount = await this.productModel.countDocuments({
      urnNo,
      ...matchRenewUrnStatusUpdateProducts(),
    });
    if (certifiedCount === 0) {
      throw new NotFoundException(
        `No certified products found for URN ${urnNo} (rejected EOIs are excluded)`,
      );
    }

    try {
      const newCycle = await runInTransactionIfSupported(
        this.connection,
        async (session) => {
          const cycle = await this.renewalCycleService.closeInProgressAndCreateNextCycle({
            urnNo,
            vendorId: ownership.vendorId,
            manufacturerId: ownership.manufacturerId,
            urnStatusAtStart: RENEWAL_URN_STATUS.PAYMENT_PENDING,
            userId: userObjectId,
            session,
          });

          await this.productModel.updateMany(
            { urnNo, ...matchRenewUrnStatusUpdateProducts() },
            {
              $set: {
                validtillDate: validTillDate,
                urnStatus: RENEWAL_URN_STATUS.PAYMENT_PENDING,
                productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
                renewCycleNo: cycle.cycleNo,
                firstNotifyDate: notifyDates.firstNotifyDate,
                secondNotifyDate: notifyDates.secondNotifyDate,
                thirdNotifyDate: notifyDates.thirdNotifyDate,
                updatedDate: now,
              },
              $unset: { renewedDate: '' },
            },
            session ? { session } : {},
          );

          return cycle;
        },
      );

      try {
        await this.activityLogService.logActivity({
          vendor_id: ownership.vendorId,
          manufacturer_id: ownership.manufacturerId,
          urn_no: urnNo,
          activities_id: RENEWAL_URN_STATUS.PAYMENT_PENDING,
          activity: 'Test renewal cycle started',
          activity_status: RENEWAL_URN_STATUS.PAYMENT_PENDING,
          responsibility: 'Admin',
          next_activity: RENEWAL_NEXT_ACTIVITY.VENDOR_SUBMIT_PAYMENT,
          next_responsibility: 'Vendor',
        });
      } catch (logError) {
        this.logger.warn(
          `Activity log failed after test renewal for URN ${urnNo}`,
          logError instanceof Error ? logError.stack : String(logError),
        );
      }

      const sample = await this.productModel
        .findOne({ urnNo, ...matchRenewUrnStatusUpdateProducts() })
        .select('urnStatus productRenewStatus renewCycleNo')
        .lean()
        .exec();

      const urnStatus = Number(
        sample?.urnStatus ?? RENEWAL_URN_STATUS.PAYMENT_PENDING,
      );
      const productRenewStatus = Number(
        sample?.productRenewStatus ?? PRODUCT_RENEW_STATUS.NOT_RENEWED,
      );

      return {
        success: true,
        urnNo,
        validTillDate: normalizedDate,
        urnStatus,
        productRenewStatus,
        renewCycleNo: newCycle.cycleNo,
        renewContext: this.buildRenewContext(
          urnNo,
          newCycle,
          urnStatus,
          productRenewStatus,
          sample?.renewCycleNo ?? newCycle.cycleNo,
          ownership,
        ),
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Test renewal validity failed for URN ${urnNo}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message || 'Failed to apply test renewal validity'
          : 'Failed to apply test renewal validity',
      );
    }
  }

  private buildRenewContext(
    urnNo: string,
    cycle: { _id: unknown; cycleNo: number; status: string; paymentId?: number },
    urnStatus: number,
    productRenewStatus: number,
    renewCycleNo: number,
    ownership: { vendorId: unknown; manufacturerId: unknown },
  ): Record<string, unknown> {
    const cyclePayload = {
      id: String(cycle._id),
      cycleNo: cycle.cycleNo,
      status: cycle.status,
      paymentId: cycle.paymentId ?? null,
    };
    return {
      urnNo,
      urnStatus,
      productRenewStatus,
      renewCycleNo,
      renewalCycleId: String(cycle._id),
      vendorId: String(ownership.vendorId),
      manufacturerId: String(ownership.manufacturerId),
      activeRenewalCycle: cyclePayload,
      renewalCycle: cyclePayload,
    };
  }
}
