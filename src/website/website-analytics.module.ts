import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WebsiteAnalyticsEvent,
  WebsiteAnalyticsEventSchema,
} from './schemas/website-analytics-event.schema';
import { WebsiteAnalyticsService } from './website-analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebsiteAnalyticsEvent.name, schema: WebsiteAnalyticsEventSchema },
    ]),
  ],
  providers: [WebsiteAnalyticsService],
  exports: [WebsiteAnalyticsService],
})
export class WebsiteAnalyticsModule {}
