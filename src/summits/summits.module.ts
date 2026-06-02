import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Summit, SummitSchema } from './schemas/summit.schema';
import { SummitsService } from './summits.service';
import { AdminSummitsController } from './admin-summits.controller';
import { PublicSummitsController } from './public-summits.controller';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
    MongooseModule.forFeature([{ name: Summit.name, schema: SummitSchema }]),
  ],
  controllers: [AdminSummitsController, PublicSummitsController],
  providers: [SummitsService, PermissionsGuard],
  exports: [SummitsService],
})
export class SummitsModule {}
