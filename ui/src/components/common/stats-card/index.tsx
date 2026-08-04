"use client";

import {
    DollarSign,
    BarChart3,
    Users,
    Activity,
    UserCheck,
    Send,
    Share2,
    ShieldCheck,
    TrendingUp,
    Clock,
    Zap,
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
    Activity,
    UserCheck,
    Send,
    Share2,
    ShieldCheck,
    TrendingUp,
    Clock,
    Zap,
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
    isLive?: boolean;
}

const COLOR_STYLES: Record<
    StatColorVariant,
    { iconBg: string; subText: string }
> = {
    emerald: {
        iconBg: "bg-emerald-50 text-emerald-600",
        subText: "text-emerald-600",
    },
    purple: {
        iconBg: "bg-purple-50 text-purple-600",
        subText: "text-purple-600",
    },
    indigo: {
        iconBg: "bg-indigo-50 text-indigo-600",
        subText: "text-indigo-600",
    },
    blue: {
        iconBg: "bg-blue-50 text-blue-600",
        subText: "text-blue-600",
    },
    amber: {
        iconBg: "bg-amber-50 text-amber-600",
        subText: "text-amber-600",
    },
    sky: {
        iconBg: "bg-sky-50 text-sky-600",
        subText: "text-sky-600",
    },
    rose: {
        iconBg: "bg-rose-50 text-rose-600",
        subText: "text-rose-600",
    },
    slate: {
        iconBg: "bg-slate-50 text-slate-600",
        subText: "text-slate-600",
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
}

export function StatsCard({ stat, className = "" }: StatsCardProps) {
    const colorTheme = COLOR_STYLES[stat.color || "emerald"];
    const iconBgStyle = stat.iconBgClass || colorTheme.iconBg;
    const subTextStyle = stat.subTextColorClass || colorTheme.subText;

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
}

export function StatsGrid({
    stats,
    gridColsClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",
}: StatsGridProps) {
    return (
        <div className={gridColsClass}>
            {stats.map((stat, idx) => (
                <StatsCard key={stat.id || stat.title || idx} stat={stat} />
            ))}
        </div>
    );
}

export default StatsCard;
