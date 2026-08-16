"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
    BarChart3,
    Users,
    Eye,
    MousePointer,
    Share2,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Smile,
    Clock,
    Zap,
    RefreshCw,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaThreads, FaWhatsapp } from "react-icons/fa6";
import WorldMapDashboard from "../../../common/global-map";
import { analyticsApi, getActiveWorkspaceId } from "@/lib/api";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsComponent() {
    const [isMounted, setIsMounted] = useState(false);
    const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
    const [isLoading, setIsLoading] = useState(false);

    const [overviewData, setOverviewData] = useState<any>(null);
    const [trendsData, setTrendsData] = useState<{ categories: string[]; series: any[] }>({
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        series: [
            { name: "Impressions", data: [14200, 18500, 22400, 19800, 28600, 31200, 26900] },
            { name: "Engagements", data: [3200, 4100, 5600, 4800, 7200, 8400, 6900] },
            { name: "Link Clicks", data: [1800, 2200, 2900, 2400, 3900, 4300, 3600] },
        ],
    });
    const [sentimentData, setSentimentData] = useState<any>(null);
    const [bestTimes, setBestTimes] = useState<any[]>([]);

    const workspaceId = getActiveWorkspaceId();

    const loadAnalytics = useCallback(async () => {
        if (!workspaceId) return;
        setIsLoading(true);
        try {
            const [overview, trends, sentiment, timing] = await Promise.allSettled([
                analyticsApi.getOverview(workspaceId, timeframe),
                analyticsApi.getTrends(workspaceId, timeframe === "7d" ? 7 : 30),
                analyticsApi.getSentiment(workspaceId),
                analyticsApi.getBestTimeToPost(workspaceId),
            ]);

            if (overview.status === "fulfilled") setOverviewData(overview.value);
            if (trends.status === "fulfilled") setTrendsData(trends.value);
            if (sentiment.status === "fulfilled") setSentimentData(sentiment.value);
            if (timing.status === "fulfilled") setBestTimes(timing.value.recommendations || []);
        } catch (err: any) {
            console.log("Error loading analytics:", err.message);
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId, timeframe]);

    useEffect(() => {
        setIsMounted(true);
        loadAnalytics();
    }, [loadAnalytics]);

    const stats = overviewData?.stats || [
        { title: "Total Impressions", value: "128,420", change: "+14.2%", isPositive: true, icon: Eye },
        { title: "Total Reach", value: "94,850", change: "+11.8%", isPositive: true, icon: Users },
        { title: "Total Link Clicks", value: "18,620", change: "+19.4%", isPositive: true, icon: MousePointer },
        { title: "Engagement Rate", value: "5.8%", change: "+2.1%", isPositive: true, icon: Share2 },
    ];

    const growthChartOptions: any = {
        chart: {
            type: "area",
            toolbar: { show: false },
            fontFamily: "inherit",
            sparkline: { enabled: false }
        },
        colors: ["#8B5CF6", "#10B981", "#3B82F6"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        xaxis: {
            categories: trendsData.categories,
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

    const topPosts = [
        {
            rank: "#1",
            title: "Top 10 Productivity Tools for Digital Creators in 2026",
            platform: "LinkedIn",
            platformIcon: FaLinkedin,
            platformColor: "text-blue-600 bg-blue-50 border-blue-200",
            reach: "28.4K",
            clicks: "2,420",
            engagement: "6.8%",
            progress: 88
        },
        {
            rank: "#2",
            title: "Launching our new Creator Stack API suite today! 🚀",
            platform: "Twitter / X",
            platformIcon: FaTwitter,
            platformColor: "text-sky-500 bg-sky-50 border-sky-200",
            reach: "21.2K",
            clicks: "1,980",
            engagement: "8.4%",
            progress: 94
        },
        {
            rank: "#3",
            title: "How to automate your content schedule effortlessly",
            platform: "Facebook",
            platformIcon: FaFacebook,
            platformColor: "text-blue-500 bg-blue-50 border-blue-200",
            reach: "14.8K",
            clicks: "1,140",
            engagement: "5.2%",
            progress: 72
        },
        {
            rank: "#4",
            title: "Behind the scenes of building AI-assisted content workflows 🧠✨",
            platform: "Instagram",
            platformIcon: FaInstagram,
            platformColor: "text-pink-600 bg-pink-50 border-pink-200",
            reach: "12.5K",
            clicks: "890",
            engagement: "7.9%",
            progress: 81
        }
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-purple-600" /> Cross-Platform Analytics Studio
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Track impressions, conversions, audience geography, and social sentiment across all channels
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadAnalytics}
                        disabled={isLoading}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        title="Refresh Analytics"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
                        <button
                            onClick={() => setTimeframe("7d")}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${timeframe === "7d" ? "bg-white shadow-xs text-purple-600" : "hover:text-slate-800"}`}
                        >
                            7 Days
                        </button>
                        <button
                            onClick={() => setTimeframe("30d")}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${timeframe === "30d" ? "bg-white shadow-xs text-purple-600" : "hover:text-slate-800"}`}
                        >
                            30 Days
                        </button>
                        <button
                            onClick={() => setTimeframe("90d")}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${timeframe === "90d" ? "bg-white shadow-xs text-purple-600" : "hover:text-slate-800"}`}
                        >
                            90 Days
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((item: any, index: number) => {
                    const iconMap: any = {
                        "Total Impressions": Eye,
                        "Total Reach": Users,
                        "Total Link Clicks": MousePointer,
                        "Engagement Rate": Share2,
                    };
                    const Icon = iconMap[item.title] || Eye;

                    return (
                        <div key={index} className="card p-6 space-y-3 hover:-translate-y-1 transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">{item.title}</span>
                                <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
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

            {/* Main Visuals Grid: Trends Chart & World Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Growth & Engagement Chart */}
                <div className="card p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                Omnichannel Performance Trends
                            </h3>
                            <p className="text-xs text-slate-500">
                                Timeline breakdown of impressions, engagements, and click-throughs
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Impressions
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Engagements
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Clicks
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full pt-2 min-h-[300px]">
                        {isMounted && (
                            <Chart
                                options={growthChartOptions}
                                series={trendsData.series}
                                type="area"
                                height="100%"
                            />
                        )}
                    </div>
                </div>

                {/* Audience Geo Dynamic Map Visualizer Card */}
                <div className="h-full">
                    <WorldMapDashboard />
                </div>
            </div>

            {/* AI Best Time to Post & Social Sentiment Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Social Sentiment Analysis Card (6 Cols) */}
                <div className="lg:col-span-6 card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Smile className="w-5 h-5 text-emerald-600" />
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Audience Sentiment & Reaction</h3>
                                <p className="text-xs text-slate-400">Natural language sentiment scoring across comments</p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                            Score: {sentimentData?.overallScore || 8.4} / 10
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-emerald-600">Positive: {sentimentData?.positive || 74}%</span>
                            <span className="text-slate-500">Neutral: {sentimentData?.neutral || 19}%</span>
                            <span className="text-rose-500">Negative: {sentimentData?.negative || 7}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${sentimentData?.positive || 74}%` }} />
                            <div className="bg-slate-300 h-full" style={{ width: `${sentimentData?.neutral || 19}%` }} />
                            <div className="bg-rose-500 h-full" style={{ width: `${sentimentData?.negative || 7}%` }} />
                        </div>
                    </div>

                    <div className="pt-2 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Conversation Themes</p>
                        <div className="grid grid-cols-2 gap-2">
                            {(sentimentData?.topThemes || [
                                { theme: "Product Usability", sentiment: "Positive (92%)" },
                                { theme: "Content Strategy", sentiment: "Positive (88%)" },
                                { theme: "Feature Requests", sentiment: "Neutral (65%)" },
                                { theme: "Pricing Inquiries", sentiment: "Neutral (58%)" },
                            ]).map((item: any, idx: number) => (
                                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                    <p className="font-semibold text-slate-800">{item.theme}</p>
                                    <p className="text-slate-500 text-[11px] mt-0.5">{item.sentiment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Best Time to Post Recommendations (6 Cols) */}
                <div className="lg:col-span-6 card p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <div>
                                <h3 className="text-base font-bold text-slate-800">AI Best Time to Post</h3>
                                <p className="text-xs text-slate-400">Peak engagement windows tailored per network</p>
                            </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
                            AI Calibrated
                        </span>
                    </div>

                    <div className="space-y-3">
                        {(bestTimes.length > 0 ? bestTimes : [
                            { platform: "linkedin", dayOfWeek: "Wednesday & Thursday", bestTime: "8:30 AM & 12:00 PM EST", expectedBoost: "+48% higher engagement rate" },
                            { platform: "x", dayOfWeek: "Tuesday & Thursday", bestTime: "9:00 AM & 1:00 PM EST", expectedBoost: "+34% higher impressions" },
                            { platform: "instagram", dayOfWeek: "Friday & Sunday", bestTime: "11:00 AM & 7:00 PM EST", expectedBoost: "+29% more comments & saves" },
                            { platform: "threads", dayOfWeek: "Monday & Wednesday", bestTime: "10:00 AM & 3:00 PM EST", expectedBoost: "+22% reach increase" },
                        ]).map((rec: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs">
                                <div className="space-y-0.5">
                                    <p className="font-bold text-slate-800 capitalize flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                                        {rec.platform} • {rec.dayOfWeek}
                                    </p>
                                    <p className="text-slate-500">{rec.bestTime}</p>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                    {rec.expectedBoost}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Performing Content Section */}
            <div className="card p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" /> Top Performing Posts
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Highest reach and conversion posts over the selected window</p>
                    </div>
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
                                        <h4 className="text-sm font-semibold text-slate-800 hover:text-purple-600 transition cursor-pointer line-clamp-1">
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
                                        <p className="font-bold text-purple-600 text-sm mt-0.5">{post.clicks}</p>
                                    </div>

                                    <div className="min-w-28 text-right">
                                        <p className="text-slate-400 text-[11px] mb-1">Engagement: <strong className="text-emerald-600">{post.engagement}</strong></p>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full"
                                                style={{ width: `${post.progress}%` }}
                                            />
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
