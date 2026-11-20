/**
 * Subset of the Meta Page webhook payload we consume.
 * https://developers.facebook.com/docs/messenger-platform/reference/webhook-events
 * https://developers.facebook.com/docs/graph-api/webhooks/reference/page/#feed
 */

export interface MessengerAttachmentPayload {
  type: string;
  payload?: { url?: string; title?: string; sticker_id?: number } | null;
  title?: string;
}

export interface MessengerMessage {
  mid: string;
  text?: string;
  is_echo?: boolean;
  app_id?: number;
  attachments?: MessengerAttachmentPayload[];
  quick_reply?: { payload: string };
  reply_to?: { mid: string };
}

export interface MessengerPostback {
  mid?: string;
  title?: string;
  payload?: string;
}

export interface MessengerEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: MessengerMessage;
  postback?: MessengerPostback;
  read?: { watermark: number };
  delivery?: { mids?: string[]; watermark: number };
}

export interface FeedChangeValue {
  item: 'comment' | 'reaction' | 'post' | 'status' | 'photo' | 'video' | 'share' | string;
  verb: 'add' | 'edited' | 'remove' | 'hide' | 'unhide' | string;
  from?: { id: string; name?: string };
  message?: string;
  post_id?: string;
  comment_id?: string;
  parent_id?: string;
  reaction_type?: string;
  created_time?: number;
}

export interface PageWebhookEntry {
  id: string; // Page ID
  time: number;
  messaging?: MessengerEvent[];
  standby?: MessengerEvent[];
  changes?: Array<{ field: string; value: FeedChangeValue }>;
}

export interface PageWebhookPayload {
  object: string; // 'page'
  entry?: PageWebhookEntry[];
}

export interface WebhookProcessingSummary {
  entries: number;
  messagesStored: number;
  duplicates: number;
  feedNotifications: number;
  skipped: number;
}
