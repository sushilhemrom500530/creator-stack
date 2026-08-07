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

    let message: any = 'Internal server error';
    let errors: any = undefined;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resObj = exceptionResponse as any;
      if (resObj.errors && Array.isArray(resObj.errors)) {
        message = resObj.message || 'Validation failed.';
        errors = resObj.errors;
      } else if (Array.isArray(resObj.message)) {
        message = 'Validation failed.';
        errors = resObj.message.map((msg: string) => ({
          field: msg.split(' ')[0] || 'field',
          message: msg,
        }));
      } else {
        message = resObj.message || resObj.error || 'Internal server error';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

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

    const responseBody: any = {
      success: false,
      statusCode: status,
      message,
    };

    if (errors) {
      responseBody.errors = errors;
    }

    responseBody.path = request.url;
    responseBody.timestamp = new Date().toISOString();

    response.status(status).json(responseBody);
  }
}
