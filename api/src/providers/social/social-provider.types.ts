import { SocialPlatform } from 'src/modules/social-accounts/schemas/social-account.schema';

export interface TokenResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenExpiresAt?: Date;
  scopes?: string[];
  metadata?: Record<string, any>;
}

export interface SocialProfile {
  platformAccountId: string;
  accountName: string;
  username?: string;
  profilePictureUrl?: string;
  metadata?: Record<string, any>;
}

export interface SocialAccountContext {
  accountId: string;
  workspaceId: string;
  userId: string;
  platform: SocialPlatform;
  platformAccountId: string;
  accessToken: string;
  refreshToken?: string;
  metadata?: Record<string, any>;
}

export interface PublishPostInput {
  content: string;
  mediaUrls?: string[];
  linkUrl?: string;
  scheduledAt?: Date;
  options?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  platformPostUrl?: string;
  publishedAt?: Date;
  errorMessage?: string;
  rawResponse?: Record<string, any>;
}

export interface AnalyticsParams {
  startDate: Date;
  endDate: Date;
  metrics?: string[];
}

export interface AnalyticsResult {
  impressions: number;
  reach: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  rawMetrics?: Record<string, any>;
}
