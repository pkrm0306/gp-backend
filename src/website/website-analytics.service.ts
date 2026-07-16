import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WebsiteAnalyticsEvent,
  WebsiteAnalyticsEventDocument,
  WebsiteAnalyticsEventType,
} from './schemas/website-analytics-event.schema';
import type { WebsiteAnalyticsCollectDto } from './dto/website-analytics-collect.dto';
import type { ResolvedDashboardFilters } from '../admin/utils/dashboard-metrics-filters.util';
import {
  formatBucketLabel,
  type DashboardGranularity,
} from '../admin/utils/dashboard-metrics-filters.util';
import type { VisitorAnalyticsChartPoint } from '../admin/dashboard/admin-dashboard-visitor-analytics.types';

type BucketId = {
  year?: number;
  month?: number;
  quarter?: number;
  week?: number;
};

type AnalyticsBucket = {
  bucket: BucketId;
  label: string;
  pageViews: number;
  visitorIds: Set<string>;
  signUps: number;
};

@Injectable()
export class WebsiteAnalyticsService {
  constructor(
    @InjectModel(WebsiteAnalyticsEvent.name)
    private readonly eventModel: Model<WebsiteAnalyticsEventDocument>,
  ) {}

  async collect(dto: WebsiteAnalyticsCollectDto): Promise<{ accepted: number }> {
    const visitorId = dto.visitorId.trim();
    const docs = dto.events.map((event) => ({
      eventType: event.type as WebsiteAnalyticsEventType,
      visitorId,
      path: event.path?.trim() || undefined,
      signUpType: event.signUpType?.trim() || undefined,
      measurementId: dto.measurementId?.trim() || undefined,
      createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
    }));

    if (docs.length === 0) return { accepted: 0 };

    await this.eventModel.insertMany(docs, { ordered: false });
    return { accepted: docs.length };
  }

  async recordSignUp(params: {
    visitorKey: string;
    signUpType: string;
    path?: string;
  }): Promise<void> {
    const visitorId = params.visitorKey.trim();
    if (!visitorId) return;

    await this.eventModel.create({
      eventType: 'sign_up',
      visitorId,
      signUpType: params.signUpType.trim(),
      path: params.path?.trim() || undefined,
      createdAt: new Date(),
    });
  }

  async getChartPoints(
    filters: ResolvedDashboardFilters,
  ): Promise<VisitorAnalyticsChartPoint[]> {
    const now = new Date();
    const granularity = filters.granularity ?? 'monthly';
    const dateRange = filters.dateRange ?? this.defaultTrailingRange(now, granularity);

    const events = await this.eventModel
      .find({
        createdAt: { $gte: dateRange.from, $lte: dateRange.to },
      })
      .select('eventType visitorId createdAt')
      .lean()
      .exec();

    const buckets = new Map<string, AnalyticsBucket>();

    const ensureBucket = (date: Date): AnalyticsBucket => {
      const bucketId = this.resolveBucketId(date, granularity);
      const key = this.bucketKey(bucketId);
      const existing = buckets.get(key);
      if (existing) return existing;

      const created: AnalyticsBucket = {
        bucket: bucketId,
        label: formatBucketLabel(granularity, bucketId),
        pageViews: 0,
        visitorIds: new Set<string>(),
        signUps: 0,
      };
      buckets.set(key, created);
      return created;
    };

    for (const row of events) {
      if (!row.createdAt) continue;
      const bucket = ensureBucket(new Date(row.createdAt));
      const visitorId = String(row.visitorId ?? '').trim();
      if (row.eventType === 'page_view') {
        bucket.pageViews += 1;
        if (visitorId) bucket.visitorIds.add(visitorId);
      } else if (row.eventType === 'sign_up') {
        bucket.signUps += 1;
        if (visitorId) bucket.visitorIds.add(visitorId);
      }
    }

    return [...buckets.values()]
      .sort((a, b) => this.compareBuckets(a.bucket, b.bucket, granularity))
      .map((bucket) => ({
        label: bucket.label,
        year: bucket.bucket.year ?? 0,
        month: bucket.bucket.month,
        quarter: bucket.bucket.quarter,
        week: bucket.bucket.week,
        pageViews: bucket.pageViews,
        visitors: bucket.visitorIds.size,
        signUps: bucket.signUps,
      }));
  }

  async hasAnyEvents(): Promise<boolean> {
    const sample = await this.eventModel.findOne().select('_id').lean().exec();
    return Boolean(sample);
  }

  private defaultTrailingRange(
    now: Date,
    granularity: DashboardGranularity,
  ): { from: Date; to: Date } {
    const to = new Date(now);
    const from = new Date(now);
    if (granularity === 'weekly') {
      from.setDate(from.getDate() - 7 * 11);
    } else if (granularity === 'quarterly') {
      from.setMonth(from.getMonth() - 11);
    } else {
      from.setMonth(from.getMonth() - 5);
    }
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }

  private resolveBucketId(
    date: Date,
    granularity: DashboardGranularity,
  ): BucketId {
    if (granularity === 'weekly') {
      return {
        year: this.isoWeekYear(date),
        week: this.isoWeek(date),
      };
    }
    if (granularity === 'quarterly') {
      return {
        year: date.getUTCFullYear(),
        quarter: Math.ceil((date.getUTCMonth() + 1) / 3),
      };
    }
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
    };
  }

  private bucketKey(bucket: BucketId): string {
    return `${bucket.year ?? 0}:${bucket.month ?? 0}:${bucket.quarter ?? 0}:${bucket.week ?? 0}`;
  }

  private compareBuckets(
    a: BucketId,
    b: BucketId,
    granularity: DashboardGranularity,
  ): number {
    const ay = a.year ?? 0;
    const by = b.year ?? 0;
    if (ay !== by) return ay - by;
    if (granularity === 'weekly') return (a.week ?? 0) - (b.week ?? 0);
    if (granularity === 'quarterly') return (a.quarter ?? 0) - (b.quarter ?? 0);
    return (a.month ?? 0) - (b.month ?? 0);
  }

  private isoWeekYear(date: Date): number {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
    return target.getFullYear();
  }

  private isoWeek(date: Date): number {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
    const week1 = new Date(target.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((target.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7,
      )
    );
  }
}
