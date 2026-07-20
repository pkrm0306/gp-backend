import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import {
  PRODUCTS_UPDATE_ANY,
  PRODUCTS_VIEW_ANY,
} from '../common/constants/permissions.constants';
import { ProductRegistrationService } from './product-registration.service';
import { AdminPatchUrnStatusBodyDto } from './dto/admin-patch-urn-status-body.dto';

/**
 * REST-style admin URN routes used by the admin portal env:
 * `NEXT_PUBLIC_PATCH_URN_STATUS_PATH=/admin/urn/{urn}/status`
 * `NEXT_PUBLIC_ADMIN_URN_DETAILS_GET_PATH=/admin/urn/{urn}`
 */
@ApiTags('Admin URN')
@Controller('admin/urn')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminUrnController {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Get(':urn')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'Get product details by URN (platform admin, REST path)',
    description:
      'Alias for **GET /api/admin/products/details/:urn** — lookup by URN only.',
  })
  @ApiParam({
    name: 'urn',
    description: 'Full URN (e.g. URN-20260303140911)',
    example: 'URN-20260303140911',
  })
  @ApiResponse({ status: 200, description: 'Product details for the URN' })
  @ApiResponse({ status: 404, description: 'No products for this URN' })
  async getDetailsByUrn(@Param('urn') urn: string) {
    const urnNo = decodeURIComponent(String(urn ?? '')).trim();
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }
    const data =
      await this.productRegistrationService.getProductDetailsByUrn(urnNo);
    return { success: true, data };
  }

  @Patch(':urn/status')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update URN status (platform admin, REST path)',
    description:
      'Alias for **PATCH /api/admin/products/urn-status**. URN is taken from the path; body fields **updateStatusType** and **updateStatusTo** are required.',
  })
  @ApiParam({
    name: 'urn',
    description: 'Full URN (e.g. URN-20260303140911)',
    example: 'URN-20260303140911',
  })
  @ApiBody({ type: AdminPatchUrnStatusBodyDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Unknown URN' })
  async patchUrnStatus(
    @Param('urn') urn: string,
    @Body() body: AdminPatchUrnStatusBodyDto,
  ) {
    const urnNo = decodeURIComponent(String(urn ?? '')).trim();
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.productRegistrationService.adminUpdateUrnStatus({
      urnNo,
      updateStatusType: body.updateStatusType,
      updateStatusTo: body.updateStatusTo,
    });
    return {
      success: true,
      message: 'URN status updated',
      data,
    };
  }
}
