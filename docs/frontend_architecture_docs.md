# 🎨 SocialFlow AI — Frontend (UI) Architecture & Design Specification

> **Platform**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Shadcn UI  
> **Target Viewport**: Desktop-First (1440px – 1600px breakpoint)  
> **Aesthetic Philosophy**: Linear / Stripe / Vercel / Framer Dark-Mode Enterprise SaaS  

---

## 🛠️ 1. Technology Stack & Dependencies

* **Framework**: Next.js 15 (App Router, Server & Client Components)
* **Language**: TypeScript (`strict: true`)
* **Styling**: Tailwind CSS + Custom CSS Design System Tokens
* **UI Components**: Shadcn UI / Radix UI Primitives + Lucide React + React Icons (`tb`)
* **State Management**: Zustand / TanStack Query (React Query)
* **Form Handling**: React Hook Form + Zod Validation Schemas
* **Charts & Data Visualization**: Recharts / Tremor
* **Animations**: Framer Motion (Smooth glassmorphism & micro-interactions)

---

## 🎨 2. Design System Tokens & Visual Guidelines

```css
:root {
  /* Canvas & Surfaces */
  --bg-canvas: #09090B;      /* Very Dark Zinc / Navy */
  --bg-surface: #111827;     /* Header & Sidebar Surface */
  --bg-card: #161B22;        /* Dark Slate Card Container */
  --border-card: #27272A;    /* Subtle Card Border */

  /* Brand Accents */
  --color-primary: #7C3AED;   /* Rich Purple (Main CTA, Glowing Orbs, Active Tabs) */
  --color-secondary: #14B8A6; /* Teal (Analytics Lines, Highlights) */
  --color-accent: #22C55E;    /* Emerald Green (Status Badges, Growth) */
  --color-danger: #EF4444;    /* Error Alerts & Disconnect Actions */
  --color-warning: #F59E0B;   /* Rate Limit & Expiry Warnings */
  --color-info: #3B82F6;      /* Informational Badges */

  /* Typography */
  --text-white: #FFFFFF;
  --text-muted: #A1A1AA;

  /* Spacing & Borders */
  --radius-card: 20px;       /* 20px - 28px rounded corners */
  --spacing-grid: 8px;       /* Strict 8px spacing system */
}
```

---

## 📐 3. Application Directory & Route Structure (`ui/src/app`)

```
ui/src/app/
├── (public)/                 # Marketing & Landing Website
│   ├── page.tsx              # High-Converting Hero, Features, Pricing, Testimonials, FAQ
│   ├── pricing/page.tsx      # Tier comparison (Free, Starter, Pro, Agency, Enterprise)
│   ├── solutions/page.tsx    # Use cases for Creators, Agencies, Startups
│   └── blog/page.tsx         # Resource & Marketing Articles
│
├── auth/                     # Authentication Screens (Split Layout)
│   ├── login/page.tsx        # Split screen: Left Brand Art, Right Glass Login Form
│   └── register/page.tsx     # Split screen: Left Benefits List, Right Register Form
│
├── (dashboard)/
│   ├── user/                 # User Social Media Operations (Desktop MVP)
│   │   ├── dashboard/        # Welcome Header, Stat Cards, Analytics Chart, Quick Actions
│   │   ├── create-post/      # Post Composer (Platform Tabs, AI Tools, Media Upload)
│   │   ├── posts/            # Posts Data Table (Tabs: All, Published, Scheduled, Draft, Failed)
│   │   ├── content-calendar/ # Drag & Drop Monthly / Weekly / Daily Content Calendar
│   │   ├── analytics/        # Detailed Aggregated Metrics & Top Posts Breakdown
│   │   ├── media-library/    # S3/Cloudinary Asset Gallery & Folder Manager
│   │   ├── ai-studio/        # Multi-Generator Engine (Captions, Hashtags, 30-Day Plan, Tone)
│   │   ├── social-accounts/  # OAuth Connection Cards & Account Health Controls
│   │   ├── notifications/    # Publishing Success/Failure & System Alerts
│   │   └── settings/         # Profile, Password, Preferences, Active Plan
│   │
│   └── admin/                # Platform Management & Ecosystem Panel
│       ├── dashboard/        # Executive Stats (MRR, ARR, Active Users, System Health)
│       ├── users/            # User Management Table & Security Controls
│       ├── workspaces/       # Multi-tenant Workspace Overview
│       ├── connected-platforms/ # Global OAuth API Health, Error Rates, API Requests
│       ├── posts/            # Platform-wide Post Audit Log
│       ├── analytics/        # SaaS Financial & Platform Usage Analytics
│       ├── ai-management/    # OpenAI/Gemini Token Costs, Request Rates & Failures
│       ├── subscribers/      # Active Subscriptions & Upgrade Tracking
│       ├── transactions/     # Payment History & Invoices
│       ├── reports/          # Abuse & User Report Moderation Queue
│       ├── system-health/    # Server, Redis, BullMQ Queue, Database CPU & RAM Monitor
│       ├── support/          # Support Ticket Inbox & Reply Drawer
│       └── settings/         # Global SaaS Configuration, Branding, SMTP, API Keys
```

