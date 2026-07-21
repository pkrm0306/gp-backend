import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @AnyPermissions(PERMISSIONS.DASHBOARD_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unified GA4 dashboard analytics',
    description:
      'Queries Google Analytics Data API for website and authentication properties ' +
      'concurrently. If one property fails, the other is still returned (value null for the failed source).',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved (may be partial)',
  })
  async getDashboard() {
    const data = await this.analyticsService.getDashboardAnalytics();
    return {
      success: true,
      data,
    };
  }
}
