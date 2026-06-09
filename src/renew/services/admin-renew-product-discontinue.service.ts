import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import {
  ProductStatusAudit,
  ProductStatusAuditDocument,
} from '../schemas/product-status-audit.schema';
import { matchActiveProducts } from '../../product-registration/constants/active-product.filter';
import { PRODUCT_STATUS_CERTIFIED } from '../constants/product-status.constants';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AUDIT_ACTION } from '../../audit-log/audit-actions';
import {
  AUDIT_ACTION_TYPE,
  AUDIT_MODULE,
} from '../../audit-log/audit-friendlies';
import { invalidateProductListingsCache } from '../../product-registration/helpers/invalidate-product-listings-cache.util';
import { RedisService } from '../../common/redis/redis.service';
import { Logger } from '@nestjs/common';

export interface ProductDiscontinueListItem {
  _id: string;
  eoiNo: string;
  productName: string;
  productStatus: number;
  createdAt: Date;
}

@Injectable()
export class AdminRenewProductDiscontinueService {
  private readonly logger = new Logger(AdminRenewProductDiscontinueService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductStatusAudit.name)
    private readonly auditModel: Model<ProductStatusAuditDocument>,
    private readonly auditLogService: AuditLogService,
    private readonly redisService: RedisService,
  ) {}

  async listProducts(urnNo: string): Promise<ProductDiscontinueListItem[]> {
    const trimmedUrn = urnNo.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }

    const rows = await this.productModel
      .find({
        urnNo: trimmedUrn,
        productStatus: PRODUCT_STATUS_CERTIFIED,
        ...matchActiveProducts(),
      })
      .select('_id eoiNo productName productStatus createdDate')
      .sort({ createdDate: 1 })
      .lean()
      .exec();

    return rows.map((row) => ({
      _id: String(row._id),
      eoiNo: row.eoiNo,
      productName: row.productName,
      productStatus: Number(row.productStatus ?? 0),
      createdAt: row.createdDate,
    }));
  }

  async discontinueProduct(
    urnNo: string,
    productId: string,
    adminUserId: string,
    reason?: string,
  ): Promise<{
    success: true;
    productId: string;
    eoiNo: string;
    productStatus: number;
    discontinuedAt: Date;
    isDeleted: true;
    updatedAt: Date;
  }> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new NotFoundException('Product not found');
    }

    const trimmedUrn = urnNo.trim();
    const productObjectId = new Types.ObjectId(productId);
    const adminObjectId = new Types.ObjectId(adminUserId);
    const now = new Date();

    const product = await this.productModel
      .findOne({
        _id: productObjectId,
        urnNo: trimmedUrn,
        productStatus: PRODUCT_STATUS_CERTIFIED,
        ...matchActiveProducts(),
      })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productModel.updateOne(
      { _id: productObjectId },
      {
        $set: {
          is_deleted: true,
          deleted_at: now,
          deleted_by: adminObjectId,
          discontinuedAt: now,
          discontinuedBy: adminObjectId,
          discontinueReason: reason?.trim() || null,
          updatedDate: now,
        },
      },
    );

    await this.auditModel.create({
      productId: productObjectId,
      urnNo: trimmedUrn,
      fromStatus: Number(product.productStatus),
      toStatus: Number(product.productStatus),
      reason: reason?.trim() || 'Renewal discontinue (soft-delete)',
      changedBy: adminObjectId,
      changedAt: now,
    });

    await this.auditLogService.record({
      occurred_at: now,
      action: AUDIT_ACTION.PRODUCT_DISCONTINUED,
      outcome: 'success',
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: String(product.eoiNo),
      description: 'Product discontinued during renewal (soft-delete)',
      performed_by: { user_id: adminUserId },
      old_values: {
        is_deleted: false,
        productStatus: Number(product.productStatus),
        eoiNo: product.eoiNo,
      },
      new_values: {
        is_deleted: true,
        productStatus: Number(product.productStatus),
        eoiNo: product.eoiNo,
        urnNo: trimmedUrn,
        discontinuedAt: now.toISOString(),
      },
      http_method: 'PATCH',
      route: '/api/admin/renewals/:urnNo/product-discontinue/products/:productId',
      status_code: 200,
    });

    await invalidateProductListingsCache(this.redisService, this.logger);

    return {
      success: true,
      productId: String(productObjectId),
      eoiNo: String(product.eoiNo),
      productStatus: Number(product.productStatus),
      discontinuedAt: now,
      isDeleted: true,
      updatedAt: now,
    };
  }

  /** @deprecated Renewal discontinue is one-way; use a dedicated restore flow if needed. */
  async bulkReactivate(
    _urnNo: string,
    _productIds: string[],
    _adminUserId: string,
  ): Promise<never> {
    throw new BadRequestException(
      'Bulk reactivate is not supported for renewal discontinue. Discontinued products are soft-deleted and require a separate restore flow.',
    );
  }

  /** @deprecated Use discontinueProduct — status 4 toggle removed. */
  async toggleProductStatus(
    urnNo: string,
    productId: string,
    currentStatus: number,
    adminUserId: string,
    reason?: string,
  ): Promise<{
    success: true;
    productId: string;
    eoiNo: string;
    productStatus: number;
    discontinuedAt: Date;
    isDeleted: true;
    updatedAt: Date;
  }> {
    if (currentStatus !== PRODUCT_STATUS_CERTIFIED) {
      throw new BadRequestException(
        'Only certified (2) products can be discontinued. productStatus is not changed on discontinue.',
      );
    }

    const trimmedUrn = urnNo.trim();
    const productObjectId = new Types.ObjectId(productId);
    const existing = await this.productModel
      .findOne({ _id: productObjectId, urnNo: trimmedUrn })
      .select('is_deleted productStatus')
      .lean()
      .exec();

    if (existing?.is_deleted === true) {
      throw new ConflictException('Product is already discontinued or deleted');
    }

    return this.discontinueProduct(trimmedUrn, productId, adminUserId, reason);
  }
}
