"use client";

import React, { useState, useMemo } from "react";
import {
    App,
    Modal,
    Drawer,
    Button,
    Input,
    Tag,
    Select,
    Tooltip,
    Form,
    Badge,
    Progress,
    Avatar,
    Dropdown,
    Popconfirm,
    ConfigProvider,
} from "antd";
import {
    Rocket,
    Megaphone,
    Globe,
    Film,
    Plus,
    Search,
    Users,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Layers,
    Activity,
    ExternalLink,
    Shield,
    Sliders,
    Settings,
    Trash2,
    Edit3,
    UserPlus,
    ChevronRight,
    ChevronLeft,
    Building,
    LayoutGrid,
    Briefcase,
    Zap,
    TrendingUp,
    Clock,
    Filter,
    RotateCcw,
    List as ListIcon,
    Grid as GridIcon,
    ShieldAlert,
    Cpu,
    ArrowUpRight,
} from "lucide-react";
import {
    FaFacebook,
    FaInstagram,
    FaXTwitter,
    FaLinkedin,
    FaTiktok,
    FaYoutube,
    FaPinterest,
    FaDiscord,
} from "react-icons/fa6";

// Workspace Data Type Definition
export interface WorkspaceType {
    id: string;
    name: string;
    owner: string;
    ownerEmail: string;
    ownerAvatar?: string;
    status: "ACTIVE" | "TRIALING" | "PAST DUE" | "SUSPENDED";
    plan: "ENTERPRISE" | "Professional Trial" | "PRO - SUSPENDED" | "Standard Monthly" | "Starter Free";
    membersCount: number;
    connectedPlatforms: {
        id: string;
        name: string;
        icon: React.ElementType;
        color: string;
    }[];
    iconType: "rocket" | "megaphone" | "globe" | "film" | "building" | "layers";
    iconBg: string;
    iconColor: string;
    storageUsedGb: number;
    storageLimitGb: number;
    aiPostsGenerated: number;
    createdAt: string;
    lastActive: string;
    description: string;
}

