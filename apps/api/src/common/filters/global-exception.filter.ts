import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorPayload } from '@educariera/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      ((request as unknown as Record<string, string>)['requestId']) ||
      'unknown-request-id';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected internal error occurred';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resPayload = exception.getResponse();
      if (typeof resPayload === 'object' && resPayload !== null) {
        code = (resPayload as Record<string, unknown>)['error'] as string || 'HTTP_ERROR';
        message = (resPayload as Record<string, unknown>)['message'] as string || exception.message;
        details = (resPayload as Record<string, unknown>)['details'];
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const payload: ApiErrorPayload = {
      error: {
        code,
        message,
        requestId,
        ...(details ? { details } : {}),
      },
    };

    response.status(status).json(payload);
  }
}
