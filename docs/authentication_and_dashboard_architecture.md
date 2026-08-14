# CreatorStack — Authentication, User Dashboard & Admin Management Architecture

> **Document Type**: System Specification & UI/UX Logic  
> **Target Audience**: Full-Stack Engineers & Product Designers  
> **Applies to**: `api/` (NestJS Backend) & `ui/` (Next.js 15 App Router Frontend)

---

## 1. Authentication & Security Engine

### 1.1 Complete Auth Lifecycle & Flows

```
                   ┌────────────────────────────────────────┐
                   │        User Registration Flow          │
                   └──────────────────┬─────────────────────┘
                                      │
       1. POST /api/v1/auth/register (name, email, password)
                                      ▼
             Save to TempUser collection + Send 6-digit OTP email
                                      │
       2. POST /api/v1/auth/verify-otp (email, otp)
                                      ▼
             Verify OTP -> Create permanent User in MongoDB
                        -> Create Default Workspace for user
                        -> Issue JWT Access Token + HttpOnly Refresh Cookie
```

```
                   ┌────────────────────────────────────────┐
                   │             User Login Flow            │
                   └──────────────────┬─────────────────────┘
                                      │
       1. POST /api/v1/auth/login (email, password)
                                      ▼
             Validate password (bcrypt) + Check account status (ACTIVE)
                                      │
       2. Device & Session Tracking
                                      ▼
             Extract IP, User-Agent, OS, Device info
             Store session record in User document
                                      │
       3. Token Delivery
                                      ▼
             - Access Token (JWT): 15-minute expiry (JSON payload)
             - Refresh Token (JWT): 7-day expiry (HttpOnly, Secure, Signed Cookie)
```

```
                   ┌────────────────────────────────────────┐
                   │          Password Recovery Flow        │
                   └──────────────────┬─────────────────────┘
                                      │
       1. POST /api/v1/auth/forgot-password -> Sends OTP email
       2. POST /api/v1/auth/verify-forgot-otp -> Validates OTP token
       3. POST /api/v1/auth/reset-password -> Hashes & saves new password
```

---

## 2. Role-Based Access Control (RBAC) & Permissions

### 2.1 System Roles vs. Workspace Roles

CreatorStack enforces a dual-tier permission model:

| Role Level | Role Identifier | Scope & Capabilities |
| :--- | :--- | :--- |
| **System** | `SUPER_ADMIN` | Full control over the entire SaaS instance, users, servers, and global billing. |
| **System** | `ADMIN` | Manage users, view platform-wide audit logs, manage system settings. |
| **System** | `USER` | Standard SaaS customer with access to user dashboard and workspaces. |
| **Workspace** | `OWNER` | Primary workspace owner; can manage billing, delete workspace, invite all roles. |
| **Workspace** | `ADMIN` | Can connect social accounts, invite members, manage post approvals. |
| **Workspace** | `EDITOR` | Can create, edit, and schedule social media posts. |
| **Workspace** | `VIEWER` | Read-only access to view calendar, post history, and analytics. |

### 2.2 Next.js Middleware Route Protection (`ui/src/middleware.ts`)

- `/auth/*` $\rightarrow$ Redirects already logged-in users directly to `/dashboard`.
- `/user/*` $\rightarrow$ Requires valid JWT cookie. Redirects unauthenticated users to `/auth/login`.
- `/admin/*` $\rightarrow$ Requires valid JWT cookie **AND** `roles.includes('admin') || roles.includes('super_admin')`. Regular users are redirected to `/user/dashboard` with a 403 alert.

---

## 3. User Dashboard Architecture (`/user/...`)

The User Dashboard is the creator & agency command center designed for publishing, content scheduling, multi-channel analytics, and AI assistance.

```
User Dashboard Navigation
├── 📊 Overview (/user/dashboard)
├── 🏢 Workspace / Brand Switcher (Header Dropdown)
│
├── ✍️ Social Publishing
│   ├── 📝 Compose Post (/user/create-post)
│   ├── 📅 Content Calendar (/user/calendar)
│   ├── 📋 Post History & Queue (/user/posts)
│   └── 🎨 Media Library (/user/media-library)
│
├── 🤖 AI Growth Assistant (/user/ai-assistant)
│
├── 📈 Channel Analytics (/user/analytics)
│
├── 🔔 Notifications (/user/notifications)
│
└── ⚙️ Settings & Connections
    ├── 🔌 Connected Accounts (/user/connected-accounts)
    └── ⚙️ Profile Settings (/user/settings)
```

### Detailed Feature Breakdown:

1. **Overview Dashboard (`/user/dashboard`)**:
   - Summary metric cards: Total Scheduled Posts, Posts Published this Month, Overall Engagement Rate, Active Connected Accounts.
   - Upcoming scheduled posts widget with direct 1-click edit.
   - Quick action shortcuts: "New Post", "Upload Media", "Connect Channel".
2. **Post Composer (`/user/create-post`)**:
   - Multi-platform live preview tabs (Facebook, Instagram, Threads, LinkedIn).
   - Rich media uploader (images, videos, carousels) with public HTTPS resolution.
   - AI Caption & Hashtag Assist button (auto-generates platform-tailored text).
   - "Publish Now" vs. "Schedule for Later" datetime picker.