// Initial Mock Workspaces Data based on user design image
const INITIAL_WORKSPACES: WorkspaceType[] = [
    {
        id: "WS-101",
        name: "Global Brand HQ",
        owner: "Sarah Chen",
        ownerEmail: "sarah.chen@globalbrand.com",
        ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        status: "ACTIVE",
        plan: "ENTERPRISE",
        membersCount: 24,
        connectedPlatforms: [
            { id: "fb", name: "Facebook", icon: FaFacebook, color: "#1877F2" },
            { id: "linkedin", name: "LinkedIn", icon: FaLinkedin, color: "#0A66C2" },
            { id: "ig", name: "Instagram", icon: FaInstagram, color: "#E4405F" },
        ],
        iconType: "rocket",
        iconBg: "bg-purple-500/10 border-purple-500/20",
        iconColor: "text-purple-500",
        storageUsedGb: 84.2,
        storageLimitGb: 500,
        aiPostsGenerated: 4280,
        createdAt: "Jan 12, 2023",
        lastActive: "2 mins ago",
        description: "Primary enterprise workspace for global marketing operations and multi-brand social campaigns.",
    },
    {
        id: "WS-102",
        name: "Marketing Lab",
        owner: "Alex Rivera",
        ownerEmail: "alex.r@marketinglab.io",
        ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        status: "TRIALING",
        plan: "Professional Trial",
        membersCount: 8,
        connectedPlatforms: [
            { id: "yt", name: "YouTube", icon: FaYoutube, color: "#FF0000" },
            { id: "globe", name: "Web Gateway", icon: Globe, color: "#06B6D4" },
        ],
        iconType: "megaphone",
        iconBg: "bg-cyan-500/10 border-cyan-500/20",
        iconColor: "text-cyan-500",
        storageUsedGb: 18.5,
        storageLimitGb: 100,
        aiPostsGenerated: 620,
        createdAt: "Feb 04, 2024",
        lastActive: "1 hour ago",
        description: "Experimental lab workspace testing short-form video strategies and viral growth funnels.",
    },
    {
        id: "WS-103",
        name: "APAC Operations",
        owner: "Jun-su Park",
        ownerEmail: "jun.park@apac-ops.org",
        ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        status: "PAST DUE",
        plan: "PRO - SUSPENDED",
        membersCount: 12,
        connectedPlatforms: [
            { id: "x", name: "X (Twitter)", icon: FaXTwitter, color: "#14171A" },
            { id: "discord", name: "Discord", icon: FaDiscord, color: "#5865F2" },
        ],
        iconType: "globe",
        iconBg: "bg-rose-500/10 border-rose-500/20",
        iconColor: "text-rose-500",
        storageUsedGb: 45.0,
        storageLimitGb: 200,
        aiPostsGenerated: 1450,
        createdAt: "Nov 15, 2023",
        lastActive: "12 days ago",
        description: "Asia-Pacific localized community hub and cross-cultural content distribution network.",
    },
    {
        id: "WS-104",
        name: "Creative Studio",
        owner: "Liam Davies",
        ownerEmail: "liam@creativestudio.app",
        ownerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        status: "ACTIVE",
        plan: "Standard Monthly",
        membersCount: 5,
        connectedPlatforms: [
            { id: "ig", name: "Instagram", icon: FaInstagram, color: "#E4405F" },
            { id: "pinterest", name: "Pinterest", icon: FaPinterest, color: "#BD081C" },
        ],
        iconType: "film",
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        iconColor: "text-emerald-500",
        storageUsedGb: 22.8,
        storageLimitGb: 150,
        aiPostsGenerated: 890,
        createdAt: "Mar 01, 2024",
        lastActive: "Just now",
        description: "Boutique design agency suite focusing on high-converting visual assets and motion design.",
    },
    {
        id: "WS-105",
        name: "Nexus Gaming Hub",
        owner: "Elena Vance",
        ownerEmail: "elena.v@nexusgame.tv",
        ownerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        status: "ACTIVE",
        plan: "ENTERPRISE",
        membersCount: 36,
        connectedPlatforms: [
            { id: "discord", name: "Discord", icon: FaDiscord, color: "#5865F2" },
            { id: "tiktok", name: "TikTok", icon: FaTiktok, color: "#000000" },
            { id: "yt", name: "YouTube", icon: FaYoutube, color: "#FF0000" },
        ],
        iconType: "building",
        iconBg: "bg-amber-500/10 border-amber-500/20",
        iconColor: "text-amber-500",
        storageUsedGb: 140.5,
        storageLimitGb: 1000,
        aiPostsGenerated: 8920,
        createdAt: "Aug 20, 2023",
        lastActive: "5 mins ago",
        description: "High-volume esports broadcast hub managing tournament live clips and community streams.",
    },
];

