import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import sanitize from 'mongo-sanitize';

@Injectable()
export class MongoSanitizeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    if (req.body && typeof req.body === 'object') {
      sanitize(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      sanitize(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      sanitize(req.params);
    }
    next();
  }
}
