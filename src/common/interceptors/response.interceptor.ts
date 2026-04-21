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
    /** CSV/binary exports must not be wrapped as JSON */
    if (
      url.includes('/sectors/export') ||
      url.includes('/standards/export') ||
      url.includes('/categories/export') ||
      url.includes('/api/admin/products/export')
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const response: Record<string, unknown> = {
          success: true,
          message: (data as { message?: string })?.message || 'Success',
          data:
            (data as { data?: unknown })?.data !== undefined
              ? (data as { data: unknown }).data
              : data,
        };
        const payload = data as {
          total?: number;
          page?: number;
          limit?: number;
          totalCount?: number;
          currentPage?: number;
          totalPages?: number;
        };
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
        const withUrn = data as { urnStatus?: number };
        if (typeof withUrn.urnStatus === 'number' && !Number.isNaN(withUrn.urnStatus)) {
          response.urnStatus = withUrn.urnStatus;
        }
        return response as unknown as ApiResponse;
      }),
    );
  }
}
