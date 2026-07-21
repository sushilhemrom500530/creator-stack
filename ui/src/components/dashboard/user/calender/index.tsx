"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    AlertCircle,
    FileEdit,
    Clock
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaCircle } from "react-icons/fa6";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

interface DayCard {
    type: "scheduled" | "draft" | "instagram" | "aigen" | "failed" | "inline-teal" | "inline-purple";
    title: string;
    time?: string;
    tagLabel?: string;
    image?: string;
}

export default function UserCalender() {
    // Interactive filter states
    const [platform, setPlatform] = useState<string>("All Platforms");
    const [status, setStatus] = useState<string>("All Status");
    const [team, setTeam] = useState<string>("Everyone");
    const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");

    // Monthly navigation state
    const [activeStartDate, setActiveStartDate] = useState(new Date(2026, 4, 1)); // May 2026

    // Ant Design Dropdown click handlers
    const platformItems: MenuProps["items"] = [
        { key: "all", label: "All Platforms" },
        { key: "ig", label: "Instagram" },
        { key: "fb", label: "Facebook" },
        { key: "x", label: "Twitter / X" },
    ];

    const handlePlatformClick: MenuProps["onClick"] = (e) => {
        const item = platformItems.find((i) => i?.key === e.key);
        if (item && "label" in item) {
            setPlatform(item.label as string);
        }
    };

    const statusItems: MenuProps["items"] = [
        { key: "all", label: "All Status" },
        { key: "scheduled", label: "Scheduled" },
        { key: "draft", label: "Draft" },
        { key: "failed", label: "Failed" },
    ];

    const handleStatusClick: MenuProps["onClick"] = (e) => {
        const item = statusItems.find((i) => i?.key === e.key);
        if (item && "label" in item) {
            setStatus(item.label as string);
        }
    };

    const teamItems: MenuProps["items"] = [
        { key: "everyone", label: "Everyone" },
        { key: "marketing", label: "Marketing" },
        { key: "design", label: "Designers" },
        { key: "only_me", label: "Only Me" },
    ];

    const handleTeamClick: MenuProps["onClick"] = (e) => {
        const item = teamItems.find((i) => i?.key === e.key);
        if (item && "label" in item) {
            setTeam(item.label as string);
        }
    };

    // Calendar Card mapping by date (YYYY-MM-DD format key)
    const cardsMap: Record<string, DayCard[]> = {
        "2026-05-01": [
            { type: "scheduled", title: "Product Launch Outline", time: "09:00 AM", tagLabel: "SCHEDULED" }
        ],
        "2026-05-03": [
            { type: "draft", title: "Weekly Newsletter Draft", tagLabel: "DRAFT" }
        ],
        "2026-05-04": [
            { type: "instagram", title: "Behind the Scenes Reel", tagLabel: "INSTAGRAM", image: "from-purple-800 to-indigo-900" }
        ],
        "2026-05-07": [
            { type: "aigen", title: "10 Tips for Workflows", tagLabel: "AI GEN" }
        ],
        "2026-05-12": [
            { type: "inline-teal", title: "Client Testimonial video" }
        ],
        "2026-05-16": [
            { type: "inline-purple", title: "Podcast Release: Episode 4" }
        ],
        "2026-05-25": [
            { type: "failed", title: "Urgent: API Fix Post", tagLabel: "FAILED" }
        ]
    };

    const handlePrevMonth = () => {
        setActiveStartDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setActiveStartDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const getFormattedDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view !== "month") return null;

        const dateKey = getFormattedDateString(date);
        const dayVal = date.getDate();
        const isCurrentMonth = date.getMonth() === activeStartDate.getMonth();
        const isToday = dayVal === 4 && date.getMonth() === 4 && date.getFullYear() === 2026; // Today mock: 04 May 2026
        const cards = cardsMap[dateKey] || [];

        return (
            <div className={`flex flex-col h-full w-full justify-between min-h-[140px] p-1.5 transition-opacity ${isCurrentMonth ? "opacity-100" : "opacity-30"}`}>
                {/* Custom date number header */}
                <div className="flex items-center gap-1.5 justify-start mb-2">
                    <span
                        className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-all ${isToday
                            ? "bg-[#7C3AED] text-white rounded-full shadow-md shadow-purple-500/20"
                            : "text-slate-700 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200"
                            }`}
                    >
                        {String(dayVal).padStart(2, "0")}
                    </span>
                    {isToday && (
                        <span className="text-[9px] font-extrabold tracking-wider bg-purple-550 dark:bg-purple-950/40 text-purple-650 dark:text-[#E2D6FF] px-1 py-0.5 rounded uppercase">
                            Today
                        </span>
                    )}
                </div>

                {/* Card rendering blocks inside tile */}
                <div className="flex-1 flex flex-col gap-1.5 justify-end mt-1 overflow-hidden pointer-events-auto">
                    {cards.map((card, idx) => {
                        if (card.type === "scheduled") {
                            return (
                                <div
                                    key={idx}
                                    className="bg-teal-500/5 dark:bg-teal-950/15 border border-teal-500/10 dark:border-teal-500/20 rounded-xl p-2 flex flex-col hover:border-teal-400 dark:hover:border-teal-400 transition-all duration-300 cursor-pointer shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-1 bg-teal-500/10 text-teal-650 dark:text-teal-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full w-max tracking-wide uppercase mb-1">
                                        <FaCircle size={5} className="mr-0.5" />
                                        {card.tagLabel}
                                    </div>
                                    <h4 className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 truncate leading-snug">
                                        {card.title}
                                    </h4>
                                    {card.time && (
                                        <span className="text-[9px] text-slate-400 dark:text-zinc-550 mt-1 flex items-center gap-1">
                                            <Clock size={10} />
                                            {card.time}
                                        </span>
                                    )}
                                </div>
                            );
                        }

                        if (card.type === "draft") {
                            return (
                                <div
                                    key={idx}
                                    className="bg-purple-500/5 dark:bg-purple-950/15 border border-purple-500/10 dark:border-purple-500/20 rounded-xl p-2 flex flex-col hover:border-purple-400 dark:hover:border-purple-400 transition-all duration-300 cursor-pointer shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-1 bg-purple-500/10 text-purple-650 dark:text-purple-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full w-max tracking-wide uppercase mb-1.5">
                                        <FileEdit size={8} />
                                        {card.tagLabel}
                                    </div>
                                    <h4 className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 truncate leading-snug">
                                        {card.title}
                                    </h4>
                                </div>
                            );
                        }

                        if (card.type === "instagram") {
                            return (
                                <div
                                    key={idx}
                                    className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-xl overflow-hidden hover:scale-[1.01] hover:border-purple-400 transition-all duration-300 cursor-pointer shadow-xs text-left"
                                >
                                    <div className="bg-gradient-to-r from-purple-600 to-rose-500 text-white text-[9px] font-bold px-2 py-1.5 flex items-center gap-1 tracking-wider uppercase">
                                        <FaInstagram size={11} />
                                        {card.tagLabel}
                                    </div>
                                    <div className={`h-[50px] bg-gradient-to-tr ${card.image} relative overflow-hidden flex items-center justify-center`}>
                                        <div className="absolute inset-0 bg-black/25"></div>
                                        <FaInstagram size={20} className="text-white/25" />
                                    </div>
                                    <div className="p-1.5">
                                        <h4 className="text-[10px] font-bold text-slate-800 dark:text-zinc-200 truncate">
                                            {card.title}
                                        </h4>
                                    </div>
                                </div>
                            );
                        }

                        if (card.type === "aigen") {
                            return (
                                <div
                                    key={idx}
                                    className="bg-indigo-500/5 dark:bg-indigo-950/15 border border-indigo-500/10 dark:border-indigo-500/20 rounded-xl p-2 flex flex-col hover:border-indigo-400 dark:hover:border-indigo-400 transition-all duration-300 cursor-pointer shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full w-max tracking-wide uppercase mb-1.5">
                                        <Sparkles size={8} className="text-indigo-455" />
                                        {card.tagLabel}
                                    </div>
                                    <h4 className="text-[11px] font-bold text-slate-850 dark:text-zinc-200 truncate leading-snug">
                                        {card.title}
                                    </h4>
                                </div>
                            );
                        }

                        if (card.type === "failed") {
                            return (
                                <div
                                    key={idx}
                                    className="bg-red-500/5 dark:bg-red-950/15 border border-red-500/10 dark:border-red-500/20 rounded-xl p-2 flex flex-col hover:border-red-400 dark:hover:border-red-400 transition-all duration-300 cursor-pointer shadow-xs text-left"
                                >
                                    <div className="flex items-center gap-1 bg-red-500/10 text-red-650 dark:text-red-450 text-[8px] font-bold px-1.5 py-0.5 rounded-full w-max tracking-wide uppercase mb-1.5">
                                        <AlertCircle size={8} />
                                        {card.tagLabel}
                                    </div>
                                    <h4 className="text-[11px] font-bold text-slate-900 dark:text-zinc-150 truncate leading-snug">
                                        {card.title}
                                    </h4>
                                </div>
                            );
                        }

                        if (card.type === "inline-teal" || card.type === "inline-purple") {
                            return (
                                <div
                                    key={idx}
                                    className={`bg-slate-50/70 dark:bg-[#1A1D21]/60 rounded-xl p-2 flex items-center border border-slate-100 dark:border-zinc-800/40 hover:border-slate-205 dark:hover:border-zinc-700 border-l-4 ${card.type === "inline-teal"
                                        ? "border-l-teal-500"
                                        : "border-l-purple-550"
                                        } transition-all duration-300 cursor-pointer text-left`}
                                >
                                    <h4 className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 truncate w-full leading-normal">
                                        {card.title}
                                    </h4>
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-[#121316] p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 font-primary min-h-[85vh] select-none flex flex-col justify-between">
            {/* Filter controls row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Ant Design Platform Dropdown */}
                    <Dropdown menu={{ items: platformItems, onClick: handlePlatformClick }} trigger={["click"]}>
                        <button className="bg-slate-50 dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#1E2227] transition-all cursor-pointer">
                            <span className="text-slate-400 dark:text-zinc-550 font-normal">Platform:</span>
                            <span>{platform}</span>
                            <ChevronDown size={14} className="text-slate-400 dark:text-zinc-500" />
                        </button>
                    </Dropdown>

                    {/* Ant Design Status Dropdown */}
                    <Dropdown menu={{ items: statusItems, onClick: handleStatusClick }} trigger={["click"]}>
                        <button className="bg-slate-50 dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#1E2227] transition-all cursor-pointer">
                            <span className="text-slate-400 dark:text-zinc-550 font-normal">Status:</span>
                            <span>{status}</span>
                            <ChevronDown size={14} className="text-slate-400 dark:text-zinc-500" />
                        </button>
                    </Dropdown>

                    {/* Ant Design Team Dropdown */}
                    <Dropdown menu={{ items: teamItems, onClick: handleTeamClick }} trigger={["click"]}>
                        <button className="bg-slate-50 dark:bg-[#1A1D21] border border-slate-100 dark:border-zinc-800/60 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#1E2227] transition-all cursor-pointer">
                            <span className="text-slate-400 dark:text-zinc-550 font-normal">Team:</span>
                            <span>{team}</span>
                            <ChevronDown size={14} className="text-slate-400 dark:text-zinc-500" />
                        </button>
                    </Dropdown>
                </div>

                {/* Calendar Navigation header & toggle switch pills */}
                <div className="flex items-center gap-4">
                    {/* Month Nav Buttons */}
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#1A1D21]/80 border border-slate-100 dark:border-zinc-800/50 p-1.5 rounded-xl">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1 rounded-lg hover:bg-slate-105 dark:hover:bg-[#1E2227] text-slate-500 dark:text-zinc-400 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-bold text-slate-785 dark:text-zinc-200 px-1 font-mono min-w-[70px] text-center capitalize">
                            {activeStartDate.toLocaleString("en-US", { month: "short", year: "numeric" })}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-1 rounded-lg hover:bg-slate-105 dark:hover:bg-[#1E2227] text-slate-500 dark:text-zinc-400 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Switch Period button toggles right */}
                    <div className="flex items-center bg-slate-50 dark:bg-[#1A1D21] p-1 rounded-xl border border-slate-100 dark:border-zinc-800/50 animate-fade-in">
                        {(["month", "week", "list"] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-300 cursor-pointer ${viewMode === mode
                                    ? "bg-[#C39DFE]/25 dark:bg-[#9760EC]/30 text-purple-700 dark:text-[#E2D6FF] shadow-xs"
                                    : "text-slate-450 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="flex-1 custom-react-calendar-wrapper">
                <Calendar
                    activeStartDate={activeStartDate}
                    showNavigation={false}
                    calendarType="iso8601"
                    locale="en-US"
                    tileContent={tileContent}
                />
            </div>

            {/* Global style injector to style react-calendar cells same-to-same */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-react-calendar-wrapper .react-calendar {
                    background: transparent !important;
                    border: none !important;
                    width: 100% !important;
                    font-family: inherit !important;
                }
                .custom-react-calendar-wrapper .react-calendar__month-view__weekdays {
                    border-bottom: 1px solid rgba(229, 231, 235, 0.4) !important;
                    margin-bottom: 8px;
                }
                .dark .custom-react-calendar-wrapper .react-calendar__month-view__weekdays {
                    border-bottom: 1px solid rgba(63, 63, 70, 0.4) !important;
                }
                .custom-react-calendar-wrapper .react-calendar__month-view__weekdays__weekday {
                    padding: 12px 6px !important;
                    text-align: center !important;
                }
                .custom-react-calendar-wrapper .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.05em !important;
                    color: #94a3b8 !important;
                }
                .dark .custom-react-calendar-wrapper .react-calendar__month-view__weekdays__weekday abbr {
                    color: #52525b !important;
                }
                .custom-react-calendar-wrapper .react-calendar__month-view__days {
                    border: 1px solid #f1f5f9 !important;
                    border-radius: 16px !important;
                    overflow: hidden !important;
                }
                .dark .custom-react-calendar-wrapper .react-calendar__month-view__days {
                    border: 1px solid rgba(63, 63, 70, 0.4) !important;
                }
                .custom-react-calendar-wrapper .react-calendar__tile {
                    background: transparent !important;
                    border: 1px solid #f1f5f9 !important;
                    min-height: 155px !important;
                    padding: 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: stretch !important;
                    align-items: stretch !important;
                    text-align: left !important;
                }
                .dark .custom-react-calendar-wrapper .react-calendar__tile {
                    border: 1px solid rgba(63, 63, 70, 0.3) !important;
                }
                .custom-react-calendar-wrapper .react-calendar__tile abbr {
                    display: none !important;
                }
                .custom-react-calendar-wrapper .react-calendar__tile--now {
                    background: rgba(124, 58, 237, 0.02) !important;
                }
                .custom-react-calendar-wrapper .react-calendar__tile--active {
                    background: transparent !important;
                    color: inherit !important;
                }
                .custom-react-calendar-wrapper .react-calendar__tile:hover {
                    background: rgba(124, 58, 237, 0.04) !important;
                }
                .dark .custom-react-calendar-wrapper .react-calendar__tile:hover {
                    background: rgba(124, 58, 237, 0.02) !important;
                }
                .custom-react-calendar-wrapper .react-calendar__month-view__days__day--neighboringMonth {
                    opacity: 0.15 !important;
                    pointer-events: none !important;
                }
            ` }} />
        </div>
    );
}