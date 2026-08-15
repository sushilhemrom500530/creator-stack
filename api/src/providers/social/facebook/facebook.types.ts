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
