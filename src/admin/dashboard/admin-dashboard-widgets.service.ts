import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import { buildProductSnapshotMatch } from '../utils/dashboard-metrics-filters.util';
import { roundRevenueAmount } from '../utils/admin-dashboard-revenue.util';
import { AdminDashboardKpiService } from './admin-dashboard-kpi.service';
import { AdminDashboardStatsService } from './admin-dashboard-stats.service';
import { AdminDashboardSustainabilityService } from './admin-dashboard-sustainability.service';
import { AdminDashboardVisitorAnalyticsService } from './admin-dashboard-visitor-analytics.service';
import type {
  AdminDashboardOverview,
  DashboardAlertItem,
  DashboardPaymentStatusWidget,
  DashboardRecentApplicationRow,
  DashboardRecentPaymentRow,
} from './admin-dashboard-widgets.types';

const PAYMENT_STATUS_PAID = 2;
const PAYMENT_STATUS_PENDING = 1;

@Injectable()
export class AdminDashboardWidgetsService {
  constructor(
    @InjectModel(PaymentDetails.name)
    private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    private readonly dashboardKpi: AdminDashboardKpiService,
    private readonly dashboardStats: AdminDashboardStatsService,
    private readonly sustainability: AdminDashboardSustainabilityService,
    private readonly visitorAnalytics: AdminDashboardVisitorAnalyticsService,
  ) {}

  async getOverview(
    filters: ResolvedDashboardFilters,
    options?: { recentLimit?: number },
  ): Promise<AdminDashboardOverview> {
    const limit = Math.min(Math.max(options?.recentLimit ?? 5, 1), 20);
    const [kpiBundle, paymentStatus, recentPayments, recentApplications, alerts, products, trends, rejectionTrend, sustainabilityContributions, visitorAnalytics] =
      await Promise.all([
        this.dashboardKpi.getKpiBundle(filters),
        this.getPaymentStatus(filters),
        this.getRecentPayments(filters, limit),
        this.getRecentApplications(filters, limit),
        this.getAlerts(filters),
        this.dashboardStats.getProductWidgetStats(filters),
        this.dashboardStats.getTrendCharts(filters, filters.granularity),
        this.dashboardStats.getRejectionTrend(filters),
        this.sustainability.getSustainabilityContributions(filters),
        this.visitorAnalytics.getVisitorAnalytics(filters),
      ]);

    return {
      kpiCards: kpiBundle.cards,
      certificationTiming: kpiBundle.certificationTiming,
      paymentStatus,
      recentPayments,
      recentApplications,
      alerts,
      charts: { products, trends, rejectionTrend },
      sustainabilityContributions,
      visitorAnalytics,
    };
  }

  /** Paid + pending only (excludes created, cancelled, overdue). */
  async getPaymentStatus(
    filters: ResolvedDashboardFilters,
  ): Promise<DashboardPaymentStatusWidget> {
    const vendorScope = this.buildPaymentVendorScope(filters);
    const match: Record<string, unknown> = {
      paymentStatus: { $in: [PAYMENT_STATUS_PAID, PAYMENT_STATUS_PENDING] },
      ...vendorScope,
    };

    const rows = await this.paymentDetailsModel
      .aggregate<{ _id: number; count: number }>([
        { $match: match },
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
      ])
      .exec();

    const paid = rows.find((r) => Number(r._id) === PAYMENT_STATUS_PAID)?.count ?? 0;
    const pending =
      rows.find((r) => Number(r._id) === PAYMENT_STATUS_PENDING)?.count ?? 0;
    const total = paid + pending;

    const items = [
      this.buildPaymentStatusItem('paid', 'Paid', paid, total),
      this.buildPaymentStatusItem('pending', 'Pending', pending, total),
    ];

    return { total, items, chart: items };
  }

