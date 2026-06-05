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
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { AdminListProductsFilterOptionsDto } from './dto/admin-list-products-filter-options.dto';
import { AdminUpdateUrnStatusDto } from './dto/admin-update-urn-status.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PatchUrnTabReviewDto } from './dto/urn-tab-review.dto';
import { UrnTabReviewService } from './urn-tab-review.service';
import { AdminPatchCertifiedProductDto } from './dto/admin-patch-certified-product.dto';
import { AdminUpdateProductChangeRequestDto } from './dto/admin-update-product-change-request.dto';
import { AdminUpdateCertifiedProductPassportDto } from './dto/admin-update-certified-product-passport.dto';
import {
  adminImageMemoryMulterOptions,
  assessmentReportMemoryMulterOptions,
} from '../common/upload/multer-universal.config';
import { AdminRenewValidityDto } from './dto/admin-renew-validity.dto';
import { RenewAdminTestValidityService } from '../renew/services/renew-admin-test-validity.service';

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
    private readonly urnTabReviewService: UrnTabReviewService,
    private readonly renewAdminTestValidityService: RenewAdminTestValidityService,
  ) {}

  @Get('urn-tab-review/:urnNo')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'Get URN tab/step admin review state',
    description:
      'Returns required process tabs + raw material steps (from category CSV), per-section reviewStatus (0=pending, 1=approved, 2=rejected), and summary. Used when urnStatus=4.',
  })
  @ApiParam({ name: 'urnNo', example: 'URN-20260326162423' })
  @ApiResponse({ status: 200, description: 'Tab review state' })
  async getUrnTabReview(
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    const data = await this.urnTabReviewService.getUrnTabReviews(
      urnNo.trim(),
      renewalCycleId?.trim(),
    );
    return { message: 'URN tab reviews retrieved', data };
  }

  @Patch('urn-tab-review')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record admin approve/reject for one process tab or raw material step',
    description:
      'Body: urnNo, tabKey, stepId (1–15 for raw-materials only), decision (approved|rejected), rejectionRemarks when rejected. Only when urnStatus=4.',
  })
  @ApiBody({ type: PatchUrnTabReviewDto })
  @ApiResponse({ status: 200, description: 'Review recorded' })
  @ApiResponse({ status: 403, description: 'URN not in admin review (status !== 4)' })
  async patchUrnTabReview(
    @Body() dto: PatchUrnTabReviewDto,
    @CurrentUser() user: { userId?: string; id?: string },
  ) {
    const adminUserId = String(user?.userId ?? user?.id ?? '').trim();
    if (!adminUserId) {
      throw new BadRequestException('Admin user id not found in token');
    }
    const data = await this.urnTabReviewService.patchUrnTabReview(dto, adminUserId);
    return {
      success: true,
      message: 'Tab review updated',
      data,
    };
  }

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
    const first = (data[0] ?? {}) as Record<string, any>;
    const vendorId =
      first?.vendorId ??
      first?.vendor?._id ??
      first?.manufacturer?.vendorId ??
      null;
    const manufacturerId = first?.manufacturerId ?? first?.manufacturer?._id ?? null;
    return {
      success: true,
      message: 'Product details fetched successfully',
      data,
      product_details_list: data,
      urnContext: {
        urnNo: first?.urnNo ?? urn.trim(),
        urnStatus: first?.urnStatus ?? null,
        product_renew_status: first?.productRenewStatus ?? null,
        productRenewStatus: first?.productRenewStatus ?? null,
        vendorId,
        manufacturerId,
      },
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
      '`urn_status` accepts 0–17 (includes renewal statuses 12–17). `product_status` accepts 0–3. ' +
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

  @Patch('renew-validity')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update valid-till date by URN (admin utility)',
    description:
      'Updates only `validtillDate` for all products under the provided URN. ' +
      'Does not require productName/productDetails/categoryId/eoiNo.',
  })
  @ApiBody({ type: AdminRenewValidityDto })
  @ApiResponse({ status: 200, description: 'Validity date updated' })
  @ApiResponse({ status: 400, description: 'Invalid URN/date input' })
  @ApiResponse({ status: 404, description: 'Unknown URN' })
  async adminRenewValidity(
    @CurrentUser() user: Record<string, unknown>,
    @Body() dto: AdminRenewValidityDto,
    @Query('preview') preview?: string,
  ) {
    const resolvedPreview =
      dto.preview !== undefined ? dto.preview : String(preview) === 'true';

    if (dto.startNewRenewalCycle === true && !resolvedPreview) {
      const userId = String(user?.userId ?? user?.sub ?? user?._id ?? '').trim();
      if (!userId) {
        throw new BadRequestException('User ID not found in token');
      }
      return this.renewAdminTestValidityService.applyTestValidity(
        {
          urnNo: dto.urnNo,
          validTillDate: dto.validTillDate,
          startNewRenewalCycle: true,
        },
        userId,
      );
    }

    const data = await this.productRegistrationService.adminUpdateRenewValidity({
      ...dto,
      preview: resolvedPreview,
    });
    return {
      success: true,
      message: 'Validity date updated',
      data,
    };
  }

  @Patch('certified/:productId')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('productImage', adminImageMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Edit certified product (admin)',
    description:
      'PATCH only for products with **productStatus = 2** (certified). Updates product name, category, description, valid till date, and optional image. ' +
      'Body must include matching **urnNo** and **eoiNo**. Changes apply to listings after cache invalidation.',
  })
  @ApiParam({
    name: 'productId',
    description: 'MongoDB product document _id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'productName',
        'productDetails',
        'urnNo',
        'eoiNo',
        'categoryId',
        'validtillDate',
      ],
      properties: {
        productName: { type: 'string' },
        productDetails: { type: 'string' },
        urnNo: { type: 'string' },
        eoiNo: { type: 'string' },
        categoryId: { type: 'string' },
        validtillDate: { type: 'string', format: 'date' },
        validTillDate: { type: 'string', format: 'date' },
        productImage: {
          type: 'string',
          format: 'binary',
          description: 'Optional product image (JPEG, PNG, GIF, WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Certified product updated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productMongoId: { type: 'string' },
            productName: { type: 'string' },
            productDetails: { type: 'string' },
            urnNo: { type: 'string' },
            eoiNo: { type: 'string' },
            categoryId: { type: 'string' },
            productImage: { type: 'string', nullable: true },
            productImageUrl: { type: 'string', nullable: true },
            productStatus: { type: 'number', example: 2 },
            validtillDate: { type: 'string', format: 'date-time', nullable: true },
            validTill: { type: 'string', format: 'date-time', nullable: true },
            validTillDate: { type: 'string', format: 'date-time', nullable: true },
            valid_till_date: { type: 'string', format: 'date-time', nullable: true },
            updatedDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Not certified or validation error' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async patchCertifiedProduct(
    @Param('productId') productId: string,
    @Body() dto: AdminPatchCertifiedProductDto,
    @UploadedFile() productImage?: Express.Multer.File,
  ) {
    const data = await this.productRegistrationService.adminPatchCertifiedProduct(
      productId.trim(),
      dto,
      productImage,
    );
    return {
      success: true,
      message: 'Certified product updated successfully',
      data,
    };
  }

  @Post('urn-assessment-report')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor(
      'assessmentReportFile',
      assessmentReportMemoryMulterOptions(),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload assessment report for certified URN (admin)',
    description:
      'Multipart body: `urnNo` + `assessmentReportFile`. Allowed after certification is complete (urnStatus 11). Accepts any file except zip archives and folders.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo', 'assessmentReportFile'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260604121240' },
        assessmentReportFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Assessment report uploaded' })
  @ApiResponse({
    status: 400,
    description: 'URN not certified, invalid file, or zip/folder rejected',
  })
  @ApiResponse({ status: 404, description: 'URN not found' })
  async uploadUrnAssessmentReportByBody(
    @Body('urnNo') urnNo: string,
    @UploadedFile() assessmentReportFile?: Express.Multer.File,
  ) {
    return this.uploadUrnAssessmentReportResponse(urnNo, assessmentReportFile);
  }

  @Post('urn/:urnNo/assessment-report')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor(
      'assessmentReportFile',
      assessmentReportMemoryMulterOptions(),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload assessment report for certified URN (admin, path param)',
    description:
      'Legacy alias: URN in path. Prefer `POST urn-assessment-report` with `urnNo` in multipart body.',
  })
  @ApiParam({ name: 'urnNo', description: 'URN number' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['assessmentReportFile'],
      properties: {
        assessmentReportFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Assessment report uploaded' })
  @ApiResponse({
    status: 400,
    description: 'URN not certified, invalid file, or zip/folder rejected',
  })
  @ApiResponse({ status: 404, description: 'URN not found' })
  async uploadUrnAssessmentReport(
    @Param('urnNo') urnNo: string,
    @UploadedFile() assessmentReportFile?: Express.Multer.File,
  ) {
    return this.uploadUrnAssessmentReportResponse(urnNo, assessmentReportFile);
  }

  private async uploadUrnAssessmentReportResponse(
    urnNo: string,
    assessmentReportFile?: Express.Multer.File,
  ) {
    if (!assessmentReportFile) {
      throw new BadRequestException('Assessment report file is required');
    }
    const data =
      await this.productRegistrationService.adminUploadUrnAssessmentReport(
        String(urnNo ?? '').trim(),
        assessmentReportFile,
      );
    return {
      success: true,
      message: 'Assessment report uploaded successfully',
      data,
    };
  }

  @Patch('certified/:productId/passport')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Save passport for certified product (admin)',
    description:
      'Stores passport content for certified products only (productStatus = 2). Maximum 5000 characters excluding whitespace.',
  })
  @ApiParam({
    name: 'productId',
    description: 'MongoDB product document _id',
  })
  @ApiBody({ type: AdminUpdateCertifiedProductPassportDto })
  @ApiResponse({ status: 200, description: 'Certified product passport saved' })
  @ApiResponse({
    status: 400,
    description:
      'Validation error (including whitespace-only or >5000 characters excluding whitespace)',
  })
  @ApiResponse({ status: 404, description: 'Certified product not found' })
  async patchCertifiedProductPassport(
    @Param('productId') productId: string,
    @Body() dto: AdminUpdateCertifiedProductPassportDto,
  ) {
    const data =
      await this.productRegistrationService.adminUpdateCertifiedProductPassport(
        productId.trim(),
        dto,
      );
    return {
      success: true,
      message: 'Certified product passport saved successfully',
      data,
    };
  }

  @Get('requests')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'List vendor product name change requests',
    description:
      'Used by admin request tab. Optional query `status` = pending | approved | rejected.',
  })
  @ApiResponse({ status: 200, description: 'Requests fetched successfully' })
  async listProductChangeRequests(
    @Query('status') status?: string,
  ) {
    const data =
      await this.productRegistrationService.adminListProductChangeRequests(
        status,
      );
    return {
      success: true,
      message: 'Product change requests fetched successfully',
      data,
    };
  }

  @Patch('requests/:requestId/status')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Review vendor product name change request',
    description:
      'Admin can mark request as pending/approved/rejected. On approve, product name is updated for that certified product.',
  })
  @ApiParam({
    name: 'requestId',
    description: 'Vendor product change request _id',
  })
  @ApiBody({ type: AdminUpdateProductChangeRequestDto })
  @ApiResponse({ status: 200, description: 'Request status updated' })
  async updateProductChangeRequestStatus(
    @Param('requestId') requestId: string,
    @Body() dto: AdminUpdateProductChangeRequestDto,
    @CurrentUser() user: { userId?: string; id?: string },
  ) {
    const adminUserId = String(user?.userId ?? user?.id ?? '').trim();
    if (!adminUserId) {
      throw new BadRequestException('Admin user id not found in token');
    }
    const data =
      await this.productRegistrationService.adminUpdateProductChangeRequestStatus(
        requestId,
        dto,
        adminUserId,
      );
    return {
      success: true,
      message: 'Product change request updated successfully',
      data,
    };
  }

  @Post('list/filter-options')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filter dropdown options for admin product list (certified, etc.)',
    description:
      'Returns active categories, manufacturers, and valid-till years for products matching `status` (default `[2]` certified). ' +
      '**City** is a free-text filter on `POST /admin/products/list` (`city` query in body), not a dropdown here. ' +
      'Use `GET /countries` and `GET /states?countryId=` for country/state dropdowns.',
  })
  @ApiBody({ type: AdminListProductsFilterOptionsDto })
  @ApiResponse({ status: 200, description: 'Filter options' })
  async listFilterOptions(@Body() dto: AdminListProductsFilterOptionsDto) {
    return this.productRegistrationService.adminGetProductListFilterOptions(dto);
  }

  @Post('list')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'Admin product lifecycle listing (manufacturer → URN → EOI)',
    description:
      'Default **groupBy: manufacturer** paginates manufacturer groups. Each item includes `manufacturer_id`, `manufacturer_name`, `total_urns`, `total_eois`, and nested `urns[]` with `eois[]`. ' +
      'Search matches manufacturer name, URN, EOI, or product name; when a manufacturer qualifies, nested URNs/EOIs reflect filters (Option A). ' +
      'Legacy **groupBy: urn** returns flat URN groups. `total` counts top-level groups (manufacturers or URNs). ' +
      '**EOI status (`productStatus`):** filter with `status`, `productStatus`, or `product_status` (array of **0–4**). Omit or send empty → defaults to **[0, 1]** (Pending + Submitted). ' +
      '**Multi-select filters:** `categoryIds`, `manufacturerIds`, `manufacturerNames`, `stateIds`, `stateNames`, `validTillYears`, plus `countryId` for plant country. **City:** send `city` as free text (partial match), not `cities` multiselect. Single-value aliases (`categoryId`, `stateId`, etc.) still work.',
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
