import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Activity Log')
@Controller('activity-log')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create activity log entry',
    description:
      'Common endpoint to persist one activity log row. Server-side code can instead inject `ActivityLogService.logActivity()` directly.',
  })
  @ApiBody({ type: CreateActivityLogDto })
  @ApiResponse({ status: 201, description: 'Activity log created' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid ObjectId',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Failed to save activity log' })
  async createActivityLog(@Body() dto: CreateActivityLogDto) {
    const saved = await this.activityLogService.logActivity({
      vendor_id: dto.vendor_id,
      manufacturer_id: dto.manufacturer_id,
      urn_no: dto.urn_no.trim(),
      activities_id: dto.activities_id,
      activity: dto.activity,
      activity_status: dto.activity_status,
      sub_activities_id: dto.sub_activities_id,
      responsibility: dto.responsibility,
      next_responsibility: dto.next_responsibility,
      next_acitivities_id: dto.next_acitivities_id,
      next_activity: dto.next_activity,
      status: dto.status,
    });
    return {
      message: 'Activity logged successfully',
      data: saved.toObject(),
    };
  }

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
              activity: { type: 'string', example: 'Registration Payment' },
              activity_status: { type: 'number', example: 1 },
              sub_activities_id: { type: 'number' },
              responsibility: { type: 'string', example: 'Vendor' },
              next_responsibility: { type: 'string', example: 'Admin' },
              next_acitivities_id: { type: 'number', example: 2 },
              next_activity: {
                type: 'string',
                example: 'Approve Registration Fee',
              },
              status: { type: 'number', example: 1 },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid URN number' })
  async getActivityLogsByUrn(@Param('urn_no') urnNo: string) {
    try {
      if (!urnNo || urnNo.trim() === '') {
        throw new BadRequestException('URN number is required');
      }

      const data = await this.activityLogService.getActivityLogsByUrn(
        urnNo.trim(),
      );

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
