import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  VendorProductChangeRequest,
  VendorProductChangeRequestDocument,
} from '../../product-registration/schemas/vendor-product-change-request.schema';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../../website/schemas/contact-message.schema';
import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import { manufacturerStatusKey } from '../admin-dashboard-metrics.util';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import {
  buildManufacturerSnapshotMatch,
  buildProductSnapshotMatch,
} from '../utils/dashboard-metrics-filters.util';
import { roundRevenueAmount } from '../utils/admin-dashboard-revenue.util';
import { AdminDashboardStatsService } from './admin-dashboard-stats.service';
import { AdminDashboardCertificationTimingService } from './admin-dashboard-certification-timing.service';
import type {
  AdminDashboardKpiBundle,
  AdminDashboardKpiCards,
} from './admin-dashboard-kpi.types';

@Injectable()
export class AdminDashboardKpiService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(VendorProductChangeRequest.name)
    private readonly vendorProductChangeRequestModel: Model<VendorProductChangeRequestDocument>,
    @InjectModel(ContactMessage.name)
    private readonly contactMessageModel: Model<ContactMessageDocument>,
    private readonly dashboardStatsService: AdminDashboardStatsService,
    private readonly certificationTimingService: AdminDashboardCertificationTimingService,
  ) {}

  async getKpiBundle(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardKpiBundle> {
    const [cards, certificationTiming] = await Promise.all([
      this.getKpiCards(filters),
      this.certificationTimingService.getCertificationTiming(filters),
    ]);
    return { cards, certificationTiming };
  }

  async getKpiCards(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardKpiCards> {
    const now = new Date();
    const productMatch = buildProductSnapshotMatch(filters, now);
    const manufacturerMatch = buildManufacturerSnapshotMatch(filters);
    const paymentVendorScope = this.buildPaymentVendorScope(filters);

    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const renewEoiMatch = {
      ...productMatch,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      $or: [
        {
          validtillDate: {
            $exists: true,
            $ne: null,
            $lt: thresholdDate,
          },
        },
        { urnStatus: { $gte: 12, $lte: 17 } },
      ],
    };

    const renewQueueMatch = {
      ...productMatch,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      urnStatus: { $gte: 12, $lte: 17 },
    };

    const pendingEoiMatch = {
      ...productMatch,
      productStatus: { $in: [0, 1] },
    };

    const [
      productWidgets,
      manufacturerFacet,
      pendingEoiCount,
      pendingProductRequests,
      renewEoiCount,
      renewQueueUrnCount,
      paymentFacet,
      revenueFacet,
      totalInquiriesCount,
      inquiriesThisMonth,
      productInquiriesCount,
      productInquiriesThisMonth,
    ] = await Promise.all([
      this.dashboardStatsService.getProductWidgetStats(filters),
      this.aggregateManufacturerFacet(manufacturerMatch),
      this.productModel.countDocuments(pendingEoiMatch).exec(),
      this.vendorProductChangeRequestModel
        .countDocuments({ status: 'pending' })
        .exec(),
      this.productModel.countDocuments(renewEoiMatch).exec(),
      this.productModel
        .aggregate<{ count: number }>([
          { $match: renewQueueMatch },
          { $group: { _id: '$urnNo' } },
          { $count: 'count' },
        ])
        .exec()
        .then((rows) => rows[0]?.count ?? 0),
      this.aggregatePaymentFacet(paymentVendorScope),
      this.aggregateCompletedRevenue(paymentVendorScope),
      this.contactMessageModel.countDocuments({
        $or: [
          { inquiryType: 'contact' },
          { inquiryType: { $exists: false } },
          { inquiryType: null },
          { inquiryType: '' },
        ],
      }).exec(),
      this.contactMessageModel
        .countDocuments({
          createdAt: { $gte: monthStart },
          $or: [
            { inquiryType: 'contact' },
            { inquiryType: { $exists: false } },
            { inquiryType: null },
            { inquiryType: '' },
          ],
        })
        .exec(),
      this.contactMessageModel.countDocuments({ inquiryType: 'product' }).exec(),
      this.contactMessageModel
        .countDocuments({
          inquiryType: 'product',
          createdAt: { $gte: monthStart },
        })
        .exec(),
    ]);

    const manufacturers = {
      verified: 0,
      unverified: 0,
      inactivePending: 0,
      verifiedActive: manufacturerFacet.verifiedActive,
      verifiedInactive: manufacturerFacet.verifiedInactive,
    };
    for (const row of manufacturerFacet.byStatus) {
      const key = manufacturerStatusKey(Number(row._id ?? 0));
      manufacturers[key] += row.count ?? 0;
    }

    const certifiedActive = productWidgets.statusCounts.certified;
    const totalProducts = productWidgets.statusCounts.total;
    const expiredCount = productWidgets.statusCounts.expired;
    const rejectedCount = productWidgets.statusCounts.rejected;
    const decidedCount = certifiedActive + rejectedCount;
    const successRate =
      decidedCount > 0
        ? Math.round((certifiedActive / decidedCount) * 1000) / 10
        : 0;

    const pendingApplicationsTotal = pendingEoiCount + pendingProductRequests;

    return {
      activeManufacturers: {
        key: 'activeManufacturers',
        label: 'Total Active Manufacturers',
        value: manufacturers.verifiedActive,
        subMetrics: {
          registered: manufacturerFacet.total,
          verified: manufacturers.verified,
        },
      },
      certifiedProducts: {
        key: 'certifiedProducts',
        label: 'Total Certified Products',
        value: certifiedActive,
        subMetrics: {
          totalRecords: totalProducts,
          expired: expiredCount,
        },
      },
      pendingApplications: {
        key: 'pendingApplications',
        label: 'Total Pending Applications',
        value: pendingApplicationsTotal,
        subMetrics: {
          eois: pendingEoiCount,
          productRequests: pendingProductRequests,
        },
      },
      transactions: {
        key: 'transactions',
        label: 'Total Transactions',
        value: paymentFacet.paid + paymentFacet.overdue,
        subMetrics: {
          paid: paymentFacet.paid,
          pending: paymentFacet.overdue,
        },
      },
      certificationSuccessRate: {
        key: 'certificationSuccessRate',
        label: 'Certification Success Rate',
        value: successRate,
        subMetrics: {
          certified: certifiedActive,
          decided: decidedCount,
          rejected: rejectedCount,
        },
      },
      totalRevenue: {
        key: 'totalRevenue',
        label: 'Total Revenue',
        value: revenueFacet.amount,
        currency: 'INR',
        subMetrics: {
          completedPayments: revenueFacet.count,
        },
      },
      pendingRenewals: {
        key: 'pendingRenewals',
        label: 'Pending Renewals',
        value: renewEoiCount,
        subMetrics: {
          renewalQueueItems: renewQueueUrnCount,
        },
      },
      expiredCertifications: {
        key: 'expiredCertifications',
        label: 'Expired Certifications',
        value: expiredCount,
        subMetrics: {
          requiresRenewal: expiredCount,
        },
      },
      totalInquiries: {
        key: 'totalInquiries',
        label: 'Total Inquiries',
        value: totalInquiriesCount,
        subMetrics: {
          thisMonth: inquiriesThisMonth,
        },
      },
      productInquiries: {
        key: 'productInquiries',
        label: 'Product Inquiries',
        value: productInquiriesCount,
        subMetrics: {
          thisMonth: productInquiriesThisMonth,
        },
      },
    };
  }

  private buildPaymentVendorScope(
    filters: ResolvedDashboardFilters,
  ): Record<string, unknown> {
    if (!filters.manufacturerIdsForRegion?.length) {
      return {};
    }
    return { vendorId: { $in: filters.manufacturerIdsForRegion } };
  }

  private async aggregateManufacturerFacet(
    manufacturerMatch: Record<string, unknown>,
  ): Promise<{
    total: number;
    byStatus: Array<{ _id: number; count: number }>;
    verifiedActive: number;
    verifiedInactive: number;
  }> {
    const pipeline: any[] = [];
    if (Object.keys(manufacturerMatch).length > 0) {
      pipeline.push({ $match: manufacturerMatch });
    }
    pipeline.push({
      $facet: {
        total: [{ $count: 'count' }],
        byStatus: [
          { $group: { _id: '$manufacturerStatus', count: { $sum: 1 } } },
        ],
        verifiedActive: [
          { $match: { manufacturerStatus: 1, vendor_status: 1 } },
          { $count: 'count' },
        ],
        verifiedInactive: [
          {
            $match: {
              manufacturerStatus: 1,
              vendor_status: { $ne: 1 },
            },
          },
          { $count: 'count' },
        ],
      },
    });

    const rows = await this.manufacturerModel
      .aggregate<{
        total: { count: number }[];
        byStatus: { _id: number; count: number }[];
        verifiedActive: { count: number }[];
        verifiedInactive: { count: number }[];
      }>(pipeline)
      .exec();

    const payload = rows[0];
    return {
      total: payload?.total?.[0]?.count ?? 0,
      byStatus: payload?.byStatus ?? [],
      verifiedActive: payload?.verifiedActive?.[0]?.count ?? 0,
      verifiedInactive: payload?.verifiedInactive?.[0]?.count ?? 0,
    };
  }

  private async aggregatePaymentFacet(
    vendorScope: Record<string, unknown>,
  ): Promise<{
    total: number;
    paid: number;
    overdue: number;
    created: number;
  }> {
    const match =
      Object.keys(vendorScope).length > 0 ? vendorScope : undefined;

    const rows = await this.paymentDetailsModel
      .aggregate<{
        _id: number;
        count: number;
      }>([
        ...(match ? [{ $match: match }] : []),
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
      ])
      .exec();

    const byStatus = new Map<number, number>();
    for (const row of rows) {
      byStatus.set(Number(row._id ?? 0), row.count ?? 0);
    }

    const paid = byStatus.get(2) ?? 0;
    const overdue = byStatus.get(1) ?? 0;
    const created = byStatus.get(0) ?? 0;
    const cancelled = byStatus.get(3) ?? 0;

    return {
      total: paid + overdue + created + cancelled,
      paid,
      overdue,
      created,
    };
  }

  private async aggregateCompletedRevenue(
    vendorScope: Record<string, unknown>,
  ): Promise<{ amount: number; count: number }> {
    const match: Record<string, unknown> = {
      paymentStatus: 2,
      ...vendorScope,
    };

    const rows = await this.paymentDetailsModel
      .aggregate<{
        amount: number;
        count: number;
      }>([
        { $match: match },
        {
          $group: {
            _id: null,
            amount: { $sum: '$quoteTotal' },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const row = rows[0];
    return {
      amount: roundRevenueAmount(row?.amount ?? 0),
      count: row?.count ?? 0,
    };
  }
}
