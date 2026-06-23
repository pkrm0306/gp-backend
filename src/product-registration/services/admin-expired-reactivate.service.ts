import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AUDIT_ACTION } from '../../audit-log/audit-actions';
import {
  AUDIT_ACTION_TYPE,
  AUDIT_MODULE,
} from '../../audit-log/audit-friendlies';
import { RedisService } from '../../common/redis/redis.service';
import { Product, ProductDocument } from '../schemas/product.schema';
import { matchActiveProducts } from '../constants/active-product.filter';
import {
  isExpiredProduct,
  matchExpiredProducts,
} from '../constants/expired-product.filter';
import { computeNotifyDates } from '../helpers/certification-dates.util';
import { invalidateProductListingsCache } from '../helpers/invalidate-product-listings-cache.util';
import {
  ProductStatusAudit,
  ProductStatusAuditDocument,
} from '../../renew/schemas/product-status-audit.schema';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';
import { PRODUCT_RENEW_STATUS } from '../../renew/constants/renewal-urn-status.constants';

type ReactivationUpdate = {
  productStatus: number;
  productRenewStatus: number;
  updatedDate: Date;
  validtillDate: Date;
  firstNotifyDate: Date;
  secondNotifyDate: Date;
  thirdNotifyDate: Date;
  discontinuedAt: null;
  discontinuedBy: null;
};

