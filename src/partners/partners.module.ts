import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import { GlobalPhoneUniquenessModule } from '../common/services/global-phone-uniqueness.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
    GlobalPhoneUniquenessModule,
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
