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
  Put,
  Query,
  Res,
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
import { AdminProductsExportDto } from './dto/admin-products-export.dto';
import { resolveAdminListValidTillMonthYearFilter } from './helpers/admin-list-valid-till-filter.util';
import { AdminListProductsFilterOptionsDto } from './dto/admin-list-products-filter-options.dto';
import { AdminUpdateUrnStatusDto } from './dto/admin-update-urn-status.dto';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import {
  PERMISSIONS,
  PRODUCTS_UPDATE_ANY,
  PRODUCTS_VIEW_ANY,
} from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { isPlatformAdminUser } from '../common/utils/platform-admin.util';
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
import { UpsertUrnFinalReviewDto } from './dto/upsert-urn-final-review.dto';
import { RenewAdminTestValidityService } from '../renew/services/renew-admin-test-validity.service';
import { ProcessFinalReviewService } from './services/process-final-review.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import type { AdminProductCallerScope } from './product-registration.service';
import type { Response } from 'express';

type AdminJwtUser = {
  userId?: string;
  id?: string;
  role?: string;
  type?: string;
};

function resolveAdminProductCallerScope(
  user?: AdminJwtUser | null,
): AdminProductCallerScope {
  return {
    userId: String(user?.userId ?? user?.id ?? '').trim(),
    isAdmin: isPlatformAdminUser(user),
  };
}

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
  const categoryIds = [
    ...(dto.categoryIds ?? dto.category_ids ?? []),
    ...(dto.categoryId ? [dto.categoryId] : []),
    ...(dto.category_id ? [dto.category_id] : []),
  ]
    .map((id) => String(id).trim())
    .filter((id) => id.length > 0);
  const uniqueCategoryIds = [...new Set(categoryIds)];

  const sectorIds = [
    ...(dto.sectorIds ??
      dto.sector_ids ??
      dto.buildingIds ??
      dto.building_ids ??
      dto.buildings ??
      []),
    ...(dto.sectorId != null ? [dto.sectorId] : []),
    ...(dto.sector_id != null ? [dto.sector_id] : []),
    ...(dto.buildingId != null ? [dto.buildingId] : []),
    ...(dto.building_id != null ? [dto.building_id] : []),
    ...(dto.building != null ? [dto.building] : []),
  ]
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
  const uniqueSectorIds = [...new Set(sectorIds)];

  const validTillMonthYear = (() => {
    const filter = resolveAdminListValidTillMonthYearFilter(dto);
    return filter?.kind === 'single' ? filter.yearMonth : undefined;
  })();

  return {
    ...dto,
    status: resolved ?? [0, 1],
    ...(uniqueCategoryIds.length > 0 ? { categoryIds: uniqueCategoryIds } : {}),
    ...(uniqueSectorIds.length > 0 ? { sectorIds: uniqueSectorIds } : {}),
    ...(validTillMonthYear ? { validTillMonthYear } : {}),
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
    private readonly processFinalReviewService: ProcessFinalReviewService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  @Get('urn-tab-review/:urnNo')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'Get URN tab/step admin review state',
    description:
      'Returns required process tabs + raw material steps (from category CSV), per-section reviewStatus (0=pending, 1=approved, 2=rejected), and summary. Used when urnStatus=4.',
  })
  @ApiParam({ name: 'urnNo', example: 'URN-20260326162423' })
  @ApiResponse({ status: 200, description: 'Tab review state' })
  async getUrnTabReview(
    @Param('urnNo') urnNo: string,
    @CurrentUser() user: AdminJwtUser,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    const trimmed = urnNo.trim();
    await this.productRegistrationService.assertAdminCanAccessUrn(
      trimmed,
      resolveAdminProductCallerScope(user),
    );
    const data = await this.urnTabReviewService.getUrnTabReviews(
      trimmed,
      renewalCycleId?.trim(),
    );
    return { message: 'URN tab reviews retrieved', data };
  }

  @Patch('urn-tab-review')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
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
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
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
  async adminGetProductDetailsByUrn(
    @Param('urn') urn: string,
    @CurrentUser() user: AdminJwtUser,
  ) {
    if (!urn || urn.trim() === '') {
      throw new BadRequestException('URN number is required');
    }
    const scope = resolveAdminProductCallerScope(user);
    await this.productRegistrationService.assertAdminCanAccessUrn(
      urn.trim(),
      scope,
    );
    const data = await this.productRegistrationService.getProductDetailsByUrn(urn.trim());
    const siteVisits =
      (data[0] as { siteVisits?: unknown[] } | undefined)?.siteVisits ?? [];
    const first = (data[0] ?? {}) as Record<string, any>;
    const embeddedProductDetailsList = first.product_details_list;
    const productDetailsList =
      Array.isArray(embeddedProductDetailsList) &&
      embeddedProductDetailsList.length > 0
        ? embeddedProductDetailsList
        : data;
    const visibleRawMaterialSteps =
      first?.product_details?.visibleRawMaterialSteps ??
      first?.category?.visibleRawMaterialSteps ??
      [];
    const processFinalReview =
      first?.process_final_review ?? first?.processFinalReview ?? null;
    const vendorId =
      first?.vendorId ??
      first?.vendor?._id ??
      first?.manufacturer?.vendorId ??
      null;
    const manufacturerId = first?.manufacturerId ?? first?.manufacturer?._id ?? null;
    const trimmedUrn = String(first?.urnNo ?? urn).trim();
    const quickView =
      await this.activityLogService.getQuickViewActivityForUrn(trimmedUrn);
    return {
      success: true,
      message: 'Product details fetched successfully',
      data,
      product_details_list: productDetailsList,
      urnContext: {
        urnNo: trimmedUrn,
        urnStatus: first?.urnStatus ?? null,
        product_renew_status: first?.productRenewStatus ?? null,
        productRenewStatus: first?.productRenewStatus ?? null,
        canSaveProcessComments:
          first?.product_details?.canSaveProcessComments ?? null,
        processCommentsBlockReason:
          first?.product_details?.processCommentsBlockReason ?? null,
        vendorId,
        manufacturerId,
        visibleRawMaterialSteps,
        processFinalReview,
        process_final_review: processFinalReview,
      },
      currentActivity: quickView,
      quickView,
      siteVisits,
      site_visits: siteVisits,
    };
  }

  @Patch('urn-status')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
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
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
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

  @Put('urn-final-review')
  @Post('urn-final-review')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Save URN technical/final review and credits (certified URN details)',
    description:
      'Persists `technicalReview`, `finalReview`, `minCredits`, and `maxCredits` for the URN in `process_final_review`. ' +
      'Snake_case aliases (`technical_review`, `final_review`, `min_credits`, `max_credits`) are accepted.',
  })
  @ApiBody({ type: UpsertUrnFinalReviewDto })
  @ApiResponse({ status: 200, description: 'URN final review saved' })
  async upsertUrnFinalReview(@Body() dto: UpsertUrnFinalReviewDto) {
    const data = await this.processFinalReviewService.upsertForUrn(dto);
    return {
      success: true,
      message: 'URN final review saved successfully',
      data,
      process_final_review: data,
    };
  }

  @Get('urn-final-review/:urnNo')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'Get URN technical/final review and credits',
  })
  @ApiParam({ name: 'urnNo', example: 'URN-20260527122016' })
  async getUrnFinalReview(
    @Param('urnNo') urnNo: string,
    @CurrentUser() user: AdminJwtUser,
  ) {
    const trimmed = urnNo.trim();
    await this.productRegistrationService.assertAdminCanAccessUrn(
      trimmed,
      resolveAdminProductCallerScope(user),
    );
    const data = await this.processFinalReviewService.getByUrn(trimmed);
    return {
      success: true,
      message: 'URN final review fetched successfully',
      data,
      process_final_review: data,
    };
  }

  @Get('certified/:productId')
  @AnyPermissions(
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CERTIFIED_VIEW,
    PERMISSIONS.PRODUCTS_UPDATE,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get certified product for admin edit',
    description:
      'Returns a certified product (**productStatus = 2**) by Mongo `_id`, including manufacturer social URLs ' +
      '(Facebook, YouTube, Twitter, LinkedIn, website) and website visibility toggles (default on).',
  })
  @ApiParam({
    name: 'productId',
    description: 'MongoDB product document _id',
  })
  @ApiResponse({ status: 200, description: 'Certified product retrieved' })
  @ApiResponse({ status: 400, description: 'Product is not certified' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getCertifiedProduct(@Param('productId') productId: string) {
    const data = await this.productRegistrationService.adminGetCertifiedProduct(
      productId.trim(),
    );
    return {
      success: true,
      message: 'Certified product retrieved successfully',
      data,
    };
  }

  @Patch('certified/:productId')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('productImage', adminImageMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Edit certified product (admin)',
    description:
      'PATCH only for products with **productStatus = 2** (certified). Updates product name, description, valid till date, and optional image. **Category is read-only** (`categoryEditable: false`) — send the existing category id or omit it. ' +
      'Optional manufacturer social visibility toggles (`showFacebookOnWebsite`, etc., default **true**) are stored on the manufacturer and apply to **all** public website product detail pages for that vendor. ' +
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
        'validtillDate',
      ],
      properties: {
        productName: { type: 'string' },
        productDetails: { type: 'string' },
        urnNo: { type: 'string' },
        eoiNo: { type: 'string' },
        categoryId: {
          type: 'string',
          description: 'Read-only — omit or send unchanged category id',
        },
        validtillDate: { type: 'string', format: 'date' },
        validTillDate: { type: 'string', format: 'date' },
        productImage: {
          type: 'string',
          format: 'binary',
          description: 'Optional product image (JPEG, PNG, GIF, WebP)',
        },
        showWebsiteOnWebsite: {
          type: 'boolean',
          description: 'Show manufacturer website on public product pages (default true)',
        },
        show_website_on_website: { type: 'boolean' },
        showFacebookOnWebsite: { type: 'boolean' },
        show_facebook_on_website: { type: 'boolean' },
        showYoutubeOnWebsite: { type: 'boolean' },
        show_youtube_on_website: { type: 'boolean' },
        showTwitterOnWebsite: { type: 'boolean' },
        show_twitter_on_website: { type: 'boolean' },
        showLinkedinOnWebsite: { type: 'boolean' },
        show_linkedin_on_website: { type: 'boolean' },
        facebookUrl: { type: 'string' },
        facebook_url: { type: 'string' },
        youtubeUrl: { type: 'string' },
        youtube_url: { type: 'string' },
        twitterUrl: { type: 'string' },
        twitter_url: { type: 'string' },
        linkedinUrl: { type: 'string' },
        linkedin_url: { type: 'string' },
        website: { type: 'string' },
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
            categoryEditable: { type: 'boolean', example: false },
            categoryChangeBlockReason: { type: 'string' },
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
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
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
      'Multipart body: `urnNo` + `assessmentReportFile`. Allowed after certification is complete (urnStatus 11). Only PDF, JPG, JPEG, PNG, DOC, and DOCX files are allowed.',
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
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
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
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Save passport for certified product (admin)',
    description:
      'Stores passport content for certified products only (productStatus = 2). Passport is optional; empty content clears the stored passport. Maximum 5000 characters excluding whitespace when provided.',
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
      'Validation error (including >5000 characters excluding whitespace)',
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
  @AnyPermissions(PERMISSIONS.PRODUCTS_REQUESTS_VIEW, PERMISSIONS.PRODUCTS_VIEW)
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
  @AnyPermissions(
    PERMISSIONS.PRODUCTS_REQUESTS_APPROVE_REJECT,
    PERMISSIONS.PRODUCTS_UPDATE,
  )
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
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Filter dropdown options for admin product list (certified, uncertified, etc.)',
    description:
      'Returns active categories, manufacturers, valid-till years, and **all countries** (`data.countries[]` — every row in the countries collection, A–Z, not limited to countries with products). ' +
      'For **certified** scope (`status: [2]`), `filterControls.validTillMonthYear` is a **month/year picker** (`YYYY-MM`); send `validTillMonthYear` / `valid_till` (or aliases) on the list body. ' +
      'Send selected `countryId` on `POST /admin/products/list`. **State** and **city** are free-text filters (`state`, `city`), not dropdowns. Alternative: `GET /countries/dropdown`. ' +
      '**Multi-select filters:** `categoryIds` / `category_ids` (Category), `sectorIds` / `sector_ids` / `buildingIds` / `building_ids` (Building), `manufacturerIds`, `manufacturerNames`. **Valid till (certified):** month+year picker, not `validTillYears` dropdown.',
  })
  @ApiBody({ type: AdminListProductsFilterOptionsDto })
  @ApiResponse({ status: 200, description: 'Filter options' })
  async listFilterOptions(
    @Body() dto: AdminListProductsFilterOptionsDto,
    @CurrentUser() user: AdminJwtUser,
  ) {
    return this.productRegistrationService.adminGetProductListFilterOptions(
      dto,
      resolveAdminProductCallerScope(user),
    );
  }

  @Post('list')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'Admin product lifecycle listing (manufacturer → URN → EOI)',
    description:
      'Default **groupBy: manufacturer** paginates manufacturer groups. Each item includes `manufacturer_id`, `manufacturer_name`, `total_urns`, `total_eois`, and nested `urns[]` with `eois[]`. ' +
      'Search matches manufacturer name, URN, EOI, or product name; when a manufacturer qualifies, nested URNs/EOIs reflect filters (Option A). ' +
      'Legacy **groupBy: urn** returns flat URN groups. `total` counts top-level groups (manufacturers or URNs). ' +
      '**EOI status (`productStatus`):** filter with `status`, `productStatus`, or `product_status` (array of **0–4**). Omit or send empty → defaults to **[0, 1]** (Pending + Submitted). ' +
      '**Multi-select filters:** `categoryIds` / `category_ids` (Category), `sectorIds` / `sector_ids` / `buildingIds` / `building_ids` (Building), `manufacturerIds`, `manufacturerNames`. **Valid till (certified):** `validTillMonthYear` / `valid_till` month+year picker (`YYYY-MM`), optional range via `validTillFrom` + `validTillTo`. **Location:** `countryId` (dropdown), **`state` / `state_name` (free text)**, `city` (free text). Single-value aliases are merged into multiselect arrays.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({ status: 200, description: 'Products listed successfully' })
  @HttpCode(HttpStatus.OK)
  async list(
    @Body() dto: AdminListProductsDto,
    @CurrentUser() user: AdminJwtUser,
  ) {
    return this.productRegistrationService.adminListProducts(
      resolveAdminListProductsBody(dto),
      resolveAdminProductCallerScope(user),
    );
  }

  @Post('export')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Export admin products (Excel or CSV)',
    description:
      'Same filters as list. Returns a file download even when filters match zero rows (headers only). Optional body `format`: `xlsx` (default) or `csv`.',
  })
  @ApiBody({ type: AdminProductsExportDto })
  @ApiResponse({ status: 200, description: 'File download (may contain headers only)' })
  async export(
    @Body() dto: AdminProductsExportDto,
    @CurrentUser() user: AdminJwtUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.productRegistrationService.exportAdminProductsFile(
      resolveAdminListProductsBody(dto) as AdminProductsExportDto,
      resolveAdminProductCallerScope(user),
    );

    res.setHeader('X-Export-Row-Count', String(file.rowCount));
    res.setHeader('X-Export-Has-Data', file.rowCount > 0 ? 'true' : 'false');
    res.setHeader(
      'Access-Control-Expose-Headers',
      'Content-Disposition, X-Export-Row-Count, X-Export-Has-Data',
    );

    return new StreamableFile(file.buffer, {
      type: file.contentType,
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }
}
