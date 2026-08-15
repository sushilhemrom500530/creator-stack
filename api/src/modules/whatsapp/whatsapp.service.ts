import {
  Injectable,
  Logger,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { WhatsAppClient } from './whatsapp.client';
import { SendTextMessageDto, SendMediaMessageDto, SendTemplateMessageDto } from './dto';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';
import {
  WhatsAppMessageResponse,
  WhatsAppTemplate,
  WhatsAppPhoneNumber,
  WhatsAppWebhookPayload,
} from './whatsapp.types';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappClient: WhatsAppClient,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
  ) {}

  private async verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<WorkspaceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const workspace = await this.workspaceModel.findOne({
      _id: new Types.ObjectId(workspaceId),
      $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
      isDeleted: false,
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace access denied.');
    }
    return workspace;
  }

  private getPhoneNumberId(overrideId?: string): string {
    const id = overrideId || this.configService.get<string>('social.whatsapp.phoneNumberId');
    if (!id) {
      throw new BadRequestException('WhatsApp Phone Number ID is not configured.');
    }
    return id;
  }

  private getAccessToken(): string {
    const token = this.configService.get<string>('social.whatsapp.accessToken');
    if (!token) {
      throw new BadRequestException('WHATSAPP_ACCESS_TOKEN is not configured.');
    }
    return token;
  }

  private getBusinessAccountId(): string {
    const id = this.configService.get<string>('social.whatsapp.businessAccountId');
    if (!id) {
      throw new BadRequestException('WHATSAPP_BUSINESS_ACCOUNT_ID is not configured.');
    }
    return id;
  }

  /**
   * Sends a direct text message.
   */
  async sendText(userId: string, dto: SendTextMessageDto): Promise<WhatsAppMessageResponse> {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const phoneNumberId = this.getPhoneNumberId(dto.phoneNumberId);
    const accessToken = this.getAccessToken();

    this.logger.log(`Sending WhatsApp text message to ${dto.to} in workspace ${dto.workspaceId}`);
    return this.whatsappClient.sendTextMessage(
      phoneNumberId,
      accessToken,
      dto.to,
      dto.body,
      dto.previewUrl,
    );
  }

  /**
   * Sends a media message (image, video, document).
   */
  async sendMedia(userId: string, dto: SendMediaMessageDto): Promise<WhatsAppMessageResponse> {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const phoneNumberId = this.getPhoneNumberId(dto.phoneNumberId);
    const accessToken = this.getAccessToken();

    this.logger.log(`Sending WhatsApp ${dto.mediaType} to ${dto.to} in workspace ${dto.workspaceId}`);
    return this.whatsappClient.sendMediaMessage(
      phoneNumberId,
      accessToken,
      dto.to,
      dto.mediaType,
      dto.mediaUrl,
      dto.caption,
      dto.filename,
    );
  }

  /**
   * Sends an approved template message.
   */
  async sendTemplate(userId: string, dto: SendTemplateMessageDto): Promise<WhatsAppMessageResponse> {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    const phoneNumberId = this.getPhoneNumberId(dto.phoneNumberId);
    const accessToken = this.getAccessToken();

    this.logger.log(`Sending WhatsApp template [${dto.templateName}] to ${dto.to}`);
    return this.whatsappClient.sendTemplateMessage(
      phoneNumberId,
      accessToken,
      dto.to,
      dto.templateName,
      dto.languageCode || 'en_US',
      dto.components,
    );
  }

  /**
   * Retrieves message templates for the WABA.
   */
  async getTemplates(workspaceId: string, userId: string): Promise<WhatsAppTemplate[]> {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const wabaId = this.getBusinessAccountId();
    const accessToken = this.getAccessToken();

    return this.whatsappClient.getMessageTemplates(wabaId, accessToken);
  }

  /**
   * Retrieves phone numbers for the WABA.
   */
  async getPhoneNumbers(workspaceId: string, userId: string): Promise<WhatsAppPhoneNumber[]> {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const wabaId = this.getBusinessAccountId();
    const accessToken = this.getAccessToken();

    return this.whatsappClient.getPhoneNumbers(wabaId, accessToken);
  }

  /**
   * Meta Webhook Verification Handshake.
   */
  verifyWebhookChallenge(mode: string, token: string, challenge: string): string {
    const verifyToken = this.configService.get<string>('social.whatsapp.webhookVerifyToken') || 'creator_stack_wa_verify_token';

    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('WhatsApp Webhook verification successful!');
      return challenge;
    }

    throw new UnauthorizedException('WhatsApp Webhook verification token mismatch.');
  }

  /**
   * Validates Meta HMAC-SHA256 signature for incoming webhooks.
   */
  verifyWebhookSignature(rawBody: string, signatureHeader?: string): boolean {
    const appSecret = this.configService.get<string>('social.meta.appSecret');
    if (!appSecret || !signatureHeader) return true; // Bypass in local development if secret is not set

    const signature = signatureHeader.replace('sha256=', '');
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(rawBody, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  /**
   * Processes incoming WhatsApp webhook events (status updates & customer messages).
   */
  async processWebhookEvent(payload: WhatsAppWebhookPayload) {
    if (payload.object !== 'whatsapp_business_account') return;

    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;

        // Delivery Status Updates
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            this.logger.log(`WhatsApp Message Status Update: [${status.id}] -> ${status.status} for recipient ${status.recipient_id}`);
          }
        }

        // Incoming Customer Messages
        if (value.messages && value.messages.length > 0) {
          for (const msg of value.messages) {
            this.logger.log(`Received incoming WhatsApp message from ${msg.from} of type ${msg.type}: ${msg.text?.body || '[Media]'}`);
          }
        }
      }
    }
  }
}
