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
import { Product, ProductDocument } from '../schemas/product.schema';
import { matchActiveProducts } from '../constants/active-product.filter';
import {
  ProductStatusAudit,
  ProductStatusAuditDocument,
} from '../../renew/schemas/product-status-audit.schema';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_REJECTED,
} from '../../renew/constants/product-status.constants';
import { invalidateProductListingsCache } from '../helpers/invalidate-product-listings-cache.util';
import { RedisService } from '../../common/redis/redis.service';
import { LifecycleNotificationService } from '../../notifications/lifecycle-notification.service';

const DEFAULT_REJECTION_TEXT =
  'Rejected by admin from certified products list';

@Injectable()
export class AdminCertifiedRejectService {
  private readonly logger = new Logger(AdminCertifiedRejectService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductStatusAudit.name)
    private readonly productStatusAuditModel: Model<ProductStatusAuditDocument>,
    private readonly auditLogService: AuditLogService,
    private readonly redisService: RedisService,
    private readonly lifecycleNotification: LifecycleNotificationService,
  ) {}

  async rejectProduct(
    urnNo: string,
    productId: string,
    adminUserId: string,
    options?: {
      eoiNo?: string;
      rejectionReason?: string;
      rejectedDetails?: string;
    },
  ): Promise<{
    success: true;
    urnNo: string;
    productId: string;
    eoiNo: string;
    fromStatus: number;
    toStatus: number;
    message: string;
    updatedAt: Date;
  }> {
    const trimmedUrn = urnNo.trim();
    const product = await this.resolveProduct(trimmedUrn, productId.trim());
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (options?.eoiNo?.trim() && String(product.eoiNo) !== options.eoiNo.trim()) {
      throw new NotFoundException('Product not found');
    }

    if (Number(product.productStatus) !== PRODUCT_STATUS_CERTIFIED) {
      throw new ConflictException('Product is not certified');
    }

    const now = new Date();
    const adminObjectId = new Types.ObjectId(adminUserId);
    const rejectionText =
      options?.rejectedDetails?.trim() ||
      options?.rejectionReason?.trim() ||
      DEFAULT_REJECTION_TEXT;

    const result = await this.productModel
      .updateOne(
        { _id: product._id, productStatus: PRODUCT_STATUS_CERTIFIED },
        {
          $set: {
            productStatus: PRODUCT_STATUS_REJECTED,
            rejectedDetails: rejectionText,
            rejectedAt: now,
            updatedDate: now,
          },
        },
      )
      .exec();

    if ((result.modifiedCount ?? 0) === 0) {
      throw new ConflictException('Product is not certified');
    }

    await this.productStatusAuditModel.create({
      productId: product._id,
      urnNo: trimmedUrn,
      fromStatus: PRODUCT_STATUS_CERTIFIED,
      toStatus: PRODUCT_STATUS_REJECTED,
      reason: rejectionText,
      changedBy: adminObjectId,
      changedAt: now,
    });

    await this.auditLogService.record({
      occurred_at: now,
      action: AUDIT_ACTION.CERTIFIED_REJECT_PRODUCT,
      outcome: 'success',
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: String(product.eoiNo),
      description: 'Certified product rejected by admin',
      performed_by: { user_id: adminUserId },
      old_values: {
        productStatus: PRODUCT_STATUS_CERTIFIED,
        eoiNo: product.eoiNo,
      },
      new_values: {
        productStatus: PRODUCT_STATUS_REJECTED,
        eoiNo: product.eoiNo,
        urnNo: trimmedUrn,
        rejectedDetails: rejectionText,
      },
      http_method: 'PATCH',
      route: '/api/admin/products/certified-reject/product',
      status_code: 200,
    });

    await invalidateProductListingsCache(this.redisService, this.logger);

    this.notifyRejected({
      manufacturerId: product.manufacturerId,
      urnNo: trimmedUrn,
      productName: String(product.productName || product.eoiNo || trimmedUrn),
      reason: rejectionText,
    });

    return {
      success: true,
      urnNo: trimmedUrn,
      productId: String(product._id),
      eoiNo: String(product.eoiNo),
      fromStatus: PRODUCT_STATUS_CERTIFIED,
      toStatus: PRODUCT_STATUS_REJECTED,
      message: 'Certified product rejected successfully',
      updatedAt: now,
    };
  }

  async rejectUrn(
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
        productStatus: PRODUCT_STATUS_CERTIFIED,
        ...matchActiveProducts(),
      })
      .select('_id eoiNo manufacturerId productName productStatus')
      .lean()
      .exec();

    if (!products.length) {
      throw new NotFoundException('No certified products on this URN');
    }

    const adminObjectId = new Types.ObjectId(adminUserId);
    const rejectionText = DEFAULT_REJECTION_TEXT;

    const bulkResult = await this.productModel.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: {
            _id: product._id,
            productStatus: PRODUCT_STATUS_CERTIFIED,
          },
          update: {
            $set: {
              productStatus: PRODUCT_STATUS_REJECTED,
              rejectedDetails: rejectionText,
              rejectedAt: now,
              updatedDate: now,
            },
          },
        },
      })),
      { ordered: false },
    );

    const modifiedCount = bulkResult.modifiedCount ?? 0;
    if (modifiedCount === 0) {
      throw new ConflictException('No certified products on this URN');
    }

    await this.productStatusAuditModel.insertMany(
      products.map((product) => ({
        productId: product._id,
        urnNo: trimmedUrn,
        fromStatus: PRODUCT_STATUS_CERTIFIED,
        toStatus: PRODUCT_STATUS_REJECTED,
        reason: rejectionText,
        changedBy: adminObjectId,
        changedAt: now,
      })),
      { ordered: false },
    );

    await this.auditLogService.recordMany(
      products.map((product) => ({
        occurred_at: now,
        action: AUDIT_ACTION.CERTIFIED_REJECT_URN,
        outcome: 'success' as const,
        module: AUDIT_MODULE.PRODUCT,
        action_type: AUDIT_ACTION_TYPE.UPDATE,
        entity_name: String(product.eoiNo),
        description: 'Certified product on URN rejected by admin',
        performed_by: { user_id: adminUserId },
        old_values: {
          productStatus: PRODUCT_STATUS_CERTIFIED,
          eoiNo: product.eoiNo,
        },
        new_values: {
          productStatus: PRODUCT_STATUS_REJECTED,
          eoiNo: product.eoiNo,
          urnNo: trimmedUrn,
          rejectedDetails: rejectionText,
        },
        http_method: 'PATCH',
        route: '/api/admin/products/certified-reject/urn',
        status_code: 200,
      })),
    );

    await invalidateProductListingsCache(this.redisService, this.logger);

    this.logger.log(
      `[rejectUrn] urnNo=${trimmedUrn} planned=${products.length} modified=${modifiedCount}`,
    );

    for (const product of products) {
      this.notifyRejected({
        manufacturerId: product.manufacturerId,
        urnNo: trimmedUrn,
        productName: String(product.productName || product.eoiNo || trimmedUrn),
        reason: rejectionText,
      });
    }

    return {
      success: true,
      urnNo: trimmedUrn,
      updatedProductIds: products.map((p) => String(p._id)),
      updatedEoiNos: products.map((p) => String(p.eoiNo)),
      updatedCount: products.length,
      message: 'Certified products on URN rejected successfully',
    };
  }

  private notifyRejected(params: {
    manufacturerId?: Types.ObjectId | string;
    urnNo: string;
    productName: string;
    reason: string;
  }): void {
    const manufacturerId = params.manufacturerId
      ? String(params.manufacturerId)
      : '';
    if (!manufacturerId) {
      this.logger.warn(
        `[certified-reject] Skipping notify: missing manufacturerId urn=${params.urnNo}`,
      );
      return;
    }
    this.lifecycleNotification
      .notifyProductRejected({
        manufacturerId,
        urnNo: params.urnNo,
        productName: params.productName,
        reason: params.reason,
      })
      .catch((err) =>
        this.logger.warn(
          `[certified-reject] Product rejected notification failed: ${(err as Error).message}`,
        ),
      );
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
}
