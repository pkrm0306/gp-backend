import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  resolveRenewalActivityState,
  type RenewActivityState,
} from '../constants/renewal-activity-state.constants';
import { normalizeUrnNo, urnCandidates } from '../../activity-log/activity-log.util';

@Injectable()
export class RenewActivityStateService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentModel: Model<PaymentDetailsDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
  ) {}

  /**
   * Backend source of truth for Renew Quick View Activity Log
   * (Completed / Current / Next) — same payload for Admin and Vendor.
   */
  async resolve(
    urnNo: string,
    renewalCycleId?: string | null,
  ): Promise<RenewActivityState & { renewalCycleId: string | null }> {
    const normalized = normalizeUrnNo(urnNo);
    if (!normalized) {
      throw new BadRequestException('URN number is required');
    }

    const cycleOid = await this.resolveCycleObjectId(
      normalized,
      renewalCycleId,
    );

    const product = await this.productModel
      .findOne({ urnNo: { $in: urnCandidates(normalized) } })
      .select('urnStatus productRenewStatus')
      .lean()
      .exec();

    const urnStatus = Number(product?.urnStatus ?? 0);
    const productRenewStatus =
      product?.productRenewStatus != null
        ? Number(product.productRenewStatus)
        : null;

    let paymentStatus: number | null = null;
    if (cycleOid) {
      const payment = await this.paymentModel
        .findOne({
          urnNo: { $in: urnCandidates(normalized) },
          paymentType: 'renew',
          renewalCycleId: cycleOid,
        })
        .select('paymentStatus')
        .sort({ paymentId: -1 })
        .lean()
        .exec();
      if (payment && payment.paymentStatus != null) {
        paymentStatus = Number(payment.paymentStatus);
      }
    }

    const state = resolveRenewalActivityState({
      urnStatus,
      paymentStatus,
      productRenewStatus,
    });

    return {
      ...state,
      renewalCycleId: cycleOid ? String(cycleOid) : null,
    };
  }

  private async resolveCycleObjectId(
    urnNo: string,
    renewalCycleId?: string | null,
  ): Promise<Types.ObjectId | null> {
    const raw = String(renewalCycleId ?? '').trim();
    if (raw && Types.ObjectId.isValid(raw)) {
      return new Types.ObjectId(raw);
    }

    const active = await this.renewalCycleModel
      .findOne({
        urnNo: { $in: urnCandidates(urnNo) },
        status: RenewalCycleStatus.IN_PROGRESS,
      })
      .sort({ cycleNo: -1, createdAt: -1 })
      .select('_id')
      .lean()
      .exec();

    if (active?._id) return active._id as Types.ObjectId;

    const latest = await this.renewalCycleModel
      .findOne({ urnNo: { $in: urnCandidates(urnNo) } })
      .sort({ cycleNo: -1, createdAt: -1 })
      .select('_id')
      .lean()
      .exec();

    return latest?._id ? (latest._id as Types.ObjectId) : null;
  }
}
