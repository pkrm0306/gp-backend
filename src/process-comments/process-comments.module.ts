import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessComments,
  ProcessCommentsSchema,
} from './schemas/process-comments.schema';
import { ProcessCommentsService } from './process-comments.service';
import { ProcessCommentsController } from './process-comments.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { RenewalModule } from '../renew/renewal.module';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessComments.name, schema: ProcessCommentsSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ProductRegistrationModule,
    forwardRef(() => RenewalModule),
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessCommentsController],
  providers: [ProcessCommentsService],
  exports: [ProcessCommentsService],
})
export class ProcessCommentsModule {}
