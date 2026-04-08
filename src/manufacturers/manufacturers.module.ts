import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer, ManufacturerSchema } from './schemas/manufacturer.schema';
import { VendorUsersModule } from '../vendor-users/vendor-users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
    VendorUsersModule,
  ],
  providers: [ManufacturersService],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
