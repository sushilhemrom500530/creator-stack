"use client";

import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Eye, 
    MousePointer, 
    Share2, 
    ArrowUpRight, 
    ArrowDownRight,
    Calendar
} from "lucide-react";

export default function AnalyticsComponent() {
    const stats = [
        { title: "Total Impressions", value: "128,420", change: "+14.2%", isPositive: true, icon: Eye },
        { title: "Active Audience", value: "24,890", change: "+8.7%", isPositive: true, icon: Users },
        { title: "Link Clicks", value: "3,412", change: "+22.5%", isPositive: true, icon: MousePointer },
        { title: "Engagement Rate", value: "4.8%", change: "-0.4%", isPositive: false, icon: Share2 },
    ];

    const topPosts = [
        { title: "Top 10 Productivity Tools for Digital Creators in 2026", platform: "LinkedIn", reach: "18.4K", engagement: "6.2%" },
        { title: "Launching our new Creator Stack API suite today! 🚀", platform: "Twitter / X", reach: "14.2K", engagement: "8.1%" },
        { title: "How to automate your content schedule effortlessly", platform: "Facebook", reach: "9.8K", engagement: "4.5%" },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-primary" /> Analytics Overview
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Track key performance metrics and audience growth across channels</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-medium text-slate-600">
                    <button className="px-3 py-1.5 rounded-lg bg-white shadow-xs text-slate-800 font-semibold">Last 30 Days</button>
                    <button className="px-3 py-1.5 rounded-lg hover:text-slate-800">Last 7 Days</button>
                    <button className="px-3 py-1.5 rounded-lg hover:text-slate-800">This Year</button>
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

            {/* Graph Visualizer Placeholder */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Audience Growth & Engagement</h3>
                        <p className="text-xs text-slate-500">Daily breakdown of impressions vs interactions</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Impressions
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Clicks
                        </div>
                    </div>
                </div>

                <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-end justify-between p-6 gap-2">
                    {[40, 65, 45, 80, 55, 90, 75, 85, 95, 60, 70, 100].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                            <div className="w-full bg-primary/20 hover:bg-primary/40 transition rounded-t-md" style={{ height: `${h}%` }}></div>
                            <span className="text-[10px] text-slate-400 font-medium">{`Day ${i+1}`}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Performing Content */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Top Performing Posts</h3>
                <div className="divide-y divide-slate-100">
                    {topPosts.map((post, idx) => (
                        <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-slate-800 hover:text-primary cursor-pointer">{post.title}</h4>
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                                    {post.platform}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-slate-500">
                                <div>Reach: <strong className="text-slate-800">{post.reach}</strong></div>
                                <div>Rate: <strong className="text-emerald-600">{post.engagement}</strong></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
