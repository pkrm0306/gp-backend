import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { matchActiveProducts } from './constants/active-product.filter';
import { computeCertificationDates } from './helpers/certification-dates.util';
import { resolveProductIdsFromCertifiedField } from './helpers/parse-products-to-be-certified.util';

const URN_STATUS_VERIFICATION_COMPLETED = 11;
const PRODUCT_STATUS_CERTIFIED = 2;
const PRODUCT_STATUS_REJECTED = 3;

export type ApplyCertificationApprovalParams = {
  urnNoOptions: string[];
  vendorId: Types.ObjectId | string;
  productsToBeCertifiedRaw?: string | null;
  approvedAt?: Date;
  session?: ClientSession;
};

export type ApplyCertificationApprovalResult = {
  certifiedCount: number;
  rejectedCount: number;
  skippedCount?: number;
};

@Injectable()
export class CertificationLifecycleService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async applyCertificationApproval(
    params: ApplyCertificationApprovalParams,
  ): Promise<ApplyCertificationApprovalResult> {
    const {
      urnNoOptions,
      vendorId,
      productsToBeCertifiedRaw,
      approvedAt = new Date(),
      session,
    } = params;

    if (!urnNoOptions.length) {
      throw new BadRequestException('URN number is required for certification');
    }

    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    const rawTrim = String(productsToBeCertifiedRaw ?? '').trim();
    if (!rawTrim) {
      throw new BadRequestException(
        'productsToBeCertified is required when approving certification payment',
      );
    }

    const products = await this.productModel
      .find(
        matchActiveProducts({
          urnNo: { $in: urnNoOptions },
          vendorId: vendorObjectId,
        }),
      )
      .select('productId _id productStatus')
      .session(session ?? null)
      .lean()
      .exec();

    if (!products.length) {
      throw new NotFoundException('No active products found for this URN');
    }

    const selectedProductIds = new Set(
      resolveProductIdsFromCertifiedField(productsToBeCertifiedRaw, products),
    );

    if (!selectedProductIds.size) {
      throw new BadRequestException(
        `productsToBeCertified must contain numeric productId values for this URN (e.g. "[101,102]"). ` +
          `Received: "${rawTrim}"`,
      );
    }

    const urnProductIds = new Set(products.map((p) => p.productId));
    const missing = [...selectedProductIds].filter((id) => !urnProductIds.has(id));
    if (missing.length) {
      throw new BadRequestException(
        `productsToBeCertified includes unknown productId(s) for this URN: ${missing.join(', ')}`,
      );
    }

    const dates = computeCertificationDates(approvedAt);
    const now = new Date();
    const validityFields = {
      validtillDate: dates.validtillDate,
      firstNotifyDate: dates.firstNotifyDate,
      secondNotifyDate: dates.secondNotifyDate,
      thirdNotifyDate: dates.thirdNotifyDate,
    };

    const baseFilter = matchActiveProducts({
      urnNo: { $in: urnNoOptions },
      vendorId: vendorObjectId,
    });

    const updateOpts = session ? { session } : {};

    const selectedList = [...selectedProductIds];
    const selectedSubmittedList = products
      .filter(
        (p) =>
          selectedProductIds.has(Number(p.productId)) &&
          Number(p.productStatus ?? 0) === 1,
      )
      .map((p) => Number(p.productId))
      .filter((id) => Number.isFinite(id));
    const skippedCount = Math.max(selectedList.length - selectedSubmittedList.length, 0);

    const certifyResult = await this.productModel.updateMany(
      {
        ...baseFilter,
        productId: { $in: selectedSubmittedList },
        // Only submitted EOIs move to certified on approval.
        productStatus: 1,
      },
      {
        $set: {
          urnStatus: URN_STATUS_VERIFICATION_COMPLETED,
          ...validityFields,
          productStatus: PRODUCT_STATUS_CERTIFIED,
          certifiedDate: dates.certifiedDate,
          updatedDate: now,
        },
      },
      updateOpts,
    );

    const rejectResult = await this.productModel.updateMany(
      {
        ...baseFilter,
        productId: { $nin: selectedList },
        productStatus: { $in: [0, 1] },
      },
      {
        $set: {
          urnStatus: URN_STATUS_VERIFICATION_COMPLETED,
          productStatus: PRODUCT_STATUS_REJECTED,
          rejectedAt: now,
          updatedDate: now,
        },
      },
      updateOpts,
    );

    return {
      certifiedCount: certifyResult.modifiedCount,
      rejectedCount: rejectResult.modifiedCount,
      skippedCount,
    };
  }

  private toObjectId(value: Types.ObjectId | string, label: string): Types.ObjectId {
    if (value instanceof Types.ObjectId) {
      return value;
    }
    const trimmed = String(value ?? '').trim();
    if (!Types.ObjectId.isValid(trimmed)) {
      throw new BadRequestException(`Invalid ${label}`);
    }
    return new Types.ObjectId(trimmed);
  }
}
