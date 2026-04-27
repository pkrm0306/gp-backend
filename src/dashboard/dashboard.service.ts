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
  ) {}

  async getDashboardData(vendorId: string) {
    try {
      const vendorObjectId = new Types.ObjectId(vendorId);

      // Check if vendor profile is complete
      const manufacturer = await this.manufacturerModel
        .findById(vendorObjectId)
        .exec();
      if (!manufacturer) {
        throw new ForbiddenException('Manufacturer not found');
      }

      // Check if vendor profile is complete (GST, designation, phone)
      if (
        !manufacturer.vendor_gst ||
        !manufacturer.vendor_designation ||
        !manufacturer.vendor_phone
      ) {
        throw new ForbiddenException(
          'Please enter your account details to access all options!',
        );
      }

      // Execute all queries in parallel for better performance
      const [
        productCount,
        certifiedProductCount,
        paymentPendingAmount,
        partnerCount,
        upcomingEventsCount,
        latestUrn,
        latestEoi,
      ] = await Promise.all([
        this.getProductsCount(vendorObjectId),
        this.getCertifiedProductsCount(vendorObjectId),
        this.getPaymentPendingAmount(vendorObjectId),
        this.getPartnersCount(vendorObjectId),
        this.getUpcomingEventsCount(),
        this.getLatestUrn(vendorObjectId),
        this.getLatestEoi(vendorObjectId),
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
