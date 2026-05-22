import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../common/redis/redis.module';
import { ZohoWebhookController } from './controllers/zoho-webhook.controller';
import {
  ZohoDealMapping,
  ZohoDealMappingSchema,
} from './schemas/zoho-deal-mapping.schema';
import {
  ZohoLeadMapping,
  ZohoLeadMappingSchema,
} from './schemas/zoho-lead-mapping.schema';
import { ZohoSyncLog, ZohoSyncLogSchema } from './schemas/zoho-sync-log.schema';
import { ZohoToken, ZohoTokenSchema } from './schemas/zoho-token.schema';
import {
  ZohoWebhookLog,
  ZohoWebhookLogSchema,
} from './schemas/zoho-webhook-log.schema';
import { ZohoSyncQueueService } from './jobs/zoho-sync-queue.service';
import { ZohoApiClientService } from './services/zoho-api-client.service';
import { ZohoDealsService } from './services/zoho-deals.service';
import { ZohoLeadsService } from './services/zoho-leads.service';
import { ZohoTokenService } from './services/zoho-token.service';
import { ZohoWebhookService } from './services/zoho-webhook.service';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: ZohoToken.name, schema: ZohoTokenSchema },
      { name: ZohoLeadMapping.name, schema: ZohoLeadMappingSchema },
      { name: ZohoDealMapping.name, schema: ZohoDealMappingSchema },
      { name: ZohoSyncLog.name, schema: ZohoSyncLogSchema },
      { name: ZohoWebhookLog.name, schema: ZohoWebhookLogSchema },
    ]),
  ],
  controllers: [ZohoWebhookController],
  providers: [
    ZohoTokenService,
    ZohoApiClientService,
    ZohoLeadsService,
    ZohoDealsService,
    ZohoWebhookService,
    ZohoSyncQueueService,
  ],
  exports: [
    ZohoTokenService,
    ZohoApiClientService,
    ZohoLeadsService,
    ZohoDealsService,
    ZohoSyncQueueService,
  ],
})
export class ZohoModule {}