---

## 🧭 4. Sidebar Navigation Specifications

### A. User Sidebar Navigation (`userMenuData`)
1. 🏠 **Dashboard** (`/(dashboard)/user/dashboard`)
2. ✍️ **Create Post** (`/(dashboard)/user/create-post`)
3. 📝 **Posts** (`/(dashboard)/user/posts`)
4. 📅 **Content Calendar** (`/(dashboard)/user/content-calendar`)
5. 📊 **Analytics** (`/(dashboard)/user/analytics`)
6. 🖼️ **Media Library** (`/(dashboard)/user/media-library`)
7. 🤖 **AI Studio** (`/(dashboard)/user/ai-studio`)
8. 🔗 **Social Accounts** (`/(dashboard)/user/social-accounts`)
9. 🔔 **Notifications** (`/(dashboard)/user/notifications`)
10. ⚙️ **Settings** (`/(dashboard)/user/settings`)

### B. Admin Sidebar Navigation (`adminMenuData`)
```typescript
export const adminMenuData = {
  linkData: [
    {
      menu: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Workspaces", href: "/admin/workspaces", icon: TbAffiliate },
        { label: "Connected Platforms", href: "/admin/connected-platforms", icon: TbWorld },
        { label: "Posts", href: "/admin/posts", icon: FileText },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "AI Management", href: "/admin/ai-management", icon: Bot },
        { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
        { label: "Transactions", href: "/admin/transactions", icon: BadgeDollarSign },
        { label: "Reports", href: "/admin/reports", icon: Flag },
        { label: "Notifications", href: "/admin/notifications", icon: Bell },
        { label: "System Health", href: "/admin/system-health", icon: Activity },
        { label: "API & Integrations", href: "/admin/api-integrations", icon: TbServer },
        { label: "Audit Logs", href: "/admin/audit-logs", icon: Database },
        { label: "Roles & Permissions", href: "/admin/roles-permissions", icon: ShieldCheck },
        { label: "Support Tickets", href: "/admin/support-tickets", icon: LifeBuoy },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ],
};
```

---

## 🎼 5. Key Page UI Workflows

### 1. Create Post Page (`/user/create-post`)
* **Unified Composer**: Rich text input with character counter per target platform.
* **Platform Target Selector**: Interactive cards for Facebook, Instagram, LinkedIn, X, TikTok, Threads, Google Business.
* **Platform Preview Tabs**: Instant preview rendering how the post will look on Facebook vs. Instagram vs. LinkedIn vs. X.
* **AI Tool Integration Sidebar**:
  * 1-Click Caption Generator
  * Hashtag Recommendation Picker (High/Med/Low competition)
  * Tone Rewriter (Professional, Casual, Funny)
  * Multi-lingual Translator (English, Bengali, Hindi, etc.)
* **Actions**: `Publish Now`, `Schedule` (Datetime picker), `Save Draft`.

### 2. Social Accounts Page (`/user/social-accounts`)
* Platform grid cards showcasing connection status (`Active`, `Token Expiring`, `Reauth Required`).
* **OAuth Connect Flow**: Clicking "Connect Facebook" triggers `GET /api/v1/integrations/facebook/connect`, redirects to Facebook OAuth page, handles callback, and presents the discovered Facebook Pages / Instagram Business Accounts for workspace import.

---

## 📱 6. Responsive Guidelines
* **Target Desktop Viewport**: 1440px to 1600px width.
* **Grid**: 8px layout grid with ample whitespace, glassmorphic floating cards (`backdrop-blur-md`), and glowing purple/teal orbs behind primary components.
