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
import { AdminListGrievancesQueryDto } from './dto/admin-list-grievances-query.dto';
import { RespondGrievanceDto } from './dto/respond-grievance.dto';
import { GrievancesService } from './grievances.service';

@ApiTags('Admin Grievances')
@Controller('api/admin/grievances')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminGrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

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
  @Permissions(PERMISSIONS.GRIEVANCES_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all grievances (admin)',
    description:
      'Supports pagination, search, status, category, and createdAt date range (from/to).',
  })
  @ApiResponse({ status: 200, description: 'Grievances retrieved successfully' })
  async findAll(@Query() query: AdminListGrievancesQueryDto) {
    const result = await this.grievancesService.findAllForAdmin(query);
    return {
      message: 'Grievances retrieved successfully',
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
  @Permissions(PERMISSIONS.GRIEVANCES_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get grievance by id (admin)' })
  @ApiParam({ name: 'id', description: 'Grievance MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Grievance retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Grievance not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.grievancesService.findOneForAdmin(id);
    return {
      message: 'Grievance retrieved successfully',
      data,
    };
  }

  @Patch(':id/respond')
  @Permissions(PERMISSIONS.GRIEVANCES_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Respond to a grievance (admin)',
    description:
      'Saves adminResponse, respondedBy, respondedAt, and status (Responded or Closed).',
  })
  @ApiParam({ name: 'id', description: 'Grievance MongoDB ObjectId' })
  @ApiBody({ type: RespondGrievanceDto })
  @ApiResponse({ status: 200, description: 'Grievance response saved' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 409,
    description: 'Grievance is closed and cannot be modified',
  })
  @ApiResponse({ status: 404, description: 'Grievance not found' })
  async respond(
    @CurrentUser() user: { userId?: string; id?: string },
    @Param('id') id: string,
    @Body() dto: RespondGrievanceDto,
  ) {
    const adminUserId = this.requireAdminUserId(user);
    const data = await this.grievancesService.respondForAdmin(
      id,
      dto,
      adminUserId,
    );
    return {
      message: 'Grievance response saved successfully',
      data,
    };
  }
}
