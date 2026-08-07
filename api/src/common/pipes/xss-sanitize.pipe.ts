import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import xss from 'xss';

@Injectable()
export class XssSanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return xss(value);
    }
    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transform(item, { type: 'body' }));
    }
    const sanitizedObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string') {
        sanitizedObj[key] = xss(val);
      } else if (typeof val === 'object' && val !== null) {
        sanitizedObj[key] = this.sanitizeObject(val);
      } else {
        sanitizedObj[key] = val;
      }
    }
    return sanitizedObj;
  }
}