  async getRecentPayments(
    filters: ResolvedDashboardFilters,
    limit = 5,
  ): Promise<DashboardRecentPaymentRow[]> {
    const vendorScope = this.buildPaymentVendorScope(filters);
    const match: Record<string, unknown> = {
      paymentStatus: { $in: [PAYMENT_STATUS_PAID, PAYMENT_STATUS_PENDING] },
      ...vendorScope,
    };

    const rows = await this.paymentDetailsModel
      .find(match)
      .sort({ updatedDate: -1, createdDate: -1 })
      .limit(limit)
      .lean()
      .exec();

    const manufacturerMap = await this.loadManufacturerNameMap(
      rows.map((r) => r.vendorId),
    );

    return rows.map((row) => {
      const status = Number(row.paymentStatus) === PAYMENT_STATUS_PAID ? 'paid' : 'pending';
      const vendorKey = row.vendorId?.toString() ?? '';
      const manufacturer = manufacturerMap.get(vendorKey);
      const companyName =
        manufacturer?.manufacturerName ??
        manufacturer?.vendor_name ??
        'Unknown';
      const paymentId = Number(row.paymentId ?? 0);
      const date = row.updatedDate ?? row.createdDate;

      return {
        paymentId,
        transactionId: row.paymentReferenceNo?.trim()
          ? String(row.paymentReferenceNo).trim()
          : `TXN-${paymentId || row._id}`,
        companyName,
        manufacturerName: companyName,
        urnNo: String(row.urnNo ?? ''),
        paymentType: String(row.paymentType ?? ''),
        paymentTypeLabel: this.formatPaymentType(row.paymentType),
        paymentMode: row.paymentMode ?? null,
        paymentModeLabel: row.paymentMode
          ? this.formatPaymentMode(row.paymentMode)
          : null,
        amount: roundRevenueAmount(Number(row.quoteTotal ?? 0)),
        currency: 'INR' as const,
        date: date ? new Date(date).toISOString().slice(0, 10) : '',
        status,
        statusLabel: status === 'paid' ? 'Paid' : 'Pending',
      };
    });
  }

