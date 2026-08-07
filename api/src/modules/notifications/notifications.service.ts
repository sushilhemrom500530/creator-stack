import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  private notifications: any[] = [];

  async sendNotification(dto: SendNotificationDto) {
    const notification = {
      id: String(this.notifications.length + 1),
      ...dto,
      read: false,
      createdAt: new Date(),
    };
    this.notifications.push(notification);
    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.notifications.filter((n) => n.userId === userId);
  }
}
