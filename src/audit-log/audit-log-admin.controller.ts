import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuditLogService } from './audit-log.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import {
  assertJsonSafe,
  toAuditLogResponseDto,
} from './dto/audit-log-response.dto';
import { Types } from 'mongoose';

@ApiTags('Admin Audit Log')
@Controller('admin/audit-log')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'staff')
@ApiBearerAuth()
export class AuditLogAdminController {
  private readonly logger = new Logger(AuditLogAdminController.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({
    summary: 'List audit log entries (admin)',
    description:
      'Append-only audit trail. Each row includes user-facing **module**, **action_type**, **description**, **performed_by**, and technical fields (**route**, **http_method**, **request.ip**, **status_code**). ' +
      'By default this endpoint returns the latest one month of data with pagination. ' +
      'For admin grids: **occurred_at** | **user_display** | **module** | **action_type** | **description** | **new_values** | **request.ip**.',
  })
  @ApiResponse({ status: 200, description: 'Paginated audit entries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async list(@Query() query: QueryAuditLogDto) {
    const result = await this.auditLogService.list(query);
    const data = result.items.map((doc) =>
      toAuditLogResponseDto(doc as unknown as Record<string, unknown>),
    );
    const pagination = {
      totalCount: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.pages,
    };
    const meta = {
      ...pagination,
      from: result.from.toISOString(),
      to: result.to.toISOString(),
    };
    return assertJsonSafe({
      success: true,
      message: 'Audit log retrieved',
      data,
      pagination,
      meta,
      totalCount: pagination.totalCount,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
    });
  }

  @Get('filters')
  @ApiOperation({
    summary: 'Get active audit filter options (admin)',
    description:
      'Returns filter options derived from audit rows in the selected date range. Modules are active-only, so unused module buckets are omitted.',
  })
  @ApiResponse({ status: 200, description: 'Audit filter options' })
  async filters(@Query() query: QueryAuditLogDto) {
    const result = await this.auditLogService.filterOptions(query);
    return assertJsonSafe({
      success: true,
      message: 'Audit filter options retrieved',
      data: {
        modules: result.modules,
        action_types: result.action_types,
        actions: result.actions,
        users: result.users,
      },
      pagination: result.pagination,
      meta: {
        ...result.pagination,
        from: result.from.toISOString(),
        to: result.to.toISOString(),
      },
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get audit log entry details (admin)',
    description:
      'Returns a single append-only audit record with JSON-safe old_values/new_values. Missing snapshots are returned as null.',
  })
  @ApiResponse({ status: 200, description: 'Audit entry details' })
  @ApiResponse({ status: 400, description: 'Invalid audit log id' })
  @ApiResponse({ status: 404, description: 'Audit entry not found' })
  async detail(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`Invalid audit detail id requested: ${id}`);
      throw new BadRequestException('Invalid audit log id');
    }

    try {
      const doc = await this.auditLogService.findById(id);
      if (!doc) {
        this.logger.warn(`Audit detail not found: ${id}`);
        throw new NotFoundException('Audit log entry not found');
      }

      return assertJsonSafe({
        success: true,
        message: 'Audit log detail retrieved',
        data: toAuditLogResponseDto(doc as unknown as Record<string, unknown>),
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to retrieve audit detail ${id}: ${message}`);
      throw new InternalServerErrorException(
        'Audit log detail could not be retrieved',
      );
    }
  }
}
