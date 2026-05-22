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

/**
 * Admin list filters EOIs by **product** `productStatus` (EOI lifecycle), not manufacturer/vendor status.
 * Body may send `status`, `productStatus`, or `product_status` (first non-empty wins).
 * If all are omitted or empty, default to Pending + Submitted `[0, 1]`.
 */
function firstNonEmptyStatusArray(
  dto: AdminListProductsDto,
): number[] | undefined {
  const candidates = [dto.status, dto.productStatus, dto.product_status];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) {
      return c;
    }
  }
  return undefined;
}

function resolveAdminListProductsBody(
  dto: AdminListProductsDto,
): AdminListProductsDto {
  const resolved = firstNonEmptyStatusArray(dto);
  return {
    ...dto,
    status: resolved ?? [0, 1],
  };
}

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
      'Each row includes **product_details.urnStatus** (number). **manufacturer** / **manufacturing_details** include full **vendor_details** (email, phone, GST, contacts, etc.) from the manufacturers record. ' +
      'Includes **siteVisits** on each row and at the response root. ' +
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
    const siteVisits =
      (data[0] as { siteVisits?: unknown[] } | undefined)?.siteVisits ?? [];
    return {
      success: true,
      data,
      siteVisits,
      site_visits: siteVisits,
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
    summary: 'Admin product lifecycle listing (manufacturer → URN → EOI)',
    description:
      'Default **groupBy: manufacturer** paginates manufacturer groups. Each item includes `manufacturer_id`, `manufacturer_name`, `total_urns`, `total_eois`, and nested `urns[]` with `eois[]`. ' +
      'Search matches manufacturer name, URN, EOI, or product name; when a manufacturer qualifies, nested URNs/EOIs reflect filters (Option A). ' +
      'Legacy **groupBy: urn** returns flat URN groups. `total` counts top-level groups (manufacturers or URNs). ' +
      '**EOI status (`productStatus`):** filter with `status`, `productStatus`, or `product_status` (array of **0–4**). Omit or send empty → defaults to **[0, 1]** (Pending + Submitted). Extra keys like `urnStatusLabels` / `urn_status_labels` are ignored.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({ status: 200, description: 'Products listed successfully' })
  @HttpCode(HttpStatus.OK)
  async list(@Body() dto: AdminListProductsDto) {
    return this.productRegistrationService.adminListProducts(
      resolveAdminListProductsBody(dto),
    );
  }

  @Post('export')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Export admin products (Excel)',
    description:
      'Same filters as list. Flat Excel with Manufacturer, URN, and EOI columns (one row per EOI).',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({ status: 200, description: 'Excel file download' })
  async export(@Body() dto: AdminListProductsDto): Promise<StreamableFile> {
    const file =
      await this.productRegistrationService.exportAdminProductsXlsx(
        resolveAdminListProductsBody(dto),
      );
    return new StreamableFile(file.buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }
}
