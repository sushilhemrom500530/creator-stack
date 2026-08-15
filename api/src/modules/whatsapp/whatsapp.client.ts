import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WhatsAppMessageResponse,
  WhatsAppTemplatesResponse,
  WhatsAppPhoneNumbersResponse,
  WhatsAppTemplate,
  WhatsAppPhoneNumber,
} from './whatsapp.types';

@Injectable()
export class WhatsAppClient {
  private readonly logger = new Logger(WhatsAppClient.name);

  constructor(private readonly configService: ConfigService) {}

  private getGraphApiUrl(): string {
    const version = this.configService.get<string>('social.meta.graphVersion') || 'v21.0';
    return `https://graph.facebook.com/${version}`;
  }

  /**
   * Sends a direct text message via WhatsApp Cloud API.
   */
  async sendTextMessage(
    phoneNumberId: string,
    accessToken: string,
    to: string,
    body: string,
    previewUrl: boolean = false,
  ): Promise<WhatsAppMessageResponse> {
    const url = `${this.getGraphApiUrl()}/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''), // E.164 clean format
      type: 'text',
      text: {
        preview_url: previewUrl,
        body,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`WhatsApp sendTextMessage failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to send WhatsApp text message.');
    }

    return data as WhatsAppMessageResponse;
  }

  /**
   * Sends a media message (image, video, document, audio) via WhatsApp Cloud API.
   */
  async sendMediaMessage(
    phoneNumberId: string,
    accessToken: string,
    to: string,
    mediaType: 'image' | 'video' | 'document' | 'audio',
    mediaUrl: string,
    caption?: string,
    filename?: string,
  ): Promise<WhatsAppMessageResponse> {
    const url = `${this.getGraphApiUrl()}/${phoneNumberId}/messages`;

    const mediaObject: Record<string, any> = { link: mediaUrl };
    if (caption && (mediaType === 'image' || mediaType === 'video' || mediaType === 'document')) {
      mediaObject.caption = caption;
    }
    if (filename && mediaType === 'document') {
      mediaObject.filename = filename;
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: mediaType,
      [mediaType]: mediaObject,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`WhatsApp sendMediaMessage failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || `Failed to send WhatsApp ${mediaType} message.`);
    }

    return data as WhatsAppMessageResponse;
  }

  /**
   * Sends a pre-approved WhatsApp Business Message Template.
   */
  async sendTemplateMessage(
    phoneNumberId: string,
    accessToken: string,
    to: string,
    templateName: string,
    languageCode: string = 'en_US',
    components?: any[],
  ): Promise<WhatsAppMessageResponse> {
    const url = `${this.getGraphApiUrl()}/${phoneNumberId}/messages`;

    const templatePayload: Record<string, any> = {
      name: templateName,
      language: { code: languageCode },
    };

    if (components && components.length > 0) {
      templatePayload.components = components;
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'template',
      template: templatePayload,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`WhatsApp sendTemplateMessage failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to send WhatsApp template message.');
    }

    return data as WhatsAppMessageResponse;
  }

  /**
   * Retrieves approved WhatsApp message templates for a WABA (WhatsApp Business Account).
   */
  async getMessageTemplates(wabaId: string, accessToken: string): Promise<WhatsAppTemplate[]> {
    const url = `${this.getGraphApiUrl()}/${wabaId}/message_templates?limit=100`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: WhatsAppTemplatesResponse = await response.json();

    if (!response.ok || (data as any).error) {
      const err = (data as any).error;
      this.logger.warn(`Failed to fetch WhatsApp templates: ${JSON.stringify(err || data)}`);
      return [];
    }

    return data.data || [];
  }

  /**
   * Retrieves phone numbers registered under the WhatsApp Business Account.
   */
  async getPhoneNumbers(wabaId: string, accessToken: string): Promise<WhatsAppPhoneNumber[]> {
    const url = `${this.getGraphApiUrl()}/${wabaId}/phone_numbers`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data: WhatsAppPhoneNumbersResponse = await response.json();

    if (!response.ok || (data as any).error) {
      const err = (data as any).error;
      this.logger.warn(`Failed to fetch WhatsApp phone numbers: ${JSON.stringify(err || data)}`);
      return [];
    }

    return data.data || [];
  }

  /**
   * Marks an incoming WhatsApp message as read.
   */
  async markAsRead(phoneNumberId: string, accessToken: string, messageId: string): Promise<boolean> {
    const url = `${this.getGraphApiUrl()}/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });

    const data = await response.json();
    return data.success === true;
  }
}
