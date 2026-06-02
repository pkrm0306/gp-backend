import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { AnyPermissions } from '../../common/decorators/any-permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { DashboardMetricsQueryDto } from '../dto/dashboard-metrics-query.dto';
import { AdminService } from '../admin.service';
import { AdminDashboardStatsService } from './admin-dashboard-stats.service';

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
  ) {}

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
    const [products, charts] = await Promise.all([
      this.dashboardStats.getProductWidgetStats(filters),
      this.dashboardStats.getTrendCharts(filters, filters.granularity),
    ]);

    return {
      message: 'Dashboard stats retrieved successfully',
      data: {
        appliedFilters,
        products,
        charts,
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
