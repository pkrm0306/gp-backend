import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import {
  RenewalCycle,
  RenewalCycleSchema,
} from '../renew/schemas/renewal-cycle.schema';
import {
  ContactMessage,
  ContactMessageSchema,
} from '../website/schemas/contact-message.schema';
import { CronController } from './cron.controller';
import { CronSecretGuard } from './guards/cron-secret.guard';
import {
  CronEmailLog,
  CronEmailLogSchema,
} from './schemas/cron-email-log.schema';
import { CertificationExpiryQueryService } from './certification-expiry/certification-expiry-query.service';
import { CertificationExpiryTemplateService } from './certification-expiry/certification-expiry-template.service';
import { CertificationExpiryService } from './certification-expiry/certification-expiry.service';
import { InquiryReminderService } from './inquiry-reminder/inquiry-reminder.service';
import { InquiryReminderCronController } from './inquiry-reminder/inquiry-reminder.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: RenewalCycle.name, schema: RenewalCycleSchema },
      { name: CronEmailLog.name, schema: CronEmailLogSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
    ]),
  ],
  controllers: [CronController, InquiryReminderCronController],
  providers: [
    CronSecretGuard,
    CertificationExpiryQueryService,
    CertificationExpiryTemplateService,
    CertificationExpiryService,
    InquiryReminderService,
  ],
  exports: [CertificationExpiryService, InquiryReminderService],
})
export class CronModule {}
