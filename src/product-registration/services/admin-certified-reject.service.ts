import {
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
      'Rejected by admin from certified products list';

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
