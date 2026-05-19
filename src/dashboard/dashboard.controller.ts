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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ListVendorApplicationsQueryDto } from './dto/list-vendor-applications-query.dto';

@ApiTags('Vendor Dashboard')
@Controller('vendor/dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

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
    if (!user || !user.vendorId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }

    return this.dashboardService.getDashboardData(user.vendorId, urn);
  }

  @Get('applications-and-urns')
  @ApiOperation({
    summary: 'Applications & URNs table (vendor dashboard)',
    description:
      'Products/EOIs for **one URN only** (not every URN in the account). Pass **urn** to fix the batch; omit **urn** to use the latest URN (same rule as GET /vendor/dashboard **progressTracking**). ' +
      'Optional **search** filters EOI/product name within that URN. Response includes **urn_no** and **urn_status** for the active batch.',
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
    @CurrentUser() user: { vendorId?: string },
    @Query() query: ListVendorApplicationsQueryDto,
  ) {
    if (!user?.vendorId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }
    return this.dashboardService.listApplicationsAndUrns(user.vendorId, query);
  }
}
