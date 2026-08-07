import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendMail(to: string, subject: string, body: string): Promise<boolean> {
    this.logger.log(`Sending mail to ${to} with subject: ${subject}`);
    // Stub implementation for mail provider (e.g. Nodemailer/SendGrid)
    return true;
  }
}
