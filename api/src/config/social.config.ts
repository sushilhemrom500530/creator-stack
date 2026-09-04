import { registerAs } from '@nestjs/config';

export const socialConfig = registerAs('social', () => ({
  encryptionKey: process.env.ENCRYPTION_KEY || process.env.TOKEN_ENCRYPTION_KEY || process.env.JWT_SECRET,

  meta: {
    appId: process.env.META_APP_ID || process.env.FACEBOOK_CLIENT_ID,
    appSecret: process.env.META_APP_SECRET || process.env.FACEBOOK_CLIENT_SECRET,
    callbackUrl: process.env.FACEBOOK_REDIRECT_URI || process.env.META_CALLBACK_URL || 'http://localhost:8080/api/v1/social-accounts/oauth/facebook/callback',
    instagramCallbackUrl: process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:8080/api/v1/social-accounts/oauth/instagram/callback',
    threadsAppId: process.env.THREADS_CLIENT_ID || process.env.THREAD_APP_ID || process.env.META_APP_ID,
    threadsAppSecret: process.env.THREADS_CLIENT_SECRET || process.env.THREAD_APP_SECRET || process.env.META_APP_SECRET,
    threadsCallbackUrl: process.env.THREADS_REDIRECT_URI || 'http://localhost:8080/api/v1/social-accounts/oauth/threads/callback',
    graphVersion: process.env.META_GRAPH_VERSION || 'v21.0',
    graphApiUrl: `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || 'v21.0'}`,
    scopes: {
      facebook: process.env.META_FACEBOOK_SCOPES
        ? process.env.META_FACEBOOK_SCOPES.split(',').map((s) => s.trim())
        : [
          'public_profile',
          'pages_show_list',
          'pages_read_engagement',
          'pages_manage_posts',
        ],
      instagram: [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_insights',
        'instagram_manage_comments',
        'pages_show_list',
        'pages_read_engagement',
      ],
      threads: [
        'threads_basic',
        'threads_content_publish',
        'threads_read_replies',
        'threads_manage_replies',
        'threads_manage_insights',
      ],
    },
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
  },

  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackUrl: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5000/api/v1/social-accounts/oauth/linkedin/callback',
    scopes: ['openid', 'profile', 'email', 'w_member_social', 'w_organization_social', 'r_organization_social'],
  },

  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    callbackUrl: process.env.TWITTER_CALLBACK_URL || 'http://localhost:5000/api/v1/social-accounts/oauth/x/callback',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  },

  whatsapp: {
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  },

  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
  },

  storage: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
}));
