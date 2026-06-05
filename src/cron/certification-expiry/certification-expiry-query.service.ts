import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { matchActiveProducts } from '../../product-registration/constants/active-product.filter';
import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import { PRODUCT_RENEW_STATUS } from '../../renew/constants/renewal-urn-status.constants';
import { EligibleExpiryProduct } from './certification-expiry.types';

const ACTIVE_RENEWAL_URN_STATUSES = [12, 13, 14, 15, 16, 17];

@Injectable()
export class CertificationExpiryQueryService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  /** Legacy getEligibleProducts() + MERN renewal exclusions (notify jobs only). */
  async getEligibleProducts(asOf = new Date()): Promise<EligibleExpiryProduct[]> {
    const thresholdDate = new Date(asOf);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    return this.findExpiryProducts({
      ...matchActiveProducts(),
      productStatus: PRODUCT_STATUS_CERTIFIED,
      productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
      urnStatus: { $nin: ACTIVE_RENEWAL_URN_STATUSES },
      validtillDate: { $exists: true, $ne: null, $lt: thresholdDate },
    });
  }

  /** Certified products past validtill — no renewal/URN exclusions (deactivation only). */
  async getDeactivationEligibleProducts(
    asOf = new Date(),
  ): Promise<EligibleExpiryProduct[]> {
    return this.findExpiryProducts({
      ...matchActiveProducts(),
      productStatus: PRODUCT_STATUS_CERTIFIED,
      validtillDate: { $exists: true, $ne: null, $lte: asOf },
    });
  }

  private async findExpiryProducts(
    match: Record<string, unknown>,
  ): Promise<EligibleExpiryProduct[]> {
    const rows = await this.productModel
      .aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'vendors',
            localField: 'vendorId',
            foreignField: '_id',
            as: 'vendor',
          },
        },
        { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'manufacturers',
            localField: 'manufacturerId',
            foreignField: '_id',
            as: 'manufacturer',
          },
        },
        { $unwind: { path: '$manufacturer', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$vendorId',
            vendorProductCount: { $sum: 1 },
            products: { $push: '$$ROOT' },
          },
        },
        { $unwind: '$products' },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$products',
                { vendorProductCount: '$vendorProductCount' },
              ],
            },
          },
        },
        { $sort: { createdDate: -1 } },
      ])
      .exec();

    return rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: Record<string, unknown>): EligibleExpiryProduct {
    const vendor = row.vendor as Record<string, unknown> | undefined;
    const category = row.category as Record<string, unknown> | undefined;
    const manufacturer = row.manufacturer as Record<string, unknown> | undefined;
    return {
      productId: Number(row.productId),
      eoiNo: String(row.eoiNo ?? ''),
      urnNo: String(row.urnNo ?? ''),
      productName: String(row.productName ?? ''),
      productStatus: Number(row.productStatus ?? 0),
      productRenewStatus: Number(row.productRenewStatus ?? 0),
      urnStatus: Number(row.urnStatus ?? 0),
      renewCycleNo:
        row.renewCycleNo != null ? Number(row.renewCycleNo) : null,
      validtillDate: row.validtillDate as Date,
      firstNotifyDate: (row.firstNotifyDate as Date) ?? null,
      secondNotifyDate: (row.secondNotifyDate as Date) ?? null,
      thirdNotifyDate: (row.thirdNotifyDate as Date) ?? null,
      vendorId: row.vendorId as EligibleExpiryProduct['vendorId'],
      vendorName: (vendor?.vendorName as string) ?? null,
      vendorEmail: (vendor?.vendorEmail as string) ?? null,
      vendorPhone: (vendor?.vendorPhone as string) ?? null,
      vendorDesignation: (vendor?.vendorDesignation as string) ?? null,
      vendorGst: (vendor?.vendorGst as string) ?? null,
      vendorStatus:
        vendor?.vendorStatus != null ? Number(vendor.vendorStatus) : null,
      categoryName:
        (category?.categoryName as string) ??
        (category?.category_name as string) ??
        null,
      manufacturerName: (manufacturer?.manufacturerName as string) ?? null,
      vendorProductCount: Number(row.vendorProductCount ?? 1),
    };
  }
}
