import {
  Controller,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
      'Retrieves comprehensive dashboard data including product counts, payment information, partners, events, and latest URN/EOI records',
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
  async getDashboard(@CurrentUser() user: any) {
    if (!user || !user.vendorId) {
      throw new UnauthorizedException('Unauthorized. Please login.');
    }

    return this.dashboardService.getDashboardData(user.vendorId);
  }
}
