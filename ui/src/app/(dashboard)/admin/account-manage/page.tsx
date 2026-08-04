
import { useState } from "react";
import dynamic from "next/dynamic";
import { Table, Tag, Tooltip, Switch, message, Popconfirm, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    TrendingUp,
    Users,
    DollarSign,
    Share2,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Activity,
    Globe,
    RefreshCw,
    Sliders,
    PauseCircle,
    PlayCircle,
    Search,
    Zap,
    BarChart3,
    PieChart,
    Bell,
    Clock,
    UserCheck,
    Radio
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa6";

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SocialStackHub {
    id: string;
    name: string;
    handleCount: string;
    dailyVolume: string;
    errorRate: string;
    status: "Healthy" | "Warning" | "Maintenance";
    icon: any;
    color: string;
    enabled: boolean;
}

export default function AccountManagePage() {
    // 1. Social Stack Global Admin State
    const [socialHubs, setSocialHubs] = useState<SocialStackHub[]>([
        {
            id: "1",
            name: "Twitter / X Network",
            handleCount: "18,420 Hubs",
            dailyVolume: "142.8K Posts",
            errorRate: "0.02%",
            status: "Healthy",
            icon: FaTwitter,
            color: "text-sky-500 bg-sky-50",
            enabled: true
        },
        {
            id: "2",
            name: "LinkedIn Professional",
            handleCount: "12,190 Hubs",
            dailyVolume: "84.2K Posts",
            errorRate: "0.01%",
            status: "Healthy",
            icon: FaLinkedin,
            color: "text-blue-600 bg-blue-50",
            enabled: true
        },
        {
            id: "3",
            name: "Instagram Graph API",
            handleCount: "14,850 Hubs",
            dailyVolume: "98.4K Media",
            errorRate: "1.45%",
            status: "Warning",
            icon: FaInstagram,
            color: "text-pink-600 bg-pink-50",
            enabled: true
        },
        {
            id: "4",
            name: "YouTube Data API v3",
            handleCount: "4,210 Channels",
            dailyVolume: "12.1K Shorts",
            errorRate: "0.00%",
            status: "Healthy",
            icon: FaYoutube,
            color: "text-red-600 bg-red-50",
            enabled: true
        },
        {
            id: "5",
            name: "Meta Facebook Pages",
            handleCount: "8,940 Pages",
            dailyVolume: "45.0K Posts",
            errorRate: "0.05%",
            status: "Healthy",
            icon: FaFacebook,
            color: "text-blue-500 bg-blue-50",
            enabled: true
        },
        {
            id: "6",
            name: "TikTok Business Hub",
            handleCount: "6,120 Accounts",
            dailyVolume: "34.9K Videos",
            errorRate: "3.10%",
            status: "Maintenance",
            icon: FaTiktok,
            color: "text-slate-800 bg-slate-100",
            enabled: false
        },
    ]);

    const [hubFilter, setHubFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Handle Social Hub Toggle
    const handleToggleHub = (id: string, currentEnabled: boolean) => {
        setSocialHubs((prev) =>
            prev.map((item) => (item.id === id ? { ...item, enabled: !currentEnabled } : item))
        );
        message.info(`Social Hub updated status`);
    };

    // Columns for Social Stack Control Table
    const columns: ColumnsType<SocialStackHub> = [
        {
            title: "Social Platform Hub",
            dataIndex: "name",
            key: "name",
            render: (_, record) => {
                const Icon = record.icon;
                return (
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${record.color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-800 text-sm block">{record.name}</span>
                            <span className="text-xs text-slate-400 font-mono">ID: hub_{record.id}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Connected Creator Hubs",
            dataIndex: "handleCount",
            key: "handleCount",
            render: (val) => <span className="font-semibold text-slate-700 text-xs">{val}</span>,
        },
        {
            title: "24h Broadcast Volume",
            dataIndex: "dailyVolume",
            key: "dailyVolume",
            render: (val) => <span className="font-mono text-xs font-semibold text-indigo-600">{val}</span>,
        },
        {
            title: "API Error Rate",
            dataIndex: "errorRate",
            key: "errorRate",
            render: (val, record) => {
                const isHigh = parseFloat(val) > 1.0;
                return (
                    <span className={`font-mono text-xs font-semibold ${isHigh ? "text-rose-600" : "text-emerald-600"}`}>
                        {val}
                    </span>
                );
            },
        },
        {
            title: "Global Gateway Status",
            dataIndex: "status",
            key: "status",
            render: (status: SocialStackHub["status"]) => {
                if (status === "Healthy") {
                    return <Tag color="green" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">Healthy</Tag>;
                }
                if (status === "Warning") {
                    return <Tag color="orange" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">Rate Limit Warning</Tag>;
                }
                return <Tag color="red" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">Maintenance</Tag>;
            },
        },
        {
            title: "Admin Control",
            key: "action",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Tooltip title={record.enabled ? "Pause Global Dispatch" : "Resume Global Dispatch"}>
                        <Switch
                            checked={record.enabled}
                            onChange={() => handleToggleHub(record.id, record.enabled)}
                            size="small"
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Force sync platform gateway?"
                        description={`Trigger global API cache refresh for ${record.name}?`}
                        onConfirm={() => message.success(`Refreshed ${record.name} Gateway Cache`)}
                        okText="Refresh"
                        cancelText="Cancel"
                    >
                        <button className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer">
                            Sync Cache
                        </button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const filteredHubs = socialHubs.filter((hub) => {
        const matchesSearch = hub.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            hubFilter === "all" ||
            (hubFilter === "healthy" && hub.status === "Healthy") ||
            (hubFilter === "warning" && hub.status === "Warning") ||
            (hubFilter === "maintenance" && hub.status === "Maintenance");
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            {/* 5. SOCIAL STACK CONTROL CENTER (MANAGE ALL SOCIAL ACCOUNTS FROM ADMIN) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 tracking-wider uppercase border border-purple-200 mb-1 inline-block">
                            ADMIN MASTER CONTROL
                        </span>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-primary" /> Social Stack Global Management
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Monitor, dispatch, pause, or configure all connected social media gateways across Creator Stack
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative w-48 sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search gateway..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-1.5">
                            {(["all", "healthy", "warning", "maintenance"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setHubFilter(tab)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${hubFilter === tab
                                        ? "bg-primary text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={filteredHubs}
                        rowKey="id"
                        pagination={false}
                        className="custom-admin-table"
                    />
                </div>
            </div>
        </div>
    );
}