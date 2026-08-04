"use client";

import React from "react";
import {
    DollarSign,
    BarChart3,
    Users,
    Users as UsersIcon,
    Activity,
    UserCheck,
    UserX,
    Send,
    Share2,
    ShieldCheck,
    ShieldAlert,
    TrendingUp,
    Clock,
    Zap,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Globe,
    Radio,
    LucideIcon,
} from "lucide-react";

// Icon string to Lucide component mapping for raw JSON payload support
const ICON_MAP: Record<string, LucideIcon> = {
    DollarSign,
    BarChart3,
    Users,
    UsersIcon,
    Activity,
    UserCheck,
    UserX,
    Send,
    Share2,
    ShieldCheck,
    ShieldAlert,
    TrendingUp,
    Clock,
    Zap,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Globe,
    Radio,
};

export type StatColorVariant =
    | "emerald"
    | "purple"
    | "indigo"
    | "blue"
    | "amber"
    | "sky"
    | "rose"
    | "slate";

export type StatCardVariant = "vertical" | "horizontal" | "summary";

export interface StatItem {
    id?: string | number;
    title: string;
    value: string | number;
    icon: LucideIcon | string;
    color?: StatColorVariant;
    iconBgClass?: string;
    subtext: string;
    subIcon?: LucideIcon | string;
    subTextColorClass?: string;
    valueColorClass?: string;
    isLive?: boolean;
    variant?: StatCardVariant;
}

const COLOR_STYLES: Record<
    StatColorVariant,
    { iconBg: string; subText: string; valueText: string }
> = {
    emerald: {
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        subText: "text-emerald-600",
        valueText: "text-emerald-600",
    },
    purple: {
        iconBg: "bg-purple-50 text-purple-600 border-purple-100",
        subText: "text-purple-600",
        valueText: "text-purple-600",
    },
    indigo: {
        iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        subText: "text-indigo-600",
        valueText: "text-indigo-600",
    },
    blue: {
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        subText: "text-blue-600",
        valueText: "text-blue-600",
    },
    amber: {
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        subText: "text-amber-600",
        valueText: "text-amber-600",
    },
    sky: {
        iconBg: "bg-sky-50 text-sky-600 border-sky-100",
        subText: "text-sky-600",
        valueText: "text-sky-600",
    },
    rose: {
        iconBg: "bg-rose-50 text-rose-600 border-rose-100",
        subText: "text-rose-600",
        valueText: "text-rose-600",
    },
    slate: {
        iconBg: "bg-slate-50 text-slate-600 border-slate-100",
        subText: "text-slate-500",
        valueText: "text-slate-900",
    },
};

function renderIcon(
    IconInput: LucideIcon | string | undefined,
    defaultClass: string = "w-4 h-4"
) {
    if (!IconInput) return null;
    if (typeof IconInput === "string") {
        const ResolvedIcon = ICON_MAP[IconInput];
        if (ResolvedIcon) {
            return <ResolvedIcon className={defaultClass} />;
        }
        return null;
    }
    const IconComponent = IconInput;
    return <IconComponent className={defaultClass} />;
}

export interface StatsCardProps {
    stat: StatItem;
    className?: string;
    variant?: StatCardVariant;
}

export function StatsCard({ stat, className = "", variant = "vertical" }: StatsCardProps) {
    const cardVariant = stat.variant || variant;
    const colorTheme = COLOR_STYLES[stat.color || "emerald"];
    const iconBgStyle = stat.iconBgClass || colorTheme.iconBg;
    const subTextStyle = stat.subTextColorClass || colorTheme.subText;

    if (cardVariant === "horizontal" || cardVariant === "summary") {
        return (
            <div
                className={`card p-5 [transition:0.3s] hover:-translate-y-1 flex items-center justify-between ${className}`}
            >
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {stat.title}
                    </p>
                    <h3
                        className={`text-2xl font-extrabold mt-1 ${stat.valueColorClass || colorTheme.valueText || "text-slate-900"
                            }`}
                    >
                        {stat.value}
                        {stat.isLive && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping ml-2" />
                        )}
                    </h3>
                    <span
                        className={`text-[11px] font-medium flex items-center gap-1 mt-1 ${subTextStyle}`}
                    >
                        {renderIcon(stat.subIcon, "w-3 h-3")}
                        <span>{stat.subtext}</span>
                    </span>
                </div>
                <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${iconBgStyle}`}
                >
                    {renderIcon(stat.icon, "w-6 h-6")}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`card p-5 [transition:0.3s] hover:-translate-y-1 space-y-2 ${className}`}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stat.title}
                </span>
                <div className={`p-2 rounded-xl ${iconBgStyle}`}>
                    {renderIcon(stat.icon, "w-4 h-4")}
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    {stat.value}
                    {stat.isLive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                    )}
                </h3>
                <p
                    className={`text-xs font-semibold mt-0.5 flex items-center gap-1 ${subTextStyle}`}
                >
                    {renderIcon(stat.subIcon, "w-3.5 h-3.5")}
                    <span>{stat.subtext}</span>
                </p>
            </div>
        </div>
    );
}

export interface StatsGridProps {
    stats: StatItem[];
    gridColsClass?: string;
    variant?: StatCardVariant;
}

export function StatsGrid({
    stats,
    gridColsClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",
    variant = "vertical",
}: StatsGridProps) {
    return (
        <div className={gridColsClass}>
            {stats.map((stat, idx) => (
                <StatsCard
                    key={stat.id || stat.title || idx}
                    stat={stat}
                    variant={variant}
                />
            ))}
        </div>
    );
}

export default StatsCard;
