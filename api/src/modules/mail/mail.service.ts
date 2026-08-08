import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const user = (this.configService.get<string>('mail.email') || process.env.NODE_MAILER_EMAIL || '').trim();
    const pass = (this.configService.get<string>('mail.password') || process.env.NODE_MAILER_PASSWORD || '').trim();

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: user,
          pass: pass,
        },
      });
      this.logger.log(`Nodemailer Gmail transport created for [${user}]`);
    } else {
      this.logger.warn('NODE_MAILER_EMAIL and NODE_MAILER_PASSWORD are not configured. Emails will log to console fallback.');
    }
  }

  async onModuleInit() {
    if (this.transporter) {
      try {
        await this.transporter.verify();
        this.logger.log('🚀 SMTP Server connection verified successfully! Ready to send emails.');
      } catch (error) {
        this.logger.error(`❌ SMTP Connection check warning: ${error.message}`);
      }
    }
  }

  async sendOtpEmail(toEmail: string, otp: string, userName?: string): Promise<boolean> {
    const user = (this.configService.get<string>('mail.email') || process.env.NODE_MAILER_EMAIL || '').trim();
    const greeting = userName ? `Hello ${userName}` : 'Hello';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">Creator Stack API</h2>
        <p style="font-size: 16px; color: #374151;">${greeting},</p>
        <p style="font-size: 15px; color: #4b5563; line-height: 1.5;">Thank you for signing up for Creator Stack. Please use the 6-digit verification code below to complete your email verification:</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1f2937; background-color: #f3f4f6; padding: 16px 32px; border-radius: 8px; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #dc2626; font-weight: 600; font-size: 14px; text-align: center;">⏳ Note: This OTP code and JWT verification token will expire in 3 minutes.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you did not request this email, please ignore it.</p>
      </div>
    `;

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: `"Creator Stack Security" <${user}>`,
          to: toEmail,
          subject: '🔒 Your 6-Digit Email Verification Code',
          html: htmlContent,
        });
        this.logger.log(`✅ OTP Email successfully sent to [${toEmail}] (MessageId: ${info.messageId})`);
        return true;
      } catch (error) {
        this.logger.error(`❌ Failed to send OTP email to [${toEmail}]: ${error.message}`);
      }
    }

    // Always log OTP to console as instant fallback
    this.logger.log(`[DEV OTP LOG] Verification Code for ${toEmail}: [ ${otp} ] (Expires in 3 mins)`);
    return false;
  }
}
