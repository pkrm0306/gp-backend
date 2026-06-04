import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RenewQuickViewService } from '../services/renew-quick-view.service';
import { RenewDetailsService } from '../services/renew-details.service';
import { RenewalOrchestrationService } from '../services/renewal-orchestration.service';
import { RenewAdminTestValidityService } from '../services/renew-admin-test-validity.service';
import { AdminRenewTestValidityDto } from '../dto/admin-renew-test-validity.dto';
import { ProductRegistrationService } from '../../product-registration/product-registration.service';

class StartRenewalCycleDto {
  urnNo: string;
  paymentId?: number;
}

@ApiTags('Renew - Admin')
/**
 * Canonical: `/renew/admin/*`.
 * Alias `/admin/renew/admin/*` — admin UI may call Nest directly with the Next.js path
 * when `NEXT_PUBLIC_API_URL` points at the API host instead of the Next proxy rewrite.
 */
@Controller(['renew/admin', 'admin/renew/admin'])
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminRenewController {
  constructor(
    private readonly renewQuickViewService: RenewQuickViewService,
    private readonly renewDetailsService: RenewDetailsService,
    private readonly renewalOrchestrationService: RenewalOrchestrationService,
    private readonly renewAdminTestValidityService: RenewAdminTestValidityService,
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Patch('test-validity')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({
    summary: 'Test renewal — change valid till and start a new renewal cycle',
    description:
      'Admin-only. Updates validtillDate, completes any in-progress cycle, creates cycleNo+1, sets urn_status=12 and product_renew_status=0. Does not copy prior-cycle process or payment data.',
  })
  async patchTestValidity(
    @CurrentUser() user: Record<string, unknown>,
    @Body() dto: AdminRenewTestValidityDto,
  ) {
    const userId = String(user?.userId ?? user?.sub ?? user?._id ?? '').trim();
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }
    return this.renewAdminTestValidityService.applyTestValidity(dto, userId);
  }

  @Get('quick-view/:urnNo')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({ summary: 'Admin renewal quick view for a URN' })
  @ApiParam({ name: 'urnNo', type: String })
  async getQuickView(
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    const data = await this.renewQuickViewService.buildQuickView(
      urnNo,
      undefined,
      renewalCycleId,
    );
    return { success: true, message: 'Renewal quick view fetched successfully', data };
  }

  @Get('details/:urnNo')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'Full renewal URN details (admin — same shape as uncertified GET /products/details)',
  })
  @ApiParam({ name: 'urnNo', type: String })
  async getRenewDetails(
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    if (!urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    const result = await this.renewDetailsService.getRenewDetailsByUrn(
      urnNo.trim(),
      renewalCycleId,
    );
    return {
      success: true,
      message: 'Renew details fetched successfully',
      data: result.data,
      product_details_list: result.data,
      products: result.products,
      manufacturer: result.manufacturer,
      manufacturing_details: result.manufacturing_details,
      plants: result.plants,
      plant_details: result.plant_details,
      all_renew_product_documents: result.all_renew_product_documents,
      all_urn_product_documents: result.all_urn_product_documents,
      documents: result.documents,
      renewContext: result.renewContext,
      urnContext: {
        urnNo: result.renewContext.urnNo,
        urnStatus: result.renewContext.urnStatus,
        product_renew_status: result.renewContext.productRenewStatus,
        productRenewStatus: result.renewContext.productRenewStatus,
        renewCycleNo: result.renewContext.renewCycleNo,
        vendorId: result.renewContext.vendorId,
        manufacturerId: result.renewContext.manufacturerId,
        renewalCycleId: result.renewContext.renewalCycleId,
      },
      siteVisits: result.siteVisits,
      site_visits: result.siteVisits,
    };
  }

  @Get('renew-list')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'Admin renew products list (grouped by manufacturer)',
    description:
      'Returns manufacturer groups with manufacturer_name, nested urns and certified EOIs only (excludes rejected).',
  })
  async getRenewList() {
    const { data, total } =
      await this.productRegistrationService.adminListRenewProducts();
    return {
      success: true,
      message: 'Renew list fetched successfully',
      data,
      total,
    };
  }

  @Post('complete-renewal/:urnNo')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({ summary: 'Complete renewal for a URN' })
  @ApiParam({ name: 'urnNo', type: String })
  async completeRenewal(
    @CurrentUser() user: any,
    @Param('urnNo') urnNo: string,
  ) {
    const userId = user?.userId ?? user?.sub ?? user?._id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }
    await this.renewalOrchestrationService.completeRenewal(urnNo, userId);
    return { success: true, message: 'Renewal completed successfully' };
  }

  @Post('start-renewal-cycle')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({ summary: 'Start a renewal cycle for a URN' })
  async startRenewalCycle(
    @CurrentUser() user: any,
    @Body() body: StartRenewalCycleDto,
  ) {
    if (!body?.urnNo?.trim()) {
      throw new BadRequestException('urnNo is required');
    }
    const userId = user?.userId ?? user?.sub ?? user?._id;
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    await this.renewalOrchestrationService.startRenewalCycle(
      body.urnNo,
      userId,
      body.paymentId,
    );
    return { success: true, message: 'Renewal cycle started', data: { urnNo: body.urnNo.trim() } };
  }
}
