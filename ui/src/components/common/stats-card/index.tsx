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
    LayoutGrid,
    FileText,
    AlertCircle,
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
    LayoutGrid,
    FileText,
    AlertCircle,
};

export type StatColorVariant =
    | "emerald"
    | "purple"
    | "indigo"
    | "blue"
    | "amber"
    | "sky"
    | "cyan"
    | "rose"
    | "slate";

export type StatCardVariant = "vertical" | "horizontal" | "summary" | "compact" | "icon-left";

export interface StatItem {
    id?: string | number;
    title: string;
    value: string | number;
    icon: LucideIcon | string | React.ReactNode;
    color?: StatColorVariant;
    iconBgClass?: string;
    subtext?: string | React.ReactNode;
    subIcon?: LucideIcon | string | React.ReactNode;
    subTextColorClass?: string;
    valueColorClass?: string;
    isLive?: boolean;
    variant?: StatCardVariant;
    relativeOverflow?: boolean;
    footer?: React.ReactNode;
}

const COLOR_STYLES: Record<
    StatColorVariant,
    { iconBg: string; subText: string; valueText: string; compactBg: string }
> = {
    emerald: {
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        subText: "text-emerald-600",
        valueText: "text-emerald-600",
        compactBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    },
    purple: {
        iconBg: "bg-purple-50 text-purple-600 border-purple-100",
        subText: "text-purple-600",
        valueText: "text-purple-600",
        compactBg: "bg-purple-500/10 border-purple-500/20 text-purple-500",
    },
    indigo: {
        iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        subText: "text-indigo-600",
        valueText: "text-indigo-600",
        compactBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-500",
    },
    blue: {
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        subText: "text-blue-600",
        valueText: "text-blue-600",
        compactBg: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    },
    amber: {
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        subText: "text-amber-600",
        valueText: "text-amber-600",
        compactBg: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    },
    sky: {
        iconBg: "bg-sky-50 text-sky-600 border-sky-100",
        subText: "text-sky-600",
        valueText: "text-sky-600",
        compactBg: "bg-sky-500/10 border-sky-500/20 text-sky-500",
    },
    cyan: {
        iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
        subText: "text-cyan-600",
        valueText: "text-cyan-600",
        compactBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500",
    },
    rose: {
        iconBg: "bg-rose-50 text-rose-600 border-rose-100",
        subText: "text-rose-600",
        valueText: "text-rose-600",
        compactBg: "bg-rose-500/10 border-rose-500/20 text-rose-500",
    },
    slate: {
        iconBg: "bg-slate-50 text-slate-600 border-slate-100",
        subText: "text-slate-500",
        valueText: "text-slate-900",
        compactBg: "bg-slate-500/10 border-slate-500/20 text-slate-500",
    },
};

function renderIcon(
    IconInput: LucideIcon | string | React.ReactNode | undefined,
    defaultClass: string = "w-4 h-4"
) {
    if (!IconInput) return null;
    if (React.isValidElement(IconInput)) {
        return IconInput;
    }
    if (typeof IconInput === "string") {
        const ResolvedIcon = ICON_MAP[IconInput];
        if (ResolvedIcon) {
            return <ResolvedIcon className={defaultClass} />;
        }
        return null;
    }
    const IconComponent = IconInput as LucideIcon;
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

    if (cardVariant === "compact" || cardVariant === "icon-left") {
        const compactIconBg = stat.iconBgClass || colorTheme.compactBg;
        return (
            <div className={`card p-5 flex items-center gap-4 transition-all ${className}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${compactIconBg}`}>
                    {renderIcon(stat.icon, "w-6 h-6")}
                </div>
                <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        {stat.title}
                    </p>
                    <h4 className={`text-2xl font-black tracking-tight mt-0.5 ${stat.valueColorClass || "text-foreground"}`}>
                        {stat.value}
                    </h4>
                </div>
            </div>
        );
    }

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
                    {stat.subtext && (
                        <span
                            className={`text-[11px] font-medium flex items-center gap-1 mt-1 ${subTextStyle}`}
                        >
                            {renderIcon(stat.subIcon, "w-3 h-3")}
                            <span>{stat.subtext}</span>
                        </span>
                    )}
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
            className={`card p-5 [transition:0.3s] hover:-translate-y-1 ${stat.relativeOverflow ? "relative overflow-hidden" : ""
                } ${className}`}
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">
                    {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${iconBgStyle}`}>
                    {renderIcon(stat.icon, "w-4 h-4")}
                </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
                <span
                    className={`text-3xl font-bold ${stat.valueColorClass || "text-slate-900"
                        }`}
                >
                    {stat.value}
                    {stat.isLive && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping ml-2" />
                    )}
                </span>
            </div>
            {stat.footer ? (
                stat.footer
            ) : stat.subtext ? (
                <div
                    className={`text-xs font-semibold flex items-center gap-1 ${subTextStyle}`}
                >
                    {renderIcon(stat.subIcon, "w-3.5 h-3.5")}
                    <span>{stat.subtext}</span>
                </div>
            ) : null}
        </div>
    );
}

export interface StatsGridProps {
    stats: StatItem[];
    gridColsClass?: string;
    variant?: StatCardVariant;
    className?: string;
}

export function StatsGrid({
    stats,
    gridColsClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",
    variant = "vertical",
    className
}: StatsGridProps) {
    return (
        <div className={gridColsClass}>
            {stats.map((stat, idx) => (
                <StatsCard
                    key={stat.id || stat.title || idx}
                    stat={stat}
                    variant={variant}
                    className={className}
                />
            ))}
        </div>
    );
}

export default StatsCard;
