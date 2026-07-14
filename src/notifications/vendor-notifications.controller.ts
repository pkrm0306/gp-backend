import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ListVendorNotificationsQueryDto } from './dto/list-vendor-notifications-query.dto';
import { UserNotificationsService } from './user-notifications.service';

@ApiTags('Vendor Notifications')
@Controller('api/vendor/notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorNotificationsController {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List vendor in-app notifications',
    description:
      'Vendor bell feed (`user_notifications` collection) scoped to the authenticated user. Optional time-range: all, today, week, 30d, 90d.',
  })
  @ApiQuery({
    name: 'range',
    required: false,
    enum: ['all', 'today', 'week', '30d', '90d'],
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'seen',
    required: false,
    type: Boolean,
    description: 'Optional: true = read only, false = unread only',
  })
  @ApiResponse({
    status: 200,
    description:
      'Notifications list with pagination and root unreadCount (unread within range filter)',
  })
  async list(
    @CurrentUser() user: { userId: string },
    @Query() query: ListVendorNotificationsQueryDto,
  ) {
    const result = await this.userNotificationsService.listForUser(
      user.userId,
      query,
    );
    return {
      message: 'Notifications retrieved successfully',
      data: result.data,
      totalCount: result.totalCount,
      unreadCount: result.unreadCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  @Patch('seen-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all vendor notifications as seen' })
  @ApiResponse({ status: 200, description: 'All notifications marked as seen' })
  async markAllSeen(@CurrentUser() user: { userId: string }) {
    const result = await this.userNotificationsService.markAllSeen(user.userId);
    return {
      message: 'All notifications marked as seen',
      success: result.success,
      markedCount: result.markedCount,
    };
  }

  @Patch(':id/seen')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark one vendor notification as seen',
    description: '`id` = MongoDB `_id` of the `user_notifications` row.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Notification marked as seen' })
  async markSeen(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    const result = await this.userNotificationsService.markSeen(
      user.userId,
      id,
    );
    return {
      message: 'Notification marked as seen',
      success: result.success,
      id: result.id,
      seen: result.seen,
    };
  }
}
