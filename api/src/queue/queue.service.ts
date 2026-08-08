import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  async addJob(queueName: string, jobName: string, data: any): Promise<void> {
    this.logger.log(`Job '${jobName}' added to queue '${queueName}'`);
  }
}
