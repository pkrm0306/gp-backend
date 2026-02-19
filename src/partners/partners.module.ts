import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { VendorUser, VendorUserSchema } from '../vendor-users/schemas/vendor-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
