import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogService } from './audit-log.service';
import { AuditHttpInterceptor } from './audit-http.interceptor';
import { AuditLogAdminController } from './audit-log-admin.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
  ],
  controllers: [AuditLogAdminController],
  providers: [
    AuditLogService,
    { provide: APP_INTERCEPTOR, useClass: AuditHttpInterceptor },
  ],
  exports: [AuditLogService],
})
export class AuditLogModule {}
