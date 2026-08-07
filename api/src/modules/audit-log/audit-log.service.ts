import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.schema';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async log(data: {
    userId: string;
    action: string;
    resource: string;
    details?: string;
    ipAddress: string;
    userAgent?: string;
  }) {
    try {
      const entry = new this.auditLogModel(data);
      await entry.save();
      this.logger.log(`Audit Log: [${data.action}] by User ${data.userId} on ${data.resource}`);
    } catch (err) {
      this.logger.error(`Failed to record audit log: ${err}`);
    }
  }

  async findAll(limit = 50) {
    return this.auditLogModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}
