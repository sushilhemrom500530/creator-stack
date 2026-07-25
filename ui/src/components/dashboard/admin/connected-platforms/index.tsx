"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
    App,
    Modal,
    Drawer,
    Button,
    Input,
    Tag,
    Select,
    ConfigProvider,
    Tooltip,
    Form,
    Badge,
} from "antd";
import {
    Activity,
    Plus,
    RefreshCw,
    Sliders,
    Search,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Key,
    Globe,
    Zap,
    ExternalLink,
    Clock,
    Shield,
    Server,
    Radio,
    Sparkles,
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
    FaTwitch,
    FaThreads,
} from "react-icons/fa6";

// Dynamically import ApexCharts with SSR disabled for Next.js App Router
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Type definitions for Connected Platform
export interface PlatformItem {
    id: string;
    name: string;
    endpoint: string;
    status: "HEALTHY" | "CRITICAL" | "WARNING";
    activeUsers: string;
    metricType: "Latency" | "Error Rate" | "Queue Depth";
    metricValue: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    chartSeries: number[];
    chartUnit: string;
    apiVersion: string;
    rateLimitUsage: number; // percentage
}

// Initial Mock Platform Data matching screenshot
const INITIAL_PLATFORMS: PlatformItem[] = [
    {
        id: "fb-graph",
        name: "Facebook Graph",
        endpoint: "v18.0 API Endpoint",
        status: "HEALTHY",
        activeUsers: "12.4k",
        metricType: "Latency",
        metricValue: "142ms",
        icon: FaFacebook,
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600",
        chartSeries: [120, 135, 128, 145, 132, 140, 142],
        chartUnit: "ms",
        apiVersion: "v18.0",
        rateLimitUsage: 34,
    },
    {
        id: "ig-business",
        name: "Instagram Business",
        endpoint: "Media Feed Service",
        status: "HEALTHY",
        activeUsers: "8.2k",
        metricType: "Latency",
        metricValue: "89ms",
        icon: FaInstagram,
        iconBg: "bg-gradient-to-tr from-amber-500/10 via-pink-500/10 to-purple-500/10",
        iconColor: "text-pink-600",
        chartSeries: [95, 88, 92, 85, 91, 84, 89],
        chartUnit: "ms",
        apiVersion: "v16.2",
        rateLimitUsage: 22,
    },
    {
        id: "x-core",
        name: "X Core API",
        endpoint: "OAuth 2.0 Handshake Error",
        status: "CRITICAL",
        activeUsers: "4.1k",
        metricType: "Error Rate",
        metricValue: "92%",
        icon: FaXTwitter,
        iconBg: "bg-slate-900/10",
        iconColor: "text-slate-900",
        chartSeries: [15, 32, 54, 70, 82, 88, 92],
        chartUnit: "%",
        apiVersion: "v2.8",
        rateLimitUsage: 94,
    },
    {
        id: "linkedin-ads",
        name: "LinkedIn Ads",
        endpoint: "Campaign Management API",
        status: "HEALTHY",
        activeUsers: "1.8k",
        metricType: "Latency",
        metricValue: "312ms",
        icon: FaLinkedin,
        iconBg: "bg-blue-600/10",
        iconColor: "text-blue-700",
        chartSeries: [290, 305, 285, 315, 300, 325, 312],
        chartUnit: "ms",
        apiVersion: "v2023.10",
        rateLimitUsage: 45,
    },
    {
        id: "tiktok-content",
        name: "TikTok Content",
        endpoint: "Rate Limit Threshold High",
        status: "WARNING",
        activeUsers: "22.9k",
        metricType: "Queue Depth",
        metricValue: "1,244",
        icon: FaTiktok,
        iconBg: "bg-slate-950/10",
        iconColor: "text-slate-950",
        chartSeries: [450, 620, 790, 910, 1050, 1180, 1244],
        chartUnit: " items",
        apiVersion: "v1.3",
        rateLimitUsage: 88,
    },
    {
        id: "youtube-data",
        name: "YouTube Data",
        endpoint: "v3 Analytics Connector",
        status: "HEALTHY",
        activeUsers: "3.4k",
        metricType: "Latency",
        metricValue: "205ms",
        icon: FaYoutube,
        iconBg: "bg-red-500/10",
        iconColor: "text-red-600",
        chartSeries: [195, 210, 202, 208, 198, 204, 205],
        chartUnit: "ms",
        apiVersion: "v3.0",
        rateLimitUsage: 18,
    },
    {
        id: "pinterest-ads",
        name: "Pinterest Ads",
        endpoint: "Visual Search API",
        status: "HEALTHY",
        activeUsers: "940",
        metricType: "Latency",
        metricValue: "178ms",
        icon: FaPinterest,
        iconBg: "bg-rose-600/10",
        iconColor: "text-rose-600",
        chartSeries: [160, 172, 168, 180, 175, 182, 178],
        chartUnit: "ms",
        apiVersion: "v5.0",
        rateLimitUsage: 15,
    },
];