3. **Content Calendar (`/user/calendar`)**:
   - Month, Week, and Day views showing visual cards of scheduled posts.
   - Drag-and-drop rescheduling.
4. **Post History & Queue (`/user/posts`)**:
   - Status filters: `All`, `Drafts`, `Scheduled`, `Published`, `Failed`.
   - Detailed platform status pills (e.g. *Facebook: Published ✓*, *Instagram: Published ✓*, *Threads: Failed ✕* with error tooltip).
5. **Connected Accounts (`/user/connected-accounts`)**:
   - Integration cards with 1-click OAuth connect buttons for Facebook Pages, Instagram Professional, Threads, LinkedIn.
   - Connection status badges (`Active`, `Token Expiring Soon`, `Disconnected`).
6. **Media Library (`/user/media-library`)**:
   - Cloud storage manager for brand assets with instant "Attach to Post" action.

---

## 4. Admin Management Dashboard Architecture (`/admin/...`)

The Admin Dashboard provides SaaS operators with total visibility and control over platform users, workspaces, server health, and security audits.

```
Admin Dashboard Navigation
├── 📊 Executive Overview (/admin/dashboard)
├── 👥 User Management (/admin/users)
├── 🏢 Workspace Oversight (/admin/workspaces)
├── 📜 Audit & Security Logs (/admin/audit-logs)
├── 🖥️ System Health & Queues (/admin/health)
├── 💳 Subscriptions & Revenue (/admin/billing)
└── ⚙️ System Settings & Feature Flags (/admin/settings)
```

### Detailed Admin Management Features:

1. **Executive Overview (`/admin/dashboard`)**:
   - High-level KPIs: Total Users, Monthly Active Users (MAU), Total Connected Social Accounts, Total Posts Published Across Meta APIs, Monthly Recurring Revenue (MRR).
   - Real-time API traffic chart and error rate monitor.
2. **User Management (`/admin/users`)**:
   - Comprehensive searchable data table with filters for Role (`USER`, `ADMIN`), Status (`ACTIVE`, `SUSPENDED`, `BANNED`), and Date Joined.
   - **User Detail Modal / Page**:
     - View user profile, email verification status, connected OAuth providers.
     - View active sessions (IP, location, OS, device, last active time) with 1-click "Revoke All Sessions".
     - Action controls: Change Role, Reset Password, Suspend/Ban User, Soft Delete / Restore User.
3. **Workspace Oversight (`/admin/workspaces`)**:
   - Global view of all agency and creator workspaces.
   - Inspect member counts, connected channels per workspace, storage usage, and post volume.
4. **Audit & Security Logs (`/admin/audit-logs`)**:
   - Immutable security trail recording:
     - User login attempts (Success / Failure with IP and Geo data).
     - Role elevation and permission changes.
     - Token revoking and password resets.
     - API rate limit breaches.
5. **System Health & Queue Monitoring (`/admin/health`)**:
   - Live status of MongoDB connection latency, Redis memory, and BullMQ queue throughput (jobs waiting, active, failed).
   - 1-click "Retry Failed Publishing Jobs" and "Purge Dead-Letter Queue".
6. **System Settings & Feature Flags (`/admin/settings`)**:
   - Toggle maintenance mode.
   - Enable/disable specific social providers (e.g. temporarily pause Threads posting during API maintenance).
   - Configure global rate-limiting thresholds and email dispatch providers.

---

## 5. API Endpoints Reference Matrix

### Authentication Endpoints
- `POST /api/v1/auth/register` — Initial registration & sends OTP.
- `POST /api/v1/auth/verify-otp` — Confirms registration OTP & activates user.
- `POST /api/v1/auth/login` — Authenticates user, sets cookie & returns access token.
- `POST /api/v1/auth/refresh` — Exchanges valid refresh cookie for fresh access token.
- `POST /api/v1/auth/logout` — Invalidates current session & clears cookie.
- `POST /api/v1/auth/forgot-password` — Initiates password reset OTP.
- `POST /api/v1/auth/verify-forgot-otp` — Validates reset OTP.
- `POST /api/v1/auth/reset-password` — Sets new password.

### User Dashboard Endpoints
- `GET /api/v1/workspaces` — List workspaces user belongs to.
- `POST /api/v1/workspaces` — Create new workspace.
- `GET /api/v1/social-accounts?workspaceId=...` — List connected channels for active workspace.
- `POST /api/v1/social-accounts/connect` — Connects social account with encrypted tokens.
- `DELETE /api/v1/social-accounts/:id` — Revokes/disconnects social channel.
- `GET /api/v1/users/profile` — Get current user profile and session info.

### Admin Management Endpoints
- `GET /api/v1/admin/users` — Search, filter, and paginate all platform users.
- `GET /api/v1/admin/users/:id` — Detailed user inspection.
- `PATCH /api/v1/admin/users/:id/status` — Suspend, activate, or ban user.
- `PATCH /api/v1/admin/users/:id/role` — Elevate or demote user role.
- `DELETE /api/v1/admin/users/:id` — Soft-delete user account.
- `GET /api/v1/admin/audit-logs` — Query immutable security audit events.
- `GET /api/v1/admin/health` — Full system telemetry and queue depths.
