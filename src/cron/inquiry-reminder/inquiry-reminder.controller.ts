import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CronSecretGuard } from '../guards/cron-secret.guard';
import { InquiryReminderService } from './inquiry-reminder.service';

@ApiTags('Cron')
@Controller('api/cron/inquiry-reminder')
@UseGuards(CronSecretGuard)
@ApiBearerAuth()
export class InquiryReminderCronController {
  constructor(private readonly inquiryReminderService: InquiryReminderService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unacknowledged enquiry reminder',
    description:
      'Emails admin with counts of unacknowledged enquiries created ≥ 3 days ago that have not been reminded yet, then marks those enquiries as reminded.',
  })
  async sendReminder() {
    const data = await this.inquiryReminderService.runReminder();
    return { message: 'inquiry-reminder job finished', data };
  }
}
