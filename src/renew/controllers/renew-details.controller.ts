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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RenewDetailsService } from '../services/renew-details.service';
import {
  buildRenewDetailsHttpResponse,
  parseRenewDetailsInclude,
} from '../utils/renew-details-response.util';

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
      'One row per certified EOI with product_details, category, plants, manufacturer, and renew process sections. ' +
      'Use include=full for a single workspace payload (process sections, payment, plants). ' +
      'Vendor tab reviews and admin process comments are not included.',
  })
  @ApiParam({ name: 'urn_no', type: String })
  @ApiQuery({ name: 'renewalCycleId', required: false, type: String })
  @ApiQuery({
    name: 'include',
    required: false,
    enum: ['summary', 'full'],
    description: 'full = complete workspace read (replaces initial quick-view + section GETs)',
  })
  async getRenewDetailsByUrn(
    @CurrentUser() user: Record<string, unknown>,
    @Param('urn_no') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
    @Query('include') include?: string,
  ) {
    if (!urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }

    const includeMode = parseRenewDetailsInclude(include);
    const actorId = String(
      user?.vendorId ?? user?.manufacturerId ?? '',
    ).trim();

    const result = await this.renewDetailsService.getRenewDetailsByUrn(
      urnNo.trim(),
      renewalCycleId,
      {
        role: 'vendor',
        include: includeMode,
        actorVendorOrManufacturerId: actorId || undefined,
      },
    );

    return buildRenewDetailsHttpResponse(result, includeMode);
  }
}
