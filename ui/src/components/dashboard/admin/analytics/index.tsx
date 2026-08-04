"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
    App,
    ConfigProvider,
    Table,
    Tag,
    Button,
    Progress,
    Drawer,
    Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    TrendingUp,
    TrendingDown,
    Sparkles,
    Globe,
    Zap,
    Bot,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Send,
    Brain,
} from "lucide-react";
import { FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import WorldMapDashboard from "@/components/common/global-map";

// Dynamically import ApexCharts for Next.js App Router
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Types for AI Model Architecture Table
export interface AiModelItem {
    key: string;
    modelName: string;
    description: string;
    tokenBudget: string;
    reachGrowth: number; // percentage
    avgCtr: string;
    efficiencyIndex: "Elite" | "Optimal" | "High" | "Standard";
}

const MOCK_AI_MODELS: AiModelItem[] = [
    {
        key: "1",
        modelName: "SocialRow-X1 Alpha",
        description: "Multi-modal cross-platform scheduler engine",
        tokenBudget: "1.28B / mo",
        reachGrowth: 22.4,
        avgCtr: "4.82%",
        efficiencyIndex: "Elite",
    },
    {
        key: "2",
        modelName: "Generative-Visual v4",
        description: "Automated thumbnail & Reel graphic synthesizer",
        tokenBudget: "850M / mo",
        reachGrowth: 14.1,
        avgCtr: "3.21%",
        efficiencyIndex: "Optimal",
    },
    {
        key: "3",
        modelName: "Sentiment Analysis Engine",
        description: "Real-time audience mood & comment classifier",
        tokenBudget: "420M / mo",
        reachGrowth: 31.8,
        avgCtr: "5.10%",
        efficiencyIndex: "Elite",
    },
    {
        key: "4",
        modelName: "Predictive Engagement v2",
        description: "Peak-hour post timing optimization algorithm",
        tokenBudget: "680M / mo",
        reachGrowth: 19.5,
        avgCtr: "4.15%",
        efficiencyIndex: "High",
    },
];

// Mini ApexSparkline for Platform Cards
function MiniPlatformChart({
    data,
    color,
}: {
    data: number[];
    color: string;
}) {
    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "area",
            sparkline: { enabled: true },
            animations: { enabled: true, speed: 400 },
        },
        stroke: { curve: "smooth", width: 2.5 },
        colors: [color],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        tooltip: { enabled: false },
    };

    return (
        <div className="w-full h-9 pt-1">
            <ReactApexChart
                options={options}
                series={[{ data }]}
                type="area"
                height="100%"
                width="100%"
            />
        </div>
    );
}

