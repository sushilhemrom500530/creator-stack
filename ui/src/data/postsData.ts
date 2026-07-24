export interface PlatformAnalytics {
    facebook?: {
        impressions: number;
        reach: number;
        reactions: { likes: number; love: number; haha: number; wow: number };
        comments: number;
        shares: number;
        clicks: number;
    };
    instagram?: {
        impressions: number;
        reach: number;
        likes: number;
        comments: number;
        shares: number;
        saves: number;
        reelsPlays?: number;
    };
    twitter?: {
        impressions: number;
        likes: number;
        retweets: number;
        replies: number;
        bookmarks: number;
        profileClicks: number;
    };
    linkedin?: {
        impressions: number;
        reactions: number;
        comments: number;
        reposts: number;
        clicks: number;
        ctr: string;
    };
}

export interface PostItem {
    id: string;
    title?: string;
    content: string;
    thumbnail?: string;
    platforms: Array<"twitter" | "linkedin" | "facebook" | "instagram">;
    status: "published" | "scheduled" | "draft" | "failed";
    publishedAt: string;
    metrics: {
        views: string;
        likes: number;
        comments: number;
        shares: number;
        engagementRate: string;
    };
    analytics?: PlatformAnalytics;
}

export const MOCK_POSTS_DATA: PostItem[] = [
    {
        id: "SF-9021",
        title: "Creator Stack Tools Official Launch",
        content: "🚀 Exciting news! We are launching our latest Creator Stack tools today. Automate your post workflow, track real-time analytics, and boost engagement effortlessly! #CreatorEconomy #TechInnovation #GenerativeAI",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
        platforms: ["twitter", "linkedin", "facebook", "instagram"],
        status: "published",
        publishedAt: "2026-07-24 14:30",
        metrics: { views: "14.2k", likes: 1240, comments: 185, shares: 128, engagementRate: "9.4%" },
        analytics: {
            facebook: {
                impressions: 4500,
                reach: 3800,
                reactions: { likes: 210, love: 95, haha: 12, wow: 28 },
                comments: 42,
                shares: 31,
                clicks: 180
            },
            instagram: {
                impressions: 5200,
                reach: 4600,
                likes: 540,
                comments: 68,
                shares: 45,
                saves: 89,
                reelsPlays: 3100
            },
            twitter: {
                impressions: 2800,
                likes: 310,
                retweets: 38,
                replies: 45,
                bookmarks: 52,
                profileClicks: 140
            },
            linkedin: {
                impressions: 1700,
                reactions: 180,
                comments: 30,
                reposts: 14,
                clicks: 95,
                ctr: "5.6%"
            }
        }
    },
    {
        id: "SF-8812",
        title: "Behind the scenes: Crafting the perfect user experience",
        content: "Content strategy 101: Consistency beats intensity every single time. Here are 5 quick tips to level up your social media presence in 2026 🧵👇 #ContentStrategy #Growth",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80",
        platforms: ["twitter", "instagram", "facebook"],
        status: "published",
        publishedAt: "2026-07-23 09:15",
        metrics: { views: "8.9k", likes: 740, comments: 89, shares: 62, engagementRate: "10.2%" },
        analytics: {
            twitter: {
                impressions: 4100,
                likes: 340,
                retweets: 48,
                replies: 39,
                bookmarks: 64,
                profileClicks: 190
            },
            instagram: {
                impressions: 3200,
                reach: 2900,
                likes: 290,
                comments: 32,
                shares: 11,
                saves: 45
            },
            facebook: {
                impressions: 1600,
                reach: 1400,
                reactions: { likes: 110, love: 35, haha: 2, wow: 5 },
                comments: 18,
                shares: 3,
                clicks: 65
            }
        }
    },
    {
        id: "SF-7644",
        title: "New product launch announcement & roadmap",
        content: "Behind the scenes of building AI-assisted content workflows. Generative AI is not replacing creators—it is amplifying their reach! 🧠✨ #GenerativeAI #FutureOfWork",
        platforms: ["linkedin", "twitter"],
        status: "scheduled",
        publishedAt: "2026-07-25 18:00",
        metrics: { views: "0", likes: 0, comments: 0, shares: 0, engagementRate: "0%" }
    },
    {
        id: "SF-9201",
        title: "Sustainability meets digital craftsmanship",
        content: "Weekly poll: What social channel is driving the highest ROI for your brand this quarter? Drop your thoughts below! 📊",
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=150&q=80",
        platforms: ["twitter", "linkedin"],
        status: "draft",
        publishedAt: "Draft",
        metrics: { views: "0", likes: 0, comments: 0, shares: 0, engagementRate: "0%" }
    },
    {
        id: "SF-4510",
        title: "Cross-Channel Analytics Announcement",
        content: "Product announcement: New cross-channel analytics integration is now live for all pro tier creators. Check your dashboard for live insights!",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=150&q=80",
        platforms: ["facebook", "instagram"],
        status: "published",
        publishedAt: "2026-07-21 16:45",
        metrics: { views: "3.1k", likes: 210, comments: 19, shares: 14, engagementRate: "6.8%" },
        analytics: {
            facebook: {
                impressions: 1800,
                reach: 1500,
                reactions: { likes: 90, love: 22, haha: 0, wow: 6 },
                comments: 11,
                shares: 8,
                clicks: 54
            },
            instagram: {
                impressions: 1300,
                reach: 1100,
                likes: 120,
                comments: 8,
                shares: 6,
                saves: 15
            }
        }
    },
    {
        id: "SF-3102",
        title: "Failed Token Retry Post",
        content: "Failed to publish post due to expired platform authentication token. Please reconnect your account.",
        platforms: ["facebook"],
        status: "failed",
        publishedAt: "2026-07-22 11:00",
        metrics: { views: "0", likes: 0, comments: 0, shares: 0, engagementRate: "0%" }
    }
];
