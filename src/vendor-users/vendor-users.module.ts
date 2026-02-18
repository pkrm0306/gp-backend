import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorUsersService } from './vendor-users.service';
import { VendorUser, VendorUserSchema } from './schemas/vendor-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
  ],
  providers: [VendorUsersService],
  exports: [VendorUsersService],
})
export class VendorUsersModule {}
