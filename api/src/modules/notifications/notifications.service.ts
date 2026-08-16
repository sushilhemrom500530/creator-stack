import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto';
import { MailService } from '../mail/mail.service';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  /**
   * Dispatches an in-app notification and optional email alert.
   */
  async sendNotification(dto: CreateNotificationDto): Promise<NotificationDocument> {
    const userObjectId = new Types.ObjectId(dto.userId);
    const workspaceObjectId = dto.workspaceId ? new Types.ObjectId(dto.workspaceId) : undefined;

    const notification = new this.notificationModel({
      userId: userObjectId,
      workspaceId: workspaceObjectId,
      title: dto.title,
      message: dto.message,
      type: dto.type || 'info',
      category: dto.category || 'system',
      link: dto.link,
      read: false,
      emailSent: false,
    });

    const saved = await notification.save();
    this.logger.log(`Created in-app notification [${saved._id}] for user [${dto.userId}]: "${dto.title}"`);

    // If critical alert or sendEmail requested, send email
    if (dto.sendEmail || dto.type === 'error' || dto.category === 'token_expiry') {
      this.dispatchEmailAlert(dto.userId, dto.title, dto.message).catch((err) => {
        this.logger.warn(`Email alert dispatch failed for notification [${saved._id}]: ${err.message}`);
      });
    }

    return saved;
  }

  private async dispatchEmailAlert(userId: string, title: string, message: string) {
    const user = await this.userModel.findById(userId).select('email name');
    if (!user || !user.email) return;

    await this.mailService.sendEmail({
      to: user.email,
      subject: `[CreatorStack Alert] ${title}`,
      text: `${title}\n\n${message}\n\nLog in to your dashboard to review: https://creatorstack.app`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #7c3aed; margin-top: 0;">CreatorStack Alert</h2>
          <h3 style="color: #0f172a;">${title}</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">${message}</p>
          <div style="margin-top: 24px;">
            <a href="https://creatorstack.app" style="background-color: #7c3aed; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Open Dashboard</a>
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 30px;">You are receiving this automated alert because email notifications are enabled on your account.</p>
        </div>
      `,
    });
  }

  /**
   * Retrieves paginated notifications for the user.
   */
  async getUserNotifications(userId: string, page = 1, limit = 20, unreadOnly = false) {
    const userObjectId = new Types.ObjectId(userId);
    const query: any = { userId: userObjectId };

    if (unreadOnly) {
      query.read = false;
    }

    const skip = (page - 1) * limit;

    const [data, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({ userId: userObjectId, read: false }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        unreadCount,
      },
    };
  }

  /**
   * Get unread notification counter for top header bell icon.
   */
  async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    const count = await this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      read: false,
    });
    return { unreadCount: count };
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string, userId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(userId),
      },
      { $set: { read: true } },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }
    return notification;
  }

  /**
   * Mark all notifications as read for the user.
   */
  async markAllAsRead(userId: string): Promise<{ updatedCount: number }> {
    const res = await this.notificationModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        read: false,
      },
      { $set: { read: true } },
    );

    return { updatedCount: res.modifiedCount };
  }

  /**
   * Delete a notification.
   */
  async deleteNotification(notificationId: string, userId: string): Promise<{ success: boolean }> {
    const res = await this.notificationModel.deleteOne({
      _id: new Types.ObjectId(notificationId),
      userId: new Types.ObjectId(userId),
    });

    if (res.deletedCount === 0) {
      throw new NotFoundException('Notification not found.');
    }
    return { success: true };
  }
}
