import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../../manufacturers/schemas/manufacturer.schema';
import {
  VendorUser,
  VendorUserSchema,
} from '../../vendor-users/schemas/vendor-user.schema';
import { GlobalPhoneUniquenessService } from './global-phone-uniqueness.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
  ],
  providers: [GlobalPhoneUniquenessService],
  exports: [GlobalPhoneUniquenessService],
})
export class GlobalPhoneUniquenessModule {}
