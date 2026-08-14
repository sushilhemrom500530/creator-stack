# SocialFlow AI (CreatorStack) — Master Production Architecture & UX Blueprint

This document is the **Single Source of Truth** for the backend architecture, provider isolation, database schemas, queue processing, and frontend dashboard UX for SocialFlow AI.

---

## 1. Dual-Engine Architecture Overview

```
                    SocialFlow AI (CreatorStack)
                                │
                          NestJS Backend
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
         Social Engine                     Messaging Engine
              │                                   │
      ┌───────┼────────┐                      WhatsApp
      │       │        │
   Facebook Instagram Threads
      │       │        │
   LinkedIn   X      TikTok
      │       │        │
   Pinterest YouTube  etc.
```

---

## 2. Core Architectural Separation: `modules/` vs `providers/`

The most critical architectural principle: **Never mix internal domain models with external API communication.**

- **`modules/`**: Owns application logic, MongoDB schemas, authorization, validation, queues, and user state.
- **`providers/`**: Owns external API clients, OAuth handshakes, payload mappers, and third-party rate-limit handling.

```
api/src/
├── common/                     # Cross-cutting utilities, encryption, guards, interceptors
│   ├── utils/
│   │   └── token-encryption.util.ts   # AES-256-GCM token encryption
│   ├── guards/                 # JWT, Workspace, Roles, Permissions
│   └── interceptors/
│
├── config/                     # Environment configuration & validation
│
├── database/                   # Mongoose / MongoDB connection & lifecycle
│
├── redis/                      # Redis connection (Caching)
│
├── queue/                      # BullMQ Queues & Workers
│   ├── queues/                 # publishing.queue, analytics.queue, ai.queue, cleanup.queue
│   └── workers/                # publishing.worker, analytics.worker, ai.worker
│
├── providers/                  # External Third-Party API Adapters
│   ├── social/
│   │   ├── social-provider.interface.ts   # Unified contract
│   │   ├── social-provider.factory.ts     # Provider resolver
│   │   ├── facebook/           # OAuth, Client, Provider, Mapper, Types
│   │   ├── instagram/          # OAuth, Container Client, Provider, Mapper
│   │   ├── threads/            # OAuth, Client, Provider, Mapper
│   │   ├── linkedin/           # OAuth, Client, Provider, Mapper
│   │   ├── twitter/            # OAuth, Client, Provider, Mapper
│   │   └── tiktok/             # OAuth, Client, Provider, Mapper
│   │
│   ├── storage/                # Cloudinary / AWS S3 / Cloudflare R2
│   ├── payment/                # Stripe
│   ├── ai/                     # OpenAI / Anthropic / Gemini
│   └── messaging/              # WhatsApp Business Cloud API
│
└── modules/                    # Internal SaaS Domain Modules
    ├── auth/                   # User login, registration, OTP, JWT
    ├── users/                  # User management & profile
    ├── workspaces/             # Multi-tenancy, agency teams, member roles
    ├── roles/                  # RBAC
    ├── permissions/            # Fine-grained permissions
    ├── social-accounts/        # Connected social accounts, credentials, status
    ├── posts/                  # Post drafts, CRUD, content validation
    ├── publishing/             # Post dispatching, attempts, retry logic
    ├── schedules/              # Post calendar scheduler & timing
    ├── media/                  # Image/video uploads, optimization, public URLs
    ├── analytics/              # Multi-channel stats, engagement metrics
    ├── ai/                     # AI caption, hashtag, thread generator
    ├── notifications/          # In-app alerts, email alerts
    ├── subscriptions/          # Tier limits (posts/mo, accounts limit)
    ├── billing/                # Invoices, transactions, checkout sessions
    ├── audit-logs/             # Security & action audit tracking
    ├── webhooks/               # Meta de-auth, data deletion, Stripe events
    └── health/                 # Health checks
```

> **Note on Cleanup**: Legacy e-commerce modules (`products/`, `categories/`) will be phased out in favor of the core SocialFlow AI domains.

---

## 3. Provider Architecture Contract

Every social network implements the generic `SocialProvider` interface:

```typescript
export interface SocialProvider {
  getAuthorizationUrl(state: string): string;
  exchangeCode(code: string): Promise<TokenResult>;
  getAccount(accessToken: string): Promise<SocialProfile>;
  publishPost(account: SocialAccountContext, post: PublishPostInput): Promise<PublishResult>;
  deletePost(account: SocialAccountContext, externalPostId: string): Promise<void>;
  getAnalytics(account: SocialAccountContext, params: AnalyticsParams): Promise<AnalyticsResult>;
}
```

### Provider Internal Structure (Example: Facebook)
- `facebook.oauth.ts`: Generates OAuth dialog URL, exchanges short-lived for long-lived tokens.
- `facebook.client.ts`: Raw HTTP requests to `graph.facebook.com`.
- `facebook.provider.ts`: Implements `SocialProvider` interface methods.
- `facebook.mapper.ts`: Maps Meta API responses to standardized CreatorStack DTOs.
- `facebook.types.ts`: Meta Graph API request/response typings.

---

## 4. Frontend Dashboard Qualification & UX Enhancement Map

Based on `ui/src/app/(dashboard)/user/`, here is the qualification of current sections and the **high-value sections to add** for an exceptional SaaS experience:

