import { SocialPlatform } from '../../modules/social-accounts/schemas/social-account.schema';

export interface TokenResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  /** `null` means the access token does not expire (e.g. Facebook Page tokens). */
  tokenExpiresAt?: Date | null;
  scopes?: string[];
  metadata?: Record<string, any>;
}

export interface SocialProfile {
  platformAccountId: string;
  accountName: string;
  username?: string;
  profilePictureUrl?: string;
  followersCount?: number;
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

/** Minimal identity of a stored account, used where the provider must target one specific account. */
export interface SocialAccountRef {
  platformAccountId: string;
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
  /** Platform error code, when available, for diagnostics. */
  errorCode?: string;
  /** True when the failure was caused by an expired/revoked token and the user must reconnect. */
  requiresReauth?: boolean;
  rawResponse?: Record<string, any>;
}

export interface AccountConnectedResult {
  /** Metadata to merge into the stored account (e.g. webhook subscription state). */
  metadata?: Record<string, any>;
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
