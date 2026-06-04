import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {
  PaymentDetails,
  PaymentDetailsSchema,
} from './schemas/payment-details.schema';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import { ZohoModule } from '../zoho/zoho.module';
import { RenewalModule } from '../renew/renewal.module';
import {
  RenewalCycle,
  RenewalCycleSchema,
} from '../renew/schemas/renewal-cycle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: RenewalCycle.name, schema: RenewalCycleSchema },
    ]),
    ProductRegistrationModule, // For SequenceHelper
    ActivityLogModule,
    PassportModule,
    AuthModule,
    ZohoModule,
    forwardRef(() => RenewalModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
