"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Drawer, Switch, Button, Tag, Slider } from "antd";
import {
    Activity,
    Cpu,
    Shield,
    TrendingUp,
    Sparkles,
    Settings2,
    Sliders,
    Power,
    SlidersHorizontal,
    Zap,
} from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface AiModelStatus {
    id: string;
    name: string;
    provider: string;
    type: "LLM" | "Image" | "Analytics";
    enabled: boolean;
    status: "operational" | "degraded" | "disabled";
    latency: string;
    uptime: string;
    usage: string;
    color: string;
}

const INITIAL_MODELS: AiModelStatus[] = [
    {
        id: "openai",
        name: "OpenAI API (GPT-4)",
        provider: "OpenAI",
        type: "LLM",
        enabled: true,
        status: "operational",
        latency: "24ms",
        uptime: "99.98%",
        usage: "750k / 1M",
        color: "#8B5CF6",
    },
    {
        id: "claude",
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        type: "LLM",
        enabled: true,
        status: "operational",
        latency: "42ms",
        uptime: "100%",
        usage: "125k / 500k",
        color: "#14B8A6",
    },
    {
        id: "sd",
        name: "Stable Diffusion XL",
        provider: "Stability AI",
        type: "Image",
        enabled: true,
        status: "degraded",
        latency: "840ms",
        uptime: "94.2%",
        usage: "45k / 50k",
        color: "#F43F5E",
    },
    {
        id: "dalle",
        name: "DALL-E 3",
        provider: "OpenAI",
        type: "Image",
        enabled: true,
        status: "operational",
        latency: "110ms",
        uptime: "99.9%",
        usage: "9k / 10k",
        color: "#10B981",
    },
];