@Injectable()
export class AdminExpiredReactivateService {
  private readonly logger = new Logger(AdminExpiredReactivateService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductStatusAudit.name)
    private readonly productStatusAuditModel: Model<ProductStatusAuditDocument>,
    private readonly auditLogService: AuditLogService,
    private readonly redisService: RedisService,
  ) {}

  async reactivateProduct(
    urnNo: string,
    productId: string,
    adminUserId: string,
    eoiNo?: string,
  ): Promise<{
    success: true;
    urnNo: string;
    productId: string;
    eoiNo: string;
    fromStatus: number;
    toStatus: number;
    validtillDate: string;
    message: string;
    updatedAt: Date;
  }> {
    const trimmedUrn = urnNo.trim();
    const product = await this.resolveProduct(trimmedUrn, productId.trim());
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (eoiNo?.trim() && String(product.eoiNo) !== eoiNo.trim()) {
      throw new NotFoundException('Product not found');
    }

    const now = new Date();
    const fromStatus = Number(product.productStatus);
    if (!isExpiredProduct(fromStatus, product.validtillDate, now)) {
      throw new ConflictException('Product is not expired');
    }

    const adminObjectId = new Types.ObjectId(adminUserId);
    const { update, validityExtended } = this.buildReactivationUpdate(
      product.validtillDate,
      now,
    );
    const description = validityExtended
      ? 'Reactivated expired product to certified; validtillDate extended by 1 year'
      : 'Reactivated expired product to certified; existing validtillDate retained';

    await this.productModel.updateOne(
      { _id: product._id },
      { $set: update },
    );

    await this.writeAudits({
      productObjectId: product._id as Types.ObjectId,
      urnNo: trimmedUrn,
      eoiNo: String(product.eoiNo),
      adminUserId,
      adminObjectId,
      now,
      validtillDate: update.validtillDate,
      fromStatus,
      route: '/api/admin/products/expired-reactivate/product',
      auditAction: AUDIT_ACTION.EXPIRED_REACTIVATE_PRODUCT,
      description,
    });

    await invalidateProductListingsCache(this.redisService, this.logger);

    return {
      success: true,
      urnNo: trimmedUrn,
      productId: String(product._id),
      eoiNo: String(product.eoiNo),
      fromStatus,
      toStatus: PRODUCT_STATUS_CERTIFIED,
      validtillDate: update.validtillDate.toISOString(),
      message: validityExtended
        ? 'Product reactivated; validtillDate extended by 1 year from reactivation date'
        : 'Product reactivated; existing validtillDate retained',
      updatedAt: now,
    };
  }

  async reactivateUrn(
    urnNo: string,
    adminUserId: string,
  ): Promise<{
    success: true;
    urnNo: string;
    updatedProductIds: string[];
    updatedEoiNos: string[];
    updatedCount: number;
    message: string;
  }> {
    const trimmedUrn = urnNo.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }

    const now = new Date();
    const products = await this.productModel
      .find({
        urnNo: trimmedUrn,
        ...matchExpiredProducts(now),
        ...matchActiveProducts(),
      })
      .select('_id eoiNo validtillDate productStatus')
      .lean()
      .exec();

    if (!products.length) {
      throw new NotFoundException('No expired products on this URN');
    }

    const adminObjectId = new Types.ObjectId(adminUserId);
    let extendedAny = false;

    for (const product of products) {
      const { update, validityExtended } = this.buildReactivationUpdate(
        product.validtillDate as Date | undefined,
        now,
      );
      if (validityExtended) {
        extendedAny = true;
      }

      await this.productModel.updateOne({ _id: product._id }, { $set: update });
      await this.writeAudits({
        productObjectId: product._id as Types.ObjectId,
        urnNo: trimmedUrn,
        eoiNo: String(product.eoiNo),
        adminUserId,
        adminObjectId,
        now,
        validtillDate: update.validtillDate,
        fromStatus: Number(product.productStatus),
        route: '/api/admin/products/expired-reactivate/urn',
        auditAction: AUDIT_ACTION.EXPIRED_REACTIVATE_URN,
        description: 'Reactivated expired product to certified via URN bulk action',
      });
    }

    await invalidateProductListingsCache(this.redisService, this.logger);

    return {
      success: true,
      urnNo: trimmedUrn,
      updatedProductIds: products.map((p) => String(p._id)),
      updatedEoiNos: products.map((p) => String(p.eoiNo)),
      updatedCount: products.length,
      message: extendedAny
        ? 'URN reactivated; validtillDate extended by 1 year where past expiry'
        : 'URN reactivated; existing validtillDate retained for all products',
    };
  }

  private async resolveProduct(
    urnNo: string,
    productId: string,
  ): Promise<ProductDocument | null> {
    if (!urnNo || !productId) {
      return null;
    }

    const baseFilter = { urnNo, ...matchActiveProducts() };

    if (Types.ObjectId.isValid(productId)) {
      return this.productModel
        .findOne({ ...baseFilter, _id: new Types.ObjectId(productId) })
        .exec();
    }

    const numericId = Number(productId);
    if (Number.isFinite(numericId)) {
      return this.productModel
        .findOne({ ...baseFilter, productId: numericId })
        .exec();
    }

    return null;
  }

  private buildReactivationUpdate(
    existingValidTill: Date | null | undefined,
    now: Date,
  ): { update: ReactivationUpdate; validityExtended: boolean } {
    const { validtillDate, validityExtended } =
      this.resolveReactivatedValidTill(existingValidTill, now);
    const notifyDates = computeNotifyDates(validtillDate);

    return {
      validityExtended,
      update: {
        productStatus: PRODUCT_STATUS_CERTIFIED,
        productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
        updatedDate: now,
        validtillDate,
        firstNotifyDate: notifyDates.firstNotifyDate,
        secondNotifyDate: notifyDates.secondNotifyDate,
        thirdNotifyDate: notifyDates.thirdNotifyDate,
        discontinuedAt: null,
        discontinuedBy: null,
      },
    };
  }

  /** Keep future validtill; otherwise extend 1 calendar year from reactivation date. */
  private resolveReactivatedValidTill(
    existingValidTill: Date | null | undefined,
    now: Date,
  ): { validtillDate: Date; validityExtended: boolean } {
    const existing =
      existingValidTill != null ? new Date(existingValidTill) : null;
    if (existing && !Number.isNaN(existing.getTime()) && existing > now) {
      return { validtillDate: existing, validityExtended: false };
    }
    const extended = new Date(now);
    extended.setFullYear(extended.getFullYear() + 1);
    extended.setHours(0, 0, 0, 0);
    return { validtillDate: extended, validityExtended: true };
  }

  private async writeAudits(input: {
    productObjectId: Types.ObjectId;
    urnNo: string;
    eoiNo: string;
    adminUserId: string;
    adminObjectId: Types.ObjectId;
    now: Date;
    validtillDate: Date;
    fromStatus: number;
    route: string;
    auditAction: string;
    description: string;
  }): Promise<void> {
    await this.productStatusAuditModel.create({
      productId: input.productObjectId,
      urnNo: input.urnNo,
      fromStatus: input.fromStatus,
      toStatus: PRODUCT_STATUS_CERTIFIED,
      reason: input.description,
      changedBy: input.adminObjectId,
      changedAt: input.now,
    });

    await this.auditLogService.record({
      occurred_at: input.now,
      action: input.auditAction,
      outcome: 'success',
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: input.eoiNo,
      description: input.description,
      performed_by: { user_id: input.adminUserId },
      old_values: { productStatus: input.fromStatus },
      new_values: {
        productStatus: PRODUCT_STATUS_CERTIFIED,
        validtillDate: input.validtillDate.toISOString(),
        urnNo: input.urnNo,
        eoiNo: input.eoiNo,
      },
      http_method: 'PATCH',
      route: input.route,
      status_code: 200,
    });
  }
}
