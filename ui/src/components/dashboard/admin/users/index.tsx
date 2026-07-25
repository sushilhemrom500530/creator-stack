"use client";

import React, { useState, useMemo } from "react";
import {
    App,
    Table,
    Tag,
    Dropdown,
    Button,
    Input,
    Select,
    Avatar,
    Modal,
    Drawer,
    Popconfirm,
    Tooltip,
    Badge,
    ConfigProvider,
    Form,
    MenuProps,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    Search,
    Plus,
    MoreVertical,
    Eye,
    UserX,
    UserCheck,
    Edit3,
    Trash2,
    RotateCcw,
    Filter,
    Shield,
    Mail,
    Calendar,
    Users as UsersIcon,
    CheckCircle2,
    AlertCircle,
    Clock,
    Sparkles,
    ShieldAlert,
    X,
    ExternalLink,
    ChevronRight,
    UserPlus,
} from "lucide-react";

// User Data Type Definition
export interface UserType {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: "Admin" | "Creator" | "Editor" | "Viewer";
    subscription: "Enterprise Pro" | "Creator Plus" | "Starter Free";
    status: "Active" | "Suspended" | "Pending";
    joinedDate: string;
    lastActive?: string;
    connectedAccountsCount?: number;
    totalPosts?: number;
}

// Initial Mock Users Data
const INITIAL_USERS: UserType[] = [
    {
        id: "USR-1001",
        name: "Elena Vance",
        email: "elena.v@socialflow.ai",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        role: "Admin",
        subscription: "Enterprise Pro",
        status: "Active",
        joinedDate: "Oct 12, 2023",
        lastActive: "2 minutes ago",
        connectedAccountsCount: 8,
        totalPosts: 1420,
    },
    {
        id: "USR-1002",
        name: "Marcus Chen",
        email: "marcus.c@techviral.io",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        role: "Creator",
        subscription: "Creator Plus",
        status: "Active",
        joinedDate: "Nov 04, 2023",
        lastActive: "1 hour ago",
        connectedAccountsCount: 5,
        totalPosts: 830,
    },
    {
        id: "USR-1003",
        name: "Sophia Rodriguez",
        email: "sophia@designstudio.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Editor",
        subscription: "Enterprise Pro",
        status: "Active",
        joinedDate: "Dec 15, 2023",
        lastActive: "Just now",
        connectedAccountsCount: 12,
        totalPosts: 2310,
    },
    {
        id: "USR-1004",
        name: "Alexander Wright",
        email: "alex@wrightmedia.co",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        role: "Creator",
        subscription: "Starter Free",
        status: "Suspended",
        joinedDate: "Jan 08, 2024",
        lastActive: "12 days ago",
        connectedAccountsCount: 2,
        totalPosts: 45,
    },
    {
        id: "USR-1005",
        name: "Isabella Thorne",
        email: "isabella@contentcraft.app",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        role: "Creator",
        subscription: "Creator Plus",
        status: "Active",
        joinedDate: "Feb 22, 2024",
        lastActive: "3 hours ago",
        connectedAccountsCount: 6,
        totalPosts: 620,
    },
    {
        id: "USR-1006",
        name: "David Miller",
        email: "david.m@influencenet.org",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        role: "Viewer",
        subscription: "Enterprise Pro",
        status: "Pending",
        joinedDate: "Mar 05, 2024",
        lastActive: "Never",
        connectedAccountsCount: 0,
        totalPosts: 0,
    },
    {
        id: "USR-1007",
        name: "Emma Watson",
        email: "emma@creatify.io",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        role: "Creator",
        subscription: "Creator Plus",
        status: "Active",
        joinedDate: "Apr 18, 2024",
        lastActive: "30 minutes ago",
        connectedAccountsCount: 4,
        totalPosts: 310,
    },
    {
        id: "USR-1008",
        name: "Liam O'Connor",
        email: "liam@streamverse.tv",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        role: "Editor",
        subscription: "Starter Free",
        status: "Suspended",
        joinedDate: "May 02, 2024",
        lastActive: "3 weeks ago",
        connectedAccountsCount: 1,
        totalPosts: 12,
    },
    {
        id: "USR-1009",
        name: "Olivia Zhang",
        email: "olivia@vividmedia.cn",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        role: "Admin",
        subscription: "Enterprise Pro",
        status: "Active",
        joinedDate: "Jun 11, 2024",
        lastActive: "15 minutes ago",
        connectedAccountsCount: 15,
        totalPosts: 3890,
    },
    {
        id: "USR-1010",
        name: "Lucas Santos",
        email: "lucas@growthpod.br",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        role: "Creator",
        subscription: "Creator Plus",
        status: "Active",
        joinedDate: "Jul 01, 2024",
        lastActive: "5 hours ago",
        connectedAccountsCount: 3,
        totalPosts: 195,
    },
];