// Interactive ApexChart Sparkline Component with hover tooltips showing labels & values
function PlatformApexSparkline({
    data,
    status,
    unit,
    metricType,
}: {
    data: number[];
    status: "HEALTHY" | "CRITICAL" | "WARNING";
    unit: string;
    metricType: string;
}) {
    const color =
        status === "CRITICAL"
            ? "#F43F5E"
            : status === "WARNING"
            ? "#F59E0B"
            : "#10B981";

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "line",
            sparkline: {
                enabled: true,
            },
            animations: {
                enabled: true,
                speed: 400,
            },
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        colors: [color],
        tooltip: {
            enabled: true,
            theme: "light",
            style: {
                fontSize: "12px",
                fontFamily: "var(--font-geist-sans), sans-serif",
            },
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => `${metricType}: `,
                },
                formatter: (val) => `${val}${unit}`,
            },
            marker: {
                show: true,
            },
        },
        markers: {
            size: 0,
            hover: {
                size: 5,
            },
        },
    };

    const series = [
        {
            name: metricType,
            data: data,
        },
    ];

    return (
        <div className="w-full h-[55px] flex items-center justify-center">
            <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={55}
                width="100%"
            />
        </div>
    );
}

function ConnectedPlatformsContent() {
    // Use context-bound message from Ant Design App hook
    const { message } = App.useApp();

    const [platforms, setPlatforms] = useState<PlatformItem[]>(INITIAL_PLATFORMS);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformItem | null>(null);

    // Modal state for Configure
    const [isConfigureOpen, setIsConfigureOpen] = useState(false);
    // Modal state for Add Platform
    const [isAddPlatformOpen, setIsAddPlatformOpen] = useState(false);

    const [form] = Form.useForm();

    // Summary system state computation
    const systemStatus = useMemo(() => {
        const hasCritical = platforms.some((p) => p.status === "CRITICAL");
        const hasWarning = platforms.some((p) => p.status === "WARNING");
        if (hasCritical) {
            return { text: "SYSTEM DEGRADED - ACTION REQUIRED", color: "text-rose-500 bg-rose-50 border-rose-200" };
        }
        if (hasWarning) {
            return { text: "SYSTEM WARNINGS DETECTED", color: "text-amber-600 bg-amber-50 border-amber-200" };
        }
        return { text: "ALL SYSTEMS OPERATIONAL", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    }, [platforms]);

    // Handle Reconnect simulation (Critical card)
    const handleReconnect = (id: string, name: string) => {
        message.loading({ content: `Re-establishing OAuth 2.0 Handshake with ${name}...`, key: id });
        setTimeout(() => {
            setPlatforms((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? {
                              ...p,
                              status: "HEALTHY",
                              metricType: "Latency",
                              metricValue: "115ms",
                              endpoint: `${p.apiVersion} API Connected`,
                              chartSeries: [90, 105, 110, 115, 108, 112, 115],
                              chartUnit: "ms",
                              rateLimitUsage: 28,
                          }
                        : p
                )
            );
            message.success({ content: `Successfully reconnected ${name}! OAuth session active.`, key: id });
        }, 1500);
    };

    // Handle Resolve simulation (Warning card)
    const handleResolve = (id: string, name: string) => {
        message.loading({ content: `Flushing queue depth & expanding rate limit for ${name}...`, key: id });
        setTimeout(() => {
            setPlatforms((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? {
                              ...p,
                              status: "HEALTHY",
                              metricType: "Latency",
                              metricValue: "160ms",
                              endpoint: "Feed Stream Optimal",
                              chartSeries: [220, 200, 180, 175, 168, 162, 160],
                              chartUnit: "ms",
                              rateLimitUsage: 40,
                          }
                        : p
                )
            );
            message.success({ content: `Resolved rate limit threshold for ${name}!`, key: id });
        }, 1200);
    };

    // Refresh all statuses
    const handleRefreshAll = () => {
        setIsRefreshing(true);
        message.info("Pinging all platform gateways...");
        setTimeout(() => {
            setIsRefreshing(false);
            message.success("Platform monitor metrics synced.");
        }, 1000);
    };

    // Handle Configure click
    const handleOpenConfigure = (platform: PlatformItem) => {
        setSelectedPlatform(platform);
        setIsConfigureOpen(true);
    };

    // Submit Add Platform
    const handleAddPlatformSubmit = (values: any) => {
        const newPlatform: PlatformItem = {
            id: `plat-${Date.now()}`,
            name: values.name,
            endpoint: values.endpoint || "v1.0 Connected Endpoint",
            status: "HEALTHY",
            activeUsers: "1.0k",
            metricType: "Latency",
            metricValue: "120ms",
            icon: FaGlobeIcon(values.type),
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-600",
            chartSeries: [110, 115, 118, 122, 120, 119, 120],
            chartUnit: "ms",
            apiVersion: "v1.0",
            rateLimitUsage: 10,
        };
        setPlatforms([...platforms, newPlatform]);
        message.success(`Platform ${values.name} integrated successfully!`);
        setIsAddPlatformOpen(false);
        form.resetFields();
    };

    // Icon helper
    const FaGlobeIcon = (type: string) => {
        switch (type) {
            case "Discord":
                return FaDiscord;
            case "Twitch":
                return FaTwitch;
            case "Threads":
                return FaThreads;
            default:
                return Globe;
        }
    };

    // Filtered platforms
    const filteredPlatforms = useMemo(() => {
        if (filterStatus === "ALL") return platforms;
        return platforms.filter((p) => p.status === filterStatus);
    }, [platforms, filterStatus]);

    return (
        <div className="space-y-8 bg-slate-50/60 p-6 sm:p-8 rounded-3xl min-h-screen">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 tracking-wider uppercase border border-purple-200">
                            GATEWAY CONTROL
                        </span>

                        {/* Dynamic System Status Indicator matching screenshot */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${systemStatus.color}`}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                            </span>
                            {systemStatus.text}
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Platform Monitor
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Real-time status monitoring and API health telemetry for all connected social ecosystems.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Filter buttons */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
                        {(["ALL", "HEALTHY", "WARNING", "CRITICAL"] as const).map((st) => (
                            <button
                                key={st}
                                onClick={() => setFilterStatus(st)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                                    filterStatus === st
                                        ? "bg-white text-purple-700 shadow-xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    <Button
                        icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />}
                        onClick={handleRefreshAll}
                        className="h-11 px-4 rounded-2xl font-bold border-slate-200 hover:border-purple-300 cursor-pointer"
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* 2. Platform Monitor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPlatforms.map((platform) => {
                    const IconComponent = platform.icon;
                    const isCritical = platform.status === "CRITICAL";
                    const isWarning = platform.status === "WARNING";

                    return (
                        <div
                            key={platform.id}
                            className={`bg-white rounded-3xl p-6 border transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between space-y-5 relative overflow-hidden group ${
                                isCritical
                                    ? "border-rose-300 ring-1 ring-rose-200"
                                    : isWarning
                                    ? "border-amber-300 ring-1 ring-amber-200"
                                    : "border-slate-200/80 hover:border-purple-200"
                            }`}
                        >
                            {/* Card Header: Identical Icon Container (w-12 h-12) & Status Dot */}
                            <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 rounded-2xl ${platform.iconBg} ${platform.iconColor} border border-slate-100 shadow-xs flex items-center justify-center shrink-0`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>

                                {/* Status Badge Top Right */}
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${
                                        isCritical
                                            ? "bg-rose-500 animate-ping"
                                            : isWarning
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"
                                    }`} />
                                    <span className={`text-[11px] font-extrabold tracking-wider ${
                                        isCritical
                                            ? "text-rose-600"
                                            : isWarning
                                            ? "text-amber-600"
                                            : "text-emerald-600"
                                    }`}>
                                        {platform.status}
                                    </span>
                                </div>
                            </div>

                            {/* Platform Title & Endpoint Subtitle */}
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-700 transition">
                                    {platform.name}
                                </h3>
                                <p className={`text-xs font-medium mt-0.5 truncate ${
                                    isCritical ? "text-rose-600 font-semibold" : isWarning ? "text-amber-600 font-semibold" : "text-slate-400"
                                }`}>
                                    {platform.endpoint}
                                </p>
                            </div>

                            {/* Interactive ApexChart Sparkline with hover tooltip label & value */}
                            <div className="py-1">
                                <PlatformApexSparkline
                                    data={platform.chartSeries}
                                    status={platform.status}
                                    unit={platform.chartUnit}
                                    metricType={platform.metricType}
                                />
                            </div>

                            {/* Key Metrics Grid (2 rows) */}
                            <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">Active Users</span>
                                    <span className="font-extrabold text-slate-900 font-mono">{platform.activeUsers}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">{platform.metricType}</span>
                                    <span className={`font-extrabold font-mono ${
                                        isCritical
                                            ? "text-rose-600"
                                            : isWarning
                                            ? "text-amber-600"
                                            : "text-slate-800"
                                    }`}>
                                        {platform.metricValue}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2">
                                {isCritical ? (
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        onClick={() => handleReconnect(platform.id, platform.name)}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 text-white font-bold rounded-2xl shadow-md hover:shadow-purple-200 h-11 cursor-pointer"
                                    >
                                        Reconnect
                                    </Button>
                                ) : isWarning ? (
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        onClick={() => handleResolve(platform.id, platform.name)}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 text-white font-bold rounded-2xl shadow-md hover:shadow-purple-200 h-11 cursor-pointer"
                                    >
                                        Resolve
                                    </Button>
                                ) : (
                                    <Button
                                        block
                                        size="large"
                                        onClick={() => handleOpenConfigure(platform)}
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border-0 rounded-2xl h-11 cursor-pointer transition"
                                    >
                                        Configure
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* 3. Add Platform Dashed Card */}
                <div
                    onClick={() => setIsAddPlatformOpen(true)}
                    className="bg-white rounded-3xl p-6 border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50/20 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[340px] group shadow-2xs"
                >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-purple-100 text-slate-500 group-hover:text-purple-600 flex items-center justify-center transition-all transform group-hover:scale-105 mb-4 border border-slate-200/60 shrink-0">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-700 transition">
                        Add Platform
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-[200px] leading-relaxed">
                        Integrate new social media APIs, custom webhooks, or OAuth apps
                    </p>
                </div>
            </div>

            {/* 4. Configure Platform Drawer */}
            <Drawer
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                            <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">{selectedPlatform?.name} Settings</h3>
                            <p className="text-xs text-slate-500 font-mono">{selectedPlatform?.endpoint}</p>
                        </div>
                    </div>
                }
                placement="right"
                onClose={() => setIsConfigureOpen(false)}
                open={isConfigureOpen}
                size="large"
            >
                {selectedPlatform && (
                    <div className="space-y-6 text-sm">
                        {/* Health Banner */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase">Gateway Health</span>
                                <div className="mt-1 flex items-center gap-2">
                                    <Tag color="success" className="rounded-full font-bold px-3 py-0.5">
                                        {selectedPlatform.status}
                                    </Tag>
                                    <span className="text-xs font-mono text-slate-600">
                                        {selectedPlatform.metricType}: {selectedPlatform.metricValue}
                                    </span>
                                </div>
                            </div>
                            <Button
                                size="small"
                                onClick={() => message.success("Ping successful! Latency: 98ms")}
                                className="font-bold text-xs rounded-xl"
                            >
                                Ping API
                            </Button>
                        </div>

                        {/* API Credentials */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                                API & Webhook Config
                            </h4>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">Client ID / App ID</label>
                                <Input
                                    value={`app_${selectedPlatform.id}_98410294`}
                                    readOnly
                                    suffix={<Key className="w-4 h-4 text-slate-400" />}
                                    className="rounded-xl font-mono text-xs h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">Webhook Endpoint URL</label>
                                <Input
                                    value={`https://api.creatorstack.io/v1/webhooks/${selectedPlatform.id}`}
                                    readOnly
                                    suffix={<Globe className="w-4 h-4 text-slate-400" />}
                                    className="rounded-xl font-mono text-xs h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700">Rate Limit Quota</span>
                                    <span className="font-mono text-purple-600 font-bold">{selectedPlatform.rateLimitUsage}% Used</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600 rounded-full"
                                        style={{ width: `${selectedPlatform.rateLimitUsage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 space-y-3 border-t border-slate-100">
                            <Button
                                block
                                icon={<RefreshCw className="w-4 h-4" />}
                                onClick={() => message.success("Rotated Secret Key successfully!")}
                                className="rounded-xl font-bold h-11"
                            >
                                Rotate OAuth Secret
                            </Button>
                            <Button
                                block
                                danger
                                icon={<XCircle className="w-4 h-4" />}
                                onClick={() => {
                                    setPlatforms(platforms.filter((p) => p.id !== selectedPlatform.id));
                                    setIsConfigureOpen(false);
                                    message.success(`Disconnected ${selectedPlatform.name}`);
                                }}
                                className="rounded-xl font-bold h-11"
                            >
                                Disconnect Platform Gateway
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* 5. Add Platform Modal */}
            <Modal
                title={<span className="text-lg font-bold text-slate-900">Integrate New Platform</span>}
                open={isAddPlatformOpen}
                onCancel={() => setIsAddPlatformOpen(false)}
                footer={null}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddPlatformSubmit}
                    initialValues={{ type: "Discord" }}
                    className="mt-4 space-y-4"
                >
                    <Form.Item
                        name="name"
                        label={<span className="font-semibold text-xs text-slate-700">Platform Display Name</span>}
                        rules={[{ required: true, message: "Please enter platform name" }]}
                    >
                        <Input placeholder="e.g. Discord Community Bot" className="rounded-xl h-10" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label={<span className="font-semibold text-xs text-slate-700">Integration Type</span>}
                    >
                        <Select
                            options={[
                                { label: "Discord Bot API", value: "Discord" },
                                { label: "Twitch Broadcast Stream", value: "Twitch" },
                                { label: "Meta Threads Graph", value: "Threads" },
                                { label: "Custom Webhook Endpoint", value: "Webhook" },
                            ]}
                            className="h-10"
                        />
                    </Form.Item>

                    <Form.Item
                        name="endpoint"
                        label={<span className="font-semibold text-xs text-slate-700">Endpoint / Version Subtitle</span>}
                    >
                        <Input placeholder="e.g. OAuth 2.0 Bot Connector" className="rounded-xl h-10" />
                    </Form.Item>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <Button onClick={() => setIsAddPlatformOpen(false)} className="rounded-xl font-semibold cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" className="rounded-xl font-bold bg-purple-600 cursor-pointer">
                            Connect Platform
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default function ConnectedPlatforms() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#7C3AED",
                    borderRadius: 16,
                    colorBgContainer: "#ffffff",
                    fontFamily: "var(--font-geist-sans), 'DM Sans', sans-serif",
                },
            }}
        >
            <App>
                <ConnectedPlatformsContent />
            </App>
        </ConfigProvider>
    );
}
