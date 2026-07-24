"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountryData {
    id: string;
    name: string;
    label: string;
    x: number; // percentage X position on map canvas
    y: number; // percentage Y position on map canvas
    progress: number;
    value: string;
    subValue?: string;
    color: "cyan" | "purple" | "pink";
}

const COUNTRIES: CountryData[] = [
    {
        id: "usa",
        name: "USA",
        label: "USA",
        x: 23,
        y: 38,
        progress: 84,
        value: "39.8K",
        subValue: "Active Users",
        color: "cyan",
    },
    {
        id: "uk",
        name: "United Kingdom",
        label: "UK",
        x: 47.5,
        y: 28,
        progress: 68,
        value: "14.2K",
        subValue: "Traffic Share",
        color: "purple",
    },
    {
        id: "germany",
        name: "Germany",
        label: "GERMANY",
        x: 50.5,
        y: 32,
        progress: 72,
        value: "18.5K",
        subValue: "Conversion",
        color: "cyan",
    },
    {
        id: "japan",
        name: "Japan",
        label: "JAPAN",
        x: 82,
        y: 41,
        progress: 47,
        value: "22.1K",
        subValue: "Growth Rate",
        color: "pink",
    },
];

// Additional glowing nodes for visual density
const NODES = [
    { x: 18, y: 22, color: "cyan" },
    { x: 28, y: 72, color: "cyan" },
    { x: 31, y: 82, color: "cyan" },
    { x: 44, y: 44, color: "cyan" },
    { x: 49, y: 64, color: "cyan" },
    { x: 53, y: 78, color: "cyan" },
    { x: 57, y: 48, color: "cyan" },
    { x: 70, y: 44, color: "pink" },
    { x: 74, y: 35, color: "cyan" },
    { x: 81, y: 81, color: "pink" },
];