  async getRecentApplications(
    filters: ResolvedDashboardFilters,
    limit = 5,
  ): Promise<DashboardRecentApplicationRow[]> {
    const now = new Date();
    const productMatch = buildProductSnapshotMatch(filters, now);
    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const rows = await this.productModel
      .aggregate([
        { $match: productMatch },
        {
          $lookup: {
            from: 'manufacturers',
            localField: 'manufacturerId',
            foreignField: '_id',
            as: 'manufacturer',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $sort: { createdDate: -1 } },
        { $limit: limit },
        {
          $project: {
            productId: 1,
            eoiNo: 1,
            productName: 1,
            productStatus: 1,
            validtillDate: 1,
            createdDate: 1,
            manufacturerName: {
              $ifNull: [
                { $arrayElemAt: ['$manufacturer.manufacturerName', 0] },
                { $arrayElemAt: ['$manufacturer.vendor_name', 0] },
              ],
            },
            categoryName: {
              $ifNull: [
                { $arrayElemAt: ['$category.categoryName', 0] },
                { $arrayElemAt: ['$category.category_name', 0] },
              ],
            },
          },
        },
      ])
      .exec();

    return rows.map((row) => {
      const statusInfo = this.mapApplicationStatus(
        Number(row.productStatus ?? 0),
        row.validtillDate as Date | null | undefined,
        now,
        thresholdDate,
      );
      return {
        productId: Number(row.productId ?? 0),
        eoiNo: String(row.eoiNo ?? ''),
        productName: String(row.productName ?? ''),
        manufacturerName: String(row.manufacturerName ?? 'Unknown'),
        categoryName: String(row.categoryName ?? 'Unknown'),
        date: row.createdDate
          ? new Date(row.createdDate as Date).toISOString().slice(0, 10)
          : '',
        status: statusInfo.key,
        statusLabel: statusInfo.label,
      };
    });
  }

  async getAlerts(filters: ResolvedDashboardFilters): Promise<DashboardAlertItem[]> {
    const now = new Date();
    const productMatch = buildProductSnapshotMatch(filters, now);
    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const expiringSoonMatch = {
      ...productMatch,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      validtillDate: {
        $exists: true,
        $ne: null,
        $gte: now,
        $lt: thresholdDate,
      },
    };

    const renewDueMatch = {
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

    const [expiringSoon, pendingApplications, rejectedProducts, renewalsDue] =
      await Promise.all([
        this.productModel.countDocuments(expiringSoonMatch).exec(),
        this.productModel
          .countDocuments({ ...productMatch, productStatus: { $in: [0, 1] } })
          .exec(),
        this.productModel
          .countDocuments({ ...productMatch, productStatus: 3 })
          .exec(),
        this.productModel
          .aggregate<{ count: number }>([
            { $match: renewDueMatch },
            { $group: { _id: '$urnNo' } },
            { $count: 'count' },
          ])
          .exec()
          .then((r) => r[0]?.count ?? 0),
      ]);

    const alerts: DashboardAlertItem[] = [];

    if (expiringSoon > 0) {
      alerts.push({
        key: 'certificationExpiringSoon',
        label: `${expiringSoon} certification${expiringSoon === 1 ? '' : 's'} expiring soon`,
        count: expiringSoon,
        severity: 'warning',
      });
    }
    if (pendingApplications > 0) {
      alerts.push({
        key: 'newApplicationsPending',
        label: `${pendingApplications} new application${pendingApplications === 1 ? '' : 's'} pending`,
        count: pendingApplications,
        severity: 'info',
      });
    }
    if (rejectedProducts > 0) {
      alerts.push({
        key: 'rejectedProducts',
        label: `${rejectedProducts} rejected product${rejectedProducts === 1 ? '' : 's'} on record`,
        count: rejectedProducts,
        severity: 'danger',
      });
    }
    if (renewalsDue > 0) {
      alerts.push({
        key: 'renewalsDue',
        label: `${renewalsDue} renewal${renewalsDue === 1 ? '' : 's'} due`,
        count: renewalsDue,
        severity: 'success',
      });
    }

    return alerts;
  }

  private buildPaymentStatusItem(
    key: 'paid' | 'pending',
    label: string,
    count: number,
    total: number,
  ) {
    const percent =
      total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
    return { key, label, count, percent };
  }

  private buildPaymentVendorScope(
    filters: ResolvedDashboardFilters,
  ): Record<string, unknown> {
    if (!filters.manufacturerIdsForRegion?.length) {
      return {};
    }
    return { vendorId: { $in: filters.manufacturerIdsForRegion } };
  }

  private async loadManufacturerNameMap(
    vendorIds: Array<Types.ObjectId | undefined | null>,
  ): Promise<
    Map<
      string,
      { manufacturerName?: string; vendor_name?: string }
    >
  > {
    const ids = [
      ...new Set(
        vendorIds
          .map((id) => id?.toString())
          .filter((id): id is string => !!id && Types.ObjectId.isValid(id)),
      ),
    ].map((id) => new Types.ObjectId(id));

    if (!ids.length) {
      return new Map();
    }

    const rows = await this.manufacturerModel
      .find({ _id: { $in: ids } })
      .select('manufacturerName vendor_name')
      .lean()
      .exec();

    return new Map(
      rows.map((row) => [
        String(row._id),
        {
          manufacturerName: row.manufacturerName,
          vendor_name: row.vendor_name,
        },
      ]),
    );
  }

  private formatPaymentType(value?: string | null): string {
    const key = String(value ?? '').trim().toLowerCase();
    if (key === 'certification') return 'Certification';
    if (key === 'renew' || key === 'renewal') return 'Renewal';
    if (key === 'registration') return 'Registration';
    return key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Payment';
  }

  private formatPaymentMode(value?: string | null): string {
    const key = String(value ?? '').trim().toLowerCase();
    if (key === 'online') return 'UPI';
    if (key === 'cheque_or_dd') return 'Cheque';
    if (key === 'neft_or_rtgs') return 'Bank Transfer';
    return key || 'Other';
  }

  private mapApplicationStatus(
    productStatus: number,
    validtillDate: Date | null | undefined,
    now: Date,
    thresholdDate: Date,
  ): { key: string; label: string } {
    if (productStatus === 3) {
      return { key: 'rejected', label: 'Rejected' };
    }
    if (productStatus === 2 && validtillDate) {
      const expiry = new Date(validtillDate);
      if (expiry >= now && expiry < thresholdDate) {
        return { key: 'expiring_soon', label: 'Expiring Soon' };
      }
      if (expiry < now) {
        return { key: 'expired', label: 'Expired' };
      }
      return { key: 'certified', label: 'Certified' };
    }
    if (productStatus === 2) {
      return { key: 'certified', label: 'Certified' };
    }
    if (productStatus === 1) {
      return { key: 'submitted', label: 'Submitted' };
    }
    return { key: 'pending', label: 'Pending' };
  }
}
