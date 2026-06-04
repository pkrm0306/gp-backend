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

  @Post('before2month')
  @ApiOperation({ summary: 'Certification expiry — first notify (2 months before)' })
  async before2Month() {
    const data = await this.certificationExpiryService.runBefore2Month();
    return { message: 'before2month job finished', data };
  }

  @Post('weekly-mail')
  @ApiOperation({ summary: 'Certification expiry — weekly reminder' })
  async weeklyMail() {
    const data = await this.certificationExpiryService.runWeeklyMail();
    return { message: 'weeklyMail job finished', data };
  }

  @Post('deactivation-mail')
  @ApiOperation({ summary: 'Certification expiry — deactivate expired products' })
  async deactivationMail() {
    const data = await this.certificationExpiryService.runDeactivationMail();
    return { message: 'deactivationMail job finished', data };
  }
}
