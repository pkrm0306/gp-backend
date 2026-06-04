import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const url = (req?.url as string) || '';
    /** CSV/binary exports and raw file streams must not be wrapped as JSON */
    if (
      url.includes('/sectors/export') ||
      url.includes('/standards/export') ||
      url.includes('/categories/export') ||
      url.includes('/api/manufacturers/export') ||
      url.includes('/api/admin/products/export') ||
      url.includes('/products/certificates/') ||
      /\/api\/standards\/[^/]+\/file(?:\?|$)/.test(url)
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (data == null || typeof data !== 'object') {
          return data;
        }
        const payload = data as Record<string, unknown>;
        const response: Record<string, unknown> = {
          success: true,
          message: (payload.message as string) || 'Success',
          data: payload.data !== undefined ? payload.data : data,
        };
        /** Preserve top-level fields (e.g. renewContext) when controller also returns `data`. */
        for (const [key, value] of Object.entries(payload)) {
          if (key === 'message' || key === 'success' || key === 'data') {
            continue;
          }
          if (value !== undefined) {
            response[key] = value;
          }
        }
        const metrics = data as {
          total?: number;
          page?: number;
          limit?: number;
          totalCount?: number;
          currentPage?: number;
          totalPages?: number;
          pagination?: unknown;
          meta?: unknown;
          unreadCount?: number;
          markedCount?: number;
        };
        if (payload?.pagination !== undefined) {
          response.pagination = payload.pagination;
        }
        if (payload?.meta !== undefined) {
          response.meta = payload.meta;
        }
        if (typeof payload?.total === 'number') {
          response.total = payload.total;
        }
        if (typeof payload?.page === 'number') {
          response.page = payload.page;
        }
        if (typeof payload?.limit === 'number') {
          response.limit = payload.limit;
        }
        if (typeof payload?.totalCount === 'number') {
          response.totalCount = payload.totalCount;
        }
        if (typeof payload?.currentPage === 'number') {
          response.currentPage = payload.currentPage;
        }
        if (typeof payload?.totalPages === 'number') {
          response.totalPages = payload.totalPages;
        }
        if (typeof payload?.unreadCount === 'number') {
          response.unreadCount = payload.unreadCount;
        }
        if (typeof payload?.markedCount === 'number') {
          response.markedCount = payload.markedCount;
        }
        const withUrn = data as { urnStatus?: number };
        if (
          typeof withUrn.urnStatus === 'number' &&
          !Number.isNaN(withUrn.urnStatus)
        ) {
          response.urnStatus = withUrn.urnStatus;
        }
        return response as unknown as ApiResponse;
      }),
    );
  }
}
