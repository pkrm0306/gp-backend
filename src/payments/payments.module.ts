import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ProductRegistrationModule, // For SequenceHelper
    ActivityLogModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
