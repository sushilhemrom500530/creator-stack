import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationsService.sendNotification(dto);
  }

  @Get('user/:userId')
  getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }
}
