export interface InstagramPicture {
  data: {
    url: string;
  };
}

export interface InstagramBusinessAccount {
  id: string; // Instagram Business User ID
  username: string;
  name?: string;
  profile_picture_url?: string;
  followers_count?: number;
  media_count?: number;
  biography?: string;
  website?: string;
}

export interface FacebookPageWithInstagram {
  id: string; // Facebook Page ID
  name: string;
  access_token: string; // Permanent Page Access Token
  instagram_business_account?: InstagramBusinessAccount;
}

export interface InstagramAccountsBridgeResponse {
  data: FacebookPageWithInstagram[];
}

export interface InstagramMediaContainerResponse {
  id: string; // Creation ID (Container ID)
}

export type InstagramContainerStatusCode = 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS';

export interface InstagramContainerStatus {
  id: string;
  status_code: InstagramContainerStatusCode;
  status?: string;
}

export interface InstagramPublishResponse {
  id: string; // Published Media ID
}

export interface InstagramInsightValue {
  value: number;
  end_time?: string;
}

export interface InstagramInsightMetric {
  name: string;
  period: string;
  values: InstagramInsightValue[];
  title?: string;
  description?: string;
  id: string;
}

export interface InstagramInsightsResponse {
  data: InstagramInsightMetric[];
}
