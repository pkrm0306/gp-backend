import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../payments/schemas/payment-details.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';
import { Event, EventDocument } from '../events/schemas/event.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  ActivityLog,
  ActivityLogDocument,
} from '../activity-log/schemas/activity-log.schema';
import { buildVendorProgressTracking } from './vendor-progress.util';
import { buildVendorApplicationRow } from './vendor-applications.util';
import { ListVendorApplicationsQueryDto } from './dto/list-vendor-applications-query.dto';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(PaymentDetails.name)
    private paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
    private readonly manufacturersService: ManufacturersService,
  ) {}

  /**
   * Vendor dashboard — **Applications & URNs** table.
   * When **urn** is passed, returns products for that batch only.
   * When **urn** is omitted, returns products across **all** URN batches.
   */
  async listApplicationsAndUrns(
    authUserId: string,
    tokenManufacturerId: string | undefined,
    query: ListVendorApplicationsQueryDto,
  ) {
    const vendorObjectId = await this.resolveVendorManufacturerObjectId(
      authUserId,
      tokenManufacturerId,
    );
    await this.assertVendorProfileComplete(authUserId, tokenManufacturerId);

    const urnFilter = String(query.urn ?? '').trim();
    let scopedUrn: { urnNo: string; urnStatus: number } | null = null;

    if (urnFilter) {
      scopedUrn = await this.resolvePrimaryUrnProduct(
        vendorObjectId,
        urnFilter,
      );
      if (!scopedUrn) {
        return {
          message: 'Applications and URNs retrieved successfully',
          data: {
            urn_no: urnFilter,
            urn_status: 0,
            rows: [],
            totalCount: 0,
            currentPage: 1,
            totalPages: 1,
            limit: Number(query.limit ?? 10),
          },
        };
      }
    }

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const perPage =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 10;
    const skip = (currentPage - 1) * perPage;

    const match: Record<string, unknown> = matchActiveProducts({
      vendorId: vendorObjectId,
      productType: 0,
      ...(scopedUrn ? { urnNo: scopedUrn.urnNo } : {}),
    });

    const search = String(query.search ?? '').trim();
    if (search) {
      const re = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      match.$or = [{ eoiNo: re }, { productName: re }, { urnNo: re }];
    }

    const [totalCount, products] = await Promise.all([
      this.productModel.countDocuments(match).exec(),
      this.productModel
        .find(match)
        .select(
          'productId urnNo eoiNo productName productStatus urnStatus validtillDate createdDate',
        )
        .sort({ urnNo: -1, createdDate: -1, productId: -1 })
        .skip(skip)
        .limit(perPage)
        .lean()
        .exec(),
    ]);

    const rows = products.map((p, index) => ({
      s_no: skip + index + 1,
      ...buildVendorApplicationRow({
        productId: p.productId,
        urnNo: p.urnNo,
        eoiNo: p.eoiNo,
        productName: p.productName,
        productStatus: p.productStatus,
        urnStatus: p.urnStatus,
        validtillDate: (p as { validtillDate?: Date | string | null }).validtillDate,
      }),
    }));

    return {
      message: 'Applications and URNs retrieved successfully',
      data: {
        urn_no: scopedUrn?.urnNo ?? null,
        urn_status: scopedUrn?.urnStatus ?? 0,
        rows,
        totalCount,
        currentPage,
        totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
        limit: perPage,
      },
    };
  }

  /** Distinct certification URNs for the vendor dashboard URN selector. */
  async listVendorUrns(
    authUserId: string,
    tokenManufacturerId: string | undefined,
  ): Promise<string[]> {
    const vendorObjectId = await this.resolveVendorManufacturerObjectId(
      authUserId,
      tokenManufacturerId,
    );
    await this.assertVendorProfileComplete(authUserId, tokenManufacturerId);

    const urns = await this.productModel.distinct(
      'urnNo',
      matchActiveProducts({
        vendorId: vendorObjectId,
        productType: 0,
        urnNo: { $exists: true, $nin: [null, ''] },
      }),
    );

    return urns
      .map((urn) => String(urn ?? '').trim())
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a));
  }

  /**
   * Progress tracking for every URN batch in one request (dashboard carousel).
   */
  async listAllUrnProgressTracking(
    authUserId: string,
    tokenManufacturerId: string | undefined,
  ): Promise<{ urns: string[]; progress: ReturnType<typeof buildVendorProgressTracking>[] }> {
    const vendorObjectId = await this.resolveVendorManufacturerObjectId(
      authUserId,
      tokenManufacturerId,
    );
    await this.assertVendorProfileComplete(authUserId, tokenManufacturerId);

    const products = await this.productModel
      .find(
        matchActiveProducts({
          vendorId: vendorObjectId,
          productType: 0,
          urnNo: { $exists: true, $nin: [null, ''] },
        }),
      )
      .select('urnNo urnStatus productId')
      .sort({ urnNo: -1, productId: -1 })
      .lean()
      .exec();

    const urnStatusByUrn = new Map<string, number>();
    for (const product of products) {
      const urn = String(product.urnNo ?? '').trim();
      if (!urn || urnStatusByUrn.has(urn)) continue;
      urnStatusByUrn.set(urn, Number(product.urnStatus ?? 0));
    }

    const urns = Array.from(urnStatusByUrn.keys()).sort((a, b) =>
      b.localeCompare(a),
    );

    if (urns.length === 0) {
      return { urns: [], progress: [] };
    }

    const activityLogs = await this.activityLogModel
      .find({ vendor_id: vendorObjectId, urn_no: { $in: urns } })
      .sort({ created_at: 1 })
      .lean()
      .exec();

    const logsByUrn = new Map<string, typeof activityLogs>();
    for (const log of activityLogs) {
      const urn = String(log.urn_no ?? '').trim();
      if (!urn) continue;
      const existing = logsByUrn.get(urn) ?? [];
      existing.push(log);
      logsByUrn.set(urn, existing);
    }

    const progress = urns.map((urnNo) =>
      buildVendorProgressTracking({
        urnNo,
        urnStatus: urnStatusByUrn.get(urnNo) ?? 0,
        activityLogs: logsByUrn.get(urnNo) ?? [],
      }),
    );

    return { urns, progress };
  }

  private async resolveVendorManufacturerObjectId(
    authUserId: string,
    tokenManufacturerId?: string,
  ): Promise<Types.ObjectId> {
    const { resolvedManufacturer } =
      await this.manufacturersService.resolveManufacturerForAuthUser({
        userId: authUserId,
        manufacturerId: tokenManufacturerId,
        vendorId: tokenManufacturerId,
      });
    if (resolvedManufacturer?._id) {
      return resolvedManufacturer._id as Types.ObjectId;
    }
    if (tokenManufacturerId && Types.ObjectId.isValid(tokenManufacturerId)) {
      return new Types.ObjectId(tokenManufacturerId);
    }
    throw new ForbiddenException('Manufacturer not found');
  }

  private async assertVendorProfileComplete(
    authUserId: string,
    tokenManufacturerId?: string,
  ): Promise<void> {
    const { resolvedManufacturer, vendorUser } =
      await this.manufacturersService.resolveManufacturerForAuthUser({
        userId: authUserId,
        manufacturerId: tokenManufacturerId,
        vendorId: tokenManufacturerId,
      });

    if (!resolvedManufacturer) {
      throw new ForbiddenException(
        'Please enter your account details to access all options!',
      );
    }

    if (
      !this.manufacturersService.isVendorAccountProfileComplete(
        resolvedManufacturer,
        vendorUser,
      )
    ) {
      throw new ForbiddenException(
        'Please enter your account details to access all options!',
      );
    }
  }

  async resolveVendorObjectIdForOverview(
    authUserId: string,
    tokenManufacturerId?: string,
  ): Promise<Types.ObjectId> {
    const vendorObjectId = await this.resolveVendorManufacturerObjectId(
      authUserId,
      tokenManufacturerId,
    );
    await this.assertVendorProfileComplete(authUserId, tokenManufacturerId);
    return vendorObjectId;
  }

  async getDashboardData(
    authUserId: string,
    tokenManufacturerId?: string,
    urnNo?: string,
  ) {
    try {
      const vendorObjectId = await this.resolveVendorObjectIdForOverview(
        authUserId,
        tokenManufacturerId,
      );

      const [
        productCount,
        certifiedProductCount,
        paymentPendingAmount,
        partnerCount,
        upcomingEventsCount,
        latestUrn,
        latestEoi,
        progressTracking,
      ] = await Promise.all([
        this.getProductsCount(vendorObjectId),
        this.getCertifiedProductsCount(vendorObjectId),
        this.getPaymentPendingAmount(vendorObjectId),
        this.getPartnersCount(vendorObjectId),
        this.getUpcomingEventsCount(),
        this.getLatestUrn(vendorObjectId),
        this.getLatestEoi(vendorObjectId),
        this.getProgressTracking(vendorObjectId, urnNo?.trim()),
      ]);

      return {
        success: true,
        data: {
          products: { product_count: productCount },
          certifiedProducts: { certified_product_count: certifiedProductCount },
          paymentPendingAmount: {
            payment_pending_amount: paymentPendingAmount,
          },
          partners: { partner_count: partnerCount },
          upcomingEventsCount: { upcoming_events_count: upcomingEventsCount },
          latestUrn: latestUrn,
          latestEoi: latestEoi,
          progressTracking,
        },
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.error('[Dashboard Service] Error:', error);
      throw new InternalServerErrorException('Failed to fetch dashboard data');
    }
  }

  /**
   * Query 1: Get total number of products for the vendor
   */
  private async getProductsCount(vendorId: Types.ObjectId): Promise<number> {
    const count = await this.productModel.countDocuments({ vendorId }).exec();
    return count || 0;
  }

  /**
   * Query 2: Get count of certified products (product_status = 2)
   */
  private async getCertifiedProductsCount(
    vendorId: Types.ObjectId,
  ): Promise<number> {
    const count = await this.productModel
      .countDocuments({
        vendorId,
        productStatus: 2,
      })
      .exec();
    return count || 0;
  }

  /**
   * Query 3: Get sum of pending payment amounts (payment_status = 0)
   */
  private async getPaymentPendingAmount(
    vendorId: Types.ObjectId,
  ): Promise<number | null> {
    const result = await this.paymentDetailsModel
      .aggregate([
        {
          $match: {
            vendorId: vendorId,
            paymentStatus: 0,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$quoteTotal' },
          },
        },
      ])
      .exec();

    if (
      result.length === 0 ||
      result[0].total === null ||
      result[0].total === undefined
    ) {
      return null;
    }

    return result[0].total;
  }

  /**
   * Query 4: Get count of partners (type = 'partner', status IN (0, 1))
   */
  private async getPartnersCount(vendorId: Types.ObjectId): Promise<number> {
    const count = await this.vendorUserModel
      .countDocuments({
        vendorId,
        type: 'partner',
        status: { $in: [0, 1] },
      })
      .exec();
    return count || 0;
  }

  /**
   * Query 5: Get count of upcoming events (event_date >= today, event_status = 1)
   * Note: This query is NOT filtered by vendor_id (it's global events)
   */
  private async getUpcomingEventsCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await this.eventModel
      .countDocuments({
        eventDate: { $gte: today },
        eventStatus: 1,
      })
      .exec();
    return count || 0;
  }

  /**
   * Dynamic certification progress (vendor panel only).
   * Stepper + latest/next cards from products.urnStatus and activity_log for the URN.
   */
  private async getProgressTracking(
    vendorId: Types.ObjectId,
    urnNo?: string,
  ) {
    const primary = await this.resolvePrimaryUrnProduct(vendorId, urnNo);
    if (!primary) {
      return buildVendorProgressTracking({
        urnNo: null,
        urnStatus: null,
        activityLogs: [],
      });
    }

    const activityLogs = await this.activityLogModel
      .find({ vendor_id: vendorId, urn_no: primary.urnNo })
      .sort({ created_at: 1 })
      .lean()
      .exec();

    return buildVendorProgressTracking({
      urnNo: primary.urnNo,
      urnStatus: primary.urnStatus,
      activityLogs,
    });
  }

  private async resolvePrimaryUrnProduct(
    vendorId: Types.ObjectId,
    urnNo?: string,
  ): Promise<{ urnNo: string; urnStatus: number } | null> {
    if (urnNo) {
      const row = await this.productModel
        .findOne(matchActiveProducts({ vendorId, urnNo, productType: 0 }))
        .select('urnNo urnStatus')
        .sort({ productId: -1 })
        .lean()
        .exec();
      if (!row?.urnNo) {
        return null;
      }
      return {
        urnNo: row.urnNo,
        urnStatus: Number(row.urnStatus ?? 0),
      };
    }

    const row = await this.productModel
      .findOne(matchActiveProducts({ vendorId, productType: 0 }))
      .select('urnNo urnStatus')
      .sort({ urnNo: -1, productId: -1 })
      .lean()
      .exec();

    if (!row?.urnNo) {
      return null;
    }
    return {
      urnNo: row.urnNo,
      urnStatus: Number(row.urnStatus ?? 0),
    };
  }

  /**
   * Query 6: Get latest 4 URN records (product_type = 0), ordered by urn_no DESC
   */
  private async getLatestUrn(vendorId: Types.ObjectId): Promise<
    Array<{
      urn_no: string;
      urn_status: number | string;
      product_status: number;
    }>
  > {
    const results = await this.productModel
      .find({
        vendorId,
        productType: 0,
      })
      .select('urnNo urnStatus productStatus')
      .sort({ urnNo: -1, productId: -1 })
      .limit(4)
      .exec();

    return results.map((product) => ({
      urn_no: product.urnNo,
      urn_status: product.urnStatus,
      product_status: product.productStatus,
    }));
  }

  /**
   * Query 7: Get latest 10 EOI records (product_type = 0), ordered by created_date DESC
   */
  private async getLatestEoi(vendorId: Types.ObjectId): Promise<
    Array<{
      eoi_no: string;
      product_name: string;
      product_status: number;
    }>
  > {
    const results = await this.productModel
      .find({
        vendorId,
        productType: 0,
      })
      .select('eoiNo productName productStatus')
      .sort({ createdDate: -1 })
      .limit(10)
      .exec();

    return results.map((product) => ({
      eoi_no: product.eoiNo,
      product_name: product.productName,
      product_status: product.productStatus,
    }));
  }
}
