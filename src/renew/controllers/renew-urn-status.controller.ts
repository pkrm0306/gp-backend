import {
  Body,
  Controller,
  Patch,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateRenewUrnStatusDto } from '../dto/update-renew-urn-status.dto';
import {
  RenewUrnStatusService,
  RenewUrnStatusActorContext,
} from '../services/renew-urn-status.service';
import { RenewUrnStatusActor } from '../helpers/renew-urn-status-transitions.util';

@ApiTags('Renew - URN Status')
@Controller('renew')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RenewUrnStatusController {
  constructor(private readonly renewUrnStatusService: RenewUrnStatusService) {}

  @Patch('urn-status')
  @ApiOperation({
    summary: 'Update renewal URN status (12–17, 11 completed)',
    description:
      'Renewal-only status transitions. Do not use PATCH /api/admin/products/urn-status for renew flows. ' +
      'Admin submit for final review: updateStatusTo 17 with renewalCycleId completes renewal (persists urnStatus 11, productRenewStatus 2, dates). ' +
      'Vendor: submit for review (14→15, 16→15). Admin: payment approve (13→14), resend (15→16).',
  })
  async updateRenewUrnStatus(
    @CurrentUser() user: Record<string, unknown>,
    @Body() dto: UpdateRenewUrnStatusDto,
  ) {
    const actorContext = this.resolveActorContext(user);
    const result = await this.renewUrnStatusService.updateRenewUrnStatus(
      dto,
      actorContext,
    );
    return { success: true, ...result };
  }

  private resolveActorContext(
    user: Record<string, unknown>,
  ): RenewUrnStatusActorContext {
    const userId = String(user?.userId ?? user?.sub ?? user?._id ?? '').trim();
    if (!userId) {
      throw new BadRequestException('User ID not found in token');
    }

    const role = String(user?.role ?? user?.type ?? '').toLowerCase();
    if (role === 'admin') {
      return { actor: 'admin' as RenewUrnStatusActor, userId };
    }

    const vendorOrManufacturerId = String(
      user?.vendorId ?? user?.manufacturerId ?? '',
    ).trim();
    if (!vendorOrManufacturerId) {
      throw new BadRequestException('Vendor organization ID not found in token');
    }

    return {
      actor: 'vendor' as RenewUrnStatusActor,
      userId,
      vendorOrManufacturerId,
    };
  }
}
