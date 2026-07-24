"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
    BarChart3,
    TrendingUp,
    Users,
    Eye,
    MousePointer,
    Share2,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Globe,
    ExternalLink,
    Sparkles
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import WorldMapDashboard from "./global-map";

// Dynamically import ApexCharts with SSR disabled for Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsComponent() {
    const [isMounted, setIsMounted] = useState(false);
    const [hoveredGeoId, setHoveredGeoId] = useState<string | null>(null);

    const geoRegions = [
        { id: "us", country: "United States", flag: "🇺🇸", percentage: 42, reach: "53.9k", lat: 37.0902, lng: -95.7129 },
        { id: "de", country: "Germany", flag: "🇩🇪", percentage: 18, reach: "23.1k", lat: 51.1657, lng: 10.4515 },
        { id: "in", country: "India", flag: "🇮🇳", percentage: 16, reach: "20.5k", lat: 20.5937, lng: 78.9629 },
        { id: "uk", country: "United Kingdom", flag: "🇬🇧", percentage: 12, reach: "15.4k", lat: 55.3781, lng: -3.4360 },
        { id: "br", country: "Brazil", flag: "🇧🇷", percentage: 7, reach: "9.0k", lat: -14.2350, lng: -51.9253 },
        { id: "au", country: "Australia", flag: "🇦🇺", percentage: 5, reach: "6.5k", lat: -25.2744, lng: 133.7751 }
    ];

    const getMapCoords = (lat: number, lng: number) => {
        const x = ((lng + 180) / 360) * 100;
        const y = ((90 - lat) / 180) * 100;
        return {
            x: `${Math.max(5, Math.min(95, x)).toFixed(2)}%`,
            y: `${Math.max(5, Math.min(95, y)).toFixed(2)}%`
        };
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const stats = [
        { title: "Total Impressions", value: "128,420", change: "+14.2%", isPositive: true, icon: Eye },
        { title: "Active Audience", value: "24,890", change: "+8.7%", isPositive: true, icon: Users },
        { title: "Link Clicks", value: "3,412", change: "+22.5%", isPositive: true, icon: MousePointer },
        { title: "Engagement Rate", value: "4.8%", change: "-0.4%", isPositive: false, icon: Share2 },
    ];

    const topPosts = [
        {
            rank: "#1",
            title: "Top 10 Productivity Tools for Digital Creators in 2026",
            platform: "LinkedIn",
            platformIcon: FaLinkedin,
            platformColor: "text-blue-600 bg-blue-50 border-blue-200",
            reach: "18.4K",
            clicks: "1,420",
            engagement: "6.2%",
            progress: 85
        },
        {
            rank: "#2",
            title: "Launching our new Creator Stack API suite today! 🚀",
            platform: "Twitter / X",
            platformIcon: FaTwitter,
            platformColor: "text-sky-500 bg-sky-50 border-sky-200",
            reach: "14.2K",
            clicks: "980",
            engagement: "8.1%",
            progress: 92
        },
        {
            rank: "#3",
            title: "How to automate your content schedule effortlessly",
            platform: "Facebook",
            platformIcon: FaFacebook,
            platformColor: "text-blue-500 bg-blue-50 border-blue-200",
            reach: "9.8K",
            clicks: "640",
            engagement: "4.5%",
            progress: 68
        },
        {
            rank: "#4",
            title: "Behind the scenes of building AI-assisted content workflows 🧠✨",
            platform: "Instagram",
            platformIcon: FaInstagram,
            platformColor: "text-pink-600 bg-pink-50 border-pink-200",
            reach: "8.5K",
            clicks: "520",
            engagement: "7.4%",
            progress: 78
        }
    ];

    // Growth Chart ApexOptions & Series
    const growthChartSeries = [
        {
            name: "Impressions",
            data: [4200, 6500, 4500, 8000, 5500, 9000, 7500, 8500, 9500, 6000, 7000, 10200]
        },
        {
            name: "Clicks",
            data: [1200, 2100, 1400, 3100, 2000, 3800, 2900, 3400, 4100, 2200, 2800, 4800]
        }
    ];

    const growthChartOptions: any = {
        chart: {
            type: "area",
            toolbar: { show: false },
            fontFamily: "inherit",
            sparkline: { enabled: false }
        },
        colors: ["#3B82F6", "#10B981"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        xaxis: {
            categories: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12"],
            labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: "#94A3B8", fontSize: "11px" },
                formatter: (val: number) => `${(val / 1000).toFixed(1)}k`
            }
        },
        grid: { borderColor: "#F1F5F9", strokeDashArray: 4 },
        legend: { show: false },
        tooltip: {
            theme: "light",
            style: { fontSize: "12px" }
        }
    };

    // Geo Chart ApexOptions & Series
    const geoChartSeries = [38, 24, 18, 12, 8];

    const geoChartOptions: any = {
        chart: {
            type: "donut",
            fontFamily: "inherit"
        },
        labels: ["United States 🇺🇸", "United Kingdom 🇬🇧", "India 🇮🇳", "Germany 🇩🇪", "Others 🌍"],
        colors: ["#4F46E5", "#3B82F6", "#10B981", "#F59E0B", "#94A3B8"],
        legend: {
            position: "bottom",
            fontSize: "11px",
            labels: { colors: "#475569" },
            itemMargin: { horizontal: 6, vertical: 3 }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "68%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total Reach",
                            color: "#64748B",
                            fontSize: "11px",
                            formatter: () => "128.4k"
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        stroke: { show: false }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-primary" /> Analytics Overview
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Track key performance metrics and audience growth across channels</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-medium text-slate-600">
                    <button className="px-3 py-1.5 rounded-lg bg-white shadow-xs text-slate-800 font-semibold cursor-pointer">Last 30 Days</button>
                    <button className="px-3 py-1.5 rounded-lg hover:text-slate-800 cursor-pointer">Last 7 Days</button>
                    <button className="px-3 py-1.5 rounded-lg hover:text-slate-800 cursor-pointer">This Year</button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">{item.title}</span>
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-slate-800">{item.value}</span>
                                <span className={`flex items-center text-xs font-bold ${item.isPositive ? "text-emerald-600" : "text-rose-500"}`}>
                                    {item.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                    {item.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Apex Charts Section: Left (Growth & Engagement) & Right (Audience Geo) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth & Engagement Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Audience Growth & Engagement</h3>
                            <p className="text-xs text-slate-500">Daily breakdown of impressions vs interactions</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Impressions
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Clicks
                            </div>
                        </div>
                    </div>

                    <div className="h-72 w-full pt-2">
                        {isMounted && (
                            <Chart
                                options={growthChartOptions}
                                series={growthChartSeries}
                                type="area"
                                height="100%"
                            />
                        )}
                    </div>
                </div>

                {/* Audience Geo Dynamic Map Visualizer Card */}
                <WorldMapDashboard />

            </div>

            {/* Refined Top Performing Content */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" /> Top Performing Posts
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Highest reach and conversion posts over the last 30 days</p>
                    </div>
                    <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                        View All Posts →
                    </span>
                </div>

                <div className="space-y-3">
                    {topPosts.map((post, idx) => {
                        const Icon = post.platformIcon;
                        return (
                            <div
                                key={idx}
                                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3.5 max-w-xl">
                                    <span className="w-7 h-7 rounded-lg bg-slate-200/70 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                                        {post.rank}
                                    </span>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold text-slate-800 hover:text-primary transition cursor-pointer line-clamp-1">
                                            {post.title}
                                        </h4>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium border ${post.platformColor}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                            {post.platform}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 text-xs text-slate-600 border-t md:border-t-0 pt-2 md:pt-0">
                                    <div className="text-center md:text-left">
                                        <p className="text-slate-400 text-[11px]">Reach</p>
                                        <p className="font-bold text-slate-800 text-sm mt-0.5">{post.reach}</p>
                                    </div>

                                    <div className="text-center md:text-left">
                                        <p className="text-slate-400 text-[11px]">Clicks</p>
                                        <p className="font-bold text-blue-600 text-sm mt-0.5">{post.clicks}</p>
                                    </div>

                                    <div className="min-w-28 text-right">
                                        <p className="text-slate-400 text-[11px] mb-1">Engagement: <strong className="text-emerald-600">{post.engagement}</strong></p>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                                                style={{ width: `${post.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
