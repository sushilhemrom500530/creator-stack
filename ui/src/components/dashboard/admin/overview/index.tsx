"use client";

import dynamic from "next/dynamic";
import { message } from "antd";
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
    Zap,
    BarChart3,
    PieChart,
    Clock,
    UserCheck,
    Radio,
    Send,
} from "lucide-react";
import WorldMapDashboard from "@/components/common/global-map";
import { StatsGrid, StatItem } from "@/components/common/stats-card";

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


export default function AdminOverview() {
    const [messageApi, contextHolder] = message.useMessage();

    // Top 8 KPI Overview Stats (JSON Data)
    const statsData: StatItem[] = [
        {
            id: "gross-revenue",
            title: "Gross Revenue",
            value: "$148,290",
            icon: DollarSign,
            color: "emerald",
            subtext: "+18.4% vs last month",
            subIcon: TrendingUp,
        },
        {
            id: "monthly-mrr",
            title: "Monthly MRR",
            value: "$34,850",
            icon: BarChart3,
            color: "purple",
            subtext: "+12.1% growth rate",
            subIcon: TrendingUp,
        },
        {
            id: "total-users",
            title: "Total Users",
            value: "24,580",
            icon: Users,
            color: "indigo",
            subtext: "+1,240 new registered",
            subIcon: TrendingUp,
        },
        {
            id: "running-users",
            title: "Running Users",
            value: "4,890",
            icon: Activity,
            color: "emerald",
            subtext: "Active live sessions",
            subIcon: CheckCircle2,
            isLive: true,
        },
        {
            id: "total-creators",
            title: "Total Creators",
            value: "12,840",
            icon: UserCheck,
            color: "blue",
            subtext: "+840 new this week",
            subIcon: UserCheck,
        },
        {
            id: "queued-broadcasts",
            title: "Queued Broadcasts",
            value: "15,420",
            icon: Send,
            color: "amber",
            subtext: "Scheduled for 24h dispatch",
            subIcon: Clock,
        },
        {
            id: "connected-hubs",
            title: "Connected Hubs",
            value: "48,190",
            icon: Share2,
            color: "sky",
            subtext: "99.8% active sync",
            subIcon: Zap,
        },
        {
            id: "system-uptime",
            title: "System Uptime",
            value: "99.98%",
            icon: ShieldCheck,
            color: "emerald",
            subtext: "All systems nominal",
            subIcon: CheckCircle2,
        },
    ];

    // Revenue & User Growth Chart Config (ApexCharts)
    const growthChartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: "area",
            toolbar: { show: false },
            fontFamily: "inherit",
            sparkline: { enabled: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#6366f1", "#10b981"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            labels: { style: { colors: "#64748b", fontSize: "11px" } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: "#64748b", fontSize: "11px" },
                formatter: (val) => `$${val}k`,
            },
        },
        legend: { position: "top", horizontalAlign: "right" },
        grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
        tooltip: { theme: "light" },
    };

    const growthChartSeries = [
        {
            name: "Platform Revenue ($k)",
            data: [32, 45, 54, 68, 84, 98, 112, 125, 138, 148, 162, 180]
        },
        {
            name: "New Creators Joined (k)",
            data: [1.2, 1.8, 2.4, 3.1, 4.2, 5.0, 6.2, 7.5, 8.4, 9.8, 11.0, 12.8]
        },
    ];

    // Subscription Distribution Donut Chart (ApexCharts)
    const donutChartOptions: ApexCharts.ApexOptions = {
        chart: { type: "donut" },
        labels: ["Pro Tier ($49/mo)", "Enterprise ($299/mo)", "Starter Free"],
        colors: ["#8b5cf6", "#3b82f6", "#e2e8f0"],
        legend: { position: "bottom", fontSize: "12px" },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: "72%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total Creators",
                            formatter: () => "12.8K",
                        },
                    },
                },
            },
        },
    };

    const donutChartSeries = [54, 18, 28];

    return (
        <div className="space-y-6 font-sans">
            {contextHolder}

            {/* 1. TOP EXPANDED METRICS OVERVIEW (8 KPI STAT CARDS GRID) */}
            <StatsGrid stats={statsData} />

            {/* 2. REAL-TIME SYSTEM HEALTH & ALERTS BANNER */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold flex items-center gap-2">
                            Global Platform Health Monitor <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                            Post Queue Engine dispatches 1,240 items/min • Instagram Graph API experiencing 1.4% rate limits
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => messageApi.success("Triggered global API diagnostic scan")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Run System Audit
                    </button>
                </div>
            </div>

            {/* 3. APEXCHARTS ANALYTICS SECTION (REVENUE VS CREATORS & SUBSCRIPTION DISTRIBUTION) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue & Creator Growth (8 Cols) */}
                <div className="lg:col-span-8 card p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Platform Revenue & Creator Growth</h3>
                            <p className="text-xs text-slate-400">Monthly breakdown of gross revenue vs new registered creators</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                            2026 Financial Telemetry
                        </span>
                    </div>

                    <div className="h-72">
                        <ReactApexChart
                            options={growthChartOptions}
                            series={growthChartSeries}
                            type="area"
                            height="100%"
                        />
                    </div>
                </div>

                {/* Subscription Tier Distribution (4 Cols) */}
                <div className="lg:col-span-4 card p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-purple-600" /> Plan Distribution
                            </h3>
                            <span className="text-xs text-slate-400">12,840 Accounts</span>
                        </div>

                        <div className="h-64 pt-2">
                            <ReactApexChart
                                options={donutChartOptions}
                                series={donutChartSeries}
                                type="donut"
                                height="100%"
                            />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
                        <div>
                            <span className="text-slate-400 block text-[10px]">PRO</span>
                            <span className="font-bold text-purple-600">54%</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px]">ENTERPRISE</span>
                            <span className="font-bold text-blue-600">18%</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px]">FREE</span>
                            <span className="font-bold text-slate-600">28%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. REGIONAL GROWTH & RECENT PLATFORM ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WorldMapDashboard />

                {/* Recent Platform Activity Log (6 Cols) */}
                <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" /> Platform Security & Activity Log
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">Live Updates</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                        {[
                            { icon: UserCheck, color: "text-emerald-600 bg-emerald-50", title: "New Enterprise Subscribed", desc: "Studio Agency acquired Enterprise Annual Plan", time: "2 mins ago" },
                            { icon: Share2, color: "text-blue-600 bg-blue-50", title: "Broadcast Peak Executed", desc: "18,400 simultaneous posts published across LinkedIn & Twitter", time: "14 mins ago" },
                            { icon: AlertTriangle, color: "text-amber-600 bg-amber-50", title: "Instagram API Throttling", desc: "Rate limit triggered for token #IG-9042 (Auto-retry queued)", time: "32 mins ago" },
                            { icon: ShieldCheck, color: "text-purple-600 bg-purple-50", title: "Root OAuth Token Rotated", desc: "Admin key updated for secure telemetry stream", time: "1 hour ago" },
                        ].map((log, lIdx) => {
                            const LIcon = log.icon;
                            return (
                                <div key={lIdx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                                    <div className={`p-2 rounded-xl shrink-0 ${log.color}`}>
                                        <LIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-800">{log.title}</h4>
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                                <Clock className="w-3 h-3" /> {log.time}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 leading-relaxed">{log.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}