function WorkspacesContent() {
    const { message } = App.useApp();

    // State management
    const [workspaces, setWorkspaces] = useState<WorkspaceType[]>(INITIAL_WORKSPACES);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [planFilter, setPlanFilter] = useState<string>("ALL");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    // Modal & Drawer states
    const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceType | null>(null);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    // Form instances
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Stats calculations
    const stats = useMemo(() => {
        const totalWorkspaces = workspaces.length + 7; // Total system environments
        const totalMembers = workspaces.reduce((acc, curr) => acc + curr.membersCount, 0) + 73;
        const pendingIssues = workspaces.filter(
            (w) => w.status === "PAST DUE" || w.status === "SUSPENDED"
        ).length;
        return {
            totalWorkspaces,
            totalMembers,
            aiUtilization: "94.2%",
            pendingIssues,
        };
    }, [workspaces]);

    // Filter Logic
    const filteredWorkspaces = useMemo(() => {
        return workspaces.filter((ws) => {
            const matchesSearch =
                ws.name.toLowerCase().includes(searchText.toLowerCase()) ||
                ws.owner.toLowerCase().includes(searchText.toLowerCase()) ||
                ws.id.toLowerCase().includes(searchText.toLowerCase());

            const matchesStatus = statusFilter === "ALL" || ws.status === statusFilter;
            const matchesPlan = planFilter === "ALL" || ws.plan.includes(planFilter);

            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [workspaces, searchText, statusFilter, planFilter]);

    // Open Edit Modal
    const handleOpenEdit = (ws: WorkspaceType) => {
        setSelectedWorkspace(ws);
        editForm.setFieldsValue({
            name: ws.name,
            owner: ws.owner,
            ownerEmail: ws.ownerEmail,
            status: ws.status,
            plan: ws.plan,
            description: ws.description,
        });
        setIsEditModalOpen(true);
    };

    // Open View Details Drawer
    const handleViewDetails = (ws: WorkspaceType) => {
        setSelectedWorkspace(ws);
        setIsDetailDrawerOpen(true);
    };

    // Handle Create Workspace Submit
    const handleCreateWorkspace = (values: any) => {
        const newWs: WorkspaceType = {
            id: `WS-${100 + workspaces.length + 1}`,
            name: values.name,
            owner: values.owner || "Admin User",
            ownerEmail: values.ownerEmail || "admin@creatorstack.io",
            ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            status: values.status || "ACTIVE",
            plan: values.plan || "ENTERPRISE",
            membersCount: values.initialMembers ? parseInt(values.initialMembers, 10) : 1,
            connectedPlatforms: [
                { id: "fb", name: "Facebook", icon: FaFacebook, color: "#1877F2" },
                { id: "ig", name: "Instagram", icon: FaInstagram, color: "#E4405F" },
            ],
            iconType: values.iconType || "rocket",
            iconBg: "bg-purple-500/10 border-purple-500/20",
            iconColor: "text-purple-500",
            storageUsedGb: 5.0,
            storageLimitGb: 200,
            aiPostsGenerated: 0,
            createdAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            lastActive: "Just now",
            description: values.description || "Newly created operational workspace.",
        };

        setWorkspaces([newWs, ...workspaces]);
        message.success(`Workspace "${newWs.name}" created successfully!`);
        setIsCreateModalOpen(false);
        createForm.resetFields();
    };

    // Handle Edit Workspace Submit
    const handleEditWorkspace = (values: any) => {
        if (!selectedWorkspace) return;

        setWorkspaces((prev) =>
            prev.map((ws) =>
                ws.id === selectedWorkspace.id ? { ...ws, ...values } : ws
            )
        );
        message.success(`Workspace "${values.name}" updated successfully!`);
        setIsEditModalOpen(false);
        setSelectedWorkspace(null);
    };

    // Handle Delete Workspace
    const handleDeleteWorkspace = (wsId: string, wsName: string) => {
        setWorkspaces((prev) => prev.filter((w) => w.id !== wsId));
        message.success(`Workspace "${wsName}" has been removed`);
    };

    // Reset Filters
    const handleResetFilters = () => {
        setSearchText("");
        setStatusFilter("ALL");
        setPlanFilter("ALL");
        message.info("Filters reset to default");
    };

    // Render workspace status tag with appropriate theme styling
    const renderStatusBadge = (status: WorkspaceType["status"]) => {
        switch (status) {
            case "ACTIVE":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 shadow-sm">
                        ACTIVE
                    </span>
                );
            case "TRIALING":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/20 shadow-sm">
                        TRIALING
                    </span>
                );
            case "PAST DUE":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/20 shadow-sm">
                        PAST DUE
                    </span>
                );
            case "SUSPENDED":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/20 shadow-sm">
                        SUSPENDED
                    </span>
                );
            default:
                return null;
        }
    };

    // Render Workspace Icon based on type
    const renderWorkspaceIcon = (type: WorkspaceType["iconType"], iconBg: string, iconColor: string) => {
        const IconComponent =
            type === "rocket"
                ? Rocket
                : type === "megaphone"
                    ? Megaphone
                    : type === "globe"
                        ? Globe
                        : type === "film"
                            ? Film
                            : type === "building"
                                ? Building
                                : Layers;

        return (
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${iconBg} ${iconColor} shadow-inner`}>
                <IconComponent className="w-6 h-6" />
            </div>
        );
    };

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Top Header Section matching Demo Screenshot */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                            Workspaces Gallery
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">
                        Manage your distributed teams and social ecosystems.
                    </p>
                </div>

                {/* AI Insights Active Pill & Add Workspace Action */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAiModalOpen(true)}
                        className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span>AI INSIGHTS ACTIVE</span>
                    </button>

                    <Button
                        type="primary"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 border-none font-semibold h-10 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                        Create Workspace
                    </Button>
                </div>
            </div>

            {/* Filter Toolbar & Search Bar */}
            <div className="bg-card border border-gray-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search workspace, owner..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-9 bg-background border-gray-200 dark:border-zinc-800 rounded-xl h-10 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            allowClear
                        />
                    </div>

                    {/* Status Filter */}
                    <Select
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val)}
                        className="w-36 h-10"
                        options={[
                            { label: "All Statuses", value: "ALL" },
                            { label: "Active", value: "ACTIVE" },
                            { label: "Trialing", value: "TRIALING" },
                            { label: "Past Due", value: "PAST DUE" },
                            { label: "Suspended", value: "SUSPENDED" },
                        ]}
                    />

                    {/* Plan Filter */}
                    <Select
                        value={planFilter}
                        onChange={(val) => setPlanFilter(val)}
                        className="w-40 h-10"
                        options={[
                            { label: "All Plans", value: "ALL" },
                            { label: "Enterprise", value: "ENTERPRISE" },
                            { label: "Professional", value: "Professional" },
                            { label: "Standard", value: "Standard" },
                            { label: "Starter", value: "Starter" },
                        ]}
                    />

                    {(searchText || statusFilter !== "ALL" || planFilter !== "ALL") && (
                        <Button
                            type="text"
                            icon={<RotateCcw className="w-3.5 h-3.5" />}
                            onClick={handleResetFilters}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                            Reset
                        </Button>
                    )}
                </div>

                {/* View Switcher */}
                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-gray-200 dark:border-zinc-800">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${viewMode === "grid"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <GridIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${viewMode === "table"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <ListIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Table</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {viewMode === "grid" ? (
                /* Workspaces Cards Grid matching demo screenshot */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkspaces.map((ws) => (
                        <div
                            key={ws.id}
                            className="group relative bg-card border border-gray-200 dark:border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between"
                        >
                            {/* Card Header: Icon, Title, Status Tag & Menu */}
                            <div>
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3.5">
                                        {renderWorkspaceIcon(ws.iconType, ws.iconBg, ws.iconColor)}
                                        <div>
                                            <h3
                                                onClick={() => handleViewDetails(ws)}
                                                className="text-lg font-bold text-foreground hover:text-emerald-500 transition-colors cursor-pointer leading-tight flex items-center gap-2"
                                            >
                                                {ws.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                                                <Users className="w-3 h-3 text-muted-foreground/70" />
                                                <span>Owned by {ws.owner}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {renderStatusBadge(ws.status)}
                                        <Dropdown
                                            menu={{
                                                items: [
                                                    {
                                                        key: "view",
                                                        label: "View Details",
                                                        icon: <ChevronRight className="w-4 h-4" />,
                                                        onClick: () => handleViewDetails(ws),
                                                    },
                                                    {
                                                        key: "edit",
                                                        label: "Edit Settings",
                                                        icon: <Edit3 className="w-4 h-4" />,
                                                        onClick: () => handleOpenEdit(ws),
                                                    },
                                                    {
                                                        type: "divider",
                                                    },
                                                    {
                                                        key: "delete",
                                                        label: "Delete Workspace",
                                                        icon: <Trash2 className="w-4 h-4 text-rose-500" />,
                                                        danger: true,
                                                        onClick: () => handleDeleteWorkspace(ws.id, ws.name),
                                                    },
                                                ],
                                            }}
                                            trigger={["click"]}
                                            placement="bottomRight"
                                        >
                                            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-[1px] w-full bg-gray-100 dark:bg-zinc-800 my-4" />

                                {/* Card Details: Members, Connected Platforms, Plan */}
                                <div className="space-y-3 text-sm font-medium">
                                    {/* Members Row */}
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span className="text-xs">Members</span>
                                        <span className="text-foreground font-semibold text-xs">
                                            {ws.membersCount} active
                                        </span>
                                    </div>

                                    {/* Connected Platforms Row */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Connected Platforms</span>
                                        <div className="flex items-center gap-2">
                                            {ws.connectedPlatforms.map((p) => {
                                                const PlatformIcon = p.icon;
                                                return (
                                                    <Tooltip key={p.id} title={p.name}>
                                                        <div className="w-6 h-6 rounded-md bg-muted/80 flex items-center justify-center text-foreground hover:scale-110 transition-transform">
                                                            <PlatformIcon className="w-3.5 h-3.5" style={{ color: p.color }} />
                                                        </div>
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Plan Row matching screenshot typography */}
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-xs text-muted-foreground">Plan</span>
                                        <span
                                            className={`text-xs font-extrabold tracking-wide uppercase ${ws.plan === "ENTERPRISE"
                                                ? "text-emerald-500"
                                                : ws.plan.includes("SUSPENDED")
                                                    ? "text-rose-500"
                                                    : "text-muted-foreground"
                                                }`}
                                        >
                                            {ws.plan}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Quick Action */}
                            <div className="mt-6 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-[11px] text-muted-foreground/70">
                                    Active {ws.lastActive}
                                </span>
                                <button
                                    onClick={() => handleViewDetails(ws)}
                                    className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                                >
                                    Open Suite
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* "Create New Workspace" Dashed Card matching demo image directly */}
                    <div
                        onClick={() => setIsCreateModalOpen(true)}
                        className="group relative border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-emerald-500/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-card/40 hover:bg-card/90 transition-all duration-300 min-h-[260px] shadow-sm hover:shadow-xl"
                    >
                        <div className="w-16 h-16 rounded-full bg-zinc-800/90 border border-zinc-700/80 group-hover:bg-emerald-500 text-foreground group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 mb-4">
                            <Plus className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                            Create New Workspace
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 max-w-[220px] font-medium leading-relaxed">
                            Scale your operations by adding a new environment for your team.
                        </p>
                    </div>
                </div>
            ) : (
                /* Table View for Workspace Power Users */
                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-gray-200 dark:border-zinc-800 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Workspace</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Owner</th>
                                    <th className="px-6 py-4">Members</th>
                                    <th className="px-6 py-4">Connected Platforms</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {filteredWorkspaces.map((ws) => (
                                    <tr key={ws.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {renderWorkspaceIcon(ws.iconType, ws.iconBg, ws.iconColor)}
                                                <div>
                                                    <div
                                                        onClick={() => handleViewDetails(ws)}
                                                        className="font-bold text-foreground hover:text-emerald-500 cursor-pointer transition-colors"
                                                    >
                                                        {ws.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{ws.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{renderStatusBadge(ws.status)}</td>
                                        <td className="px-6 py-4 font-medium text-foreground">{ws.owner}</td>
                                        <td className="px-6 py-4 font-semibold">{ws.membersCount} active</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {ws.connectedPlatforms.map((p) => {
                                                    const PlatformIcon = p.icon;
                                                    return (
                                                        <div
                                                            key={p.id}
                                                            className="w-6 h-6 rounded bg-muted/80 flex items-center justify-center"
                                                        >
                                                            <PlatformIcon className="w-3.5 h-3.5" style={{ color: p.color }} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-xs uppercase text-emerald-500">
                                            {ws.plan}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<ChevronRight className="w-4 h-4 text-emerald-500" />}
                                                onClick={() => handleViewDetails(ws)}
                                            >
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bottom Stat Summary Cards matching demo image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
                {/* Stat 1: Total Workspaces */}
                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-purple-500/40 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            TOTAL WORKSPACES
                        </p>
                        <h4 className="text-2xl font-black text-foreground tracking-tight mt-0.5">
                            {stats.totalWorkspaces}
                        </h4>
                    </div>
                </div>

                {/* Stat 2: Total Members */}
                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-emerald-500/40 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            TOTAL MEMBERS
                        </p>
                        <h4 className="text-2xl font-black text-foreground tracking-tight mt-0.5">
                            {stats.totalMembers}
                        </h4>
                    </div>
                </div>

                {/* Stat 3: AI Utilization */}
                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-cyan-500/40 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            AI UTILIZATION
                        </p>
                        <h4 className="text-2xl font-black text-foreground tracking-tight mt-0.5">
                            {stats.aiUtilization}
                        </h4>
                    </div>
                </div>

                {/* Stat 4: Pending Issues */}
                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-amber-500/40 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            PENDING ISSUES
                        </p>
                        <h4 className="text-2xl font-black text-foreground tracking-tight mt-0.5">
                            {stats.pendingIssues}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Create Workspace Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-foreground pb-2 border-b border-gray-200 dark:border-zinc-800">
                        <Plus className="w-5 h-5 text-emerald-500" />
                        <span>Create New Workspace</span>
                    </div>
                }
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
                width={560}
                centered
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreateWorkspace}
                    initialValues={{
                        status: "ACTIVE",
                        plan: "ENTERPRISE",
                        iconType: "rocket",
                    }}
                    className="mt-4 space-y-4"
                >
                    <Form.Item
                        name="name"
                        label={<span className="font-semibold text-foreground">Workspace Name</span>}
                        rules={[{ required: true, message: "Please enter workspace name" }]}
                    >
                        <Input placeholder="e.g. Creator Growth Hub" className="rounded-xl h-10 border-gray-200 dark:border-zinc-800" />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item
                            name="owner"
                            label={<span className="font-semibold text-foreground">Owner Name</span>}
                            rules={[{ required: true, message: "Please enter owner name" }]}
                        >
                            <Input placeholder="e.g. Sarah Chen" className="rounded-xl h-10 border-gray-200 dark:border-zinc-800" />
                        </Form.Item>

                        <Form.Item
                            name="ownerEmail"
                            label={<span className="font-semibold text-foreground">Owner Email</span>}
                            rules={[{ required: true, type: "email", message: "Enter valid email" }]}
                        >
                            <Input placeholder="sarah@company.com" className="rounded-xl h-10 border-gray-200 dark:border-zinc-800" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item
                            name="status"
                            label={<span className="font-semibold text-foreground">Initial Status</span>}
                        >
                            <Select
                                className="h-10"
                                options={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Trialing", value: "TRIALING" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="plan"
                            label={<span className="font-semibold text-foreground">Subscription Plan</span>}
                        >
                            <Select
                                className="h-10"
                                options={[
                                    { label: "Enterprise Pro", value: "ENTERPRISE" },
                                    { label: "Professional Trial", value: "Professional Trial" },
                                    { label: "Standard Monthly", value: "Standard Monthly" },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="description"
                        label={<span className="font-semibold text-foreground">Description</span>}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Briefly describe the purpose of this workspace environment..."
                            className="rounded-xl border-gray-200 dark:border-zinc-800"
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                        <Button onClick={() => setIsCreateModalOpen(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-xl px-6 font-semibold"
                        >
                            Deploy Workspace
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Edit Workspace Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-foreground pb-2 border-b border-gray-200 dark:border-zinc-800">
                        <Edit3 className="w-5 h-5 text-emerald-500" />
                        <span>Edit Workspace Settings</span>
                    </div>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width={560}
                centered
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditWorkspace}
                    className="mt-4 space-y-4"
                >
                    <Form.Item
                        name="name"
                        label={<span className="font-semibold text-foreground">Workspace Name</span>}
                        rules={[{ required: true }]}
                    >
                        <Input className="rounded-xl h-10 border-gray-200 dark:border-zinc-800" />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item name="status" label={<span className="font-semibold text-foreground">Status</span>}>
                            <Select
                                className="h-10"
                                options={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Trialing", value: "TRIALING" },
                                    { label: "Past Due", value: "PAST DUE" },
                                    { label: "Suspended", value: "SUSPENDED" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="plan" label={<span className="font-semibold text-foreground">Plan</span>}>
                            <Select
                                className="h-10"
                                options={[
                                    { label: "ENTERPRISE", value: "ENTERPRISE" },
                                    { label: "Professional Trial", value: "Professional Trial" },
                                    { label: "PRO - SUSPENDED", value: "PRO - SUSPENDED" },
                                    { label: "Standard Monthly", value: "Standard Monthly" },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="description" label={<span className="font-semibold text-foreground">Description</span>}>
                        <Input.TextArea rows={3} className="rounded-xl border-gray-200 dark:border-zinc-800" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                        <Button onClick={() => setIsEditModalOpen(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-xl px-6 font-semibold"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Workspace Details Slide-Over Drawer */}
            <Drawer
                title={
                    selectedWorkspace && (
                        <div className="flex items-center gap-3">
                            {renderWorkspaceIcon(
                                selectedWorkspace.iconType,
                                selectedWorkspace.iconBg,
                                selectedWorkspace.iconColor
                            )}
                            <div>
                                <h3 className="text-lg font-bold text-foreground leading-none">
                                    {selectedWorkspace.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">{selectedWorkspace.id}</p>
                            </div>
                        </div>
                    )
                }
                width={500}
                open={isDetailDrawerOpen}
                onClose={() => setIsDetailDrawerOpen(false)}
                className=""
            >
                {selectedWorkspace && (
                    <div className="space-y-6">
                        {/* Status & Plan Info Header */}
                        <div className="bg-muted/40 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-muted-foreground block font-medium">Status</span>
                                <div className="mt-1">{renderStatusBadge(selectedWorkspace.status)}</div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block font-medium">Tier Plan</span>
                                <span className="text-xs font-black uppercase text-emerald-500 mt-1 block">
                                    {selectedWorkspace.plan}
                                </span>
                            </div>
                        </div>

                        {/* Owner & Meta Info */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                                Ownership & Team
                            </h4>
                            <div className="flex items-center justify-between bg-card border border-gray-200 dark:border-zinc-800 p-3.5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Avatar src={selectedWorkspace.ownerAvatar} size={40}>
                                        {selectedWorkspace.owner[0]}
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-foreground text-sm">
                                            {selectedWorkspace.owner}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {selectedWorkspace.ownerEmail}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                    Owner
                                </span>
                            </div>
                        </div>

                        {/* Connected Social Ecosystem */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                                Connected Ecosystem
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedWorkspace.connectedPlatforms.map((p) => {
                                    const PlatformIcon = p.icon;
                                    return (
                                        <div
                                            key={p.id}
                                            className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-gray-200 dark:border-zinc-800 text-sm font-medium"
                                        >
                                            <PlatformIcon className="w-4 h-4" style={{ color: p.color }} />
                                            <span>{p.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Resource Usage & Telemetry */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                                Storage & AI Usage
                            </h4>
                            <div className="bg-card border border-gray-200 dark:border-zinc-800 p-4 rounded-2xl space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                                        <span>Cloud Storage</span>
                                        <span>
                                            {selectedWorkspace.storageUsedGb} GB / {selectedWorkspace.storageLimitGb} GB
                                        </span>
                                    </div>
                                    <Progress
                                        percent={Math.round(
                                            (selectedWorkspace.storageUsedGb / selectedWorkspace.storageLimitGb) * 100
                                        )}
                                        strokeColor="#10B981"
                                    />
                                </div>

                                <div className="pt-2 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground font-medium">AI Posts Generated</span>
                                    <span className="font-bold text-foreground">
                                        {selectedWorkspace.aiPostsGenerated.toLocaleString()} posts
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                                About Workspace
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800">
                                {selectedWorkspace.description}
                            </p>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* AI Insights Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <span>AI Workspace Intelligence Insights</span>
                    </div>
                }
                open={isAiModalOpen}
                onCancel={() => setIsAiModalOpen(false)}
                footer={null}
                width={600}
                centered
            >
                <div className="mt-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-start gap-3">
                        <Zap className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm">System Optimization Active</h4>
                            <p className="text-xs text-emerald-600/90 dark:text-emerald-400/90 mt-1 leading-relaxed">
                                AI has detected 3 high-impact recommendations across your 12 workspace environments.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-card border border-gray-200 dark:border-zinc-800 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-foreground">APAC Operations Payment Alert</span>
                                <Tag color="warning">Past Due</Tag>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Payment for APAC Operations failed 12 days ago. Upgrade or update payment method to avoid suspension of connected channels.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-card border border-gray-200 dark:border-zinc-800 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-foreground">Storage Reallocation Recommendation</span>
                                <Tag color="processing">Storage</Tag>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Global Brand HQ is utilizing 84% of its cloud quota. Reallocate 100GB from Marketing Lab to prevent render bottlenecks.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-card border border-gray-200 dark:border-zinc-800 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-foreground">AI Content Acceleration</span>
                                <Tag color="success">Efficiency</Tag>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nexus Gaming Hub generated 8,920 AI posts this month (+34% WoW). Recommended auto-scheduling for peak audience hours.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="primary"
                            onClick={() => setIsAiModalOpen(false)}
                            className="bg-emerald-600 hover:bg-emerald-500 border-none rounded-xl"
                        >
                            Close Insights
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default function Workspaces() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#10B981",
                    borderRadius: 12,
                },
            }}
        >
            <App>
                <WorkspacesContent />
            </App>
        </ConfigProvider>
    );
}