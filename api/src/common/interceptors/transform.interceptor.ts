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

const SENSITIVE_KEYS = new Set([
  'accessTokenEncrypted',
  'refreshTokenEncrypted',
  'password',
  'passwordHash',
  'otp',
  'otpExpiresAt',
  'jwtSecret',
  'cookieSecret',
  'encryptionKey',
  'appSecret',
]);

function scrubSensitiveFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  // If it's a Mongoose document or has toObject / toJSON
  if (typeof obj.toObject === 'function') {
    obj = obj.toObject();
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => scrubSensitiveFields(item));
  }

  if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof RegExp)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_KEYS.has(key)) {
        continue; // Strip sensitive key from response payload
      }
      cleaned[key] = scrubSensitiveFields(value);
    }
    return cleaned;
  }

  return obj;
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

        // Apply recursive token scrubber to protect all sensitive keys
        const sanitizedData = scrubSensitiveFields(data);

        const responseObj: any = {
          success: true,
          message,
        };

        if (meta !== undefined) {
          responseObj.meta = meta;
        }

        responseObj.data = sanitizedData;

        return responseObj;
      }),
    );
  }
}