function AnalyticsContent() {
    const { message } = App.useApp();
    const [timeframe, setTimeframe] = useState<"7d" | "30d" | "all">("7d");
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    const [aiResponses, setAiResponses] = useState<string[]>([]);

    // Timeframe dataset configuration
    const revenueSeries = useMemo(() => {
        if (timeframe === "30d") {
            return [
                { name: "MRR", data: [95000, 105000, 118000, 125000, 132000, 138000, 142850] },
                { name: "Active Users", data: [45000, 52000, 61000, 68000, 74000, 81000, 89400] },
            ];
        }
        if (timeframe === "all") {
            return [
                { name: "MRR", data: [40000, 65000, 85000, 110000, 128000, 135000, 142850] },
                { name: "Active Users", data: [20000, 35000, 50000, 65000, 78000, 84000, 89400] },
            ];
        }
        // 7 days default
        return [
            { name: "MRR", data: [128000, 131000, 133500, 136000, 139000, 141200, 142850] },
            { name: "Active Users", data: [78000, 79500, 81000, 83200, 85400, 87600, 89400] },
        ];
    }, [timeframe]);

    // Main Chart Options
    const mainChartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: "area",
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#8B5CF6", "#14B8A6"], // Purple & Teal
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            categories:
                timeframe === "7d"
                    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    : timeframe === "30d"
                        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
                        : ["Q1", "Q2", "Q3", "Q4", "Q1 '26", "Q2 '26"],
            labels: {
                style: { colors: "#64748B", fontSize: "12px", fontWeight: "600" },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (val) => `$${(val / 1000).toFixed(0)}k`,
                style: { colors: "#64748B", fontSize: "12px" },
            },
        },
        grid: {
            borderColor: "#F1F5F9",
            strokeDashArray: 4,
        },
        tooltip: {
            theme: "light",
            y: {
                formatter: (val: any, opts?: any) =>
                    opts?.seriesIndex === 0 ? `$${val.toLocaleString()}` : `${val.toLocaleString()} Users`,
            },
        },
        legend: { show: false },
    };

    // AI Query Submission
    const handleAskAi = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!aiQuery.trim()) return;
        const query = aiQuery;
        setAiQuery("");
        setAiResponses((prev) => [
            ...prev,
            `Q: ${query}`,
            `AI Analyst: Based on real-time telemetry, ${query.toLowerCase().includes("mrr") ? "MRR has grown 12.4% this week driven by Enterprise Pro tier conversions." : "AI scheduling models are maintaining a 94.2% engagement lift across Instagram & LinkedIn."}`,
        ]);
        message.success("AI Analyst calculated telemetry insights!");
    };

    // Table Columns
    const tableColumns: ColumnsType<AiModelItem> = [
        {
            title: "MODEL ARCHITECTURE",
            dataIndex: "modelName",
            key: "modelName",
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                        <Brain className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="font-bold text-slate-800 text-sm block">{text}</span>
                        <span className="text-xs text-slate-400">{record.description}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "TOKEN BUDGET",
            dataIndex: "tokenBudget",
            key: "tokenBudget",
            render: (text) => <span className="font-mono text-xs font-semibold text-slate-600">{text}</span>,
        },
        {
            title: "REACH GROWTH",
            dataIndex: "reachGrowth",
            key: "reachGrowth",
            render: (val) => (
                <div className="flex items-center gap-3 max-w-[160px]">
                    <span className="font-bold text-xs text-emerald-600 font-mono">+{val}%</span>
                    <Progress
                        percent={val * 2.5}
                        showInfo={false}
                        strokeColor={{ "0%": "#10b981", "100%": "#059669" }}
                        size="small"
                        className="flex-1 mb-0"
                    />
                </div>
            ),
        },
        {
            title: "AVG CTR",
            dataIndex: "avgCtr",
            key: "avgCtr",
            render: (text) => <span className="font-mono text-xs font-bold text-primary">{text}</span>,
        },
        {
            title: "EFFICIENCY INDEX",
            dataIndex: "efficiencyIndex",
            key: "efficiencyIndex",
            render: (idx) => {
                if (idx === "Elite") {
                    return <Tag color="purple" className="rounded-full px-3 font-bold border-purple-200">Elite</Tag>;
                }
                if (idx === "Optimal") {
                    return <Tag color="cyan" className="rounded-full px-3 font-bold border-cyan-200">Optimal</Tag>;
                }
                return <Tag color="blue" className="rounded-full px-3 font-bold border-blue-200">High</Tag>;
            },
        },
    ];

    // Platform Performance JSON Data
    const PLATFORM_PERFORMANCE_DATA = [
        {
            id: "instagram",
            platform: "Instagram",
            icon: <FaInstagram className="w-4 h-4" />,
            iconContainerClass: "bg-pink-50 text-pink-600 border-pink-100",
            change: "8%",
            isUp: true,
            label: "Reach",
            value: "1.2M",
            chartData: [80, 95, 110, 105, 120, 118, 125],
            chartColor: "#10B981",
        },
        {
            id: "x-platform",
            platform: "X Platform",
            icon: <FaXTwitter className="w-4 h-4" />,
            iconContainerClass: "bg-slate-100 text-slate-900 border-slate-200",
            change: "3%",
            isUp: false,
            label: "Engagement",
            value: "450K",
            chartData: [120, 115, 108, 98, 92, 88, 85],
            chartColor: "#F43F5E",
        },
        {
            id: "linkedin",
            platform: "LinkedIn",
            icon: <FaLinkedin className="w-4 h-4" />,
            iconContainerClass: "bg-blue-50 text-blue-700 border-blue-100",
            change: "14%",
            isUp: true,
            label: "Conversions",
            value: "24.1K",
            chartData: [15, 18, 20, 22, 21, 23, 24],
            chartColor: "#3B82F6",
        },
        {
            id: "youtube",
            platform: "YouTube",
            icon: <FaYoutube className="w-4 h-4" />,
            iconContainerClass: "bg-red-50 text-red-600 border-red-100",
            change: "22%",
            isUp: true,
            label: "Watch Time",
            value: "158K hrs",
            chartData: [110, 125, 138, 142, 150, 155, 158],
            chartColor: "#F59E0B",
        },
    ];

    return (
        <div className="space-y-8 p-6">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card p-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Advanced Analytics
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Real-time performance metrics and AI-driven growth insights.
                    </p>
                </div>

                {/* Light Mode Timeframe Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
                    {(["7d", "30d", "all"] as const).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${timeframe === tf
                                ? "bg-white text-primary shadow-xs border border-slate-200/80 font-extrabold"
                                : "text-slate-600 hover:text-slate-900 font-bold"
                                }`}
                        >
                            {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "All Time"}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Top Row: Main Revenue & Subscription Growth Chart + AI Insights Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: Revenue & Subscription Growth Chart (2 cols) */}
                <div className="lg:col-span-2 card p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                REVENUE & SUBSCRIPTION GROWTH
                            </span>
                            <div className="flex items-baseline gap-3 mt-1">
                                <h2 className="text-3xl font-extrabold text-slate-900">$142,850.00</h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
                                </span>
                            </div>
                        </div>

                        {/* Chart Legend */}
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                            <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary/80 inline-block" />
                                MRR
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                                Active Users
                            </span>
                        </div>
                    </div>

                    {/* ApexChart Area Component */}
                    <div className="pt-2">
                        <ReactApexChart
                            options={mainChartOptions}
                            series={revenueSeries}
                            type="area"
                            height={280}
                        />
                    </div>
                </div>

                {/* Right Card: AI Insights Sidebar */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 p-6 rounded-3xl text-white flex flex-col justify-between space-y-6">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-400/20 animate-pulse" />
                                <h3 className="text-lg font-extrabold text-white">AI Insights</h3>
                            </div>
                            <Tag color="primary" className="rounded-full font-bold border-primary/50">
                                Live Telemetry
                            </Tag>
                        </div>

                        {/* Progress Metric 1 */}
                        <div className="space-y-4 pt-5">
                            <div>
                                <div className="flex justify-between items-center text-xs mb-1.5">
                                    <span className="text-slate-400 font-semibold">Token Efficiency</span>
                                    <span className="font-extrabold text-emerald-400">+18.2%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="w-[78%] h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                                </div>
                            </div>

                            {/* Progress Metric 2 */}
                            <div>
                                <div className="flex justify-between items-center text-xs mb-1.5">
                                    <span className="text-slate-400 font-semibold">Engagement Lift</span>
                                    <span className="font-extrabold text-purple-400">+34.5%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="w-[85%] h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Quote Callout Box */}
                        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md italic text-xs text-slate-300 leading-relaxed">
                            "AI models are optimizing reach by 22% during peak evening hours."
                        </div>
                    </div>

                    <Button
                        type="primary"
                        icon={<Sparkles className="w-4 h-4 text-purple-300" />}
                        onClick={() => setIsAiModalOpen(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-primary hover:to-indigo-700 border-0 h-11 rounded-2xl font-extrabold text-white shadow-md cursor-pointer"
                    >
                        Ask AI Analyst
                    </Button>
                </div>
            </div>

            {/* 3. Middle Row: Equal Size & Height Grid (50% Platform Performance + 50% Global Activity Heatmap) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Left Card: Platform Performance (Light Mode Cards & Equal Height) */}
                <div className="card p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center justify-between pb-3">
                        <h3 className="text-base font-extrabold text-slate-900">Platform Performance</h3>
                        <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
                    </div>

                    {/* 2x2 Light Mode Card Grid */}
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {PLATFORM_PERFORMANCE_DATA.map((item) => (
                            <div
                                key={item.id}
                                className="border border-slate-200/90 hover:border-primary/60 transition p-4.5 rounded-2xl flex flex-col justify-between space-y-2 group"
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-xl border ${item.iconContainerClass}`}>
                                            {item.icon}
                                        </div>
                                        <span className="font-extrabold text-slate-900 text-xs">{item.platform}</span>
                                    </div>
                                    <span
                                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${item.isUp
                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                            : "text-rose-700 bg-rose-50 border-rose-200"
                                            }`}
                                    >
                                        {item.isUp ? (
                                            <ArrowUpRight className="w-3 h-3" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3" />
                                        )}
                                        {item.change}
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                    <h4 className="text-2xl font-extrabold text-slate-900 group-hover:text-primary transition">
                                        {item.value}
                                    </h4>
                                </div>
                                <MiniPlatformChart data={item.chartData} color={item.chartColor} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Card: Global Activity Heatmap (Equal 50% Width & Height) */}
                <div className="card overflow-hidden flex flex-col justify-between h-full">
                    {/* World Map Container */}
                    <div className="flex-1">
                        <WorldMapDashboard />
                    </div>

                    {/* Footer Banner Light Mode */}
                    <div className="border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                            Primary Region: <strong className="text-slate-900">North America</strong>
                        </span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Growth: +4.2% MoM
                        </span>
                    </div>
                </div>
            </div>

            {/* 4. Bottom Table: AI Efficiency: Token Usage vs. Engagement Lift */}
            <div className="card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4  pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-extrabold text-slate-900">
                                AI Efficiency: Token Usage vs. Engagement Lift
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-primary border border-purple-200">
                                <Sparkles className="w-3 h-3 text-purple-600" /> Optimization Active
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Telemetry breakdown of underlying AI models, token quota burn, and engagement lift multipliers.
                        </p>
                    </div>

                    <Button
                        type="primary"
                        icon={<Sparkles className="w-4 h-4" />}
                        onClick={() => setIsAiModalOpen(true)}
                        className="bg-purple-600 hover:bg-primary text-white font-bold rounded-2xl h-10 cursor-pointer border-0"
                    >
                        Ask AI Analyst →
                    </Button>
                </div>

                <Table
                    columns={tableColumns}
                    dataSource={MOCK_AI_MODELS}
                    pagination={false}
                    className="custom-admin-table"
                />
            </div>

            {/* 5. AI Analyst Drawer / Interactive Dialog */}
            <Drawer
                title={
                    <div className="flex items-center gap-2.5 text-primary">
                        <Sparkles className="w-5 h-5 text-purple-600 fill-purple-100" />
                        <span className="text-base font-bold text-slate-900">AI Growth Analyst</span>
                    </div>
                }
                placement="right"
                onClose={() => setIsAiModalOpen(false)}
                open={isAiModalOpen}
                size="large"
            >
                <div className="space-y-4 text-sm h-full flex flex-col justify-between">
                    <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900 text-xs leading-relaxed">
                            👋 Hello Admin! I am your AI Growth Analyst. Ask me anything about your platform metrics, token efficiency, or regional conversion lift.
                        </div>

                        {aiResponses.map((res, i) => (
                            <div
                                key={i}
                                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${res.startsWith("Q:")
                                    ? "bg-slate-100 text-slate-800 font-bold ml-6"
                                    : "bg-purple-900 text-white mr-6 shadow-xs"
                                    }`}
                            >
                                {res}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAskAi} className="flex gap-2 pt-4 border-t border-slate-100">
                        <Input
                            placeholder="Ask AI Analyst (e.g. Why did MRR jump?)..."
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            className="rounded-xl h-11"
                        />
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<Send className="w-4 h-4" />}
                            className="h-11 rounded-xl bg-purple-600 font-bold cursor-pointer"
                        />
                    </form>
                </div>
            </Drawer>
        </div>
    );
}

export default function Analytics() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    // colorPrimary: "#7C3AED",
                    colorPrimary: "var(--primary)",
                    borderRadius: 16,
                    colorBgContainer: "#ffffff",
                    fontFamily: "var(--font-geist-sans), 'DM Sans', sans-serif",
                },
            }}
        >
            <App>
                <AnalyticsContent />
            </App>
        </ConfigProvider>
    );
}
