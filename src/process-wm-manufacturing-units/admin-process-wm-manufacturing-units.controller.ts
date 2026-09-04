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
import { ProcessWmManufacturingUnitsService } from './process-wm-manufacturing-units.service';

/**
 * Admin aliases for waste-management unit metrics.
 * - GET /admin/urn/{urn}/process-wm-manufacturing-units
 * - GET /admin/process-wm-manufacturing-units/{urn}
 */
@ApiTags('Admin Process WM Manufacturing Units')
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminProcessWmManufacturingUnitsController {
  constructor(
    private readonly service: ProcessWmManufacturingUnitsService,
  ) {}

  private async listForUrn(urn: string) {
    const urnNo = decodeURIComponent(String(urn ?? '')).trim();
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.service.listByUrnForAdmin(urnNo);
    return { success: true, data };
  }

  @Get('urn/:urn/process-wm-manufacturing-units')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'List WM manufacturing units by URN (platform admin)',
  })
  @ApiParam({ name: 'urn', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  listByUrnNested(@Param('urn') urn: string) {
    return this.listForUrn(urn);
  }

  @Get('process-wm-manufacturing-units/:urn_no')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'List WM manufacturing units by URN (platform admin, flat path)',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  listByUrnFlat(@Param('urn_no') urnNo: string) {
    return this.listForUrn(urnNo);
  }
}

/** Alias when admin client uses `/api/process-wm-manufacturing-units/{urn}`. */
@ApiTags('Admin Process WM Manufacturing Units')
@Controller('api/process-wm-manufacturing-units')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ApiProcessWmManufacturingUnitsController {
  constructor(
    private readonly service: ProcessWmManufacturingUnitsService,
  ) {}

  @Get(':urn_no')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'List WM manufacturing units by URN (platform admin, /api prefix)',
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
