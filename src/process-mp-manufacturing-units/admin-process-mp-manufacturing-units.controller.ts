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
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { ProcessMpManufacturingUnitsService } from './process-mp-manufacturing-units.service';

/**
 * Admin aliases for manufacturing-process unit metrics.
 * Used by admin portal env fallbacks:
 * - GET /admin/urn/{urn}/process-mp-manufacturing-units
 * - GET /admin/process-mp-manufacturing-units/{urn}
 */
@ApiTags('Admin Process MP Manufacturing Units')
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminProcessMpManufacturingUnitsController {
  constructor(
    private readonly service: ProcessMpManufacturingUnitsService,
  ) {}

  private async listForUrn(urn: string) {
    const urnNo = decodeURIComponent(String(urn ?? '')).trim();
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.service.listByUrnForAdmin(urnNo);
    return { success: true, data };
  }

  @Get('urn/:urn/process-mp-manufacturing-units')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'List MP manufacturing units by URN (platform admin)',
  })
  @ApiParam({ name: 'urn', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  listByUrnNested(@Param('urn') urn: string) {
    return this.listForUrn(urn);
  }

  @Get('process-mp-manufacturing-units/:urn_no')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'List MP manufacturing units by URN (platform admin, flat path)',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  listByUrnFlat(@Param('urn_no') urnNo: string) {
    return this.listForUrn(urnNo);
  }
}

/** Alias when admin client uses `/api/process-mp-manufacturing-units/{urn}` (base URL without `/api` strip). */
@ApiTags('Admin Process MP Manufacturing Units')
@Controller('api/process-mp-manufacturing-units')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ApiProcessMpManufacturingUnitsController {
  constructor(
    private readonly service: ProcessMpManufacturingUnitsService,
  ) {}

  @Get(':urn_no')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'List MP manufacturing units by URN (platform admin, /api prefix)',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@Param('urn_no') urnNo: string) {
    const trimmed = decodeURIComponent(String(urnNo ?? '')).trim();
    if (!trimmed) {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.service.listByUrnForAdmin(trimmed);
    return { success: true, data };
  }
}
