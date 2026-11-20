export interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface MetaLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface FacebookPagePicture {
  data: {
    height?: number;
    is_silhouette?: boolean;
    url: string;
    width?: number;
  };
}

export interface FacebookPageAccount {
  id: string;
  name: string;
  category?: string;
  access_token: string;
  tasks?: string[];
  picture?: FacebookPagePicture;
  followers_count?: number;
  fan_count?: number;
}

export interface FacebookAccountsResponse {
  data: FacebookPageAccount[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface FacebookPostResponse {
  id: string;
}

export interface FacebookPhotoResponse {
  id: string;
  post_id?: string;
}

export interface FacebookVideoResponse {
  id: string;
}

export interface FacebookInsightValue {
  value: number | Record<string, any>;
  end_time: string;
}

export interface FacebookInsightMetric {
  name: string;
  period: string;
  values: FacebookInsightValue[];
  title?: string;
  description?: string;
  id: string;
}

export interface FacebookInsightsResponse {
  data: FacebookInsightMetric[];
}

export interface FacebookPermission {
  permission: string;
  status: 'granted' | 'declined' | 'expired';
}

export interface FacebookPermissionsResponse {
  data: FacebookPermission[];
}

export interface FacebookSendMessageResponse {
  recipient_id: string;
  message_id: string;
}

export interface FacebookUserProfile {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
}

export interface FacebookConversationMessage {
  id: string;
  message?: string;
  created_time: string;
  from?: { id: string; name?: string; email?: string };
  to?: { data: Array<{ id: string; name?: string }> };
  attachments?: {
    data: Array<{
      mime_type?: string;
      name?: string;
      image_data?: { url: string; preview_url?: string };
      video_data?: { url: string; preview_url?: string };
      file_url?: string;
    }>;
  };
}

export interface FacebookConversation {
  id: string;
  updated_time: string;
  participants?: { data: Array<{ id: string; name?: string; email?: string }> };
  messages?: { data: FacebookConversationMessage[] };
}

export interface FacebookConversationsResponse {
  data: FacebookConversation[];
  paging?: { next?: string };
}

/** Fields we subscribe a Page to so Meta pushes Messenger + feed events to our webhook. */
export const FACEBOOK_PAGE_WEBHOOK_FIELDS = [
  'messages',
  'messaging_postbacks',
  'message_echoes',
  'feed',
] as const;

/** Permissions without which a connected Page cannot be published to. */
export const FACEBOOK_REQUIRED_PUBLISH_PERMISSIONS = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
] as const;

/** Permissions that unlock Messenger inbox + webhook delivery. */
export const FACEBOOK_MESSAGING_PERMISSIONS = ['pages_messaging', 'pages_manage_metadata'] as const;
