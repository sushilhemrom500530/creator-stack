import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && (data.status === 'online' || typeof data === 'string')) {
          return data;
        }
        return {
          success: true,
          message: data?.message || 'Operation successful',
          data: data?.data !== undefined ? data.data : data,
          meta: data?.meta,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
