import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import {
  ZOHO_DEFAULT_BASE_URL,
  ZOHO_DEFAULT_RETRY_ATTEMPTS,
  ZOHO_DEFAULT_RETRY_DELAY_MS,
} from '../helpers/zoho.constants';
import {
  ZohoApiError,
  ZohoApiResponse,
} from '../interfaces/zoho-api-response.interface';
import { ZohoTokenService } from './zoho-token.service';

@Injectable()
export class ZohoApiClientService {
  private readonly logger = new Logger(ZohoApiClientService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: ZohoTokenService,
  ) {}

  get<T = unknown>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<ZohoApiResponse<T>> {
    return this.request<T>('GET', path, undefined, config);
  }

  post<T = unknown>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ZohoApiResponse<T>> {
    return this.request<T>('POST', path, data, config);
  }

  put<T = unknown>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ZohoApiResponse<T>> {
    return this.request<T>('PUT', path, data, config);
  }

  patch<T = unknown>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ZohoApiResponse<T>> {
    return this.request<T>('PATCH', path, data, config);
  }

  async request<T = unknown>(
    method: Method,
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ZohoApiResponse<T>> {
    const attempts = this.retryAttempts();
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const accessToken =
          attempt === 1
            ? await this.tokenService.getValidAccessToken()
            : await this.tokenService.refreshAccessToken();

        const response = await axios.request<T>({
          ...config,
          method,
          url: this.buildUrl(path),
          data,
          timeout: this.requestTimeoutMs(),
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
            ...(config?.headers || {}),
          },
        });

        return {
          ok: true,
          statusCode: response.status,
          data: response.data,
          zohoRequestId: this.resolveRequestId(response.headers),
        };
      } catch (error) {
        lastError = error;
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        const shouldRetry =
          attempt < attempts && (!status || status === 401 || status >= 500);

        if (!shouldRetry) {
          break;
        }

        this.logger.warn(
          `Retrying Zoho ${method} ${path}; attempt ${attempt + 1}/${attempts}`,
        );
        await this.delay(this.retryDelayMs() * attempt);
      }
    }

    const normalized = this.normalizeError(lastError);
    this.logger.error(
      `Zoho ${method} ${path} failed: ${normalized.error?.message}`,
    );
    return normalized as ZohoApiResponse<T>;
  }

  private buildUrl(path: string): string {
    const baseUrl =
      this.configService.get<string>('ZOHO_BASE_URL') || ZOHO_DEFAULT_BASE_URL;
    const normalizedBase = baseUrl.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private normalizeError(error: unknown): ZohoApiResponse {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as
        | { code?: string; message?: string; details?: unknown }
        | undefined;
      const apiError: ZohoApiError = {
        code: body?.code,
        message: body?.message || error.message || 'Zoho API request failed',
        details: body?.details || body,
      };
      return {
        ok: false,
        statusCode: error.response?.status || 503,
        error: apiError,
        zohoRequestId: this.resolveRequestId(error.response?.headers),
      };
    }

    if (error instanceof ServiceUnavailableException) {
      return {
        ok: false,
        statusCode: 503,
        error: { message: error.message },
      };
    }

    return {
      ok: false,
      statusCode: 500,
      error: {
        message: error instanceof Error ? error.message : 'Zoho request failed',
      },
    };
  }

  private resolveRequestId(headers?: unknown): string | undefined {
    if (!headers || typeof headers !== 'object') return undefined;
    const value =
      (headers as Record<string, string | string[]>)['x-zcrm-request-id'] ||
      (headers as Record<string, string | string[]>)['x-request-id'];
    return Array.isArray(value) ? value[0] : value;
  }

  private retryAttempts(): number {
    return (
      Number(this.configService.get<string>('ZOHO_RETRY_ATTEMPTS')) ||
      ZOHO_DEFAULT_RETRY_ATTEMPTS
    );
  }

  private retryDelayMs(): number {
    return (
      Number(this.configService.get<string>('ZOHO_RETRY_DELAY_MS')) ||
      ZOHO_DEFAULT_RETRY_DELAY_MS
    );
  }

  private requestTimeoutMs(): number {
    return (
      Number(this.configService.get<string>('ZOHO_HTTP_TIMEOUT_MS')) || 15000
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
