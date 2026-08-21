import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { CertificationExpiryService } from './certification-expiry/certification-expiry.service';
import { InquiryReminderService } from './inquiry-reminder/inquiry-reminder.service';
import { CRON_TIMEZONE } from './utils/cron-date.util';

/**
 * In-process daily schedule (01:00 Asia/Kolkata).
 * Enable with CRON_ENABLED=true on a single long-running API instance only —
 * multiple replicas would duplicate emails. HTTP POST + CRON_SECRET still works for manual runs.
 */
@Injectable()
export class CronScheduler implements OnModuleInit {
  private readonly logger = new Logger(CronScheduler.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly certificationExpiryService: CertificationExpiryService,
    private readonly inquiryReminderService: InquiryReminderService,
  ) {}

  onModuleInit(): void {
    if (this.isScheduleEnabled()) {
      this.logger.log(
        `In-process cron enabled: daily 01:00 ${CRON_TIMEZONE} (one API replica only)`,
      );
    } else {
      this.logger.log(
        'In-process cron disabled (CRON_ENABLED is not true). HTTP POST + CRON_SECRET still works.',
      );
    }
  }

  private isScheduleEnabled(): boolean {
    const raw = String(this.configService.get<string>('CRON_ENABLED') ?? '')
      .trim()
      .toLowerCase();
    return raw === 'true' || raw === '1' || raw === 'yes';
  }

  @Cron('0 1 * * *', { timeZone: CRON_TIMEZONE })
  async runDailyJobs(): Promise<void> {
    if (!this.isScheduleEnabled()) {
      this.logger.debug(
        'Skipping scheduled cron (set CRON_ENABLED=true to run daily at 01:00 Asia/Kolkata)',
      );
      return;
    }

    this.logger.log(`Starting daily cron jobs (${CRON_TIMEZONE})`);

    const jobs: Array<{ name: string; run: () => Promise<unknown> }> = [
      {
        name: 'before2month',
        run: () => this.certificationExpiryService.runBefore2Month(),
      },
      {
        name: 'weeklyMail',
        run: () => this.certificationExpiryService.runWeeklyMail(),
      },
      {
        name: 'deactivationMail',
        run: () => this.certificationExpiryService.runDeactivationMail(),
      },
      {
        name: 'inquiry-reminder',
        run: () => this.inquiryReminderService.runReminder(),
      },
    ];

    for (const job of jobs) {
      try {
        this.logger.log(`Starting ${job.name}`);
        const result = await job.run();
        this.logger.log(`Finished ${job.name}: ${JSON.stringify(result)}`);
      } catch (err) {
        this.logger.error(
          `Failed ${job.name}`,
          err instanceof Error ? err.stack : String(err),
        );
      }
    }

    this.logger.log('Daily cron jobs finished');
  }
}
