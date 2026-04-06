import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Product, ProductSchema } from '../product-registration/schemas/product.schema';
import { PaymentDetails, PaymentDetailsSchema } from '../payments/schemas/payment-details.schema';
import { VendorUser, VendorUserSchema } from '../vendor-users/schemas/vendor-user.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { Vendor, VendorSchema } from '../vendors/schemas/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Vendor.name, schema: VendorSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
