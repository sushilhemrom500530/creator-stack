import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        success: false,
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}
