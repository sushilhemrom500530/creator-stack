"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { Table, Input, Select, Tag, Popconfirm, App, Tooltip, Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    PenSquare,
    Search,
    Filter,
    Eye,
    Calendar,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    AlertTriangle,
    Plus,
    Edit3,
    Trash2,
    RotateCcw,
    Image as ImageIcon,
    RefreshCw,
    Send,
    ExternalLink,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaThreads, FaWhatsapp } from "react-icons/fa6";
import { postsApi, publishingApi, getActiveWorkspaceId } from "@/lib/api";

export interface PostTargetRecord {
    accountId: {
        _id: string;
        accountName: string;
        username?: string;
        platform: string;
        profilePictureUrl?: string;
    } | string;
    platform: string;
    platformContent?: string;
    mediaOverrides?: string[];
    status: 'pending' | 'processing' | 'published' | 'failed' | 'cancelled';
    externalPostId?: string;
    externalPostUrl?: string;
    errorMessage?: string;
    publishedAt?: string;
    retryCount?: number;
}

export interface PostRecord {
    _id: string;
    baseContent: string;
    mediaUrls: string[];
    targets: PostTargetRecord[];
    status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'partially_published' | 'failed' | 'archived';
    scheduledAt?: string;
    publishedAt?: string;
    createdAt: string;
    tags?: string[];
}

