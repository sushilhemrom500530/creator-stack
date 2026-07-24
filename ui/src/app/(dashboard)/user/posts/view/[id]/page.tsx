"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    PenSquare,
    Eye,
    ThumbsUp,
    MessageSquare,
    Share2,
    Bookmark,
    MousePointer,
    TrendingUp,
    ExternalLink,
    Play,
    Edit3
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { MOCK_POSTS_DATA, PostItem } from "@/data/postsData";
import { Tag } from "antd";

export default function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const postId = resolvedParams.id;

    // Find target post or default to first post for demo fallback
    const post: PostItem =
        MOCK_POSTS_DATA.find((p) => p.id === postId) || MOCK_POSTS_DATA[0];

    const getStatusTag = (status: PostItem["status"]) => {
        switch (status) {
            case "published":
                return (
                    <Tag className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </Tag>
                );
            case "scheduled":
                return (
                    <Tag className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                        <Clock className="w-3.5 h-3.5" /> Scheduled
                    </Tag>
                );
            case "draft":
                return (
                    <Tag className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border-slate-200">
                        <PenSquare className="w-3.5 h-3.5" /> Draft
                    </Tag>
                );
            case "failed":
                return (
                    <Tag className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </Tag>
                );
        }
    };

    const analytics = post.analytics;

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Top Navigation & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        title="Back to Posts"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-800">
                                {post.title || `Post #${post.id}`}
                            </h1>
                            {getStatusTag(post.status)}
                        </div>
                        <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Published on {post.publishedAt}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/user/posts"
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition"
                    >
                        View All Posts
                    </Link>
                    <Link
                        href="/user/create-post"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition shadow-sm"
                    >
                        <Edit3 className="w-4 h-4" /> Edit Content
                    </Link>
                </div>
            </div>

            {/* Post Content Preview Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            SH
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">Sushil Hemrom</h4>
                            <p className="text-xs text-slate-400">Published across {post.platforms.length} Channels</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {post.platforms.map((p) => (
                            <span key={p} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold capitalize text-slate-600">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-sans">
                        {post.content}
                    </p>
                </div>
            </div>

            {/* Overall Performance Highlights */}
            {post.status === "published" && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>TOTAL VIEWS</span>
                            <Eye className="w-4 h-4 text-sky-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mt-2">{post.metrics.views}</h3>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">↑ 14.2% vs avg</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>TOTAL LIKES</span>
                            <ThumbsUp className="w-4 h-4 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mt-2">{post.metrics.likes}</h3>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">↑ 8.5% vs avg</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>TOTAL COMMENTS</span>
                            <MessageSquare className="w-4 h-4 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mt-2">{post.metrics.comments}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Across all accounts</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>ENGAGEMENT RATE</span>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-2">{post.metrics.engagementRate}</h3>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">High performing post</p>
                    </div>
                </div>
            )}

            {/* Channel-by-Channel Breakdown Grid */}
            <h2 className="text-lg font-bold text-slate-800 pt-2">Channel Performance Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facebook Details Card */}
                {analytics?.facebook && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-blue-600">
                                <div className="p-2 rounded-xl bg-blue-50">
                                    <FaFacebook className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Facebook Analytics</h3>
                                    <p className="text-xs text-slate-400">Page post performance</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                                Active
                            </span>
                        </div>

                        {/* Reactions Grid */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reactions Breakdown</p>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-lg">👍</span>
                                    <p className="text-xs text-slate-400 mt-1">Likes</p>
                                    <p className="text-sm font-bold text-slate-800">{analytics.facebook.reactions.likes}</p>
                                </div>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-lg">❤️</span>
                                    <p className="text-xs text-slate-400 mt-1">Love</p>
                                    <p className="text-sm font-bold text-slate-800">{analytics.facebook.reactions.love}</p>
                                </div>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-lg">😆</span>
                                    <p className="text-xs text-slate-400 mt-1">Haha</p>
                                    <p className="text-sm font-bold text-slate-800">{analytics.facebook.reactions.haha}</p>
                                </div>
                                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-lg">😲</span>
                                    <p className="text-xs text-slate-400 mt-1">Wow</p>
                                    <p className="text-sm font-bold text-slate-800">{analytics.facebook.reactions.wow}</p>
                                </div>
                            </div>
                        </div>

                        {/* Extra Metrics List */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Comments</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.facebook.comments}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Shares</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.facebook.shares}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Link Clicks</p>
                                <p className="text-base font-bold text-blue-600 mt-0.5">{analytics.facebook.clicks}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instagram Details Card */}
                {analytics?.instagram && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-pink-600">
                                <div className="p-2 rounded-xl bg-pink-50">
                                    <FaInstagram className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Instagram Insights</h3>
                                    <p className="text-xs text-slate-400">Feed & Reel engagement</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-50 text-pink-600 border border-pink-200">
                                Active
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <ThumbsUp className="w-3.5 h-3.5 text-pink-500" /> Likes
                                </p>
                                <p className="text-base font-bold text-slate-800 mt-1">{analytics.instagram.likes}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-pink-500" /> Comments
                                </p>
                                <p className="text-base font-bold text-slate-800 mt-1">{analytics.instagram.comments}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <Bookmark className="w-3.5 h-3.5 text-pink-500" /> Saves
                                </p>
                                <p className="text-base font-bold text-slate-800 mt-1">{analytics.instagram.saves}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <Share2 className="w-3.5 h-3.5 text-pink-500" /> Shares
                                </p>
                                <p className="text-base font-bold text-slate-800 mt-1">{analytics.instagram.shares}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <Play className="w-3.5 h-3.5 text-pink-500" /> Reel Plays
                                </p>
                                <p className="text-base font-bold text-slate-800 mt-1">{analytics.instagram.reelsPlays || "—"}</p>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <Eye className="w-3.5 h-3.5 text-pink-500" /> Reach
                                </p>
                                <p className="text-base font-bold text-pink-600 mt-1">{analytics.instagram.reach}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Twitter / X Details Card */}
                {analytics?.twitter && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-sky-500">
                                <div className="p-2 rounded-xl bg-sky-50">
                                    <FaTwitter className="w-5 h-5 text-sky-500" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Twitter / X Analytics</h3>
                                    <p className="text-xs text-slate-400">Tweet engagement & metrics</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                                Active
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Impressions</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.twitter.impressions}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Likes</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.twitter.likes}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Retweets</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.twitter.retweets}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Replies</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.twitter.replies}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Bookmarks</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.twitter.bookmarks}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Profile Clicks</p>
                                <p className="text-base font-bold text-sky-600 mt-0.5">{analytics.twitter.profileClicks}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* LinkedIn Details Card */}
                {analytics?.linkedin && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-blue-700">
                                <div className="p-2 rounded-xl bg-blue-50">
                                    <FaLinkedin className="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">LinkedIn Analytics</h3>
                                    <p className="text-xs text-slate-400">Professional post analytics</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                                Active
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Impressions</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.linkedin.impressions}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Reactions</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.linkedin.reactions}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Comments</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.linkedin.comments}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Reposts</p>
                                <p className="text-base font-bold text-slate-800 mt-0.5">{analytics.linkedin.reposts}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">Link Clicks</p>
                                <p className="text-base font-bold text-blue-700 mt-0.5">{analytics.linkedin.clicks}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400">CTR Rate</p>
                                <p className="text-base font-bold text-emerald-600 mt-0.5">{analytics.linkedin.ctr}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
