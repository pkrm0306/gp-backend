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
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || error;
      }
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

    response.status(status).json(apiResponse);
  }
}
