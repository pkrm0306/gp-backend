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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RenewQuickViewService } from '../services/renew-quick-view.service';

@ApiTags('Renew - Vendor')
@Controller('renew/vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorRenewController {
  constructor(private readonly renewQuickViewService: RenewQuickViewService) {}

  @Get('quick-view/:urnNo')
  @ApiOperation({ summary: 'Vendor renewal quick view for a URN' })
  @ApiParam({ name: 'urnNo', type: String })
  async getQuickView(
    @CurrentUser() user: any,
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    const vendorId = user?.vendorId || user?.manufacturerId;
    if (!vendorId) {
      throw new BadRequestException('Vendor organization ID not found in token');
    }
    const data = await this.renewQuickViewService.buildQuickView(
      urnNo,
      vendorId,
      renewalCycleId,
    );
    return { success: true, message: 'Renewal quick view fetched successfully', data };
  }
}
