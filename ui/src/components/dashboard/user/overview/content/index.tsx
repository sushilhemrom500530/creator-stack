"use client";

import React, { useState } from "react";
import {
    Settings,
    MoreHorizontal,
    Sparkles,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";

interface ContentItem {
    title: string;
    time: string;
    platform: string;
    likes: string;
    status: "Published" | "In Review";
    gradient: string;
}

interface ScheduleDay {
    weekday: string;
    dayNum: number;
    active?: boolean;
    hasEvent?: boolean;
}

interface EventItem {
    dayVal: number;
    month: string;
    title: string;
    time: string;
    format: string;
    borderColor: string;
}

interface AccountItem {
    name: string;
    status: "Active" | "Re-auth needed";
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
}

interface ActivityItem {
    user: string;
    action: string;
    target: string;
    time: string;
    dotColor: string;
}

export default function UserOverviewContent() {
    const recentContent: ContentItem[] = [
        {
            title: "Future of Generative AI in Soc...",
            time: "2h ago",
            platform: "Instagram",
            likes: "1.2k",
            status: "Published",
            gradient: "from-[#F355C7] to-[#FFAC30]",
        },
        {
            title: "10 Tips for Scaling Your Digit...",
            time: "5h ago",
            platform: "LinkedIn",
            likes: "842",
            status: "In Review",
            gradient: "from-[#0A66C2] to-[#3B82F6]",
        },
        {
            title: "Weekly Product Update: May Edi...",
            time: "Yesterday",
            platform: "Twitter",
            likes: "3.4k",
            status: "Published",
            gradient: "from-[#1DA1F2] to-[#0F1419]",
        },
    ];

    const scheduleDays: ScheduleDay[] = [
        { weekday: "M", dayNum: 28 },
        { weekday: "T", dayNum: 29 },
        { weekday: "W", dayNum: 30 },
        { weekday: "T", dayNum: 1, active: true },
        { weekday: "F", dayNum: 2, hasEvent: true },
        { weekday: "S", dayNum: 3 },
        { weekday: "S", dayNum: 4 },
    ];

    const upEvents: EventItem[] = [
        {
            dayVal: 14,
            month: "MAY",
            title: "Q2 Strategy Reveal",
            time: "02:00 PM",
            format: "Video",
            borderColor: "border-l-[#8B5CF6]",
        },
        {
            dayVal: 15,
            month: "MAY",
            title: "Influencer Collab Post",
            time: "09:00 AM",
            format: "Carousel",
            borderColor: "border-l-[#14B8A6]",
        },
    ];

    const accounts: AccountItem[] = [
        {
            name: "Facebook Page",
            status: "Active",
            icon: FaFacebook,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/10",
        },
        {
            name: "Instagram Business",
            status: "Active",
            icon: FaInstagram,
            iconColor: "text-rose-500",
            bgColor: "bg-rose-50 dark:bg-rose-900/10",
        },
        {
            name: "Twitter / X",
            status: "Re-auth needed",
            icon: FaTwitter,
            iconColor: "text-slate-800 dark:text-zinc-300",
            bgColor: "bg-slate-100 dark:bg-zinc-800/60",
        },
    ];

    const activities: ActivityItem[] = [
        {
            user: "Sarah Miller",
            action: 'approved the draft',
            target: '"Summer Campaign v2"',
            time: "12 minutes ago",
            dotColor: "bg-purple-500",
        },
        {
            user: "AI Assistant",
            action: 'generated 5 new hashtags for your',
            target: 'latest post',
            time: "45 minutes ago",
            dotColor: "bg-emerald-500",
        },
        {
            user: "System",
            action: 'automatically published',
            target: '"Weekend Vibes" to Instagram',
            time: "2 hours ago",
            dotColor: "bg-slate-400 dark:bg-zinc-650",
        },
    ];

    return (
        <div className="space-y-6 relative font-primary">
            {/* Top row cards: Recent Content & Upcoming Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Content Card */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 rounded-3xl p-6 hover:shadow-xs transition-shadow flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                                Recent Content
                            </h2>
                            <button className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                                View All
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                            {recentContent.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Mock Thumbnail Visual Gradient */}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.gradient} flex-shrink-0 relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/10"></div>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-1e0 truncate max-w-[200px] md:max-w-xs">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                                                {item.time} &bull; {item.platform}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 block">
                                                {item.likes}
                                            </span>
                                            <span className="text-[10px] text-slate-450 dark:text-zinc-500 font-medium tracking-wide uppercase">
                                                Likes
                                            </span>
                                        </div>
                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded-full ${item.status === "Published"
                                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Schedule Card */}
                <div className="bg-white dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 rounded-3xl p-6 hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                            Upcoming Schedule
                        </h2>
                        <div className="flex items-center gap-1">
                            <button className="p-1 rounded-lg border border-slate-100 dark:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-[#121316] text-slate-500 dark:text-zinc-400 transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="p-1 rounded-lg border border-slate-100 dark:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-[#121316] text-slate-500 dark:text-zinc-400 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Week Calendar Header */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-6">
                        {scheduleDays.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wide uppercase">
                                    {item.weekday}
                                </span>
                                <div
                                    className={`w-8 h-8 rounded-full flex flex-col items-center justify-center text-xs font-bold transition-all relative ${item.active
                                        ? "bg-[#7C3AED] text-white shadow-md shadow-purple-500/20"
                                        : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-805"
                                        }`}
                                >
                                    {item.dayNum}
                                    {item.hasEvent && !item.active && (
                                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Events List */}
                    <div className="space-y-3">
                        {upEvents.map((evt, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-4 bg-slate-50/50 dark:bg-[#121316]/50 border border-slate-100 dark:border-zinc-800/40 rounded-2xl p-4 border-l-4 ${evt.borderColor} hover:bg-slate-50 dark:hover:bg-[#121316] transition-colors`}
                            >
                                <div className="text-center border-r border-slate-100 dark:border-zinc-800/60 pr-4 flex-shrink-0 min-w-[45px]">
                                    <span className="text-xl font-extrabold text-slate-800 dark:text-white block leading-none">
                                        {evt.dayVal}
                                    </span>
                                    <span className="text-[9px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 block mt-1">
                                        {evt.month}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-150 truncate">
                                        {evt.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 font-medium">
                                        {evt.time} &bull; {evt.format}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom row cards: Connected Accounts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Connected Accounts Card */}
                <div className="bg-white dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 rounded-3xl p-6 hover:shadow-xs transition-shadow">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight mb-6">
                        Connected Accounts
                    </h2>

                    <div className="space-y-4">
                        {accounts.map((acct, idx) => {
                            const IconComp = acct.icon;
                            return (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${acct.bgColor} ${acct.iconColor}`}>
                                            <IconComp size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                                                {acct.name}
                                            </h4>
                                            <span
                                                className={`text-[10px] font-bold mt-0.5 block ${acct.status === "Active"
                                                    ? "text-emerald-550 dark:text-emerald-400 opacity-90"
                                                    : "text-red-500 dark:text-red-400"
                                                    }`}
                                            >
                                                {acct.status}
                                            </span>
                                        </div>
                                    </div>

                                    {acct.status === "Active" ? (
                                        <button className="text-slate-400 dark:text-zinc-500 hover:text-slate-650 dark:hover:text-zinc-350 transition-colors">
                                            <Settings size={16} />
                                        </button>
                                    ) : (
                                        <button className="bg-red-500 hover:bg-red-650 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-white dark:text-red-400 text-[10px] font-bold px-3 py-1 rounded-lg border border-transparent dark:border-red-500/35 transition-colors">
                                            Fix
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity Timeline Card */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 rounded-3xl p-6 hover:shadow-xs transition-shadow">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 tracking-tight mb-6">
                        Recent Activity
                    </h2>

                    <div className="relative">
                        {/* Vertical Timeline bar */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-zinc-800/60"></div>

                        <div className="space-y-6">
                            {activities.map((act, idx) => (
                                <div key={idx} className="flex items-start justify-between pl-6 relative min-w-0">
                                    {/* Circle Bullet absolute */}
                                    <span className={`absolute left-0 top-[5px] w-4 h-4 rounded-full border-4 border-white dark:border-[#1A1D21] ${act.dotColor} flex-shrink-0 z-10`}></span>

                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 leading-normal">
                                            <span className="font-bold text-slate-800 dark:text-white mr-1">
                                                {act.user}
                                            </span>
                                            {act.action}
                                            <span className="font-bold text-slate-850 dark:text-zinc-100 ml-1">
                                                {act.target}
                                            </span>
                                        </p>
                                        <span className="text-[10px] text-slate-400 dark:text-zinc-550 mt-1 block">
                                            {act.time}
                                        </span>
                                    </div>

                                    <button className="text-slate-400 dark:text-zinc-550 hover:text-slate-600 dark:hover:text-zinc-350 transition-colors ml-4 flex-shrink-0">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Float Button (Sparkles design) */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    title="AI Assistant Helper"
                    className="w-12 h-12 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] hover:scale-105 shadow-xl shadow-purple-500/20 text-white flex items-center justify-center transition-all duration-300 group cursor-pointer relative"
                >
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
}