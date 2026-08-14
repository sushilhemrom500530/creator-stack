# ⚙️ SocialFlow AI — Backend (API) Architecture Specification

> **Platform**: NestJS (TypeScript) + MongoDB (Mongoose ODM) + Redis + BullMQ  
> **Security & Auth**: JWT Tokens, Refresh Tokens, AES-256-GCM Token Encryption, OAuth 2.0 CSRF State Protection  
> **Architecture Pattern**: Provider Strategy Pattern / Integration Layer Abstraction  

---

## 🏛️ 1. Core Architectural Topography

```
                    CUSTOMER / ADMIN FRONTEND (Next.js 15)
                                       │
                         REST API / JWT / WebSockets
                                       ▼
                             NESTJS API GATEWAY
           ┌───────────────────────────┴───────────────────────────┐
           ▼                                                       ▼
  CUSTOMER API MODULES                                   ADMIN API MODULES
  /api/v1/workspaces, /api/v1/posts,                     /api/v1/admin/users, /admin/analytics,
  /api/v1/social, /api/v1/ai-studio                      /admin/connected-platforms, /admin/health
           │                                                       │
           └───────────────────────────┬───────────────────────────┘
                                       │
                                       ▼
                          MONGODB DATABASE (Mongoose ODM)
   users, workspaces, workspace_members, social_connections, social_accounts,
   posts, post_publications, media, analytics, ai_histories, subscriptions
                                       │
                                       ▼
                       REDIS & BULLMQ QUEUE PIPELINES
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
    [PUBLISH QUEUE WORKERS]                               [ANALYTICS QUEUE]
 (FB, IG, LinkedIn, X, TikTok)                      (Metric Scraping & Aggregation)
            │                                                     │
            └──────────────────────────┬──────────────────────────┘
                                       │
                                       ▼
                       INTEGRATION LAYER PROVIDERS
     (FacebookProvider, InstagramProvider, LinkedInProvider, XProvider, TikTokProvider)
                                       │
                                       ▼
                           EXTERNAL SOCIAL PLATFORM APIs
```

---

## 🗄️ 2. Core Mongoose Schemas & Data Models

### A. `SocialConnection` (OAuth Authorization Token Model)
Stores the encrypted OAuth tokens and lifecycle status per workspace.
```typescript
{
  _id: ObjectId,
  workspaceId: ObjectId,
  provider: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'X' | 'TIKTOK' | 'GOOGLE_BUSINESS',
  providerUserId: string,
  accessTokenEncrypted: string,   // AES-256-GCM Encrypted
  refreshTokenEncrypted: string,  // AES-256-GCM Encrypted
  accessTokenExpiresAt: Date,
  refreshTokenExpiresAt: Date,
  scopes: string[],
  status: 'ACTIVE' | 'EXPIRING' | 'REVOKED' | 'REAUTH_REQUIRED',
  metadata: Record<string, any>,
  createdAt: Date,
  updatedAt: Date
}
```

### B. `SocialAccount` (Manageable Page / Profile / Channel)
Represents each individual page or profile accessible via a `SocialConnection`.
```typescript
{
  _id: ObjectId,
  workspaceId: ObjectId,
  connectionId: ObjectId,
  provider: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'X' | 'TIKTOK',
  providerAccountId: string,
  username: string,
  displayName: string,
  avatar: string,
  accountType: 'PAGE' | 'PROFILE' | 'BUSINESS' | 'ORGANIZATION' | 'CHANNEL',
  status: 'ACTIVE' | 'DISCONNECTED' | 'ERROR',
  capabilities: {
    publish: boolean,
    analytics: boolean,
    comments: boolean,
    messages: boolean
  },
  metadata: Record<string, any>,
  createdAt: Date,
  updatedAt: Date
}
```

