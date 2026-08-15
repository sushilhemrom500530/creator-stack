export interface ThreadsUser {
  id: string; // Threads User ID
  username: string;
  name?: string;
  threads_profile_picture_url?: string;
  threads_biography?: string;
}

export interface ThreadsTokenResponse {
  access_token: string;
  user_id: string;
}

export interface ThreadsLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ThreadsContainerResponse {
  id: string; // Creation ID (Container ID)
}

export type ThreadsContainerStatusType = 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS';

export interface ThreadsContainerStatus {
  id: string;
  status: ThreadsContainerStatusType;
  error_message?: string;
}

export interface ThreadsPublishResponse {
  id: string; // Published Thread ID
}

export interface ThreadsInsightValue {
  value: number;
}

export interface ThreadsInsightMetric {
  name: string;
  period: string;
  values: ThreadsInsightValue[];
  title?: string;
  description?: string;
  id: string;
}

export interface ThreadsInsightsResponse {
  data: ThreadsInsightMetric[];
}
