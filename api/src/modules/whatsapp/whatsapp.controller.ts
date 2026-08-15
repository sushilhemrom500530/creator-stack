import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Headers,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';
import { SendTextMessageDto, SendMediaMessageDto, SendTemplateMessageDto } from './dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from 'src/common/decorators/public.decorator';
import type { WhatsAppWebhookPayload } from './whatsapp.types';

@ApiTags('WhatsApp Messaging')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  /**
   * Send WhatsApp text message
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send-text')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a direct WhatsApp text message' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Message dispatched successfully' })
  sendText(
    @CurrentUser('userId') userId: string,
    @Body() dto: SendTextMessageDto,
  ) {
    return this.whatsappService.sendText(userId, dto);
  }

  /**
   * Send WhatsApp media message
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send-media')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a WhatsApp media message (image, video, document, audio)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Media message dispatched successfully' })
  sendMedia(
    @CurrentUser('userId') userId: string,
    @Body() dto: SendMediaMessageDto,
  ) {
    return this.whatsappService.sendMedia(userId, dto);
  }

  /**
   * Send WhatsApp approved template message
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send-template')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a pre-approved WhatsApp Business Message Template' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Template message dispatched successfully' })
  sendTemplate(
    @CurrentUser('userId') userId: string,
    @Body() dto: SendTemplateMessageDto,
  ) {
    return this.whatsappService.sendTemplate(userId, dto);
  }

  /**
   * List approved message templates
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('templates')
  @ApiOperation({ summary: 'Get approved WhatsApp message templates for the workspace' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getTemplates(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.whatsappService.getTemplates(workspaceId, userId);
  }

  /**
   * List registered WABA phone numbers
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('phone-numbers')
  @ApiOperation({ summary: 'Get registered WhatsApp Business phone numbers' })
  @ApiQuery({ name: 'workspaceId', required: true })
  getPhoneNumbers(
    @Query('workspaceId') workspaceId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.whatsappService.getPhoneNumbers(workspaceId, userId);
  }

  /**
   * Meta Webhook Verification Handshake
   */
  @Public()
  @Get('webhook')
  @ApiOperation({ summary: 'Meta WhatsApp webhook verification challenge handler' })
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.whatsappService.verifyWebhookChallenge(mode, token, challenge);
  }

  /**
   * Meta Webhook Event Receiver
   */
  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Meta WhatsApp webhook delivery receipts & incoming messages listener' })
  async handleWebhook(
    @Body() payload: WhatsAppWebhookPayload,
    @Headers('x-hub-signature-256') signature?: string,
  ) {
    await this.whatsappService.processWebhookEvent(payload);
    return { status: 'EVENT_RECEIVED' };
  }
}
