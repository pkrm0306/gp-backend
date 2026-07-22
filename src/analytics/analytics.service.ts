import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAnalyticsClient } from './google-analytics.client';
import {
  AUTH_EVENT_MAPPINGS,
  WEBSITE_ANALYTICS_REPORT,
  buildAuthEventsReportConfig,
  type AuthenticationAnalytics,
  type DashboardAnalytics,
  type WebsiteAnalytics,
} from './report-config';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly gaClient: GoogleAnalyticsClient,
    private readonly configService: ConfigService,
  ) {}

  async getWebsiteAnalytics(): Promise<WebsiteAnalytics> {
    const propertyId = this.requirePropertyId('GA4_WEBSITE_PROPERTY_ID');
    const report = await this.gaClient.getReport(
      propertyId,
      WEBSITE_ANALYTICS_REPORT,
    );

    const pageViews = report.totals.screenPageViews ?? 0;
    const activeUsers = report.totals.activeUsers ?? 0;
    const newUsers = report.totals.newUsers ?? 0;
    const sessions = report.totals.sessions ?? 0;
    const engagedSessions = report.totals.engagedSessions ?? 0;
    const userEngagementDuration = report.totals.userEngagementDuration ?? 0;

    return {
      pageViews,
      activeUsers,
      newUsers,
      sessions,
      engagedSessions,
      averageEngagementTime:
        activeUsers > 0 ? userEngagementDuration / activeUsers : 0,
    };
  }

  /**
   * Aggregated custom event counts from the auth GA4 property.
   * Response keys come from {@link AUTH_EVENT_MAPPINGS} so new events
   * can be added in report-config without changing this method.
   */
  async getAuthenticationAnalytics(): Promise<AuthenticationAnalytics> {
    const propertyId = this.requirePropertyId('GA4_AUTH_PROPERTY_ID');
    const reportConfig = buildAuthEventsReportConfig(AUTH_EVENT_MAPPINGS);
    const report = await this.gaClient.getReport(propertyId, reportConfig);

    const countsByEventName = new Map<string, number>();
    for (const row of report.rows) {
      const eventName = row.dimensions.eventName;
      if (!eventName) continue;
      countsByEventName.set(
        eventName,
        (countsByEventName.get(eventName) ?? 0) + (row.metrics.eventCount ?? 0),
      );
    }

    const result = {} as AuthenticationAnalytics;
    for (const mapping of AUTH_EVENT_MAPPINGS) {
      result[mapping.responseKey] =
        countsByEventName.get(mapping.eventName) ?? 0;
    }
    return result;
  }

  /**
   * Fetches website + authentication analytics concurrently.
   * A failure on one property is logged and returned as null so the
   * other property's data can still be delivered.
   */
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const [websiteResult, authenticationResult] = await Promise.all([
      this.safeFetch('website', () => this.getWebsiteAnalytics()),
      this.safeFetch('authentication', () => this.getAuthenticationAnalytics()),
    ]);

    return {
      website: websiteResult,
      authentication: authenticationResult,
    };
  }

  private async safeFetch<T>(
    source: string,
    loader: () => Promise<T>,
  ): Promise<T | null> {
    try {
      return await loader();
    } catch (error) {
      this.logger.error(
        `Failed to retrieve ${source} analytics from GA4`,
        error instanceof Error ? error.stack : String(error),
      );
      return null;
    }
  }

  private requirePropertyId(envKey: string): string {
    const value = this.configService.get<string>(envKey)?.trim();
    if (!value) {
      throw new Error(`${envKey} is not configured`);
    }
    return value;
  }
}
