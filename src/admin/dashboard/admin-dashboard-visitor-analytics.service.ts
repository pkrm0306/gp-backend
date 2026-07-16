import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../../website/schemas/contact-message.schema';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from '../../website/schemas/newsletter-subscriber.schema';
import {
  Notification,
  NotificationDocument,
} from '../../common/schemas/notification.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import {
  formatBucketLabel,
  type DashboardGranularity,
} from '../utils/dashboard-metrics-filters.util';
import type {
  AdminDashboardVisitorAnalytics,
  VisitorAnalyticsChartPoint,
} from './admin-dashboard-visitor-analytics.types';
import { WebsiteAnalyticsService } from '../../website/website-analytics.service';

type BucketId = {
  year?: number;
  month?: number;
  quarter?: number;
  week?: number;
};

type MonthBucket = {
  bucket: BucketId;
  label: string;
  pageViews: number;
  visitorEmails: Set<string>;
  signUps: number;
};

const SERIES_META = [
  { key: 'pageViews' as const, label: 'Page Views', color: '#3B82F6', order: 1 },
  { key: 'visitors' as const, label: 'Visitors', color: '#22C55E', order: 2 },
  { key: 'signUps' as const, label: 'Sign-ups', color: '#8B5CF6', order: 3 },
];

const PAGE_VIEWS_PER_ENGAGEMENT = 3;

@Injectable()
export class AdminDashboardVisitorAnalyticsService {
  constructor(
    @InjectModel(ContactMessage.name)
    private readonly contactMessageModel: Model<ContactMessageDocument>,
    @InjectModel(NewsletterSubscriber.name)
    private readonly newsletterModel: Model<NewsletterSubscriberDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    private readonly websiteAnalytics: WebsiteAnalyticsService,
  ) {}