### Current Dashboard Pages (Qualified)
| Current UI Route | Module Mapping | UX Purpose |
| :--- | :--- | :--- |
| `/dashboard` | `analytics`, `posts` | High-level metrics, upcoming scheduled posts, quick actions. |
| `/connected-accounts` | `social-accounts` | Grid of platforms (FB, IG, Threads, LinkedIn, etc.) with Connect / Reconnect / Disconnect cards. |
| `/create-post` | `posts`, `ai`, `media` | Multi-channel composer with live preview tabs (FB preview, IG preview, Threads preview), AI caption button, media uploader. |
| `/posts` | `posts`, `publishing` | Tabbed view (`All`, `Drafts`, `Scheduled`, `Published`, `Failed`) with retry action. |
| `/calendar` | `schedules` | Month/Week/Day interactive calendar with drag-and-drop rescheduling. |
| `/media-library` | `media` | Grid of images/videos, tags, storage quota indicator, direct "Attach to Post". |
| `/ai-assistant` | `ai` | Viral hook generator, hashtag suggestions, content repurposing assistant. |
| `/analytics` | `analytics` | Engagement graphs, top-performing posts, follower growth per platform. |
| `/notifications` | `notifications` | Live feed of publishing successes, failed attempts, and token expiration alerts. |

---

### Recommended New Dashboard Sections for Superior UX

To make SocialFlow AI feel like a top-tier SaaS (competitor to Buffer/Later/Hootsuite), these sections should be integrated:

```
Dashboard Sidebar Navigation
├── 📊 Overview (/dashboard)
├── 🏢 Workspace Switcher (Header Dropdown)  <-- [NEW: Multi-brand / Agency support]
│
├── ✍️ Create & Publish
│   ├── 📝 Compose Post (/create-post)
│   ├── 📅 Content Calendar (/calendar)
│   ├── 📋 Post History & Queue (/posts)
│   ├── ⏳ Approval Queue (/approvals)      <-- [NEW: Team/Client review workflow]
│   └── 🎨 Media Library (/media-library)
│
├── 🤖 AI Growth Studio
│   ├── ✨ AI Caption & Hook Studio (/ai-studio)
│   └── 🔗 Smart Bio / Link-in-Bio (/link-in-bio) <-- [NEW: Creator landing page]
│
├── 💬 Unified Inbox (/inbox)               <-- [NEW: Comments & WhatsApp/IG DMs]
│
├── 📈 Insights & Reports
│   ├── 📊 Analytics (/analytics)
│   └── 📑 Export PDF Reports (/reports)    <-- [NEW: Automated agency reports]
│
└── ⚙️ Management
    ├── 🔌 Connected Accounts (/connected-accounts)
    ├── 👥 Team & Workspaces (/workspaces)   <-- [NEW: Invite team members / clients]
    ├── 💳 Plan & Billing (/billing)        <-- [NEW: Stripe subscription / post limits]
    └── ⚙️ Account Settings (/settings)
```

#### Detailed Breakdown of New UX Enhancements:

1. **Workspace / Brand Switcher (Top Navigation)**:
   - Allows users managing multiple brands or client accounts to switch workspaces in 1 click without logging out.
2. **Approval Workflow (`/approvals`)**:
   - For social media managers and agency clients. Junior creator submits post $\rightarrow$ Client approves $\rightarrow$ Auto-scheduled.
3. **Smart Link-in-Bio (`/link-in-bio`)**:
   - Gives creators a customized micro-landing page for their Instagram/TikTok bio with clickable links to their products/posts.
4. **Unified Social & Messaging Inbox (`/inbox`)**:
   - Read and respond to Facebook/Instagram comments and WhatsApp customer queries from one single screen.
5. **Team & Permissions (`/workspaces/team`)**:
   - Invite copywriters, designers, and managers with custom roles (`Admin`, `Editor`, `Approver`, `Viewer`).
6. **Billing & Usage Bar (`/billing`)**:
   - Visual progress bars showing: *Posts this month (e.g. 84/100)*, *Connected Accounts (4/5)*, *AI Tokens remaining*.

---

## 5. Master Development Phase Order

1. **Phase 1: Foundation & Security**
   - Clean up legacy modules.
   - Setup AES-256 token encryption util & `workspaces` module.
   - Implement `SocialAccount` schema & generic `SocialProvider` interface.
2. **Phase 2: Facebook Page Engine**
   - Facebook OAuth 2.0 $\rightarrow$ Page fetching $\rightarrow$ Token persistence.
   - `FacebookProvider` for publishing text, single image, and link posts.
3. **Phase 3: Instagram Professional Engine**
   - Fetch linked IG Business Account from Facebook Page.
   - `InstagramProvider` with 2-step media container async flow.
4. **Phase 4: Threads Engine**
   - Threads OAuth $\rightarrow$ `ThreadsProvider` for text, image, and link posting.
5. **Phase 5: Queue & Scheduling Engine**
   - BullMQ publishing worker + retry logic + exponential backoff.
   - Delayed jobs for scheduled calendar posts.
   - Automatic 30-day token refresh cron.
6. **Phase 6: AI Content Studio**
   - OpenAI / Gemini integration for captions, hashtags, and multi-platform text repurposing.
7. **Phase 7: Analytics & Reports**
   - Periodic metric sync worker (impressions, likes, shares, clicks).
8. **Phase 8: Workspace Collaboration & Billing**
   - Team invitations, approval workflows, Stripe subscriptions.
9. **Phase 9: Additional Social Channels**
   - LinkedIn, X (Twitter), TikTok, Pinterest, YouTube.
10. **Phase 10: Messaging Engine (WhatsApp Business)**
    - Cloud API for template messages and 1-on-1 customer interaction.
