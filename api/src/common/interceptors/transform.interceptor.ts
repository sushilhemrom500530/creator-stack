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
  meta?: any;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        // Return raw response for status endpoints or raw string returns
        if (res && (res.status === 'online' || typeof res === 'string')) {
          return res;
        }

        const message = res?.message || 'Operation successful';
        const meta = res?.meta;

        let data = res;

        if (res && typeof res === 'object' && !Array.isArray(res)) {
          if (res.data !== undefined) {
            data = res.data;
          } else if (res.results !== undefined) {
            data = res.results;
          } else if (res.result !== undefined) {
            data = res.result;
          } else if (res.items !== undefined) {
            data = res.items;
          } else {
            // Exclude 'message' and 'meta' from being duplicated inside data payload
            const { message: _msg, meta: _meta, ...cleanData } = res;
            data = cleanData;
          }
        }

        const responseObj: any = {
          success: true,
          message,
        };

        if (meta !== undefined) {
          responseObj.meta = meta;
        }

        responseObj.data = data;

        return responseObj;
      }),
    );
  }
}
