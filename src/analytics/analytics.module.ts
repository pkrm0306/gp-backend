import { Module } from '@nestjs/common';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { GoogleAnalyticsClient } from './google-analytics.client';

@Module({
  imports: [RbacModule],
  controllers: [AnalyticsController],
  providers: [GoogleAnalyticsClient, AnalyticsService, PermissionsGuard],
  exports: [AnalyticsService, GoogleAnalyticsClient],
})
export class AnalyticsModule {}