export default function AiManagement() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [models, setModels] = useState<AiModelStatus[]>(INITIAL_MODELS);
    const [temperature, setTemperature] = useState<number>(0.7);

    const toggleModel = (id: string) => {
        setModels((prev) =>
            prev.map((model) => {
                if (model.id === id) {
                    const nextEnabled = !model.enabled;
                    return {
                        ...model,
                        enabled: nextEnabled,
                        status: nextEnabled
                            ? id === "sd"
                                ? "degraded"
                                : "operational"
                            : "disabled",
                    };
                }
                return model;
            })
        );
    };

    // Helper to get model by ID
    const getModel = (id: string) => models.find((m) => m.id === id) || INITIAL_MODELS[0];

    // Mini sparklines for top cards
    const miniSparklineOptions = (color: string): ApexCharts.ApexOptions => ({
        chart: {
            type: "bar",
            sparkline: { enabled: true },
            animations: { enabled: false },
        },
        plotOptions: {
            bar: {
                columnWidth: "60%",
                borderRadius: 2,
            },
        },
        colors: [color],
        tooltip: { enabled: false },
    });

    // Daily Token Consumption Bar Chart
    const tokenChartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            stacked: true,
            toolbar: { show: false },
            zoom: { enabled: false },
            background: "transparent",
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "40%",
                borderRadius: 2,
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"],
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: false },
        grid: { show: false },
        colors: ["#8B5CF6", "#14B8A6"],
        legend: {
            position: "top",
            horizontalAlign: "right",
            labels: { colors: "#64748B" },
            markers: { shape: "circle", size: 6 },
        },
        fill: { opacity: 1 },
        theme: { mode: "light" },
    };

    const tokenSeries = [
        { name: "Input", data: [44, 55, 41, 67, 22, 43, 21, 49, 62, 41, 67, 22, 43, 21] },
        { name: "Output", data: [13, 23, 20, 8, 13, 27, 33, 12, 19, 20, 8, 13, 27, 33] },
    ];

    // Radial Gauge Options
    const getRadialOptions = (color: string, isDisabled: boolean): ApexCharts.ApexOptions => ({
        chart: {
            type: "radialBar",
            background: "transparent",
            fontFamily: "inherit",
        },
        plotOptions: {
            radialBar: {
                hollow: { size: "70%" },
                track: { background: "#F1F5F9", strokeWidth: "100%" },
                dataLabels: {
                    name: { show: false },
                    value: {
                        show: true,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isDisabled ? "#94A3B8" : "#475569",
                        formatter: (val) => (isDisabled ? "OFF" : `${val}%`),
                        offsetY: 5,
                    },
                },
            },
        },
        stroke: { lineCap: "round" },
        colors: [isDisabled ? "#CBD5E1" : color],
    });

    const activeCount = models.filter((m) => m.enabled).length;

    return (
        <div className="p-6">
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Management & Monitoring</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Real-time health telemetry and engine control</p>
                </div>

                {/* Header Actions / Title Opponent */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-full ">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                            {activeCount} / {models.length} Models Operational
                        </span>
                    </div>

                    {/* Manage AI Button */}
                    <Button
                        type="primary"
                        icon={<Settings2 className="w-4 h-4" />}
                        onClick={() => setIsDrawerOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 font-extrabold rounded-full h-9 px-5 flex items-center gap-1.5 border-none"
                    >
                        Manage AI
                    </Button>
                </div>
            </div>

            {/* --- TOP ROW GRID: AI Health Hub & Rate Limit Gauges --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* 1. AI Health Hub (lg:col-span-2) */}
                <div className="lg:col-span-2 card p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Cpu className="w-5 h-5" />
                                <h2 className="text-lg font-extrabold text-slate-900">AI Health Hub</h2>
                            </div>
                            <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
                                Real-time Status
                            </span>
                        </div>

                        {/* Top Mini Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* OpenAI */}
                            {(() => {
                                const m = getModel("openai");
                                return (
                                    <div className={`p-4 rounded-2xl border hover:-translate-y-1 [transition:0.3s] ${m.enabled ? "bg-white border-slate-200" : "bg-slate-100/60 border-slate-200 opacity-60"
                                        }`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-extrabold text-slate-900">{m.name}</span>
                                            {m.enabled ? (
                                                <span className="text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                                                    {m.uptime}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded font-bold">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-2xl font-extrabold text-slate-900">{m.enabled ? m.latency : "--"}</span>
                                                <span className="text-xs font-bold text-slate-400 ml-1">lat</span>
                                            </div>
                                            <div className="w-12 h-8">
                                                <ReactApexChart
                                                    options={miniSparklineOptions(m.enabled ? "#10B981" : "#94A3B8")}
                                                    series={[{ data: m.enabled ? [12, 14, 18, 15, 20, 22] : [0, 0, 0, 0, 0, 0] }]}
                                                    type="bar"
                                                    height="100%"
                                                    width="100%"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Claude 3.5 */}
                            {(() => {
                                const m = getModel("claude");
                                return (
                                    <div className={`p-4 rounded-2xl border hover:-translate-y-1 [transition:0.3s] ${m.enabled ? "bg-white border-slate-200" : "bg-slate-100/60 border-slate-200 opacity-60"
                                        }`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-extrabold text-slate-900">Claude 3.5</span>
                                            {m.enabled ? (
                                                <span className="text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                                                    {m.uptime}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded font-bold">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-2xl font-extrabold text-slate-900">{m.enabled ? m.latency : "--"}</span>
                                                <span className="text-xs font-bold text-slate-400 ml-1">lat</span>
                                            </div>
                                            <div className="w-12 h-8">
                                                <ReactApexChart
                                                    options={miniSparklineOptions(m.enabled ? "#10B981" : "#94A3B8")}
                                                    series={[{ data: m.enabled ? [20, 22, 19, 21, 23, 20] : [0, 0, 0, 0, 0, 0] }]}
                                                    type="bar"
                                                    height="100%"
                                                    width="100%"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Stable Diffusion */}
                            {(() => {
                                const m = getModel("sd");
                                return (
                                    <div className={`p-4 rounded-2xl border hover:-translate-y-1 [transition:0.3s] ${m.enabled ? "bg-white border-slate-200" : "bg-slate-100/60 border-slate-200 opacity-60"
                                        }`}>
                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <span className="text-sm font-extrabold text-slate-900">Stable Diffusion</span>
                                            {m.enabled ? (
                                                <span className="text-[10px] text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded font-bold">
                                                    Degraded
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded font-bold">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-end relative z-10">
                                            <div>
                                                <span className="text-2xl font-extrabold text-slate-900">{m.enabled ? m.latency : "--"}</span>
                                                <span className="text-xs font-bold text-slate-400 ml-1">lat</span>
                                            </div>
                                            <div className="w-12 h-8">
                                                <ReactApexChart
                                                    options={miniSparklineOptions(m.enabled ? "#8B5CF6" : "#94A3B8")}
                                                    series={[{ data: m.enabled ? [35, 45, 80, 95, 85, 90] : [0, 0, 0, 0, 0, 0] }]}
                                                    type="bar"
                                                    height="100%"
                                                    width="100%"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Daily Token Consumption</h3>
                        <div className="h-44 w-full">
                            <ReactApexChart options={tokenChartOptions} series={tokenSeries} type="bar" height="100%" width="100%" />
                        </div>
                    </div>
                </div>

                {/* 2. Rate Limit Gauges (lg:col-span-1) */}
                <div className="card p-6 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <Activity className="w-5 h-5" />
                                <h2 className="text-lg font-extrabold text-slate-900">Rate Limit Gauges</h2>
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                4 Engines
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mb-4">Allocated quota for the current billing cycle.</p>
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col justify-around">
                        {models.map((m) => {
                            const usagePercent =
                                m.id === "openai"
                                    ? 75
                                    : m.id === "claude"
                                        ? 25
                                        : m.id === "sd"
                                            ? 85
                                            : 90;
                            return (
                                <div
                                    key={m.id}
                                    className={`flex items-center justify-between p-3 rounded-2xl border transition ${m.enabled ? "bg-white border-slate-200" : "bg-slate-100/70 border-slate-200 opacity-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                                            <ReactApexChart
                                                options={getRadialOptions(m.color, !m.enabled)}
                                                series={[m.enabled ? usagePercent : 0]}
                                                type="radialBar"
                                                height="100%"
                                                width="100%"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-extrabold text-slate-900">{m.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400">
                                                {m.enabled ? m.usage : "Disabled"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${!m.enabled
                                        ? "bg-slate-200 text-slate-500 border-slate-300"
                                        : usagePercent > 80
                                            ? "bg-amber-50 text-amber-600 border-amber-200"
                                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        }`}>
                                        {!m.enabled ? "OFF" : `${usagePercent}% Quota`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400">Cycle Reset:</span>
                        <span className="font-extrabold text-slate-700">In 6 Days (1st of month)</span>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE ROW GRID: Cost Matrix & AI Model Tuning --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 3. Cost Matrix (lg:col-span-2) */}
                <div className="lg:col-span-2 card p-6 flex flex-col md:flex-row gap-8 justify-between h-full">
                    <div className="flex-1">
                        <h2 className="text-lg font-extrabold text-slate-900 mb-6">Cost Matrix</h2>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-slate-500">Cost per 1k Tokens</span>
                            <span className="text-2xl font-extrabold text-slate-900">$0.012</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                            <div className="h-full bg-indigo-500 w-1/3 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Image Gen</span>
                            <span className="text-xl font-extrabold text-emerald-600 mt-1">32%</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Copywriting</span>
                            <span className="text-xl font-extrabold text-amber-500 mt-1">54%</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sentiment</span>
                            <span className="text-xl font-extrabold text-indigo-500 mt-1">14%</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Moderation</span>
                            <span className="text-xl font-extrabold text-rose-500 mt-1">2%</span>
                        </div>
                    </div>
                </div>

                {/* 4. AI Model Tuning (lg:col-span-1) */}
                <div className="card p-6 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <SlidersHorizontal className="w-5 h-5" />
                                <h2 className="text-lg font-extrabold text-slate-900">AI Model Tuning</h2>
                            </div>
                            <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                                Active Policy
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mb-3">Configure real-time inference parameters & safety filters.</p>
                    </div>

                    {/* Adjustments & Controls */}
                    <div className="space-y-4">
                        {/* Temperature Control */}
                        <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Temperature (Creativity)
                                </span>
                                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-mono">
                                    {temperature}
                                </span>
                            </div>
                            <Slider
                                min={0}
                                max={1}
                                step={0.05}
                                value={temperature}
                                onChange={(val) => setTemperature(val)}
                                className="my-2"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>0.0 (Precise)</span>
                                <span>0.5 (Balanced)</span>
                                <span>1.0 (Creative)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM ROW CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Cost Opt */}
                <div className="card p-5 cursor-pointer hover:-translate-y-1 [transition:0.3s]">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 mb-1">AI Cost Optimization</h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-3">Switching minor copywriting tasks to GPT-4o-mini could save $420/month.</p>
                            <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider group-hover:text-indigo-700">Review Strategy &rarr;</span>
                        </div>
                    </div>
                </div>

                {/* Prompt Security */}
                <div className="card p-5 cursor-pointer hover:-translate-y-1 [transition:0.3s]">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Prompt Security</h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-3">0 PII leaks detected in the last 10,000 requests. Filter is active.</p>
                            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">View Report &rarr;</span>
                        </div>
                    </div>
                </div>

                {/* Feature Velocity */}
                <div className="card p-5 cursor-pointer hover:-translate-y-1 [transition:0.3s]">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Feature Velocity</h3>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-3">Sentiment analysis usage grew by 24% this week. Scaling workers...</p>
                            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider group-hover:text-emerald-700">Manage Nodes &rarr;</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MANAGE AI DRAWER --- */}
            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-indigo-600" />
                        <span className="font-extrabold text-slate-900 text-lg">AI Model Operations</span>
                    </div>
                }
                placement="right"
                size="large"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <div className="space-y-6">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Control active AI engines running in the production stack. Disabling a model will pause background inference tasks and divert fallback requests.
                    </p>

                    <div className="space-y-4">
                        {models.map((model) => (
                            <div
                                key={model.id}
                                className={`p-4 rounded-2xl border transition-all ${model.enabled
                                    ? "bg-slate-50 border-slate-200 shadow-2xs"
                                    : "bg-slate-100/80 border-slate-200 opacity-70"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`p-2 rounded-xl border ${model.enabled
                                                ? "bg-white border-slate-200 text-indigo-600"
                                                : "bg-slate-200 border-slate-300 text-slate-400"
                                                }`}
                                        >
                                            <Power className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-extrabold text-slate-900">{model.name}</h4>
                                            <span className="text-[11px] text-slate-400 font-semibold">{model.provider}</span>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={model.enabled}
                                        onChange={() => toggleModel(model.id)}
                                        className={model.enabled ? "bg-indigo-600" : ""}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center">
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                                        {model.enabled ? (
                                            model.status === "degraded" ? (
                                                <Tag color="warning" className="m-0 text-[10px] font-extrabold">Degraded</Tag>
                                            ) : (
                                                <Tag color="success" className="m-0 text-[10px] font-extrabold">Active</Tag>
                                            )
                                        ) : (
                                            <Tag color="default" className="m-0 text-[10px] font-extrabold">Disabled</Tag>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Latency</span>
                                        <span className="text-xs font-extrabold text-slate-700">
                                            {model.enabled ? model.latency : "--"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Type</span>
                                        <span className="text-xs font-extrabold text-indigo-600">{model.type}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mt-8">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                                <h5 className="text-xs font-extrabold text-indigo-950 mb-1">Automatic Failover Active</h5>
                                <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                                    When an AI model is disabled, traffic automatically reroutes to the secondary tier (e.g. OpenAI GPT-4o-mini).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
