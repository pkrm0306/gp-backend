import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { ProcessRenewCommentsService } from './process-renew-comments.service';
import { AdminRenewProcessCommentsDto } from './dto/admin-renew-process-comments.dto';

@ApiTags('Renew - Admin Process Comments')
/**
 * Canonical: `/renew/admin/process-comments`.
 * Alias `/admin/renew/admin/process-comments` for direct Nest calls from admin UI.
 */
@Controller(['renew/admin/process-comments', 'admin/renew/admin/process-comments'])
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminRenewProcessCommentsController {
  constructor(
    private readonly processRenewCommentsService: ProcessRenewCommentsService,
  ) {}

  @Post()
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({
    summary: 'Admin — upsert renewal process comment for one section',
    description:
      'No vendor URN ownership check. Does not apply cert urn_status edit gate. Stores in process_renew_comments.',
  })
  async upsert(@Body() body: AdminRenewProcessCommentsDto) {
    const data = await this.processRenewCommentsService.adminUpsertSection(body);
    return {
      success: true,
      message: 'Renew process comments saved successfully',
      data,
    };
  }

  @Get(':urnNo')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({ summary: 'Admin — get renewal process comments for a URN + cycle' })
  @ApiParam({ name: 'urnNo', type: String })
  @ApiQuery({ name: 'renewalCycleId', required: true, type: String })
  async getByUrn(
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    if (!renewalCycleId?.trim()) {
      throw new BadRequestException('renewalCycleId is required');
    }
    const data = await this.processRenewCommentsService.adminGetCommentsPayload(
      urnNo.trim(),
      renewalCycleId.trim(),
    );
    return {
      success: true,
      message: 'Renew process comments fetched successfully',
      data,
    };
  }
}
