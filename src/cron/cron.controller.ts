import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CronSecretGuard } from './guards/cron-secret.guard';
import { CertificationExpiryService } from './certification-expiry/certification-expiry.service';

@ApiTags('Cron')
@Controller('api/cron/certification-expiry')
@UseGuards(CronSecretGuard)
@ApiBearerAuth()
export class CronController {
  constructor(
    private readonly certificationExpiryService: CertificationExpiryService,
  ) {}

  @Post('before3month')
  @ApiOperation({
    summary:
      'Certification expiry — first notify (3 months before validtillDate)',
  })
  async before3Month() {
    const data = await this.certificationExpiryService.runBefore3Month();
    return { message: 'before3month job finished', data };
  }

  /** @deprecated Prefer POST before3month — alias for one release. */
  @Post('before2month')
  @ApiOperation({
    summary:
      '[Deprecated] Alias of before3month — first notify (3 months before validtillDate)',
    deprecated: true,
  })
  async before2Month() {
    const data = await this.certificationExpiryService.runBefore3Month();
    return { message: 'before3month job finished', data };
  }

  @Post('weekly-mail')
  @ApiOperation({ summary: 'Certification expiry — weekly reminder' })
  async weeklyMail() {
    const data = await this.certificationExpiryService.runWeeklyMail();
    return { message: 'weeklyMail job finished', data };
  }

  @Post('deactivation-mail')
  @ApiOperation({
    summary:
      'Certification expiry — deactivate after 3-month grace past validtillDate',
  })
  async deactivationMail() {
    const data = await this.certificationExpiryService.runDeactivationMail();
    return { message: 'deactivationMail job finished', data };
  }
}