function UsersContent() {
    const { message } = App.useApp();
    // State management
    const [users, setUsers] = useState<UserType[]>(INITIAL_USERS);
    const [searchText, setSearchText] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("ALL");
    const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
    const [selectedSubscription, setSelectedSubscription] = useState<string>("ALL");

    // Modal & Drawer states
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    // Toggle Suspend / Activate user status
    const handleToggleUserStatus = (userId: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => {
                if (user.id === userId) {
                    const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
                    message.success(`User ${user.name} account is now ${newStatus}`);
                    return { ...user, status: newStatus };
                }
                return user;
            })
        );
    };

    // Delete User
    const handleDeleteUser = (userId: string, userName: string) => {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
        message.success(`User ${userName} has been removed`);
    };

    // Reset Password simulation
    const handleResetPassword = (email: string) => {
        message.info(`Password reset link sent to ${email}`);
    };

    // View User Details
    const handleViewDetails = (user: UserType) => {
        setSelectedUser(user);
        setIsDetailDrawerOpen(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (user: UserType) => {
        setSelectedUser(user);
        editForm.setFieldsValue({
            name: user.name,
            email: user.email,
            role: user.role,
            subscription: user.subscription,
            status: user.status,
        });
        setIsEditModalOpen(true);
    };

    // Submit Create Form
    const handleCreateUserSubmit = (values: any) => {
        const newUser: UserType = {
            id: `USR-${1000 + users.length + 1}`,
            name: values.name,
            email: values.email,
            role: values.role,
            subscription: values.subscription,
            status: values.status || "Active",
            joinedDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            lastActive: "Just created",
            connectedAccountsCount: 0,
            totalPosts: 0,
        };
        setUsers([newUser, ...users]);
        message.success("New user created successfully!");
        setIsCreateModalOpen(false);
        form.resetFields();
    };

    // Submit Edit Form
    const handleEditUserSubmit = (values: any) => {
        if (!selectedUser) return;
        setUsers((prevUsers) =>
            prevUsers.map((u) =>
                u.id === selectedUser.id ? { ...u, ...values } : u
            )
        );
        message.success("User details updated successfully!");
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    // Reset Filters
    const handleResetFilters = () => {
        setSearchText("");
        setSelectedRole("ALL");
        setSelectedStatus("ALL");
        setSelectedSubscription("ALL");
        message.info("Filters reset to default");
    };

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                user.id.toLowerCase().includes(searchText.toLowerCase());

            const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
            const matchesStatus = selectedStatus === "ALL" || user.status === selectedStatus;
            const matchesSub =
                selectedSubscription === "ALL" || user.subscription === selectedSubscription;

            return matchesSearch && matchesRole && matchesStatus && matchesSub;
        });
    }, [users, searchText, selectedRole, selectedStatus, selectedSubscription]);

    // Summary Statistics
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter((u) => u.status === "Active").length;
        const suspended = users.filter((u) => u.status === "Suspended").length;
        const enterprise = users.filter((u) => u.subscription === "Enterprise Pro").length;
        return { total, active, suspended, enterprise };
    }, [users]);

    // Table Columns Configuration
    const columns: ColumnsType<UserType> = [
        {
            title: "USER PROFILE",
            dataIndex: "name",
            key: "profile",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (_, record) => (
                <div className="flex items-center gap-3 py-1">
                    <Avatar
                        src={record.avatar}
                        size={42}
                        className="border-2 border-purple-100 shadow-sm shrink-0 bg-purple-600 text-white font-bold"
                    >
                        {record.name.charAt(0)}
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 text-sm hover:text-purple-600 transition cursor-pointer truncate">
                            {record.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                                {record.role}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                                • {record.id}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "EMAIL ADDRESS",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
            render: (email) => (
                <div className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs font-medium font-mono text-slate-700 truncate">{email}</span>
                </div>
            ),
        },
        {
            title: "SUBSCRIPTION",
            dataIndex: "subscription",
            key: "subscription",
            filters: [
                { text: "Enterprise Pro", value: "Enterprise Pro" },
                { text: "Creator Plus", value: "Creator Plus" },
                { text: "Starter Free", value: "Starter Free" },
            ],
            onFilter: (value, record) => record.subscription === value,
            render: (sub: UserType["subscription"]) => {
                if (sub === "Enterprise Pro") {
                    return (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span>ENTERPRISE PRO</span>
                        </div>
                    );
                }
                if (sub === "Creator Plus") {
                    return (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                            <Shield className="w-3.5 h-3.5 text-teal-600" />
                            <span>CREATOR PLUS</span>
                        </div>
                    );
                }
                return (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <span>STARTER FREE</span>
                    </div>
                );
            },
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status: UserType["status"]) => {
                if (status === "Active") {
                    return (
                        <Tag color="success" className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border-emerald-200 bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                        </Tag>
                    );
                }
                if (status === "Suspended") {
                    return (
                        <Tag color="error" className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border-rose-200 bg-rose-50 text-rose-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Suspended
                        </Tag>
                    );
                }
                return (
                    <Tag color="warning" className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border-amber-200 bg-amber-50 text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending
                    </Tag>
                );
            },
        },
        {
            title: "JOINED DATE",
            dataIndex: "joinedDate",
            key: "joinedDate",
            sorter: (a, b) => new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime(),
            render: (date) => (
                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-700">{date}</span>
                </div>
            ),
        },
        {
            title: "ACTIONS",
            key: "action",
            align: "center",
            width: 100,
            render: (_, record) => {
                // Dropdown Menu items for each row
                const menuItems: MenuProps["items"] = [
                    {
                        key: "view",
                        icon: <Eye className="w-4 h-4 text-purple-600" />,
                        label: <span className="font-medium text-slate-700">View Details</span>,
                        onClick: () => handleViewDetails(record),
                    },
                    {
                        key: "edit",
                        icon: <Edit3 className="w-4 h-4 text-blue-600" />,
                        label: <span className="font-medium text-slate-700">Edit Details</span>,
                        onClick: () => handleOpenEdit(record),
                    },
                    {
                        type: "divider",
                    },
                    {
                        key: "toggle-status",
                        icon:
                            record.status === "Suspended" ? (
                                <UserCheck className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <UserX className="w-4 h-4 text-amber-600" />
                            ),
                        label: (
                            <span
                                className={`font-medium ${record.status === "Suspended" ? "text-emerald-700" : "text-amber-700"
                                    }`}
                            >
                                {record.status === "Suspended" ? "Activate Account" : "Suspend Account"}
                            </span>
                        ),
                        onClick: () => handleToggleUserStatus(record.id),
                    },
                    {
                        key: "reset-password",
                        icon: <RotateCcw className="w-4 h-4 text-indigo-600" />,
                        label: <span className="font-medium text-slate-700">Reset Password</span>,
                        onClick: () => handleResetPassword(record.email),
                    },
                    {
                        type: "divider",
                    },
                    {
                        key: "delete",
                        danger: true,
                        icon: <Trash2 className="w-4 h-4 text-rose-600" />,
                        label: (
                            <Popconfirm
                                title="Delete user account?"
                                description={`Are you sure you want to delete ${record.name}? This action cannot be undone.`}
                                onConfirm={() => handleDeleteUser(record.id, record.name)}
                                okText="Yes, Delete"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true }}
                            >
                                <span className="font-medium text-rose-600 block w-full">Delete Account</span>
                            </Popconfirm>
                        ),
                    },
                ];

                return (
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={["click"]}
                        placement="bottomRight"
                        arrow={{ pointAtCenter: true }}
                    >
                        <Button
                            type="text"
                            shape="circle"
                            className="flex items-center justify-center hover:bg-purple-50 hover:text-purple-600 text-slate-500 transition cursor-pointer"
                            icon={<MoreVertical className="w-4 h-4" />}
                        />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div className="space-y-6 bg-slate-50/60 p-6 rounded-3xl min-h-screen">
                {/* 1. Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 tracking-wider uppercase border border-purple-200">
                                ADMIN CONTROL PANEL
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users Directory</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Manage team members, assign creator permissions, and oversee enterprise tier subscriptions.
                        </p>
                    </div>
                </div>

                {/* 2. Top Summary KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
                            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                                <CheckCircle2 className="w-3 h-3" /> +12% from last month
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Users</p>
                            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.active}</h3>
                            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" /> Currently online/active
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suspended</p>
                            <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{stats.suspended}</h3>
                            <span className="text-[11px] font-medium text-rose-500 flex items-center gap-1 mt-1">
                                <ShieldAlert className="w-3 h-3" /> Requires review
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                            <UserX className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enterprise Pro</p>
                            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.enterprise}</h3>
                            <span className="text-[11px] font-medium text-indigo-600 flex items-center gap-1 mt-1">
                                <Sparkles className="w-3 h-3" /> Premium Tier
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 3. Search & Filter Bar Section */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Input
                                placeholder="Search by name, email, or user ID..."
                                prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                className="h-11 rounded-xl bg-slate-50 border-slate-200 hover:border-purple-400 focus:border-purple-600 text-sm font-medium"
                            />
                        </div>

                        {/* Filters Group */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Role Filter */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Role:</span>
                                <Select
                                    value={selectedRole}
                                    onChange={setSelectedRole}
                                    className="w-36 h-10 rounded-xl"
                                    options={[
                                        { label: "All Roles", value: "ALL" },
                                        { label: "Admin", value: "Admin" },
                                        { label: "Creator", value: "Creator" },
                                        { label: "Editor", value: "Editor" },
                                        { label: "Viewer", value: "Viewer" },
                                    ]}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Status:</span>
                                <Select
                                    value={selectedStatus}
                                    onChange={setSelectedStatus}
                                    className="w-36 h-10 rounded-xl"
                                    options={[
                                        { label: "All Status", value: "ALL" },
                                        { label: "Active", value: "Active" },
                                        { label: "Suspended", value: "Suspended" },
                                        { label: "Pending", value: "Pending" },
                                    ]}
                                />
                            </div>

                            {/* Subscription Filter */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Plan:</span>
                                <Select
                                    value={selectedSubscription}
                                    onChange={setSelectedSubscription}
                                    className="w-40 h-10 rounded-xl"
                                    options={[
                                        { label: "All Plans", value: "ALL" },
                                        { label: "Enterprise Pro", value: "Enterprise Pro" },
                                        { label: "Creator Plus", value: "Creator Plus" },
                                        { label: "Starter Free", value: "Starter Free" },
                                    ]}
                                />
                            </div>

                            {/* Clear Filters Button */}
                            {(searchText ||
                                selectedRole !== "ALL" ||
                                selectedStatus !== "ALL" ||
                                selectedSubscription !== "ALL") && (
                                    <Button
                                        onClick={handleResetFilters}
                                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                                        className="h-10 px-3 text-xs font-semibold text-slate-600 bg-slate-100 border-0 hover:bg-slate-200 rounded-xl cursor-pointer"
                                    >
                                        Reset Filters
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>

                {/* 4. Ant Design Table with Pagination */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="id"
                        pagination={{
                            pageSize: 6,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "6", "10", "20"],
                            showTotal: (total, range) => (
                                <span className="text-xs font-semibold text-slate-500">
                                    Showing <span className="text-purple-600 font-bold">{range[0]}-{range[1]}</span> of{" "}
                                    <span className="text-slate-800 font-bold">{total}</span> users
                                </span>
                            ),
                            className: "px-6 py-4 border-t border-slate-100 flex items-center justify-between",
                        }}
                        className="custom-admin-table"
                    />
                </div>

                {/* 5. User Details Drawer */}
                <Drawer
                    title={
                        <div className="flex items-center gap-3">
                            <Avatar src={selectedUser?.avatar} size={40} className="bg-purple-600 text-white">
                                {selectedUser?.name.charAt(0)}
                            </Avatar>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 leading-tight">{selectedUser?.name}</h3>
                                <p className="text-xs font-mono text-slate-500">{selectedUser?.id}</p>
                            </div>
                        </div>
                    }
                    placement="right"
                    onClose={() => setIsDetailDrawerOpen(false)}
                    open={isDetailDrawerOpen}
                    size="large"
                >
                    {selectedUser && (
                        <div className="space-y-6 text-sm">
                            {/* Status Card */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase">Account Status</span>
                                    <div className="mt-1">
                                        {selectedUser.status === "Active" && (
                                            <Tag color="success" className="rounded-full px-3 font-semibold">Active</Tag>
                                        )}
                                        {selectedUser.status === "Suspended" && (
                                            <Tag color="error" className="rounded-full px-3 font-semibold">Suspended</Tag>
                                        )}
                                        {selectedUser.status === "Pending" && (
                                            <Tag color="warning" className="rounded-full px-3 font-semibold">Pending Verification</Tag>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="small"
                                    onClick={() => handleToggleUserStatus(selectedUser.id)}
                                    className={`font-semibold text-xs rounded-lg cursor-pointer ${selectedUser.status === "Suspended"
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                        }`}
                                >
                                    {selectedUser.status === "Suspended" ? "Activate User" : "Suspend User"}
                                </Button>
                            </div>

                            {/* User Overview Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                                    <span className="text-xs font-medium text-purple-600">Connected Accounts</span>
                                    <p className="text-xl font-bold text-slate-900 mt-1">{selectedUser.connectedAccountsCount || 0}</p>
                                </div>
                                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <span className="text-xs font-medium text-indigo-600">Total Published Posts</span>
                                    <p className="text-xl font-bold text-slate-900 mt-1">{selectedUser.totalPosts || 0}</p>
                                </div>
                            </div>

                            {/* Info Fields */}
                            <div className="space-y-3 pt-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                                    Account Meta
                                </h4>

                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Email Address</span>
                                    <span className="font-mono text-slate-800 font-semibold">{selectedUser.email}</span>
                                </div>

                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">System Role</span>
                                    <Tag className="font-bold text-xs uppercase">{selectedUser.role}</Tag>
                                </div>

                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Subscription Tier</span>
                                    <span className="font-semibold text-purple-700">{selectedUser.subscription}</span>
                                </div>

                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Joined Date</span>
                                    <span className="text-slate-700">{selectedUser.joinedDate}</span>
                                </div>

                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Last Active</span>
                                    <span className="text-slate-700">{selectedUser.lastActive || "Recently"}</span>
                                </div>
                            </div>

                            {/* Actions inside drawer */}
                            <div className="pt-4 space-y-2 border-t border-slate-100">
                                <Button
                                    block
                                    icon={<Edit3 className="w-4 h-4" />}
                                    onClick={() => {
                                        setIsDetailDrawerOpen(false);
                                        handleOpenEdit(selectedUser);
                                    }}
                                    className="rounded-xl font-semibold cursor-pointer"
                                >
                                    Edit Profile Information
                                </Button>
                                <Button
                                    block
                                    icon={<RotateCcw className="w-4 h-4" />}
                                    onClick={() => handleResetPassword(selectedUser.email)}
                                    className="rounded-xl font-semibold cursor-pointer"
                                >
                                    Send Password Reset Email
                                </Button>
                            </div>
                        </div>
                    )}
                </Drawer>

                {/* 6. Create User Modal */}
                <Modal
                    title={<span className="text-lg font-bold text-slate-900">Create New User</span>}
                    open={isCreateModalOpen}
                    onCancel={() => setIsCreateModalOpen(false)}
                    footer={null}
                    destroyOnHidden
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateUserSubmit}
                        initialValues={{ role: "Creator", subscription: "Creator Plus", status: "Active" }}
                        className="mt-4 space-y-4"
                    >
                        <Form.Item
                            name="name"
                            label={<span className="font-semibold text-xs text-slate-700">Full Name</span>}
                            rules={[{ required: true, message: "Please enter user full name" }]}
                        >
                            <Input placeholder="e.g. John Doe" className="rounded-xl h-10" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label={<span className="font-semibold text-xs text-slate-700">Email Address</span>}
                            rules={[
                                { required: true, message: "Please enter email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input placeholder="john@example.com" className="rounded-xl h-10" />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-3">
                            <Form.Item
                                name="role"
                                label={<span className="font-semibold text-xs text-slate-700">User Role</span>}
                            >
                                <Select
                                    options={[
                                        { label: "Admin", value: "Admin" },
                                        { label: "Creator", value: "Creator" },
                                        { label: "Editor", value: "Editor" },
                                        { label: "Viewer", value: "Viewer" },
                                    ]}
                                    className="h-10"
                                />
                            </Form.Item>

                            <Form.Item
                                name="subscription"
                                label={<span className="font-semibold text-xs text-slate-700">Subscription Tier</span>}
                            >
                                <Select
                                    options={[
                                        { label: "Enterprise Pro", value: "Enterprise Pro" },
                                        { label: "Creator Plus", value: "Creator Plus" },
                                        { label: "Starter Free", value: "Starter Free" },
                                    ]}
                                    className="h-10"
                                />
                            </Form.Item>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                            <Button onClick={() => setIsCreateModalOpen(false)} className="rounded-xl font-semibold cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" className="rounded-xl font-bold bg-purple-600 cursor-pointer">
                                Create User
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* 7. Edit User Modal */}
                <Modal
                    title={<span className="text-lg font-bold text-slate-900">Edit User Details</span>}
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    footer={null}
                    destroyOnHidden
                >
                    <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={handleEditUserSubmit}
                        className="mt-4 space-y-4"
                    >
                        <Form.Item
                            name="name"
                            label={<span className="font-semibold text-xs text-slate-700">Full Name</span>}
                            rules={[{ required: true, message: "Please enter name" }]}
                        >
                            <Input className="rounded-xl h-10" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label={<span className="font-semibold text-xs text-slate-700">Email Address</span>}
                            rules={[{ required: true, message: "Please enter email" }]}
                        >
                            <Input className="rounded-xl h-10" />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-3">
                            <Form.Item
                                name="role"
                                label={<span className="font-semibold text-xs text-slate-700">User Role</span>}
                            >
                                <Select
                                    options={[
                                        { label: "Admin", value: "Admin" },
                                        { label: "Creator", value: "Creator" },
                                        { label: "Editor", value: "Editor" },
                                        { label: "Viewer", value: "Viewer" },
                                    ]}
                                    className="h-10"
                                />
                            </Form.Item>

                            <Form.Item
                                name="subscription"
                                label={<span className="font-semibold text-xs text-slate-700">Subscription Tier</span>}
                            >
                                <Select
                                    options={[
                                        { label: "Enterprise Pro", value: "Enterprise Pro" },
                                        { label: "Creator Plus", value: "Creator Plus" },
                                        { label: "Starter Free", value: "Starter Free" },
                                    ]}
                                    className="h-10"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="status"
                            label={<span className="font-semibold text-xs text-slate-700">Status</span>}
                        >
                            <Select
                                options={[
                                    { label: "Active", value: "Active" },
                                    { label: "Suspended", value: "Suspended" },
                                    { label: "Pending", value: "Pending" },
                                ]}
                                className="h-10"
                            />
                        </Form.Item>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                            <Button onClick={() => setIsEditModalOpen(false)} className="rounded-xl font-semibold cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" className="rounded-xl font-bold bg-purple-600 cursor-pointer">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
    );
}

export default function Users() {
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
                <UsersContent />
            </App>
        </ConfigProvider>
    );
}