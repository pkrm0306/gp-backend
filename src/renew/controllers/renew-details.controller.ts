import {
  Controller,
  Get,
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
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RenewDetailsService } from '../services/renew-details.service';

@ApiTags('Renew - Details')
@Controller('renew')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RenewDetailsController {
  constructor(private readonly renewDetailsService: RenewDetailsService) {}

  @Get('details/:urn_no')
  @ApiOperation({
    summary: 'Full renewal URN details (same shape as GET /products/details/:urn_no)',
    description:
      'One row per certified EOI with product_details, category, plants (product_plants + states/countries), manufacturer, payments, and renew process sections. ' +
      'Includes process_mp_manufacturing_units and process_wm_manufacturing_units from renew collections. ' +
      'Process data is stored in renew collections only. Optional renewalCycleId scopes product performance.',
  })
  @ApiParam({ name: 'urn_no', type: String })
  @ApiQuery({ name: 'renewalCycleId', required: false, type: String })
  async getRenewDetailsByUrn(
    @Param('urn_no') urnNo: string,
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
      siteVisits: result.siteVisits,
      site_visits: result.siteVisits,
    };
  }
}
