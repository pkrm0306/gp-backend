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
import { EmailService } from '../common/services/email.service';
import { CronController } from './cron.controller';
import { CronSecretGuard } from './guards/cron-secret.guard';
import {
  CronEmailLog,
  CronEmailLogSchema,
} from './schemas/cron-email-log.schema';
import { CertificationExpiryQueryService } from './certification-expiry/certification-expiry-query.service';
import { CertificationExpiryTemplateService } from './certification-expiry/certification-expiry-template.service';
import { CertificationExpiryService } from './certification-expiry/certification-expiry.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: RenewalCycle.name, schema: RenewalCycleSchema },
      { name: CronEmailLog.name, schema: CronEmailLogSchema },
    ]),
  ],
  controllers: [CronController],
  providers: [
    EmailService,
    CronSecretGuard,
    CertificationExpiryQueryService,
    CertificationExpiryTemplateService,
    CertificationExpiryService,
  ],
  exports: [CertificationExpiryService],
})
export class CronModule {}