### C. `Post` (Platform-Independent Master Post)
```typescript
{
  _id: ObjectId,
  workspaceId: ObjectId,
  authorId: ObjectId,
  content: {
    text: string,
    media: string[],      // S3 / Cloudinary URLs
    hashtags: string[],
    mentions: string[]
    
  },
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'PARTIALLY_PUBLISHED' | 'FAILED',
  scheduledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### D. `PostPublication` (1-to-Many Target Dispatches)
```typescript
{
  _id: ObjectId,
  postId: ObjectId,
  socialAccountId: ObjectId,
  provider: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'X' | 'TIKTOK',
  status: 'QUEUED' | 'PROCESSING' | 'PUBLISHED' | 'FAILED',
  providerPostId: string,
  scheduledAt: Date,
  publishedAt: Date,
  error: {
    code: string,
    message: string,
    raw: Record<string, any>
  },
  retryCount: number,
  metadata: Record<string, any>
}
```

---

## 🔗 3. Integration Provider Strategy Pattern (`integrations/`)

```
src/modules/integrations/
├── integrations.module.ts
├── integrations.service.ts
├── factory/
│   └── social-provider.factory.ts     # Injects & retrieves provider instance
├── interfaces/
│   ├── social-provider.interface.ts   # Main contract
│   ├── social-oauth.interface.ts      # Auth URL, token exchange, refresh
│   ├── social-publish.interface.ts    # Content dispatch
│   └── social-analytics.interface.ts  # Metric scraping
└── providers/
    ├── facebook/    (facebook.provider.ts, facebook.oauth.ts, facebook.publisher.ts)
    ├── instagram/   (instagram.provider.ts, instagram.oauth.ts, instagram.publisher.ts)
    ├── linkedin/    (linkedin.provider.ts, linkedin.oauth.ts, linkedin.publisher.ts)
    ├── x/           (x.provider.ts, x.oauth.ts, x.publisher.ts)
    └── tiktok/      (tiktok.provider.ts, tiktok.oauth.ts, tiktok.publisher.ts)
```

### Standardized `SocialProvider` Interface
```typescript
export interface SocialProvider {
  getAuthorizationUrl(state: string): Promise<string>;
  exchangeCode(code: string): Promise<OAuthTokens>;
  refreshToken(refreshToken: string): Promise<OAuthTokens>;
  getAccounts(accessToken: string): Promise<Partial<SocialAccount>[]>;
  publishPost(account: SocialAccount, post: PublishPostInput): Promise<PublishResult>;
  deletePost(account: SocialAccount, providerPostId: string): Promise<void>;
  getAnalytics(account: SocialAccount, options: AnalyticsOptions): Promise<AnalyticsResult>;
}
```

---

## ⚡ 4. Queue Architecture & Retry System (BullMQ + Redis)

* **Publishing Queue (`publish-queue`)**: Handles delayed jobs scheduled at future timestamps (`delay = targetTime - currentTime`).
* **Workers**: `FacebookWorker`, `InstagramWorker`, `LinkedInWorker`, `XWorker`, `TikTokWorker`.
* **Exponential Backoff Retry Engine**:
  * On API rate limits (`429 Too Many Requests`) or transient network glitches:
    * **Retry 1**: Wait 30 seconds
    * **Retry 2**: Wait 2 minutes
    * **Retry 3**: Wait 10 minutes
    * **Retry 4**: Mark `FAILED` with detailed error log saved in `PostPublication`.

---

## 🤖 5. Modular AI Studio Engine (`ai/`)

The `AIModule` encapsulates prompts and OpenAI/Gemini providers:

1. **`CaptionGenerator`**: Generates high-converting captions customized by business type, target audience, platform, and tone.
2. **`HashtagGenerator`**: Returns 20 optimized hashtags divided into High, Medium, and Low competition buckets.
3. **`ContentRewriter`**: Rewrites existing text into Professional, Casual, or Funny tones.
4. **`CampaignGenerator`**: Takes a single business brief and generates a structured JSON 30-Day Content Calendar.
5. **`Token & Cost Tracker`**: Saves prompt history, token usage, execution latency, and estimated cost to MongoDB (`ai_histories`).

---

## 🗺️ 6. The 13-Step Development Roadmap

```
Step  1 ➔ Foundation (NestJS Core, DatabaseModule, RedisModule, QueueModule, AuthModule, JWT)
Step  2 ➔ Multi-Tenancy (WorkspacesModule, WorkspaceMembers, RBAC Guards)
Step  3 ➔ OAuth Framework (OAuthStateService, AES-256 TokenEncryptionService, TokenRefreshWorker)
Step  4 ➔ First Provider Integration: Facebook Pages (OAuth, Discovery, Publisher, Analytics)
Step  5 ➔ Second Provider Integration: Instagram Professional Accounts
Step  6 ➔ Third Provider Integration: LinkedIn (Member & Organization profiles)
Step  7 ➔ Fourth Provider Integration: X (Twitter v2 API)
Step  8 ➔ Fifth Provider Integration: TikTok Content Posting API
Step  9 ➔ Publishing Engine (BullMQ Workers, Retries, Exponential Backoff, Scheduler Producer)
Step 10 ➔ Analytics Engine (Background Metric Scrapers & Normalized SocialMetric Schema)
Step 11 ➔ AI Engine (OpenAI / Gemini Integration, Prompts, Token Cost Tracker)
Step 12 ➔ Billing Module (Stripe Subscriptions, Webhooks, Quota Enforcement)
Step 13 ➔ Admin Dashboard Backend APIs (System Health, Token Error Rate Monitors, Audit Logs)
```
