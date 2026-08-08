import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('mail.email') || process.env.NODE_MAILER_EMAIL;
    const pass = this.configService.get<string>('mail.password') || process.env.NODE_MAILER_PASSWORD;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
      this.logger.log(`Nodemailer transport initialized for [${user}]`);
    } else {
      this.logger.warn('NODE_MAILER_EMAIL and NODE_MAILER_PASSWORD are not set. OTP emails will log to console.');
    }
  }

  async sendOtpEmail(toEmail: string, otp: string, userName?: string): Promise<boolean> {
    const user = this.configService.get<string>('mail.email') || process.env.NODE_MAILER_EMAIL;
    const greeting = userName ? `Hello ${userName}` : 'Hello';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">Creator Stack API</h2>
        <p>${greeting},</p>
        <p>Thank you for signing up. Please use the following 6-digit verification code to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; background-color: #F3F4F6; padding: 12px 24px; border-radius: 6px;">${otp}</span>
        </div>
        <p style="color: #EF4444; font-weight: bold;">⏳ Note: This OTP code and verification session will expire in 3 minutes.</p>
        <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">If you did not request this code, please ignore this email.</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"Creator Stack Security" <${user}>`,
          to: toEmail,
          subject: '🔒 Your 6-Digit Email Verification Code',
          html: htmlContent,
        });
        this.logger.log(`OTP Email successfully sent to ${toEmail}`);
        return true;
      } catch (error) {
        this.logger.error(`Failed to send OTP email to ${toEmail}: ${error.message}`);
      }
    }

    // Console fallback if transporter not configured or fails in dev
    this.logger.log(`[DEV OTP LOG] Verification Code for ${toEmail}: [ ${otp} ] (Expires in 3 mins)`);
    return false;
  }
}
