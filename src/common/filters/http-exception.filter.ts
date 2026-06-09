import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string | string[]) || message;
        error = (responseObj.error as string) || error;
      }
    } else if (exception instanceof SyntaxError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.formatInvalidJsonMessage(exception.message);
      error = 'Bad Request';
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      (exception as { type?: string }).type === 'entity.parse.failed'
    ) {
      status = HttpStatus.BAD_REQUEST;
      const parseMessage =
        (exception as { message?: string }).message || 'Invalid JSON body';
      message = this.formatInvalidJsonMessage(parseMessage);
      error = 'Bad Request';
    }

    if (Array.isArray(message)) {
      message = message.join('; ');
    }

    // Server-side diagnostic logging (sanitized response is still returned to client)
    const reqMethod = request?.method || 'UNKNOWN';
    const reqPath = request?.path || request?.url || 'UNKNOWN_PATH';
    const isMissingStaticUpload =
      status === HttpStatus.NOT_FOUND &&
      reqMethod === 'GET' &&
      typeof reqPath === 'string' &&
      reqPath.startsWith('/uploads');

    if (!isMissingStaticUpload) {
      console.error(
        `[HttpExceptionFilter] ${reqMethod} ${reqPath} -> ${status}`,
        {
          message,
          error,
          exceptionName: (exception as any)?.name,
          exceptionMessage: (exception as any)?.message,
          stack: (exception as any)?.stack,
          response:
            exception instanceof HttpException ? exception.getResponse() : null,
        },
      );
    }

    if (
      status === HttpStatus.BAD_REQUEST &&
      request.method === 'POST' &&
      request.path === '/auth/login' &&
      Array.isArray(message)
    ) {
      message = `${message.join(' ')} — No login data received. Use Body → raw → JSON (Content-Type: application/json) or x-www-form-urlencoded with keys email and password; do not use Body → none.`;
    }

    const apiResponse: ApiResponse = {
      success: false,
      message,
      error,
    };

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (body && typeof body === 'object' && !Array.isArray(body)) {
        const extra = body as Record<string, unknown>;
        if (extra.code && typeof extra.code === 'string') {
          apiResponse.code = extra.code;
        }
        const fieldErrorSource = extra.fieldErrors ?? extra.errors;
        if (
          fieldErrorSource &&
          typeof fieldErrorSource === 'object' &&
          !Array.isArray(fieldErrorSource)
        ) {
          apiResponse.fieldErrors = fieldErrorSource as Record<string, string>;
        }
        if (Array.isArray(extra.issues)) {
          apiResponse.issues = extra.issues as ApiResponse['issues'];
        }
      }
    }

    response.status(status).json(apiResponse);
  }

  private formatInvalidJsonMessage(raw: string): string {
    if (/bad control character|unexpected token|json at position/i.test(raw)) {
      return (
        'Invalid JSON request body. String values cannot contain raw line breaks — ' +
        'use \\n inside the string (e.g. "line one\\nline two") or keep text on one line.'
      );
    }
    return raw || 'Invalid JSON request body';
  }
}
