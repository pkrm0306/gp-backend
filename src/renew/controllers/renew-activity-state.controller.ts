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
import { RenewActivityStateService } from '../services/renew-activity-state.service';

@ApiTags('Renew - Activity State')
@Controller('renew')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RenewActivityStateController {
  constructor(
    private readonly renewActivityStateService: RenewActivityStateService,
  ) {}

  @Get('activity-state/:urn_no')
  @ApiOperation({
    summary:
      'Resolved Renewal Activity Log state (Completed / Current / Next)',
    description:
      'Single source of truth for Admin + Vendor renew Quick View. ' +
      'Uses urnStatus + renew payment_details.paymentStatus for the cycle — ' +
      'not the latest raw activity_log Pending tip.',
  })
  @ApiParam({ name: 'urn_no', type: String })
  @ApiQuery({ name: 'renewalCycleId', required: false, type: String })
  async getRenewActivityState(
    @Param('urn_no') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    if (!urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.renewActivityStateService.resolve(
      urnNo.trim(),
      renewalCycleId,
    );
    return {
      success: true,
      message: 'Renewal activity state resolved',
      data,
    };
  }
}
