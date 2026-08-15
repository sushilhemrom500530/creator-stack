export interface WhatsAppContact {
  input: string;
  wa_id: string;
}

export interface WhatsAppMessageResult {
  id: string;
}

export interface WhatsAppMessageResponse {
  messaging_product: string;
  contacts: WhatsAppContact[];
  messages: WhatsAppMessageResult[];
}

export interface WhatsAppTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: Record<string, any>;
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
    text: string;
    url?: string;
    phone_number?: string;
  }>;
}

export interface WhatsAppTemplate {
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED';
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  id: string;
  components: WhatsAppTemplateComponent[];
}

export interface WhatsAppTemplatesResponse {
  data: WhatsAppTemplate[];
  paging?: Record<string, any>;
}

export interface WhatsAppPhoneNumber {
  id: string;
  verified_name: string;
  display_phone_number: string;
  quality_rating: string;
  code_verification_status?: string;
}

export interface WhatsAppPhoneNumbersResponse {
  data: WhatsAppPhoneNumber[];
}

export interface WhatsAppWebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title: string; message?: string }>;
}

export interface WhatsAppIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'button' | 'interactive';
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string };
  video?: { id: string; mime_type: string };
  interactive?: { type: string; button_reply?: { id: string; title: string }; list_reply?: { id: string; title: string } };
}

export interface WhatsAppWebhookValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: Array<{ profile: { name: string }; wa_id: string }>;
  messages?: WhatsAppIncomingMessage[];
  statuses?: WhatsAppWebhookStatus[];
}

export interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: WhatsAppWebhookValue;
    field: string;
  }>;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppWebhookEntry[];
}
