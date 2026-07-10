import {
  Controller,
  Get,
  Query,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { VendorDashboardOverviewService } from './vendor-dashboard-overview.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ListVendorApplicationsQueryDto } from './dto/list-vendor-applications-query.dto';

@ApiTags('Vendor Dashboard')
@Controller('api/vendor/dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly dashboardOverview: VendorDashboardOverviewService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get vendor dashboard statistics',
    description:
      'Retrieves dashboard data for the **vendor panel only**: product counts, payments, partners, events, latest URN/EOI, and **progressTracking** (dynamic URN lifecycle stepper, timeline, latest/next step cards from activity_log + products.urnStatus). ' +
      'Optional query **urn** tracks a specific certification URN; otherwise the latest URN is used.',
  })
  @ApiQuery({
    name: 'urn',
    required: false,
    description: 'Optional URN to scope progress tracking (defaults to latest URN)',
    example: 'URN-20260305124230',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            products: {
              type: 'object',
              properties: {
                product_count: { type: 'number', example: 25 },
              },
            },
            certifiedProducts: {
              type: 'object',
              properties: {
                certified_product_count: { type: 'number', example: 10 },
              },
            },
            paymentPendingAmount: {
              type: 'object',
              properties: {
                payment_pending_amount: {
                  type: 'number',
                  nullable: true,
                  example: 50000,
                },
              },
            },
            partners: {
              type: 'object',
              properties: {
                partner_count: { type: 'number', example: 5 },
              },
            },
            upcomingEventsCount: {
              type: 'object',
              properties: {
                upcoming_events_count: { type: 'number', example: 3 },
              },
            },
            latestUrn: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  urn_no: { type: 'string', example: 'URN-20260305124230' },
                  urn_status: { type: 'number', example: 2 },
                  product_status: { type: 'number', example: 1 },
                },
              },
            },
            latestEoi: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  eoi_no: { type: 'string', example: 'EOI-20260305124230' },
                  product_name: {
                    type: 'string',
                    example: 'Green Product XYZ',
                  },
                  product_status: { type: 'number', example: 1 },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Please login.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Unauthorized. Please login.' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Please enter your account details to access all options!',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Please enter your account details to access all options!',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  async getDashboard(
    @CurrentUser() user: any,
    @Query('urn') urn?: string,
  ) {
    if (!user?.userId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }

    const manufacturerId = user.vendorId || user.manufacturerId;
    return this.dashboardService.getDashboardData(
      user.userId,
      manufacturerId,
      urn,
    );
  }

  @Get('product-outcomes-chart')
  @ApiOperation({
    summary: 'Yearly product outcomes bar chart',
    description:
      'Monthly counts of registered, certified, and rejected products for the selected year. ' +
      'Pass **year** to filter (defaults to the current year).',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    example: 2026,
  })
  @ApiResponse({ status: 200, description: 'Product outcomes chart data retrieved' })
  async getProductOutcomesChart(
    @CurrentUser()
    user: {
      userId?: string;
      vendorId?: string;
      manufacturerId?: string;
    },
    @Query('year') year?: string,
  ) {
    if (!user?.userId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }

    const vendorObjectId =
      await this.dashboardService.resolveVendorObjectIdForOverview(
        user.userId,
        user.vendorId || user.manufacturerId,
      );

    const parsedYear = year != null && String(year).trim() !== '' ? Number(year) : undefined;
    const data = await this.dashboardOverview.getProductOutcomesChart(
      vendorObjectId,
      Number.isFinite(parsedYear) ? parsedYear : undefined,
    );

    return {
      message: 'Product outcomes chart retrieved successfully',
      data,
    };
  }

  @Get('overview')
  @ApiOperation({
    summary: 'Vendor dashboard overview (KPIs, charts, recent EOIs, activity)',
    description:
      'Single payload for the vendor panel home page: six KPI cards with trend %, ' +
      'registration vs certification trend, product status donut, products by category bar chart, ' +
      'recent EOIs table, and recent activity feed (last 7 days). Scoped to the authenticated vendor.',
  })
  @ApiResponse({ status: 200, description: 'Vendor dashboard overview retrieved' })
  async getDashboardOverview(
    @CurrentUser()
    user: {
      userId?: string;
      vendorId?: string;
      manufacturerId?: string;
    },
  ) {
    if (!user?.userId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }

    const vendorObjectId =
      await this.dashboardService.resolveVendorObjectIdForOverview(
        user.userId,
        user.vendorId || user.manufacturerId,
      );

    const data = await this.dashboardOverview.getOverview(vendorObjectId);
    return {
      message: 'Vendor dashboard overview retrieved successfully',
      data,
    };
  }

  @Get('applications-and-urns')
  @ApiOperation({
    summary: 'Applications & URNs table (vendor dashboard)',
    description:
      'Products/EOIs for the vendor dashboard table. Pass **urn** to scope to one batch; omit **urn** to return products across **all** URN batches. ' +
      'Optional **search** filters EOI, product name, or URN within the current scope.',
  })
  @ApiQuery({
    name: 'urn',
    required: false,
    description: 'URN batch to show (defaults to latest URN for this vendor)',
    example: 'URN-20260305124230',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Partial match on EOI or product name (within the scoped URN)',
    example: 'GPPPK',
  })
  @ApiResponse({
    status: 200,
    description: 'Table rows with pagination',
  })
  async listApplicationsAndUrns(
    @CurrentUser()
    user: { userId?: string; vendorId?: string; manufacturerId?: string },
    @Query() query: ListVendorApplicationsQueryDto,
  ) {
    if (!user?.userId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }
    const manufacturerId = user.vendorId || user.manufacturerId;
    return this.dashboardService.listApplicationsAndUrns(
      user.userId,
      manufacturerId,
      query,
    );
  }

  @Get('urn-progress')
  @ApiOperation({
    summary: 'Certification progress for all URN batches',
    description:
      'Returns progressTracking for every distinct URN batch in one payload. Used by the dashboard journey carousel when no URN filter is selected.',
  })
  @ApiResponse({
    status: 200,
    description: 'URN progress list retrieved',
  })
  async listAllUrnProgress(
    @CurrentUser()
    user: { userId?: string; vendorId?: string; manufacturerId?: string },
  ) {
    if (!user?.userId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }
    const manufacturerId = user.vendorId || user.manufacturerId;
    const { urns, progress } =
      await this.dashboardService.listAllUrnProgressTracking(
        user.userId,
        manufacturerId,
      );
    return {
      message: 'Vendor URN progress retrieved successfully',
      data: { urns, progress },
    };
  }

  @Get('urns')
  @ApiOperation({
    summary: 'List vendor URN batches (dashboard selector)',
    description:
      'Returns all distinct certification URNs for the authenticated vendor, newest first. Used by the dashboard global URN selector.',
  })
  @ApiResponse({
    status: 200,
    description: 'URN list retrieved',
  })
  async listVendorUrns(
    @CurrentUser()
    user: { userId?: string; vendorId?: string; manufacturerId?: string },
  ) {
    if (!user?.userId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }
    const manufacturerId = user.vendorId || user.manufacturerId;
    const urns = await this.dashboardService.listVendorUrns(
      user.userId,
      manufacturerId,
    );
    return {
      message: 'Vendor URNs retrieved successfully',
      data: { urns },
    };
  }
}
