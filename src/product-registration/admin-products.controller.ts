import {
  Body,
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ProductRegistrationService } from './product-registration.service';
import { AdminListProductsDto } from './dto/admin-list-products.dto';
import { AdminUpdateUrnStatusDto } from './dto/admin-update-urn-status.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';

@ApiTags('Admin Products')
@Controller('api/admin/products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminProductsController {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Get('details/:urn')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'Get product details by URN (platform admin)',
    description:
      'Same payload as **GET /products/details/:urn_no** — lookup by URN only (no manufacturer filter). ' +
      'Each row includes **product_details.urnStatus** (number). Response may also include top-level **urnStatus** for timeline highlighting. ' +
      'Requires a valid Bearer token (any authenticated user).',
  })
  @ApiParam({
    name: 'urn',
    description: 'Full URN (e.g. URN-20260303140911)',
    example: 'URN-20260303140911',
  })
  @ApiResponse({ status: 200, description: 'Product details for the URN' })
  @ApiResponse({ status: 404, description: 'No products for this URN' })
  async adminGetProductDetailsByUrn(@Param('urn') urn: string) {
    if (!urn || urn.trim() === '') {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.productRegistrationService.getProductDetailsByUrn(urn.trim());
    return {
      success: true,
      data,
    };
  }

  @Patch('urn-status')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update URN status (platform admin)',
    description:
      'Resolves all products by **urnNo** only. Body: **urnNo**, **updateStatusType** (`urn_status` or `product_status`), and **updateStatusTo**. ' +
      '`urn_status` accepts 0–11. `product_status` accepts 0–3. ' +
      'Requires a valid Bearer token (any authenticated user).',
  })
  @ApiBody({ type: AdminUpdateUrnStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({
    status: 400,
    description: 'Invalid updateStatusType/updateStatusTo',
  })
  @ApiResponse({ status: 404, description: 'Unknown URN' })
  async adminPatchUrnStatus(@Body() dto: AdminUpdateUrnStatusDto) {
    const data =
      await this.productRegistrationService.adminUpdateUrnStatus(dto);
    return {
      message: 'URN status updated',
      data,
    };
  }

  @Post('list')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'Unified product lifecycle listing',
    description:
      'Single listing endpoint for all admin product lifecycle tabs using filters only.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({ status: 200, description: 'Products listed successfully' })
  @HttpCode(HttpStatus.OK)
  async list(@Body() dto: AdminListProductsDto) {
    return this.productRegistrationService.adminListProducts(dto);
  }

  @Post('export')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Export admin products (Excel)',
    description:
      'Direct Excel download using same filters as list endpoint. Exports one row per EOI.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({ status: 200, description: 'Excel file download' })
  async export(@Body() dto: AdminListProductsDto): Promise<StreamableFile> {
    const file =
      await this.productRegistrationService.exportAdminProductsXlsx(dto);
    return new StreamableFile(file.buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }
}
