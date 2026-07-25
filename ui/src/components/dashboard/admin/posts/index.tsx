"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    App,
    Table,
    Tag,
    Button,
    Input,
    Select,
    Avatar,
    Modal,
    Popconfirm,
    Tooltip,
    ConfigProvider,
    Badge,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    Search,
    Plus,
    Eye,
    Trash2,
    RotateCcw,
    FileText,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    PenSquare,
    TrendingUp,
    ThumbsUp,
    MessageSquare,
    Share2,
    Filter,
    Users as UsersIcon,
    Sparkles,
    Check,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { MOCK_POSTS_DATA, PostItem } from "@/data/postsData";

// Enhanced Admin Post item with Creator info
export interface AdminPostItem extends PostItem {
    author: {
        name: string;
        email: string;
        avatar?: string;
    };
}

// Sample Creator details mapped to posts
const MOCK_ADMIN_POSTS: AdminPostItem[] = MOCK_POSTS_DATA.map((post, idx) => {
    const authors = [
        { name: "Elena Vance", email: "elena.v@socialflow.ai", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" },
        { name: "Marcus Chen", email: "marcus.c@techviral.io", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" },
        { name: "Sophia Rodriguez", email: "sophia@designstudio.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" },
        { name: "Sushil Hemrom", email: "sushil@creatorstack.io", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" },
    ];
    return {
        ...post,
        author: authors[idx % authors.length],
    };
});

function AdminPostsContent() {
    const { message } = App.useApp();
    const router = useRouter();

    const [posts, setPosts] = useState<AdminPostItem[]>(MOCK_ADMIN_POSTS);
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");

    // Modal state for Delete confirmation
    const [deleteModalPost, setDeleteModalPost] = useState<AdminPostItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Delete post execution
    const confirmDeletePost = () => {
        if (!deleteModalPost) return;
        setPosts((prev) => prev.filter((p) => p.id !== deleteModalPost.id));
        message.success(`Post #${deleteModalPost.id} deleted successfully across all platforms.`);
        setIsDeleteModalOpen(false);
        setDeleteModalPost(null);
    };

    // Retry publishing for failed post
    const handleRetryPost = (postId: string) => {
        message.loading({ content: `Retrying dispatch for Post #${postId}...`, key: postId });
        setTimeout(() => {
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? {
                            ...p,
                            status: "published",
                            publishedAt: "Just now",
                            metrics: { views: "1.2k", likes: 85, comments: 12, shares: 6, engagementRate: "4.5%" },
                        }
                        : p
                )
            );
            message.success({ content: `Post #${postId} published successfully!`, key: postId });
        }, 1200);
    };

    // Filter Logic
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                (post.title || "").toLowerCase().includes(searchText.toLowerCase()) ||
                post.content.toLowerCase().includes(searchText.toLowerCase()) ||
                post.author.name.toLowerCase().includes(searchText.toLowerCase()) ||
                post.author.email.toLowerCase().includes(searchText.toLowerCase()) ||
                post.id.toLowerCase().includes(searchText.toLowerCase());

            const matchesStatus = selectedStatus === "ALL" || post.status === selectedStatus;
            const matchesPlatform =
                selectedPlatform === "ALL" ||
                post.platforms.includes(selectedPlatform as any);

            return matchesSearch && matchesStatus && matchesPlatform;
        });
    }, [posts, searchText, selectedStatus, selectedPlatform]);

    // Stats Computation
    const stats = useMemo(() => {
        const total = posts.length;
        const published = posts.filter((p) => p.status === "published").length;
        const scheduled = posts.filter((p) => p.status === "scheduled").length;
        const failed = posts.filter((p) => p.status === "failed").length;
        return { total, published, scheduled, failed };
    }, [posts]);

    // Render social icon helpers
    const renderPlatformBadge = (platform: string) => {
        switch (platform) {
            case "facebook":
                return (
                    <Tooltip title="Facebook" key={platform}>
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 inline-flex items-center justify-center">
                            <FaFacebook className="w-3.5 h-3.5" />
                        </span>
                    </Tooltip>
                );
            case "instagram":
                return (
                    <Tooltip title="Instagram" key={platform}>
                        <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 inline-flex items-center justify-center">
                            <FaInstagram className="w-3.5 h-3.5" />
                        </span>
                    </Tooltip>
                );
            case "twitter":
                return (
                    <Tooltip title="Twitter / X" key={platform}>
                        <span className="p-1.5 rounded-lg bg-sky-50 text-sky-500 border border-sky-100 inline-flex items-center justify-center">
                            <FaTwitter className="w-3.5 h-3.5" />
                        </span>
                    </Tooltip>
                );
            case "linkedin":
                return (
                    <Tooltip title="LinkedIn" key={platform}>
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 inline-flex items-center justify-center">
                            <FaLinkedin className="w-3.5 h-3.5" />
                        </span>
                    </Tooltip>
                );
            default:
                return null;
        }
    };

    // Table Columns Configuration
    const columns: ColumnsType<AdminPostItem> = [
        {
            title: "POST CONTENT PREVIEW",
            dataIndex: "content",
            key: "content",
            width: 320,
            render: (_, record) => (
                <div className="flex items-start gap-3 py-1">
                    {record.thumbnail ? (
                        <img
                            src={record.thumbnail}
                            alt="Post thumbnail"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0 border border-purple-100">
                            <FileText className="w-6 h-6" />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span
                            onClick={() => router.push(`/admin/posts/view/${record.id}`)}
                            className="font-bold text-slate-800 text-sm hover:text-purple-600 transition cursor-pointer truncate max-w-[230px]"
                        >
                            {record.title || `Post #${record.id}`}
                        </span>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-[230px]">
                            {record.content}
                        </p>
                        <span className="text-[10px] text-purple-600 font-mono mt-1 font-semibold">
                            ID: {record.id}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: "CREATOR / AUTHOR",
            dataIndex: "author",
            key: "author",
            render: (author) => (
                <div className="flex items-center gap-2.5">
                    <Avatar src={author.avatar} size={36} className="bg-purple-600 text-white font-bold shrink-0">
                        {author.name.charAt(0)}
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 text-xs truncate">{author.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono truncate">{author.email}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "TARGET PLATFORMS",
            dataIndex: "platforms",
            key: "platforms",
            render: (platforms: string[]) => (
                <div className="flex items-center gap-1.5">
                    {platforms.map((p) => renderPlatformBadge(p))}
                </div>
            ),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status: AdminPostItem["status"]) => {
                if (status === "published") {
                    return (
                        <Tag color="success" className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border-emerald-200 bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Published
                        </Tag>
                    );
                }
                if (status === "scheduled") {
                    return (
                        <Tag color="processing" className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border-blue-200 bg-blue-50 text-blue-700">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            Scheduled
                        </Tag>
                    );
                }
                if (status === "failed") {
                    return (
                        <Tag color="error" className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border-rose-200 bg-rose-50 text-rose-700">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            Failed
                        </Tag>
                    );
                }
                return (
                    <Tag color="default" className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border-slate-200 bg-slate-100 text-slate-700">
                        <PenSquare className="w-3.5 h-3.5 text-slate-500" />
                        Draft
                    </Tag>
                );
            },
        },
        {
            title: "ENGAGEMENT",
            dataIndex: "metrics",
            key: "metrics",
            render: (metrics, record) => {
                if (record.status !== "published") {
                    return <span className="text-xs text-slate-400 font-mono">—</span>;
                }
                return (
                    <div className="flex flex-col text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> {metrics.views} views
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5">
                            {metrics.likes} likes • {metrics.comments} comments
                        </span>
                    </div>
                );
            },
        },
        {
            title: "PUBLISHED / SCHEDULED",
            dataIndex: "publishedAt",
            key: "publishedAt",
            render: (date) => (
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{date}</span>
                </div>
            ),
        },
        {
            title: "ACTIONS",
            key: "action",
            align: "center",
            width: 140,
            render: (_, record) => (
                <div className="flex items-center justify-center gap-2">
                    {/* View Details Button */}
                    <Tooltip title="View Full Post Details">
                        <Button
                            type="default"
                            size="small"
                            onClick={() => router.push(`/admin/posts/view/${record.id}`)}
                            icon={<Eye className="w-3.5 h-3.5 text-purple-600" />}
                            className="rounded-xl font-semibold border-slate-200 hover:border-purple-300 hover:text-purple-600 flex items-center justify-center cursor-pointer"
                        >
                        </Button>
                    </Tooltip>

                    {/* Delete Action Button with Modal Confirmation */}
                    <Tooltip title="Delete Post">
                        <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => {
                                setDeleteModalPost(record);
                                setIsDeleteModalOpen(true);
                            }}
                            icon={<Trash2 className="w-4 h-4 text-rose-600" />}
                            className="hover:bg-rose-50 rounded-xl flex items-center justify-center cursor-pointer"
                        />
                    </Tooltip>

                    {record.status === "failed" && (
                        <Tooltip title="Retry Publishing">
                            <Button
                                type="text"
                                size="small"
                                onClick={() => handleRetryPost(record.id)}
                                icon={<RotateCcw className="w-4 h-4 text-indigo-600" />}
                                className="hover:bg-indigo-50 rounded-xl flex items-center justify-center cursor-pointer"
                            />
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 bg-slate-50/60 p-6 rounded-3xl min-h-screen">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 tracking-wider uppercase border border-purple-200">
                            CONTENT MODERATION
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Posts Management</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Monitor, audit, and manage user-generated social media content across all connected platforms.
                    </p>
                </div>
            </div>

            {/* 2. KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Posts</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
                        <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Across all creators
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                        <FileText className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published</p>
                        <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.published}</h3>
                        <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Live on channels
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled</p>
                        <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{stats.scheduled}</h3>
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> Pending dispatch
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed / Flagged</p>
                        <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{stats.failed}</h3>
                        <span className="text-[11px] font-medium text-rose-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> Requires retry
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* 3. Search & Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Input
                            placeholder="Search by title, content, author, or ID..."
                            prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            className="h-11 rounded-xl bg-slate-50 border-slate-200 hover:border-purple-400 focus:border-purple-600 text-sm font-medium"
                        />
                    </div>

                    {/* Filter Selects */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Status:</span>
                            <Select
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                className="w-36 h-10 rounded-xl"
                                options={[
                                    { label: "All Status", value: "ALL" },
                                    { label: "Published", value: "published" },
                                    { label: "Scheduled", value: "scheduled" },
                                    { label: "Draft", value: "draft" },
                                    { label: "Failed", value: "failed" },
                                ]}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Platform:</span>
                            <Select
                                value={selectedPlatform}
                                onChange={setSelectedPlatform}
                                className="w-40 h-10 rounded-xl"
                                options={[
                                    { label: "All Platforms", value: "ALL" },
                                    { label: "Facebook", value: "facebook" },
                                    { label: "Instagram", value: "instagram" },
                                    { label: "Twitter / X", value: "twitter" },
                                    { label: "LinkedIn", value: "linkedin" },
                                ]}
                            />
                        </div>

                        {(searchText || selectedStatus !== "ALL" || selectedPlatform !== "ALL") && (
                            <Button
                                onClick={() => {
                                    setSearchText("");
                                    setSelectedStatus("ALL");
                                    setSelectedPlatform("ALL");
                                    message.info("Filters reset");
                                }}
                                icon={<RotateCcw className="w-3.5 h-3.5" />}
                                className="h-10 px-3 text-xs font-semibold text-slate-600 bg-slate-100 border-0 hover:bg-slate-200 rounded-xl cursor-pointer"
                            >
                                Reset Filters
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Posts Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filteredPosts}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    pagination={{
                        pageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "6", "10", "20"],
                        showTotal: (total, range) => (
                            <span className="text-xs font-semibold text-slate-500">
                                Showing <span className="text-purple-600 font-bold">{range[0]}-{range[1]}</span> of{" "}
                                <span className="text-slate-800 font-bold">{total}</span> posts
                            </span>
                        ),
                        className: "px-6 py-4 border-t border-slate-100 flex items-center justify-between",
                    }}
                    className="custom-admin-table"
                />
            </div>

            {/* 5. Delete Confirmation Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-rose-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-lg font-bold text-slate-900">Confirm Post Deletion</span>
                    </div>
                }
                open={isDeleteModalOpen}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteModalPost(null);
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setIsDeleteModalOpen(false);
                            setDeleteModalPost(null);
                        }}
                        className="rounded-xl font-semibold cursor-pointer"
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        onClick={confirmDeletePost}
                        className="rounded-xl font-bold bg-rose-600 cursor-pointer"
                    >
                        Yes, Delete Post
                    </Button>,
                ]}
                destroyOnHidden
            >
                {deleteModalPost && (
                    <div className="space-y-4 py-2 text-sm">
                        <p className="text-slate-600">
                            Are you sure you want to delete <strong className="text-slate-900">{deleteModalPost.title || `Post #${deleteModalPost.id}`}</strong>?
                        </p>
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                            <span className="font-bold block mb-1">Warning:</span>
                            This action will purge post records from the system database and trigger removal webhooks across connected social channels ({deleteModalPost.platforms.join(", ")}).
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default function Posts() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#7C3AED",
                    borderRadius: 12,
                    colorBgContainer: "#ffffff",
                    fontFamily: "var(--font-geist-sans), 'DM Sans', sans-serif",
                },
                components: {
                    Table: {
                        headerBg: "#F8FAFC",
                        headerColor: "#475569",
                        headerSplitColor: "transparent",
                        rowHoverBg: "#FAF5FF",
                        borderColor: "#F1F5F9",
                    },
                },
            }}
        >
            <App>
                <AdminPostsContent />
            </App>
        </ConfigProvider>
    );
}
