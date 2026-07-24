"use client";

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
    Radio,
    Send,
    HardDrive
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

export default function AdminOverview() {

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
        { name: "Platform Revenue ($k)", data: [32, 45, 54, 68, 84, 98, 112, 125, 138, 148, 162, 180] },
        { name: "New Creators Joined (k)", data: [1.2, 1.8, 2.4, 3.1, 4.2, 5.0, 6.2, 7.5, 8.4, 9.8, 11.0, 12.8] },
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

            {/* 1. TOP EXPANDED METRICS OVERVIEW (8 KPI STAT CARDS GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Gross Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">$148,290</h3>
                        <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last month
                        </p>
                    </div>
                </div>

                {/* 2. Monthly MRR */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly MRR</span>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">$34,850</h3>
                        <p className="text-xs text-purple-600 font-semibold mt-0.5 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +12.1% growth rate
                        </p>
                    </div>
                </div>

                {/* 3. Total Registered Users */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">24,580</h3>
                        <p className="text-xs text-indigo-600 font-semibold mt-0.5 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +1,240 new registered
                        </p>
                    </div>
                </div>

                {/* 4. Running / Active Online Users */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Running Users</span>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            4,890 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                        </h3>
                        <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active live sessions
                        </p>
                    </div>
                </div>

                {/* 5. Total Active Creators */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Creators</span>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <UserCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">12,840</h3>
                        <p className="text-xs text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" /> +840 new this week
                        </p>
                    </div>
                </div>

                {/* 6. Scheduled Broadcast Queue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Queued Broadcasts</span>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <Send className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">15,420</h3>
                        <p className="text-xs text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Scheduled for 24h dispatch
                        </p>
                    </div>
                </div>

                {/* 7. Connected Social Hubs */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Hubs</span>
                        <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                            <Share2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">48,190</h3>
                        <p className="text-xs text-sky-600 font-semibold mt-0.5 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" /> 99.8% active sync
                        </p>
                    </div>
                </div>

                {/* 8. System Uptime & Security */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Uptime</span>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">99.98%</h3>
                        <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> All systems nominal
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. REAL-TIME SYSTEM HEALTH & ALERTS BANNER */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
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
                        onClick={() => message.success("Triggered global API diagnostic scan")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Run System Audit
                    </button>
                </div>
            </div>

            {/* 3. APEXCHARTS ANALYTICS SECTION (REVENUE VS CREATORS & SUBSCRIPTION DISTRIBUTION) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue & Creator Growth (8 Cols) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
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
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Growth by Region (6 Cols) */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" /> Geographic Creator Reach
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">Global Breakdown</span>
                    </div>

                    <div className="space-y-4 text-xs">
                        {[
                            { flag: "🇺🇸", region: "North America", count: "5,392 creators", percent: 42, color: "bg-blue-500" },
                            { flag: "🇪🇺", region: "Europe & UK", count: "3,595 creators", percent: 28, color: "bg-purple-500" },
                            { flag: "🇸🇬", region: "Asia Pacific (APAC)", count: "2,311 creators", percent: 18, color: "bg-emerald-500" },
                            { flag: "🇧🇷", region: "Latin America (LATAM)", count: "1,027 creators", percent: 8, color: "bg-amber-500" },
                            { flag: "🌍", region: "Middle East & Other", count: "515 creators", percent: 4, color: "bg-slate-400" },
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between text-slate-700">
                                    <span className="font-bold flex items-center gap-2">
                                        <span className="text-base">{item.flag}</span> {item.region}
                                    </span>
                                    <span className="font-mono text-slate-500">{item.count} ({item.percent}%)</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Platform Activity Log (6 Cols) */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
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