  async getVisitorAnalytics(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardVisitorAnalytics> {
    const hasWebsiteEvents = await this.websiteAnalytics.hasAnyEvents();
    if (hasWebsiteEvents) {
      const chart = await this.websiteAnalytics.getChartPoints(filters);
      return this.buildResponse(chart, filters.granularity ?? 'monthly', 'website', {
        pageViews:
          'Page views recorded by the public website and stored via POST /website/analytics/collect.',
        visitors:
          'Unique anonymous visitor sessions (visitorId) per period from website analytics events.',
        signUps:
          'Sign-up events from newsletter subscriptions, vendor registrations, and website sign_up beacons.',
      });
    }

    return this.getEstimatedVisitorAnalytics(filters);
  }

  private async getEstimatedVisitorAnalytics(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardVisitorAnalytics> {
    const now = new Date();
    const granularity = filters.granularity ?? 'monthly';
    const dateRange = filters.dateRange ?? this.defaultTrailingRange(now, granularity);

    const [contacts, newsletters, inquiries, manufacturers] = await Promise.all([
      this.contactMessageModel
        .find({
          createdAt: { $gte: dateRange.from, $lte: dateRange.to },
        })
        .select('email createdAt')
        .lean()
        .exec(),
      this.newsletterModel
        .find({
          createdAt: { $gte: dateRange.from, $lte: dateRange.to },
        })
        .select('email createdAt')
        .lean()
        .exec(),
      this.notificationModel
        .find({
          source: 'website',
          referenceType: 'manufacturer_inquiry',
          createdAt: { $gte: dateRange.from, $lte: dateRange.to },
        })
        .select('actorName createdAt')
        .lean()
        .exec(),
      this.manufacturerModel
        .find({
          createdAt: { $gte: dateRange.from, $lte: dateRange.to },
        })
        .select('vendor_email createdAt')
        .lean()
        .exec(),
    ]);

    const buckets = new Map<string, MonthBucket>();

    const ensureBucket = (date: Date): MonthBucket => {
      const bucketId = this.resolveBucketId(date, granularity);
      const key = this.bucketKey(bucketId);
      const existing = buckets.get(key);
      if (existing) return existing;

      const created: MonthBucket = {
        bucket: bucketId,
        label: formatBucketLabel(granularity, bucketId),
        pageViews: 0,
        visitorEmails: new Set<string>(),
        signUps: 0,
      };
      buckets.set(key, created);
      return created;
    };

    for (const row of contacts) {
      if (!row.createdAt) continue;
      const bucket = ensureBucket(new Date(row.createdAt));
      bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
      const email = String(row.email ?? '').trim().toLowerCase();
      if (email) bucket.visitorEmails.add(email);
    }

    for (const row of newsletters) {
      if (!row.createdAt) continue;
      const bucket = ensureBucket(new Date(row.createdAt));
      bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
      bucket.signUps += 1;
      const email = String(row.email ?? '').trim().toLowerCase();
      if (email) bucket.visitorEmails.add(email);
    }

    for (const row of inquiries) {
      if (!row.createdAt) continue;
      const bucket = ensureBucket(new Date(row.createdAt));
      bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
      const identity = String(row.actorName ?? '').trim().toLowerCase();
      if (identity) bucket.visitorEmails.add(`inquiry:${identity}`);
    }

    for (const row of manufacturers) {
      if (!row.createdAt) continue;
      const bucket = ensureBucket(new Date(row.createdAt));
      bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
      bucket.signUps += 1;
      const email = String(row.vendor_email ?? '').trim().toLowerCase();
      if (email) bucket.visitorEmails.add(email);
    }

    const sortedBuckets = [...buckets.values()].sort((a, b) =>
      this.compareBuckets(a.bucket, b.bucket, granularity),
    );

    const chart: VisitorAnalyticsChartPoint[] = sortedBuckets.map((bucket) => ({
      label: bucket.label,
      year: bucket.bucket.year ?? 0,
      month: bucket.bucket.month,
      quarter: bucket.bucket.quarter,
      week: bucket.bucket.week,
      pageViews: bucket.pageViews,
      visitors: bucket.visitorEmails.size,
      signUps: bucket.signUps,
    }));

    return this.buildResponse(chart, granularity, 'estimated', {
      pageViews:
        'Estimated from recorded public website engagements until the website analytics beacon is deployed.',
      visitors:
        'Unique visitor identities per bucket (distinct contact/newsletter emails and manufacturer inquiry submitters).',
      signUps:
        'New newsletter subscribers plus new manufacturer (vendor portal) registrations.',
    });
  }

  private buildResponse(
    chart: VisitorAnalyticsChartPoint[],
    granularity: DashboardGranularity,
    source: 'website' | 'estimated',
    methodology: AdminDashboardVisitorAnalytics['methodology'],
  ): AdminDashboardVisitorAnalytics {
    const totals = chart.reduce(
      (acc, point) => ({
        pageViews: acc.pageViews + point.pageViews,
        visitors: acc.visitors + point.visitors,
        signUps: acc.signUps + point.signUps,
      }),
      { pageViews: 0, visitors: 0, signUps: 0 },
    );

    const maxValue = chart.reduce(
      (max, point) =>
        Math.max(max, point.pageViews, point.visitors, point.signUps),
      0,
    );

    return {
      title: 'Visitor Analytics',
      subtitle: 'Platform traffic and engagement',
      granularity,
      source,
      series: SERIES_META,
      chart,
      totals,
      yAxis: {
        min: 0,
        suggestedMax: this.suggestYMax(maxValue),
      },
      methodology,
    };
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

  private suggestYMax(maxValue: number): number {
    if (maxValue <= 0) return 10;
    if (maxValue <= 10) return 10;
    if (maxValue <= 100) return Math.ceil(maxValue / 10) * 10;
    if (maxValue <= 1000) return Math.ceil(maxValue / 100) * 100;
    if (maxValue <= 10000) return Math.ceil(maxValue / 1000) * 1000;
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const normalized = maxValue / magnitude;
    const nice =
      normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return nice * magnitude;
  }
}
