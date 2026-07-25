"use client";

import { use, useState } from "react";
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
    TrendingUp,
    Play,
    Trash2,
    RotateCcw,
    Shield,
    Globe,
    Activity,
    ExternalLink,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { MOCK_POSTS_DATA, PostItem } from "@/data/postsData";
import { Tag, Button, Modal, ConfigProvider, App, Avatar } from "antd";

function PostDetailsContent({ postId }: { postId: string }) {
    const router = useRouter();
    const { message } = App.useApp();

    // Find target post or fallback
    const post: PostItem =
        MOCK_POSTS_DATA.find((p) => p.id === postId) || MOCK_POSTS_DATA[0];

    const authorsMap: Record<string, { name: string; email: string; avatar: string }> = {
        "SF-9021": { name: "Elena Vance", email: "elena.v@socialflow.ai", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" },
        "SF-8812": { name: "Marcus Chen", email: "marcus.c@techviral.io", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" },
        "SF-7644": { name: "Sophia Rodriguez", email: "sophia@designstudio.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" },
    };

    const author = authorsMap[post.id] || {
        name: "Sushil Hemrom",
        email: "sushil@creatorstack.io",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Confirm Delete
    const handleDeleteConfirm = () => {
        message.success(`Post #${post.id} deleted from system database.`);
        setIsDeleteModalOpen(false);
        setTimeout(() => {
            router.push("/admin/posts");
        }, 500);
    };

    // Resync Gateway
    const handleResyncGateway = () => {
        message.loading({ content: "Re-pinging social platform webhooks...", key: "resync" });
        setTimeout(() => {
            message.success({ content: "Platform gateway metrics synced!", key: "resync" });
        }, 1000);
    };

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
        <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-screen bg-slate-50/60 rounded-3xl">
            {/* Top Navigation & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/admin/posts")}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        title="Back to Admin Posts"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 uppercase tracking-wider">
                                ADMIN POST DETAILS
                            </span>
                            {getStatusTag(post.status)}
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                            {post.title || `Post #${post.id}`}
                        </h1>
                        <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1.5 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date: {post.publishedAt} • ID: {post.id}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        icon={<RotateCcw className="w-4 h-4" />}
                        onClick={handleResyncGateway}
                        className="rounded-xl font-bold h-10 cursor-pointer"
                    >
                        Resync Gateway
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="rounded-xl font-bold bg-rose-600 h-10 cursor-pointer"
                    >
                        Delete Post
                    </Button>
                </div>
            </div>

            {/* Post Content & Creator Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <Avatar src={author.avatar} size={48} className="bg-purple-600 text-white font-bold shrink-0">
                            {author.name.charAt(0)}
                        </Avatar>
                        <div>
                            <h4 className="text-base font-extrabold text-slate-900">{author.name}</h4>
                            <p className="text-xs text-slate-500 font-mono">{author.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                            Target Channels:
                        </span>
                        {post.platforms.map((p) => (
                            <span key={p} className="px-3 py-1 bg-slate-100 rounded-xl text-xs font-extrabold capitalize text-slate-700 border border-slate-200">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Post Body & Media Preview */}
                <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-sans font-medium">
                            {post.content}
                        </p>
                    </div>

                    {post.thumbnail && (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-w-md shadow-xs">
                            <img src={post.thumbnail} alt="Post Attachment" className="w-full h-56 object-cover" />
                        </div>
                    )}
                </div>
            </div>

            {/* Overall Performance Metrics Highlights */}
            {post.status === "published" && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>TOTAL VIEWS</span>
                            <Eye className="w-4 h-4 text-sky-500" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{post.metrics.views}</h3>
                        <p className="text-xs text-emerald-600 mt-1 font-semibold">↑ 14.2% vs baseline</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>TOTAL LIKES</span>
                            <ThumbsUp className="w-4 h-4 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{post.metrics.likes}</h3>
                        <p className="text-xs text-emerald-600 mt-1 font-semibold">↑ 8.5% engagement rate</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>TOTAL COMMENTS</span>
                            <MessageSquare className="w-4 h-4 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{post.metrics.comments}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Across all platforms</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>ENGAGEMENT RATE</span>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">{post.metrics.engagementRate}</h3>
                        <p className="text-xs text-emerald-600 mt-1 font-semibold">High Performing</p>
                    </div>
                </div>
            )}

            {/* Channel Performance Breakdown Grid */}
            <h2 className="text-lg font-extrabold text-slate-900 pt-2">Channel Performance Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facebook Details Card */}
                {analytics?.facebook && (
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-blue-600">
                                <div className="p-2.5 rounded-xl bg-blue-50">
                                    <FaFacebook className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Facebook Analytics</h3>
                                    <p className="text-xs text-slate-400">Page post performance telemetry</p>
                                </div>
                            </div>
                            <Tag color="blue" className="rounded-full font-bold">Active</Tag>
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
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-pink-600">
                                <div className="p-2.5 rounded-xl bg-pink-50">
                                    <FaInstagram className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Instagram Insights</h3>
                                    <p className="text-xs text-slate-400">Feed & Reel engagement</p>
                                </div>
                            </div>
                            <Tag color="magenta" className="rounded-full font-bold">Active</Tag>
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
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-sky-500">
                                <div className="p-2.5 rounded-xl bg-sky-50">
                                    <FaTwitter className="w-5 h-5 text-sky-500" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Twitter / X Analytics</h3>
                                    <p className="text-xs text-slate-400">Tweet impressions & profile clicks</p>
                                </div>
                            </div>
                            <Tag color="cyan" className="rounded-full font-bold">Active</Tag>
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
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5 text-blue-700">
                                <div className="p-2.5 rounded-xl bg-blue-50">
                                    <FaLinkedin className="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">LinkedIn Analytics</h3>
                                    <p className="text-xs text-slate-400">Professional reach & CTR</p>
                                </div>
                            </div>
                            <Tag color="geekblue" className="rounded-full font-bold">Active</Tag>
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

            {/* Delete Confirmation Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-rose-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-lg font-bold text-slate-900">Delete Post Permanently</span>
                    </div>
                }
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl font-semibold cursor-pointer">
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDeleteConfirm} className="rounded-xl font-bold bg-rose-600 cursor-pointer">
                        Yes, Delete Post
                    </Button>,
                ]}
                destroyOnHidden
            >
                <div className="space-y-3 py-2 text-sm text-slate-600">
                    <p>Are you sure you want to delete post <strong className="text-slate-900 font-mono">#{post.id}</strong>?</p>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                        This action is permanent and will purge all post engagement metrics and gateway logs.
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default function AdminPostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#7C3AED",
                    borderRadius: 12,
                    colorBgContainer: "#ffffff",
                    fontFamily: "var(--font-geist-sans), 'DM Sans', sans-serif",
                },
            }}
        >
            <App>
                <PostDetailsContent postId={resolvedParams.id} />
            </App>
        </ConfigProvider>
    );
}
