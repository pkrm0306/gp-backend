import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { AdminListAccountDeletionQueryDto } from './dto/admin-list-account-deletion-query.dto';
import { ReviewAccountDeletionRequestDto } from './dto/review-account-deletion-request.dto';
import { AccountDeletionService } from './account-deletion.service';

@ApiTags('Admin Account Deletion')
@Controller('api/admin/account-deletion-requests')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminAccountDeletionController {
  constructor(
    private readonly accountDeletionService: AccountDeletionService,
  ) {}

  private requireAdminUserId(user: {
    userId?: string;
    id?: string;
  }): string {
    const userId = user?.userId || user?.id;
    if (!userId) {
      throw new BadRequestException('Admin user ID not found in token');
    }
    return String(userId);
  }

  @Get()
  @Permissions(PERMISSIONS.ACCOUNT_DELETION_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List account deletion requests (admin)',
    description:
      'Supports pagination, search, status, reason, and createdAt date range.',
  })
  async findAll(@Query() query: AdminListAccountDeletionQueryDto) {
    const result = await this.accountDeletionService.findAllForAdmin(query);
    return {
      message: 'Account deletion requests retrieved successfully',
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get(':id')
  @Permissions(PERMISSIONS.ACCOUNT_DELETION_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get account deletion request by id (admin)' })
  @ApiParam({ name: 'id', description: 'Request MongoDB ObjectId' })
  async findOne(@Param('id') id: string) {
    const data = await this.accountDeletionService.findOneForAdmin(id);
    return {
      message: 'Account deletion request retrieved successfully',
      data,
    };
  }

  @Patch(':id/review')
  @Permissions(PERMISSIONS.ACCOUNT_DELETION_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve, reject, or complete an account deletion request',
    description:
      'Manages the deletion request workflow only. Does not permanently delete the vendor account.',
  })
  @ApiParam({ name: 'id', description: 'Request MongoDB ObjectId' })
  @ApiBody({ type: ReviewAccountDeletionRequestDto })
  async review(
    @CurrentUser() user: { userId?: string; id?: string },
    @Param('id') id: string,
    @Body() dto: ReviewAccountDeletionRequestDto,
  ) {
    const adminUserId = this.requireAdminUserId(user);
    const data = await this.accountDeletionService.reviewForAdmin(
      id,
      dto,
      adminUserId,
    );
    return {
      message: 'Account deletion request updated successfully',
      data,
    };
  }
}
