import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message || (exceptionResponse as any).error || 'Internal server error'
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    // Format 404 Not Found error messages professionally
    if (
      status === HttpStatus.NOT_FOUND ||
      (typeof message === 'string' && message.startsWith('Cannot '))
    ) {
      message = `Route Not Found for ${request.method} ${request.url}`;
    }

    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(message)} - Path: ${request.url}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
