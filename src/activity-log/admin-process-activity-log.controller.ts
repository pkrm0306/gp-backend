import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import { PRODUCTS_VIEW_ANY } from '../common/constants/permissions.constants';
import { ActivityLogService } from './activity-log.service';

/**
 * Admin portal env: `NEXT_PUBLIC_ACTIVITY_LOG_GET_BY_URN_PATH=/admin/process/{urn}/activity-log`
 * Vendor/general API: `GET /activity-log/{urn_no}`
 */
@ApiTags('Admin Process Activity Log')
@Controller('admin/process')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminProcessActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get(':urn/activity-log')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'Get activity logs by URN (platform admin, REST path)',
    description:
      'Alias for **GET /activity-log/:urn_no** — timeline rows for certification workflow.',
  })
  @ApiParam({
    name: 'urn',
    description: 'Full URN (e.g. URN-20260428051158)',
    example: 'URN-20260428051158',
  })
  @ApiResponse({ status: 200, description: 'Activity logs retrieved' })
  @ApiResponse({ status: 400, description: 'URN missing' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getActivityLogsByUrn(@Param('urn') urn: string) {
    const urnNo = decodeURIComponent(String(urn ?? '')).trim();
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }

    const data = await this.activityLogService.getActivityLogsByUrn(urnNo);
    return { success: true, data };
  }
}
