"use client";

import React, { useState } from "react";
import {
    Users,
    Calendar,
    CheckCircle2,
    TrendingUp,
    Heart,
    DollarSign,
    Sparkles,
    ArrowRight
} from "lucide-react";

interface StatItem {
    label: string;
    value: string;
    change: string;
    changeType: "positive" | "info" | "neutral";
    icon: React.ElementType;
}

export default function Overview() {
    const [selectedTab, setSelectedTab] = useState<"week" | "month" | "year">("month");

    const stats: StatItem[] = [
        {
            label: "Followers",
            value: "128.4k",
            change: "+12%",
            changeType: "positive",
            icon: Users,
        },
        {
            label: "Scheduled",
            value: "42",
            change: "24 Left",
            changeType: "info",
            icon: Calendar,
        },
        {
            label: "Published",
            value: "156",
            change: "This Month",
            changeType: "neutral",
            icon: CheckCircle2,
        },
        {
            label: "Reach",
            value: "2.4M",
            change: "+8.4k",
            changeType: "positive",
            icon: TrendingUp,
        },
        {
            label: "Engagement",
            value: "5.8%",
            change: "+4.2%",
            changeType: "positive",
            icon: Heart,
        },
        {
            label: "Revenue",
            value: "$14.2k",
            change: "+18%",
            changeType: "positive",
            icon: DollarSign,
        },
    ];

    // 9 pairs of bars reflecting the reference image layout.
    const chartData = [
        { label: "01 May", purpleHeight: 48, tealHeight: 62 },
        { label: "", purpleHeight: 32, tealHeight: 74 },
        { label: "07 May", purpleHeight: 45, tealHeight: 88 },
        { label: "", purpleHeight: 65, tealHeight: 52 },
        { label: "14 May", purpleHeight: 36, tealHeight: 82 },
        { label: "", purpleHeight: 28, tealHeight: 48 },
        { label: "21 May", purpleHeight: 40, tealHeight: 78 },
        { label: "", purpleHeight: 58, tealHeight: 50 },
        { label: "28 May", purpleHeight: 52, tealHeight: 94 },
    ];

    const aiTips = [
        {
            category: "Content Tip",
            tip: "Post a 'Behind the Scenes' video today at 3:00 PM for 24% higher engagement.",
            tagColor: "text-purple-600 dark:text-purple-400",
        },
        {
            category: "Audience Insight",
            tip: "Your tech tutorial posts are trending with the 'Developer' demographic.",
            tagColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
            category: "Optimization",
            tip: "Refine your bio links to include the new product launch for better conversion.",
            tagColor: "text-indigo-600 dark:text-indigo-400",
        },
    ];

    return (
        <div className="space-y-6 select-none font-primary">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 p-5 rounded-2xl flex flex-col justify-between h-32 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className="text-slate-400 dark:text-zinc-500 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer">
                                    <IconComponent size={20} />
                                </span>
                                <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.changeType === "positive"
                                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : stat.changeType === "info"
                                                ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                                : "bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"
                                        }`}
                                >
                                    {stat.change}
                                </span>
                            </div>

                            <div className="mt-4 space-y-0.5">
                                <p className="text-xs font-medium text-slate-400 dark:text-zinc-500 tracking-wide uppercase">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Performance + AI Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Platform Performance Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/65 rounded-3xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                            Platform Performance
                        </h2>

                        {/* Period Selector Pills */}
                        <div className="flex items-center bg-slate-50 dark:bg-[#121316] p-1 rounded-xl border border-slate-100 dark:border-zinc-800/40">
                            {(["week", "month", "year"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all duration-300 ${selectedTab === tab
                                            ? "bg-[#C39DFE]/25 dark:bg-[#9760EC]/30 text-purple-700 dark:text-[#E2D6FF] shadow-xs"
                                            : "text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-350"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart Playground */}
                    <div className="relative flex-1 min-h-[300px] flex flex-col justify-between pt-6">
                        {/* Horizontal reference grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 select-none">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-full border-t border-dashed border-slate-100 dark:border-[#27272A]/40"
                                />
                            ))}
                        </div>

                        {/* Rendering core bars */}
                        <div className="relative flex-1 flex items-end justify-between px-2 pb-2 h-[240px]">
                            {chartData.map((data, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                                        {/* Purple Bar */}
                                        <div
                                            style={{ height: `${data.purpleHeight}%` }}
                                            className="w-4 rounded-xl bg-purple-200/90 dark:bg-[#796F9E]/50 group-hover:bg-purple-300 dark:group-hover:bg-[#796F9E] transition-all duration-500 cursor-pointer relative"
                                            title={`Metric A: ${data.purpleHeight}%`}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                A: {data.purpleHeight}%
                                            </div>
                                        </div>
                                        {/* Teal Bar */}
                                        <div
                                            style={{ height: `${data.tealHeight}%` }}
                                            className="w-4 rounded-xl bg-teal-500/85 dark:bg-[#2A8575] group-hover:bg-teal-400 dark:group-hover:bg-[#349D8A] transition-all duration-500 cursor-pointer relative"
                                            title={`Metric B: ${data.tealHeight}%`}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                B: {data.tealHeight}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart Dates Axis */}
                        <div className="w-full flex justify-between px-2 pt-2 border-t border-slate-100 dark:border-zinc-800/40 text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                            {chartData.map((data, idx) => (
                                <div key={idx} className="flex-1 text-center font-medium">
                                    {data.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Growth Engine Insights Panel */}
                <div className="bg-white dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/65 rounded-3xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                                AI Growth Engine
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {aiTips.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-50/50 dark:bg-[#121316]/50 border border-slate-100 dark:border-zinc-800/40 rounded-2xl p-4 flex flex-col justify-between h-[120px] hover:border-purple-300 dark:hover:border-[#9760EC]/40 hover:bg-slate-50 dark:hover:bg-[#121316] transition-all duration-300 group cursor-pointer"
                                >
                                    <div>
                                        <span className={`text-xs font-mono font-bold tracking-tight ${item.tagColor}`}>
                                            {item.category}
                                        </span>
                                        <p className="text-xs mt-1.5 text-slate-650 dark:text-zinc-350 leading-relaxed font-medium">
                                            {item.tip}
                                        </p>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-650 group-hover:translate-x-1.5 transition-all duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}