function UserPostsInner() {
    const { message } = App.useApp();
    const [posts, setPosts] = useState<PostRecord[]>([]);
    const [summary, setSummary] = useState({
        total: 0,
        drafts: 0,
        scheduled: 0,
        publishing: 0,
        published: 0,
        failed: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [channelFilter, setChannelFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Edit modal state
    const [editingPost, setEditingPost] = useState<PostRecord | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const workspaceId = getActiveWorkspaceId();

    // Fetch live posts & summary
    const loadPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const [postsRes, summaryRes] = await Promise.allSettled([
                postsApi.getPosts({
                    workspaceId,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    platform: channelFilter !== "all" ? channelFilter : undefined,
                    search: searchTerm || undefined,
                    page,
                    limit: pageSize,
                }),
                postsApi.getSummary(workspaceId),
            ]);

            if (postsRes.status === "fulfilled") {
                setPosts(postsRes.value.data || []);
                setTotalItems(postsRes.value.meta?.total || 0);
            }

            if (summaryRes.status === "fulfilled") {
                setSummary(summaryRes.value);
            }
        } catch (error: any) {
            console.log("Error loading posts:", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId, statusFilter, channelFilter, searchTerm, page, pageSize]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    // Instant Publish Now handler
    const handlePublishNow = async (postId: string) => {
        setActionLoadingId(postId);
        try {
            message.loading("Dispatching post across selected social networks...", 1.5);
            await publishingApi.publishNow(postId);
            message.success("Post publishing process completed!");
            loadPosts();
        } catch (error: any) {
            message.error(`Publishing failed: ${error.message}`);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Retry specific failed target
    const handleRetryTarget = async (postId: string, accountId: string, platform: string) => {
        setActionLoadingId(`${postId}-${accountId}`);
        try {
            message.loading(`Retrying publish on ${platform.toUpperCase()}...`, 1.5);
            await publishingApi.retryTarget(postId, accountId);
            message.success(`${platform.toUpperCase()} target published successfully!`);
            loadPosts();
        } catch (error: any) {
            message.error(`Retry failed: ${error.message}`);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Delete post handler
    const handleDelete = async (id: string) => {
        try {
            await postsApi.deletePost(id);
            message.success("Post deleted successfully");
            loadPosts();
        } catch (error: any) {
            message.error(`Delete failed: ${error.message}`);
        }
    };

    // Open edit modal
    const handleOpenEdit = (post: PostRecord) => {
        setEditingPost(post);
        setEditContent(post.baseContent);
    };

    // Save edit
    const handleSaveEdit = async () => {
        if (!editingPost) return;
        setIsSavingEdit(true);
        try {
            await postsApi.updatePost(editingPost._id, { baseContent: editContent });
            message.success("Post updated successfully");
            setEditingPost(null);
            loadPosts();
        } catch (error: any) {
            message.error(`Update failed: ${error.message}`);
        } finally {
            setIsSavingEdit(false);
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setChannelFilter("all");
        setStatusFilter("all");
        setPage(1);
    };

    const renderPlatformBadge = (target: PostTargetRecord, record: PostRecord) => {
        const platform = target.platform?.toLowerCase();
        const accountId = typeof target.accountId === 'object' ? target.accountId._id : target.accountId;

        let Icon = FaFacebook;
        let colorClasses = "border-blue-200 text-blue-600 bg-blue-50";

        if (platform === "x" || platform === "twitter") {
            Icon = FaTwitter;
            colorClasses = "border-sky-200 text-sky-600 bg-sky-50";
        } else if (platform === "linkedin") {
            Icon = FaLinkedin;
            colorClasses = "border-blue-200 text-blue-700 bg-blue-50";
        } else if (platform === "instagram") {
            Icon = FaInstagram;
            colorClasses = "border-pink-200 text-pink-600 bg-pink-50";
        } else if (platform === "threads") {
            Icon = FaThreads;
            colorClasses = "border-zinc-300 text-zinc-800 bg-zinc-50";
        } else if (platform === "whatsapp") {
            Icon = FaWhatsapp;
            colorClasses = "border-emerald-200 text-emerald-600 bg-emerald-50";
        }

        // Target Status Indicators
        let statusDot = <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />;
        let statusTooltip = "Pending Dispatch";

        if (target.status === "published") {
            statusDot = <span className="w-2 h-2 rounded-full bg-emerald-500" />;
            statusTooltip = `Published successfully ${target.publishedAt ? `at ${new Date(target.publishedAt).toLocaleTimeString()}` : ''}`;
        } else if (target.status === "failed") {
            statusDot = <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />;
            statusTooltip = `Failed: ${target.errorMessage || 'Platform rejected post'}. Click to retry.`;
        } else if (target.status === "processing") {
            statusDot = <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />;
            statusTooltip = "Currently Publishing...";
        }

        return (
            <Tooltip key={accountId || target.platform} title={statusTooltip}>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-xs ${colorClasses}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{platform}</span>
                    {statusDot}
                    {target.status === "failed" && (
                        <button
                            onClick={() => handleRetryTarget(record._id, accountId, target.platform)}
                            className="ml-1 px-1.5 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold transition-all"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </Tooltip>
        );
    };

    const renderStatusTag = (status: PostRecord["status"]) => {
        switch (status) {
            case "published":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </Tag>
                );
            case "partially_published":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" /> Partial Failure
                    </Tag>
                );
            case "scheduled":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                        <Clock className="w-3.5 h-3.5" /> Scheduled
                    </Tag>
                );
            case "publishing":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border-purple-200">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Publishing...
                    </Tag>
                );
            case "draft":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border-slate-200">
                        <PenSquare className="w-3.5 h-3.5" /> Draft
                    </Tag>
                );
            case "failed":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </Tag>
                );
            default:
                return null;
        }
    };

    const columns: ColumnsType<PostRecord> = [
        {
            title: "Thumbnail",
            dataIndex: "mediaUrls",
            key: "mediaUrls",
            width: "100px",
            render: (mediaUrls: string[]) => {
                const thumb = mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : null;
                return (
                    <div className="w-14 h-11 rounded-xl bg-slate-900 border border-slate-700/80 overflow-hidden flex items-center justify-center shadow-inner group relative shrink-0">
                        {thumb ? (
                            <img
                                src={thumb}
                                alt="Thumbnail"
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-800/90 flex items-center justify-center text-slate-500">
                                <ImageIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Caption",
            dataIndex: "baseContent",
            key: "baseContent",
            width: "35%",
            render: (content: string, record) => (
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 hover:text-purple-600 transition cursor-pointer">
                        {content}
                    </h4>
                    <div className="flex items-center gap-2">
                        <p className="text-slate-400 font-mono text-[11px] tracking-wide">
                            ID: {record._id.slice(-6).toUpperCase()}
                        </p>
                        {record.tags && record.tags.length > 0 && (
                            <div className="flex gap-1">
                                {record.tags.slice(0, 2).map((t, idx) => (
                                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Target Channels & Health",
            dataIndex: "targets",
            key: "targets",
            width: "25%",
            render: (targets: PostTargetRecord[], record) => (
                <div className="flex flex-wrap gap-1.5">
                    {targets && targets.length > 0 ? (
                        targets.map((target) => renderPlatformBadge(target, record))
                    ) : (
                        <span className="text-xs text-slate-400">No targets</span>
                    )}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "14%",
            render: (status: PostRecord["status"]) => renderStatusTag(status),
        },
        {
            title: "Schedule / Date",
            key: "date",
            width: "14%",
            render: (_, record) => {
                const date = record.scheduledAt || record.publishedAt || record.createdAt;
                return (
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Draft'}
                    </span>
                );
            },
        },
        {
            title: "Actions",
            key: "action",
            align: "right",
            width: "12%",
            render: (_, record) => (
                <div className="flex items-center justify-end gap-1.5">
                    {/* Instant Publish / Retry All button */}
                    {(record.status === "draft" || record.status === "scheduled" || record.status === "failed" || record.status === "partially_published") && (
                        <Tooltip title={record.status === "failed" ? "Retry Publishing" : "Publish Now"}>
                            <button
                                onClick={() => handlePublishNow(record._id)}
                                disabled={actionLoadingId === record._id}
                                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition cursor-pointer"
                            >
                                <Send className={`w-4 h-4 ${actionLoadingId === record._id ? 'animate-spin' : ''}`} />
                            </button>
                        </Tooltip>
                    )}

                    {/* Edit button */}
                    {record.status !== "published" && (
                        <Tooltip title="Edit Post">
                            <button
                                onClick={() => handleOpenEdit(record)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition cursor-pointer"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </Tooltip>
                    )}

                    {/* Delete button */}
                    <Tooltip title="Delete Post">
                        <Popconfirm
                            title="Delete this post?"
                            description="Are you sure you want to delete this post?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes, Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <button className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <PenSquare className="w-7 h-7 text-purple-600" /> Posts Management Studio
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Monitor omnichannel delivery, inspect platform errors, and trigger isolated retries.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadPosts}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    <Link
                        href="/user/create-post"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-md active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Create New Post
                    </Link>
                </div>
            </div>

            {/* Quick Metrics Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-5 flex items-center justify-between hover:-translate-y-1 transition-all">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Posts</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{summary.total}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <PenSquare className="w-5 h-5" />
                    </div>
                </div>

                <div className="card p-5 flex items-center justify-between hover:-translate-y-1 transition-all">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">{summary.published}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="card p-5 flex items-center justify-between hover:-translate-y-1 transition-all">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-1">{summary.scheduled}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                <div className="card p-5 flex items-center justify-between hover:-translate-y-1 transition-all">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed / Issues</p>
                        <h3 className="text-2xl font-bold text-rose-600 mt-1">{summary.failed}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-purple-600" />
                        <h3 className="text-sm font-bold text-slate-800">Filter & Search</h3>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                            {totalItems} total posts
                        </span>
                    </div>

                    {(searchTerm || channelFilter !== "all" || statusFilter !== "all") && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Input
                        prefix={<Search className="w-4 h-4 text-slate-400 mr-2" />}
                        placeholder="Search posts by content or keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:!w-96 h-10 rounded-xl border-slate-200 shadow-xs"
                        allowClear
                    />

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <Select
                            value={channelFilter}
                            onChange={(value) => setChannelFilter(value)}
                            className="w-44 h-10"
                            options={[
                                { value: "all", label: "🌐 All Channels" },
                                { value: "x", label: "𝕏 X (Twitter)" },
                                { value: "linkedin", label: "💼 LinkedIn" },
                                { value: "facebook", label: "📘 Facebook" },
                                { value: "instagram", label: "📸 Instagram" },
                                { value: "threads", label: "🧵 Threads" },
                                { value: "whatsapp", label: "💬 WhatsApp" },
                            ]}
                        />

                        <Select
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            className="w-44 h-10"
                            options={[
                                { value: "all", label: "⚡ All Statuses" },
                                { value: "published", label: "✅ Published" },
                                { value: "partially_published", label: "⚠️ Partial Delivery" },
                                { value: "scheduled", label: "🕒 Scheduled" },
                                { value: "publishing", label: "🔄 Publishing" },
                                { value: "draft", label: "📝 Draft" },
                                { value: "failed", label: "❌ Failed" },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Ant Design Table */}
            <div className="card overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={posts}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        onChange: (newPage, newPageSize) => {
                            setPage(newPage);
                            setPageSize(newPageSize);
                        },
                    }}
                    className="custom-antd-table"
                />
            </div>

            {/* Edit Modal */}
            <Modal
                title="Edit Post Content"
                open={!!editingPost}
                onOk={handleSaveEdit}
                confirmLoading={isSavingEdit}
                onCancel={() => setEditingPost(null)}
                okText="Save Changes"
                cancelText="Cancel"
            >
                <div className="py-4 space-y-3">
                    <label className="text-xs font-semibold text-slate-600">Base Post Text</label>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={5}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm"
                    />
                </div>
            </Modal>
        </div>
    );
}

export default function UserPosts() {
    return (
        <Suspense fallback={<div className="p-8 text-center" />}>
            <UserPostsInner />
        </Suspense>
    );
}