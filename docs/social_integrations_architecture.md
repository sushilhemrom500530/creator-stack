# Social Media Integrations & Publishing Architecture (CreatorStack)

This document is the **Single Source of Truth** for connecting third-party platforms (Facebook, Instagram, Threads, LinkedIn, WhatsApp) and implementing multi-platform cross-posting in CreatorStack.

---

## 1. Core Architectural Principles

1. **Decouple Social Login from Social Connection**:
   - **Social Login**: "How does a user log into CreatorStack?" (Auth module).
   - **Social Connection**: "Where does CreatorStack publish the user's posts?" (`SocialAccounts` module).
2. **Strategy & Adapter Pattern for Publishers**:
   - NestJS core service does not know platform-specific Graph API details.
   - It delegates through a common `SocialPublisher` interface.
3. **Asynchronous & Queued Processing (BullMQ / Redis)**:
   - Publishing is never synchronous with HTTP requests.
   - Handles rate-limits, retries, multi-container processing, and post scheduling.
4. **WhatsApp is a Messaging System, Not a Feed**:
   - Facebook, Instagram, Threads, LinkedIn $\rightarrow$ Social Feed Publishing.
   - WhatsApp Business $\rightarrow$ 1-on-1 / Broadcast Customer Messaging.

---

## 2. Directory Structure Blueprint

```
api/src/modules/
├── social/
│   ├── social.module.ts
│   ├── connections/
│   │   ├── connection.controller.ts
│   │   ├── connection.service.ts
│   │   ├── dto/
│   │   │   ├── connect-account.dto.ts
│   │   │   └── select-page.dto.ts
│   │   └── schemas/
│   │       └── social-account.schema.ts
│   ├── providers/
│   │   ├── facebook/
│   │   │   ├── facebook.oauth.ts
│   │   │   ├── facebook.api.ts
│   │   │   └── facebook.service.ts
│   │   ├── instagram/
│   │   │   ├── instagram.oauth.ts
│   │   │   ├── instagram.api.ts
│   │   │   └── instagram.service.ts
│   │   ├── threads/
│   │   │   ├── threads.oauth.ts
│   │   │   ├── threads.api.ts
│   │   │   └── threads.service.ts
│   │   └── linkedin/
│   │       ├── linkedin.oauth.ts
│   │       ├── linkedin.api.ts
│   │       └── linkedin.service.ts
│   └── publishers/
│       ├── social-publisher.interface.ts
│       ├── facebook.publisher.ts
│       ├── instagram.publisher.ts
│       ├── threads.publisher.ts
│       └── linkedin.publisher.ts
│
├── social-posts/
│   ├── social-posts.module.ts
│   ├── social-posts.controller.ts
│   ├── social-posts.service.ts
│   ├── dto/
│   │   ├── create-social-post.dto.ts
│   │   └── update-social-post.dto.ts
│   └── schemas/
│       └── social-post.schema.ts
│
└── queue/
    ├── social-post.queue.ts
    └── social-post.worker.ts
```

---

## 3. Database Schemas (MongoDB / Mongoose)

### `social_accounts` Collection
```typescript
@Schema({ timestamps: true })
export class SocialAccount {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['facebook', 'instagram', 'threads', 'linkedin'] })
  platform: string;

  @Prop({ required: true })
  platformAccountId: string; // Facebook Page ID, IG User ID, Threads User ID

  @Prop({ required: true })
  accountName: string;

  @Prop()
  username?: string;

  @Prop()
  profilePictureUrl?: string;

  @Prop({ required: true })
  accessTokenEncrypted: string; // AES-256 encrypted

  @Prop()
  tokenExpiresAt?: Date;

  @Prop()
  refreshTokenEncrypted?: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: 'active', enum: ['active', 'expired', 'revoked'] })
  status: string;
}
```

### `social_posts` Collection
```typescript
@Schema({ timestamps: true })
export class SocialPost {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  mediaUrls: string[];

  @Prop()
  scheduledAt?: Date;

  @Prop({ 
    default: 'draft', 
    enum: ['draft', 'queued', 'publishing', 'published', 'partial_failure', 'failed'] 
  })
  status: string;

  @Prop({
    type: [{
      socialAccountId: { type: Types.ObjectId, ref: 'SocialAccount' },
      platform: String,
      status: { type: String, enum: ['pending', 'published', 'failed'], default: 'pending' },
      platformPostId: String,
      platformPostUrl: String,
      errorMessage: String,
      publishedAt: Date,
    }],
    default: []
  })
  targets: Array<{
    socialAccountId: Types.ObjectId;
    platform: string;
    status: string;
    platformPostId?: string;
    platformPostUrl?: string;
    errorMessage?: string;
    publishedAt?: Date;
  }>;
}
```

---

## 4. Platform Specifications & Flow Rules

| Platform | OAuth Flow & Account Type | Post Mechanism | Key Gotcha |
| :--- | :--- | :--- | :--- |
| **Facebook** | User OAuth $\rightarrow$ Fetch Admin Pages $\rightarrow$ User selects Page $\rightarrow$ Store Page Token | Graph API: `POST /{page-id}/feed` or `/{page-id}/photos` | Post to Page, never personal profile. Page tokens derived from long-lived user tokens do not expire. |
| **Instagram** | Meta OAuth $\rightarrow$ Fetch connected IG Business/Creator account from Page | 2-step Container: `POST /{ig-user-id}/media` $\rightarrow$ `POST /{ig-user-id}/media_publish` | Requires at least 1 image or video (no text-only posts). Image URLs must be public HTTPS. |
| **Threads** | Threads OAuth $\rightarrow$ Store user token | 2-step Container: `POST /{threads-user-id}/threads` $\rightarrow$ `POST /{threads-user-id}/threads_publish` | Token expires every 60 days (requires refresh job). Up to 500 characters. |
| **LinkedIn** | LinkedIn OAuth 2.0 (OpenID + Community Management API) | `POST /v2/ugcPosts` or `/rest/posts` | Access token 60 days, refresh token 365 days. |
| **WhatsApp** | WhatsApp Cloud API (WABA) | `POST /{phone-number-id}/messages` | Use for transactional/marketing messaging via templates; NOT a social feed post. |

---

## 5. Security & Queue Requirements

1. **Security**:
   - `AES-256-GCM` encryption for all stored access and refresh tokens.
   - `state` parameter validation on OAuth redirects to prevent CSRF.
2. **Queuing (BullMQ / Redis)**:
   - Non-blocking publishing jobs.
   - Automatic retry strategy with exponential backoff on transient Meta API rate-limits.
   - Delayed jobs for scheduled post publishing.
3. **Media Hosting**:
   - All uploaded media must be hosted on public HTTPS URLs (e.g. S3 / R2 / Cloudinary / public upload endpoint) so Meta servers can fetch them.

---

## 6. Phased Implementation Roadmap

- **Phase 1**: Security foundation (Token Encryption) & SocialAccount schema.
- **Phase 2**: Facebook OAuth + Page Selection + Feed Posting.
- **Phase 3**: Instagram Professional Account Linking + Container Publishing.
- **Phase 4**: Threads OAuth + Publishing.
- **Phase 5**: BullMQ Job Worker + Post Scheduling + Token Refresh Cron.
- **Phase 6**: WhatsApp Business Messaging Module (Decoupled).
