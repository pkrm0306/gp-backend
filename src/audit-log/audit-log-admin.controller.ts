import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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

@ApiTags('Admin Audit Log')
@Controller('admin/audit-log')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'staff')
@ApiBearerAuth()
export class AuditLogAdminController {
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
    const data = result.items.map((doc) => {
      const row = doc as unknown as Record<string, unknown>;
      const pb = row['performed_by'] as
        | { name?: string; email?: string; user_id?: string }
        | undefined;
      const actor = row['actor'] as { user_id?: string } | undefined;
      return {
        ...row,
        new_values:
          (row['new_values'] as Record<string, unknown> | undefined) ?? null,
        user_display:
          pb?.name || pb?.email || pb?.user_id || actor?.user_id || null,
        action_display: (row['action_type'] as string | undefined) ?? null,
      };
    });
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
    return {
      success: true,
      message: 'Audit log retrieved',
      data,
      pagination,
      meta,
      totalCount: pagination.totalCount,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
    };
  }
}
