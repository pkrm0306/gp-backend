import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BetaAnalyticsDataClient, protos } from '@google-analytics/data';
import {
  DEFAULT_DATE_RANGE,
  type NormalizedReport,
  type NormalizedReportRow,
  type ReportConfig,
} from './report-config';

type IFilterExpression =
  protos.google.analytics.data.v1beta.IFilterExpression;
type IRunReportRequest = protos.google.analytics.data.v1beta.IRunReportRequest;
type IRunReportResponse =
  protos.google.analytics.data.v1beta.IRunReportResponse;

@Injectable()
export class GoogleAnalyticsClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GoogleAnalyticsClient.name);
  private client: BetaAnalyticsDataClient | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const clientOptions = this.resolveClientOptions();
    if (!clientOptions) {
      this.logger.warn(
        'GA4 credentials are missing or invalid. Set GA4_CLIENT_EMAIL + GA4_PRIVATE_KEY ' +
          '(and optionally GA4_PROJECT_ID), or GA4_SERVICE_ACCOUNT_JSON.',
      );
      return;
    }

    this.client = new BetaAnalyticsDataClient(clientOptions);
    this.logger.log('Google Analytics Data API client initialized');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  /**
   * Executes a GA4 runReport against the given property and returns
   * a normalized row / totals structure.
   */
  async getReport(
    propertyId: string,
    reportConfig: ReportConfig,
  ): Promise<NormalizedReport> {
    if (!this.client) {
      throw new Error(
        'Google Analytics client is not initialized. Set GA4_CLIENT_EMAIL + GA4_PRIVATE_KEY ' +
          '(and optionally GA4_PROJECT_ID), or GA4_SERVICE_ACCOUNT_JSON.',
      );
    }

    const trimmedPropertyId = propertyId.trim();
    if (!trimmedPropertyId) {
      throw new Error('GA4 property ID is required');
    }

    const dateRanges = reportConfig.dateRanges?.length
      ? reportConfig.dateRanges
      : [DEFAULT_DATE_RANGE];

    const request: IRunReportRequest = {
      property: `properties/${trimmedPropertyId}`,
      dateRanges,
      metrics: reportConfig.metrics.map((name) => ({ name })),
      dimensions: (reportConfig.dimensions ?? []).map((name) => ({ name })),
      dimensionFilter: this.buildDimensionFilter(
        reportConfig.dimensionEqualsFilters,
      ),
    };

    const [response] = await this.client.runReport(request);
    return this.normalizeResponse(response, reportConfig);
  }

  private buildDimensionFilter(
    filters?: ReportConfig['dimensionEqualsFilters'],
  ): IFilterExpression | undefined {
    if (!filters?.length) return undefined;

    const expressions: IFilterExpression[] = filters.map((filter) => ({
      filter: {
        fieldName: filter.dimension,
        inListFilter: {
          values: filter.values,
        },
      },
    }));

    if (expressions.length === 1) {
      return expressions[0];
    }

    return { andGroup: { expressions } };
  }

  private normalizeResponse(
    response: IRunReportResponse,
    reportConfig: ReportConfig,
  ): NormalizedReport {
    const dimensionNames = reportConfig.dimensions ?? [];
    const metricNames = reportConfig.metrics;

    const rows: NormalizedReportRow[] = (response.rows ?? []).map((row) => {
      const dimensions: Record<string, string> = {};
      dimensionNames.forEach((name, index) => {
        dimensions[name] = row.dimensionValues?.[index]?.value ?? '';
      });

      const metrics: Record<string, number> = {};
      metricNames.forEach((name, index) => {
        metrics[name] = this.toNumber(row.metricValues?.[index]?.value);
      });

      return { dimensions, metrics };
    });

    const totals: Record<string, number> = {};
    const totalRow = response.totals?.[0];
    metricNames.forEach((name, index) => {
      const fromTotals = totalRow?.metricValues?.[index]?.value;
      if (fromTotals !== undefined && fromTotals !== null) {
        totals[name] = this.toNumber(fromTotals);
        return;
      }
      totals[name] = rows.reduce(
        (sum, row) => sum + (row.metrics[name] ?? 0),
        0,
      );
    });

    return { rows, totals };
  }

  private toNumber(value: string | null | undefined): number {
    if (value === undefined || value === null || value === '') return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private resolveClientOptions():
    | ConstructorParameters<typeof BetaAnalyticsDataClient>[0]
    | undefined {
    const fromSplitEnv = this.resolveSplitEnvCredentials();
    if (fromSplitEnv) return fromSplitEnv;

    const fromJson = this.resolveJsonCredentials();
    if (fromJson) return fromJson;

    return undefined;
  }

  /** Preferred: GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY, GA4_PROJECT_ID */
  private resolveSplitEnvCredentials():
    | ConstructorParameters<typeof BetaAnalyticsDataClient>[0]
    | undefined {
    const clientEmail = this.configService.get<string>('GA4_CLIENT_EMAIL')?.trim();
    const privateKeyRaw = this.configService.get<string>('GA4_PRIVATE_KEY');
    const projectId = this.configService.get<string>('GA4_PROJECT_ID')?.trim();

    if (!clientEmail || !privateKeyRaw?.trim()) return undefined;

    const options: ConstructorParameters<typeof BetaAnalyticsDataClient>[0] = {
      credentials: {
        client_email: clientEmail,
        private_key: privateKeyRaw.replace(/\\n/g, '\n'),
      },
    };

    if (projectId) {
      options.projectId = projectId;
    }

    return options;
  }

  /** Fallback: single-line GA4_SERVICE_ACCOUNT_JSON */
  private resolveJsonCredentials():
    | ConstructorParameters<typeof BetaAnalyticsDataClient>[0]
    | undefined {
    const raw = this.configService.get<string>('GA4_SERVICE_ACCOUNT_JSON');
    if (!raw?.trim()) return undefined;

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (typeof parsed.private_key === 'string') {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }

      const options: ConstructorParameters<typeof BetaAnalyticsDataClient>[0] = {
        credentials: parsed,
      };

      const projectId =
        typeof parsed.project_id === 'string' ? parsed.project_id.trim() : '';
      if (projectId) {
        options.projectId = projectId;
      }

      return options;
    } catch (error) {
      this.logger.error(
        'Failed to parse GA4_SERVICE_ACCOUNT_JSON',
        error instanceof Error ? error.stack : undefined,
      );
      return undefined;
    }
  }
}
