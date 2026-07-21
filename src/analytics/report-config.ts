/**
 * Declarative GA4 report configurations.
 * Add metrics, dimensions, filters, or auth event mappings here
 * without changing analytics.service / google-analytics.client logic.
 */

export interface Ga4DateRange {
  startDate: string;
  endDate: string;
}

export interface ReportConfig {
  /** GA4 metric API names, e.g. screenPageViews, eventCount */
  metrics: string[];
  /** GA4 dimension API names, e.g. eventName */
  dimensions?: string[];
  /** Defaults to {@link DEFAULT_DATE_RANGE} when omitted */
  dateRanges?: Ga4DateRange[];
  /** Restrict rows to a set of dimension values (AND across entries) */
  dimensionEqualsFilters?: Array<{
    dimension: string;
    values: string[];
  }>;
}

export interface NormalizedReportRow {
  dimensions: Record<string, string>;
  metrics: Record<string, number>;
}

export interface NormalizedReport {
  rows: NormalizedReportRow[];
  totals: Record<string, number>;
}

/** Maps a GA4 custom event name to a camelCase response field */
export interface AuthEventMapping {
  eventName: string;
  responseKey: string;
}

/** Rolling window used when a report does not specify dateRanges */
export const DEFAULT_DATE_RANGE: Ga4DateRange = {
  startDate: '28daysAgo',
  endDate: 'today',
};

export const WEBSITE_ANALYTICS_REPORT: ReportConfig = {
  metrics: [
    'screenPageViews',
    'activeUsers',
    'newUsers',
    'sessions',
    'engagedSessions',
    'userEngagementDuration',
  ],
};

/**
 * Auth property event → response key mapping.
 * Append entries here to expose additional gtag() events
 * (e.g. login → logins) without changing service logic.
 */
export const AUTH_EVENT_MAPPINGS: readonly AuthEventMapping[] = [
  { eventName: 'sign_up', responseKey: 'signUps' },
  // Future:
  // { eventName: 'login', responseKey: 'logins' },
  // { eventName: 'logout', responseKey: 'logouts' },
  // { eventName: 'password_reset', responseKey: 'passwordResets' },
  // { eventName: 'email_verified', responseKey: 'emailVerified' },
];

export function buildAuthEventsReportConfig(
  mappings: readonly AuthEventMapping[] = AUTH_EVENT_MAPPINGS,
): ReportConfig {
  return {
    metrics: ['eventCount'],
    dimensions: ['eventName'],
    dimensionEqualsFilters: [
      {
        dimension: 'eventName',
        values: mappings.map((m) => m.eventName),
      },
    ],
  };
}

export interface WebsiteAnalytics {
  pageViews: number;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  engagedSessions: number;
  averageEngagementTime: number;
}

/** Derived from {@link AUTH_EVENT_MAPPINGS} so new events stay typed */
export type AuthenticationAnalytics = {
  [K in (typeof AUTH_EVENT_MAPPINGS)[number]['responseKey']]: number;
};

export interface DashboardAnalytics {
  website: WebsiteAnalytics | null;
  authentication: AuthenticationAnalytics | null;
}
