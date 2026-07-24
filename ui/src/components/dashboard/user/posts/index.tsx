"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, Input, Select, Tag, Popconfirm, message, Tooltip, Modal } from "antd";
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
    Plus,
    Edit3,
    Trash2,
    ThumbsUp
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { MOCK_POSTS_DATA, PostItem } from "@/data/postsData";

export default function UserPosts() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostItem[]>(MOCK_POSTS_DATA);
    const [searchTerm, setSearchTerm] = useState("");
    const [channelFilter, setChannelFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingPost, setEditingPost] = useState<PostItem | null>(null);
    const [editContent, setEditContent] = useState("");

    // Delete post handler
    const handleDelete = (id: string) => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        message.success("Post deleted successfully");
    };

    // Open edit modal
    const handleOpenEdit = (post: PostItem) => {
        setEditingPost(post);
        setEditContent(post.content);
    };

    // Save edit
    const handleSaveEdit = () => {
        if (!editingPost) return;
        setPosts((prev) =>
            prev.map((p) => (p.id === editingPost.id ? { ...p, content: editContent } : p))
        );
        message.success("Post updated successfully");
        setEditingPost(null);
    };

    // Filter logic
    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesChannel =
            channelFilter === "all" || post.platforms.includes(channelFilter as any);
        const matchesStatus = statusFilter === "all" || post.status === statusFilter;
        return matchesSearch && matchesChannel && matchesStatus;
    });

    const renderPlatformBadge = (platform: string) => {
        switch (platform) {
            case "twitter":
                return (
                    <Tag
                        key="twitter"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border-sky-200 text-sky-600 bg-sky-50"
                    >
                        <FaTwitter className="w-3.5 h-3.5" /> Twitter / X
                    </Tag>
                );
            case "linkedin":
                return (
                    <Tag
                        key="linkedin"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border-blue-200 text-blue-600 bg-blue-50"
                    >
                        <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                    </Tag>
                );
            case "facebook":
                return (
                    <Tag
                        key="facebook"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border-blue-200 text-blue-600 bg-blue-50"
                    >
                        <FaFacebook className="w-3.5 h-3.5" /> Facebook
                    </Tag>
                );
            case "instagram":
                return (
                    <Tag
                        key="instagram"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border-pink-200 text-pink-600 bg-pink-50"
                    >
                        <FaInstagram className="w-3.5 h-3.5" /> Instagram
                    </Tag>
                );
            default:
                return null;
        }
    };

    const renderStatusTag = (status: PostItem["status"]) => {
        switch (status) {
            case "published":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </Tag>
                );
            case "scheduled":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                        <Clock className="w-3.5 h-3.5" /> Scheduled
                    </Tag>
                );
            case "draft":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border-slate-200">
                        <PenSquare className="w-3.5 h-3.5" /> Draft
                    </Tag>
                );
            case "failed":
                return (
                    <Tag className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </Tag>
                );
        }
    };

    // Antd Table Columns Definition
    const columns: ColumnsType<PostItem> = [
        {
            title: "Post Content",
            dataIndex: "content",
            key: "content",
            width: "35%",
            render: (_, record) => (
                <div className="space-y-1">
                    {record.title && (
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{record.title}</h4>
                    )}
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{record.content}</p>
                </div>
            ),
        },
        {
            title: "Posted Channels",
            dataIndex: "platforms",
            key: "platforms",
            width: "25%",
            render: (platforms: string[]) => (
                <div className="flex flex-wrap gap-1">
                    {platforms.map((platform) => renderPlatformBadge(platform))}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "12%",
            render: (status: PostItem["status"]) => renderStatusTag(status),
        },
        {
            title: "Date & Time",
            dataIndex: "publishedAt",
            key: "publishedAt",
            width: "14%",
            render: (date: string) => (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {date}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "action",
            align: "right",
            width: "14%",
            render: (_, record) => (
                <div className="flex items-center justify-end gap-1.5">
                    {/* View Details button */}
                    <Tooltip title="View Details">
                        <Link
                            href={`/user/posts/view/${record.id}`}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-primary/10 text-slate-600 hover:text-primary transition"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                    </Tooltip>

                    {/* Edit button */}
                    <Tooltip title="Edit Post">
                        <button
                            onClick={() => handleOpenEdit(record)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition cursor-pointer"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </Tooltip>

                    {/* Delete button */}
                    <Tooltip title="Delete Post">
                        <Popconfirm
                            title="Delete this post?"
                            description="Are you sure you want to delete this post?"
                            onConfirm={() => handleDelete(record.id)}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <PenSquare className="w-7 h-7 text-primary" /> Posts Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Monitor, filter, and track performance for all your social content
                    </p>
                </div>
                <Link
                    href="/user/create-post"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition shadow-md w-fit"
                >
                    <Plus className="w-4 h-4" /> Create New Post
                </Link>
            </div>

            {/* Quick Metrics Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Posts</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{posts.length}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <PenSquare className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                            {posts.filter((p) => p.status === "published").length}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-1">
                            {posts.filter((p) => p.status === "scheduled").length}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reach</p>
                        <h3 className="text-2xl font-bold text-amber-600 mt-1">26.4k</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Antd Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
                <Input
                    prefix={<Search className="w-4 h-4 text-slate-400 mr-2" />}
                    placeholder="Search posts or hashtags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 h-10 rounded-xl border-slate-200"
                    allowClear
                />

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <Select
                        value={channelFilter}
                        onChange={(value) => setChannelFilter(value)}
                        className="w-40 h-10"
                        options={[
                            { value: "all", label: "All Channels" },
                            { value: "twitter", label: "Twitter / X" },
                            { value: "linkedin", label: "LinkedIn" },
                            { value: "facebook", label: "Facebook" },
                            { value: "instagram", label: "Instagram" },
                        ]}
                    />

                    <Select
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        className="w-36 h-10"
                        options={[
                            { value: "all", label: "All Statuses" },
                            { value: "published", label: "Published" },
                            { value: "scheduled", label: "Scheduled" },
                            { value: "draft", label: "Draft" },
                            { value: "failed", label: "Failed" },
                        ]}
                    />
                </div>
            </div>

            {/* Ant Design Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden p-2">
                <Table
                    columns={columns}
                    dataSource={filteredPosts}
                    rowKey="id"
                    pagination={{ pageSize: 5, showSizeChanger: true, pageSizeOptions: ["5", "10", "20"] }}
                    className="custom-antd-table"
                />
            </div>

            {/* Edit Modal */}
            <Modal
                title="Edit Post Content"
                open={!!editingPost}
                onOk={handleSaveEdit}
                onCancel={() => setEditingPost(null)}
                okText="Save Changes"
                cancelText="Cancel"
            >
                <div className="py-4 space-y-3">
                    <label className="text-xs font-semibold text-slate-600">Post Text</label>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={5}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm"
                    />
                </div>
            </Modal>
        </div>
    );
}