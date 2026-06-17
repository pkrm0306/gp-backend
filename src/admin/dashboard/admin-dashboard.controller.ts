import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { AnyPermissions } from '../../common/decorators/any-permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { DashboardMetricsQueryDto } from '../dto/dashboard-metrics-query.dto';
import { AdminService } from '../admin.service';
import { AdminDashboardStatsService } from './admin-dashboard-stats.service';
import { AdminDashboardKpiService } from './admin-dashboard-kpi.service';
import { AdminDashboardWidgetsService } from './admin-dashboard-widgets.service';
import { AdminDashboardCertificationTimingService } from './admin-dashboard-certification-timing.service';
import { AdminDashboardSustainabilityService } from './admin-dashboard-sustainability.service';
import { AdminDashboardVisitorAnalyticsService } from './admin-dashboard-visitor-analytics.service';

/**
 * Dedicated admin dashboard analytics routes (product counts, pipeline, categories).
 * Counts use **active** products and match the admin Products list — not filtered by period/year.
 */
@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminDashboardController {
  constructor(
    private readonly adminService: AdminService,
    private readonly dashboardStats: AdminDashboardStatsService,
    private readonly dashboardKpi: AdminDashboardKpiService,
    private readonly dashboardWidgets: AdminDashboardWidgetsService,
    private readonly certificationTiming: AdminDashboardCertificationTimingService,
    private readonly sustainability: AdminDashboardSustainabilityService,
    private readonly visitorAnalytics: AdminDashboardVisitorAnalyticsService,
  ) {}

  @Get('overview')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Full admin dashboard overview (KPIs + widgets + charts)',
    description:
      'Single payload for the dashboard home page: KPI cards, payment status (paid/pending only), ' +
      'recent payments, recent applications, alerts, and chart data.',
  })
  async getDashboardOverview(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const data = await this.dashboardWidgets.getOverview(filters, {
      recentLimit: 5,
    });
    return {
      message: 'Dashboard overview retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        ...data,
      },
    };
  }

  @Get('payment-status')
  @AnyPermissions(PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.PAYMENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Payment status widget (paid and pending only)',
    description:
      'Returns paid (`paymentStatus` 2) and pending (`paymentStatus` 1) counts with percentages. ' +
      'Does not include created, cancelled, or overdue buckets.',
  })
  async getPaymentStatus(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const paymentStatus = await this.dashboardWidgets.getPaymentStatus(filters);
    return {
      message: 'Payment status retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        ...paymentStatus,
      },
    };
  }

  @Get('recent-payments')
  @AnyPermissions(PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.PAYMENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recent paid/pending payments for dashboard list',
    description: 'Latest payments with status paid or pending only (default limit 5).',
  })
  async getRecentPayments(
    @Query() query: DashboardMetricsQueryDto,
    @Query('limit') limit?: string,
  ) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const parsedLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
    const items = await this.dashboardWidgets.getRecentPayments(
      filters,
      parsedLimit,
    );
    return {
      message: 'Recent payments retrieved successfully',
      data: { items, limit: parsedLimit },
    };
  }

  @Get('recent-applications')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recent product applications for dashboard list',
    description: 'Latest EOIs/products with status labels (default limit 5).',
  })
  async getRecentApplications(
    @Query() query: DashboardMetricsQueryDto,
    @Query('limit') limit?: string,
  ) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const parsedLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
    const items = await this.dashboardWidgets.getRecentApplications(
      filters,
      parsedLimit,
    );
    return {
      message: 'Recent applications retrieved successfully',
      data: { items, limit: parsedLimit },
    };
  }

  @Get('alerts')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dashboard alerts and action items',
    description:
      'Counts for expiring certifications, pending applications, rejected products, and renewals due.',
  })
  async getDashboardAlerts(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const alerts = await this.dashboardWidgets.getAlerts(filters);
    return {
      message: 'Dashboard alerts retrieved successfully',
      data: { alerts },
    };
  }

  @Get('kpi-cards')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dashboard home KPI card counts + certification timing widgets',
    description:
      'Returns the eight dashboard stat cards plus certification timing analytics ' +
      '(Time at Stage bar chart + Avg. Time to Certification). ' +
      'Counts use the current platform snapshot (not limited by period/year). Optional `categoryId` and `region` apply.',
  })
  @ApiResponse({ status: 200, description: 'KPI card counts retrieved' })
  async getKpiCards(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const bundle = await this.dashboardKpi.getKpiBundle(filters);
    return {
      message: 'Dashboard KPI cards retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        cards: bundle.cards,
        certificationTiming: bundle.certificationTiming,
      },
    };
  }

  @Get('certification-timing')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Certification timing widgets (Time at Stage + Avg. Time to Certification)',
    description:
      'Computes average days per certification stage from `activity_log` milestones on certified URNs. ' +
      'Includes end-to-end average days and Technical / Audit / Review breakdown. ' +
      'Optional `categoryId` and `region` filters apply.',
  })
  async getCertificationTiming(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const certificationTiming =
      await this.certificationTiming.getCertificationTiming(filters);
    return {
      message: 'Certification timing analytics retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        ...certificationTiming,
      },
    };
  }

  @Get('visitor-analytics')
  @AnyPermissions(PERMISSIONS.DASHBOARD_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Visitor Analytics multi-line chart (page views, visitors, sign-ups)',
    description:
      'Returns monthly platform engagement from website contact forms, newsletter sign-ups, ' +
      'manufacturer inquiries, and vendor registrations. Page views are engagement-weighted estimates ' +
      'until dedicated analytics tracking is added. Optional `period`, `year`, `month`, `granularity`.',
  })
  async getVisitorAnalytics(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const visitorAnalytics =
      await this.visitorAnalytics.getVisitorAnalytics(filters);
    return {
      message: 'Visitor analytics retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        ...visitorAnalytics,
      },
    };
  }

  @Get('sustainability-contributions')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sustainability Contributions progress widget',
    description:
      'Returns Energy Saved, Water Saved, Recyclability, and Carbon Offset percentages ' +
      'aggregated from certified product process forms (energy/water reductions, recycled content, ' +
      'renewable materials). Optional `categoryId` and `region` filters apply.',
  })
  async getSustainabilityContributions(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const sustainabilityContributions =
      await this.sustainability.getSustainabilityContributions(filters);
    return {
      message: 'Sustainability contributions retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        ...sustainabilityContributions,
      },
    };
  }

  @Get('rejection-trend')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rejection trend area chart (monthly rejected product volume)',
    description:
      'Returns time-bucketed counts of rejected products (`productStatus: 3`) for the dashboard ' +
      'Rejection Trend widget. Buckets by `rejectedAt` (fallback `updatedDate`). ' +
      'Respects `period`, `year`, `month`, `granularity`, `categoryId`, and `region` filters.',
  })
  async getRejectionTrend(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const rejectionTrend = await this.dashboardStats.getRejectionTrend(filters);
    return {
      message: 'Rejection trend retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        ...rejectionTrend,
      },
    };
  }

  @Get('stats')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'All dashboard widget stats (accurate product counts)',
    description:
      'Returns product status breakdown, certified vs uncertified, URN pipeline, category certified counts, ' +
      'and trend charts. **Product counts ignore period/year** (current platform snapshot). ' +
      'Optional `categoryId`, `region`, `productStatus` still apply. Revenue included when caller has payments permission.',
  })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
  async getDashboardStats(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const appliedFilters = this.dashboardStats.buildAppliedFilters(query, filters);
    const [products, charts, rejectionTrend] = await Promise.all([
      this.dashboardStats.getProductWidgetStats(filters),
      this.dashboardStats.getTrendCharts(filters, filters.granularity),
      this.dashboardStats.getRejectionTrend(filters),
    ]);

    return {
      message: 'Dashboard stats retrieved successfully',
      data: {
        appliedFilters,
        products,
        charts,
        rejectionTrend,
      },
    };
  }

  @Get('products/summary')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Product counts for dashboard widgets',
    description:
      'Certified, uncertified, expired, renewed, URN pipeline, and per-category certified counts. ' +
      'Matches admin Products list totals (active products only).',
  })
  async getProductSummary(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const products = await this.dashboardStats.getProductWidgetStats(filters);
    return {
      message: 'Dashboard product summary retrieved successfully',
      data: {
        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
        ...products,
      },
    };
  }

  @Get('revenue')
  @AnyPermissions(PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.PAYMENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revenue analytics widgets (donut + weekly comparison)',
    description:
      'Reads from `payment_details` (same as Payment History). ' +
      'Donut centre: `distribution.totalRevenue`. Segments: Registration Fee, Certificate Fee, Renew Payment with amount + percentage. ' +
      'Line chart: `weeklyComparison` (W1–W5, current vs previous period). ' +
      'Filters: `period=this_week|this_month|this_year|last_month|last_week|last_year` (aliases: week, month, year, last_month).',
  })
  async getRevenueWidgets(@Query() query: DashboardMetricsQueryDto) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const data = await this.adminService.getRevenueAnalyticsForUser({
      filters,
      query,
    });
    return {
      message: 'Revenue analytics retrieved successfully',
      data,
    };
  }
}