export default function WorldMapDashboard() {
    const [activeCountry, setActiveCountry] = useState<CountryData | null>(
        COUNTRIES[0]
    );
    const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(
        null
    );

    const displayCountry = hoveredCountry || activeCountry || COUNTRIES[0];

    return (
        <div className="relative min-h-screen w-full bg-[#0a0c14] text-white flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden select-none font-sans">
            {/* Background Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-pink-900/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Main Container */}
            <div className="relative w-full max-w-6xl aspect-[16/9] rounded-3xl border border-white/10 bg-[#0d0f1a]/80 backdrop-blur-xl shadow-2xl p-6 overflow-hidden">

                {/* World Map SVG Canvas */}
                <div className="relative w-full h-full">
                    {/* Base World Map Silhouette */}
                    <svg
                        viewBox="0 0 1000 500"
                        className="w-full h-full opacity-25 text-slate-500 fill-current"
                    >
                        {/* Simplified Map Outline */}
                        <path d="M150,120 Q180,100 220,130 T280,180 Q250,220 200,200 Z M220,250 Q260,260 280,320 T240,420 Q200,380 210,300 Z M450,120 Q500,100 540,140 T480,220 Q440,180 450,120 Z M420,230 Q480,220 520,280 T480,400 Q430,350 420,230 Z M580,100 Q700,80 850,120 T800,280 Q700,260 600,220 Z M750,340 Q820,330 840,400 T780,440 Z" />
                    </svg>

                    {/* Connection Arcs SVG Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <linearGradient id="cyanArc" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                            </linearGradient>
                            <linearGradient id="purpleArc" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>

                        {/* Dynamic Animated Arcs */}
                        <path
                            d="M 230 190 Q 350 100 475 140"
                            fill="none"
                            stroke="url(#cyanArc)"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                            className="animate-pulse"
                        />
                        <path
                            d="M 230 190 Q 520 80 820 205"
                            fill="none"
                            stroke="url(#purpleArc)"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M 475 140 Q 650 120 820 205"
                            fill="none"
                            stroke="url(#cyanArc)"
                            strokeWidth="1.5"
                        />
                    </svg>

                    {/* Static Glowing Network Nodes */}
                    {NODES.map((node, i) => (
                        <div
                            key={i}
                            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${node.color === "pink"
                                    ? "bg-pink-400 shadow-[0_0_10px_#ec4899]"
                                    : "bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                                    }`}
                            />
                        </div>
                    ))}

                    {/* Interactive Country Markers */}
                    {COUNTRIES.map((country) => {
                        const isHovered = hoveredCountry?.id === country.id;
                        const isActive = activeCountry?.id === country.id;

                        return (
                            <div
                                key={country.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                                style={{ left: `${country.x}%`, top: `${country.y}%` }}
                                onMouseEnter={() => setHoveredCountry(country)}
                                onMouseLeave={() => setHoveredCountry(null)}
                                onClick={() => setActiveCountry(country)}
                            >
                                {/* Pulse Ring */}
                                <div
                                    className={`absolute -inset-3 rounded-full opacity-75 animate-ping ${country.color === "cyan"
                                        ? "bg-cyan-500/30"
                                        : country.color === "purple"
                                            ? "bg-purple-500/30"
                                            : "bg-pink-500/30"
                                        }`}
                                />

                                {/* Country Node Dot */}
                                <div
                                    className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${isHovered || isActive
                                        ? "scale-125 border-white bg-white shadow-[0_0_20px_#22d3ee]"
                                        : country.color === "cyan"
                                            ? "border-cyan-300 bg-cyan-500 shadow-[0_0_12px_#06b6d4]"
                                            : country.color === "purple"
                                                ? "border-purple-300 bg-purple-500 shadow-[0_0_12px_#a855f7]"
                                                : "border-pink-300 bg-pink-500 shadow-[0_0_12px_#ec4899]"
                                        }`}
                                />

                                {/* Country Badge Label */}
                                <span
                                    className={`absolute left-1/2 -translate-x-1/2 top-5 px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border backdrop-blur-md transition-all duration-200 ${isHovered || isActive
                                        ? "bg-white text-black border-white shadow-lg"
                                        : "bg-black/60 text-white/80 border-white/20 group-hover:border-white/50"
                                        }`}
                                >
                                    {country.label}
                                </span>

                                {/* Hover Tooltip / Card Preview */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#141828]/90 border border-white/20 backdrop-blur-md shadow-2xl pointer-events-none z-30"
                                        >
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-xs font-semibold text-white">
                                                    {country.name}
                                                </span>
                                                <span className="text-xs font-bold text-cyan-400">
                                                    {country.progress}%
                                                </span>
                                            </div>

                                            {/* Hover Dynamic Progress Bar */}
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${country.progress}%` }}
                                                    transition={{ duration: 0.4 }}
                                                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
                                                />
                                            </div>

                                            <div className="mt-2 flex justify-between items-center text-[11px] text-slate-400">
                                                <span>{country.subValue || "Metric"}</span>
                                                <span className="text-white font-medium">
                                                    {country.value}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Floating Glassmorphism Widgets */}

                {/* Bottom Left: Progress & Stats Card */}
                <div className="absolute bottom-6 left-6 w-56 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                        <span>{displayCountry.name}</span>
                        <span className="font-bold text-white">
                            {displayCountry.progress}%
                        </span>
                    </div>

                    {/* Animated Gradient Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                        <motion.div
                            key={displayCountry.id}
                            initial={{ width: 0 }}
                            animate={{ width: `${displayCountry.progress}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                        />
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                Total Value
                            </p>
                            <p className="text-lg font-bold text-white">
                                {displayCountry.value}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                Region
                            </p>
                            <p className="text-xs font-semibold text-cyan-400">
                                {displayCountry.label}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Center-Right: Gauge Meter Widget */}
                <div className="absolute bottom-6 left-[58%] -translate-x-1/2 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl flex items-center justify-center">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-white/10"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-cyan-400"
                                strokeDasharray={`${displayCountry.progress}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-white">
                            {displayCountry.progress}
                        </span>
                    </div>
                </div>

                {/* Right: Sparkline Card */}
                <div className="absolute bottom-20 right-6 w-44 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-300">
                            {displayCountry.label}
                        </span>
                        <span className="text-xs font-bold text-cyan-400">
                            {displayCountry.progress}%
                        </span>
                    </div>

                    {/* Mini Sparkline Graph */}
                    <div className="h-10 w-full mt-2">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                            <path
                                d="M 0 30 Q 25 35 50 20 T 100 5"
                                fill="none"
                                stroke="url(#sparklineGrad)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient
                                    id="sparklineGrad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#22d3ee" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}