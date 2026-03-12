import {
  Controller,
  Get,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Activity Log')
@Controller('activity-log')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get(':urn_no')
  @ApiOperation({
    summary: 'Get activity logs by URN',
    description:
      'Returns all activity logs for a specific URN, sorted by created_at ascending for timeline display.',
  })
  @ApiParam({
    name: 'urn_no',
    description: 'URN number',
    example: 'URN-20240302120000',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Activity logs retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              vendor_id: { type: 'string' },
              manufacturer_id: { type: 'string' },
              urn_no: { type: 'string', example: 'URN-20240302120000' },
              activities_id: { type: 'number', example: 1 },
              activity: { type: 'string', example: 'Registration Payment Pending' },
              activity_status: { type: 'number', example: 1 },
              sub_activities_id: { type: 'number' },
              responsibility: { type: 'string', example: 'Vendor' },
              next_responsibility: { type: 'string', example: 'Admin' },
              next_acitivities_id: { type: 'number', example: 2 },
              next_activity: { type: 'string', example: 'Approve Registration Pending' },
              status: { type: 'number', example: 1 },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid URN number' })
  async getActivityLogsByUrn(@Param('urn_no') urnNo: string) {
    try {
      if (!urnNo || urnNo.trim() === '') {
        throw new BadRequestException('URN number is required');
      }

      const data = await this.activityLogService.getActivityLogsByUrn(urnNo.trim());

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
