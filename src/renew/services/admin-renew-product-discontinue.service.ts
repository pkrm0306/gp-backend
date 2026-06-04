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
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
  TOGGLEABLE_DISCONTINUE_STATUSES,
} from '../constants/product-status.constants';

export interface ProductDiscontinueListItem {
  _id: string;
  eoiNo: string;
  productName: string;
  productStatus: number;
  createdAt: Date;
}

@Injectable()
export class AdminRenewProductDiscontinueService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductStatusAudit.name)
    private readonly auditModel: Model<ProductStatusAuditDocument>,
  ) {}

  async listProducts(urnNo: string): Promise<ProductDiscontinueListItem[]> {
    const trimmedUrn = urnNo.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }

    const rows = await this.productModel
      .find({ urnNo: trimmedUrn, ...matchActiveProducts() })
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

  async toggleProductStatus(
    urnNo: string,
    productId: string,
    currentStatus: number,
    adminUserId: string,
    reason?: string,
  ): Promise<{
    success: true;
    productId: string;
    fromStatus: number;
    toStatus: number;
    updatedAt: Date;
  }> {
    if (!TOGGLEABLE_DISCONTINUE_STATUSES.includes(currentStatus as 2 | 4)) {
      throw new BadRequestException(
        'Only certified (2) or discontinued (4) products can be toggled',
      );
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new NotFoundException('Product not found');
    }

    const trimmedUrn = urnNo.trim();
    const productObjectId = new Types.ObjectId(productId);
    const adminObjectId = new Types.ObjectId(adminUserId);
    const now = new Date();

    const product = await this.productModel
      .findOne({ _id: productObjectId, urnNo: trimmedUrn, ...matchActiveProducts() })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (Number(product.productStatus) !== currentStatus) {
      throw new ConflictException('Product status has changed');
    }

    const toStatus =
      currentStatus === PRODUCT_STATUS_CERTIFIED
        ? PRODUCT_STATUS_DISCONTINUED
        : PRODUCT_STATUS_CERTIFIED;

    const update: Record<string, unknown> = {
      productStatus: toStatus,
      updatedDate: now,
    };

    if (toStatus === PRODUCT_STATUS_DISCONTINUED) {
      update.discontinuedAt = now;
      update.discontinuedBy = adminObjectId;
    } else {
      update.discontinuedAt = null;
      update.discontinuedBy = null;
    }

    await this.productModel.updateOne({ _id: productObjectId }, { $set: update });

    await this.auditModel.create({
      productId: productObjectId,
      urnNo: trimmedUrn,
      fromStatus: currentStatus,
      toStatus,
      reason: reason?.trim() || undefined,
      changedBy: adminObjectId,
      changedAt: now,
    });

    return {
      success: true,
      productId: String(productObjectId),
      fromStatus: currentStatus,
      toStatus,
      updatedAt: now,
    };
  }

  async bulkReactivate(
    urnNo: string,
    productIds: string[],
    adminUserId: string,
  ): Promise<{ success: true; updatedCount: number }> {
    const trimmedUrn = urnNo.trim();
    if (!trimmedUrn) {
      throw new BadRequestException('urnNo is required');
    }

    const ids = (productIds ?? [])
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (!ids.length) {
      return { success: true, updatedCount: 0 };
    }

    const now = new Date();
    const adminObjectId = new Types.ObjectId(adminUserId);

    const products = await this.productModel
      .find({
        _id: { $in: ids },
        urnNo: trimmedUrn,
        ...matchActiveProducts(),
      })
      .select('_id productStatus')
      .lean()
      .exec();

    if (!products.length) {
      return { success: true, updatedCount: 0 };
    }

    const productObjectIds = products.map((p) => p._id);

    const updateResult = await this.productModel.updateMany(
      { _id: { $in: productObjectIds }, urnNo: trimmedUrn, ...matchActiveProducts() },
      {
        $set: {
          productStatus: PRODUCT_STATUS_CERTIFIED,
          updatedDate: now,
          discontinuedAt: null,
          discontinuedBy: null,
        },
      },
    );

    const audits = products
      .filter((p) => Number(p.productStatus) !== PRODUCT_STATUS_CERTIFIED)
      .map((p) => ({
        productId: p._id,
        urnNo: trimmedUrn,
        fromStatus: Number(p.productStatus),
        toStatus: PRODUCT_STATUS_CERTIFIED,
        changedBy: adminObjectId,
        changedAt: now,
      }));

    if (audits.length) {
      await this.auditModel.insertMany(audits);
    }

    return {
      success: true,
      updatedCount: updateResult.modifiedCount ?? 0,
    };
  }
}
