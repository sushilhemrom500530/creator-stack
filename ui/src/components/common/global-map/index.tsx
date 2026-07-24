"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    Radio,
    Activity
} from "lucide-react";
import mapImg from "@/assets/dashboard/map.png";

interface CountryStat {
    id: string;
    name: string;
    code: string;
    flag: string;
    percentage: number;
    reach: string;
    users: number;
    latency: number;
    cities: string[];
    topPos: { x: string; y: string }; // Position on map in percentage
    color: string;
}

const STATIC_COUNTRIES: CountryStat[] = [
    {
        id: "USA",
        name: "United States",
        code: "US",
        flag: "🇺🇸",
        percentage: 47,
        reach: "39.8K",
        users: 39820,
        latency: 18,
        cities: ["New York", "San Francisco", "Chicago"],
        topPos: { x: "24%", y: "38%" },
        color: "from-blue-500 via-indigo-500 to-purple-500"
    },
    {
        id: "JPN",
        name: "Japan",
        code: "JP",
        flag: "🇯🇵",
        percentage: 19,
        reach: "16.2K",
        users: 16200,
        latency: 55,
        cities: ["Tokyo", "Osaka", "Kyoto"],
        topPos: { x: "82%", y: "36%" },
        color: "from-pink-500 to-rose-500"
    },
    {
        id: "DEU",
        name: "Germany",
        code: "DE",
        flag: "🇩🇪",
        percentage: 18,
        reach: "14.8K",
        users: 14890,
        latency: 20,
        cities: ["Berlin", "Munich", "Frankfurt"],
        topPos: { x: "50%", y: "29%" },
        color: "from-purple-500 to-indigo-600"
    },
    {
        id: "GBR",
        name: "United Kingdom",
        code: "GB",
        flag: "🇬🇧",
        percentage: 15,
        reach: "12.4K",
        users: 12450,
        latency: 22,
        cities: ["London", "Manchester"],
        topPos: { x: "46%", y: "26%" },
        color: "from-sky-500 to-blue-600"
    },
    {
        id: "IND",
        name: "India",
        code: "IN",
        flag: "🇮🇳",
        percentage: 24,
        reach: "20.5K",
        users: 20500,
        latency: 75,
        cities: ["Bengaluru", "Mumbai", "Delhi"],
        topPos: { x: "69%", y: "48%" },
        color: "from-emerald-500 to-teal-600"
    },
    {
        id: "BRA",
        name: "Brazil",
        code: "BR",
        flag: "🇧🇷",
        percentage: 11,
        reach: "9.4K",
        users: 9410,
        latency: 110,
        cities: ["São Paulo", "Rio de Janeiro"],
        topPos: { x: "34%", y: "68%" },
        color: "from-amber-500 to-orange-500"
    }
];

export default function WorldMapDashboard() {
    const [hoveredCountry, setHoveredCountry] = useState<CountryStat | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<CountryStat>(STATIC_COUNTRIES[0]);

    const activeDisplay = hoveredCountry || selectedCountry;

    return (
        <div className="relative z-0 isolate w-full h-full bg-white text-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 font-sans flex flex-col justify-between select-none">
            {/* Light Mode Header Control Toolbar */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 pb-3.5 gap-3 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                        <Globe className="w-5 h-5 animate-spin-slow text-blue-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold tracking-tight text-slate-800">
                                Global Geography
                            </h2>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" /> LIVE FEED
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">Audience progression & country traffic breakdown</p>
                    </div>
                </div>
            </div>

            {/* Main Interactive Map Viewport */}
            <div className="relative flex-1 w-full min-h-[300px] overflow-hidden flex items-center justify-center bg-[#090b14]">
                {/* Background World Map Image */}
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src={mapImg}
                        alt="Global Map Analytics"
                        fill
                        priority
                        className="object-cover object-center opacity-95"
                    />
                    {/* Soft gradient vignetting */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-transparent to-[#090b14]/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#090b14]/50 via-transparent to-[#090b14]/50" />
                </div>

                {/* SVG ARCS OVERLAY (Connecting USA to Europe & Asia) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 500" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="arcGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="arcGradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
                        </linearGradient>
                    </defs>

                    {/* USA (240, 190) -> UK (460, 130) */}
                    <path d="M 240 190 Q 350 110 460 130" fill="none" stroke="url(#arcGradCyan)" strokeWidth="1.8" strokeDasharray="4 2" className="animate-pulse" />

                    {/* USA (240, 190) -> Germany (500, 145) */}
                    <path d="M 240 190 Q 370 120 500 145" fill="none" stroke="url(#arcGradCyan)" strokeWidth="1.8" />

                    {/* USA (240, 190) -> Japan (820, 180) */}
                    <path d="M 240 190 Q 530 50 820 180" fill="none" stroke="url(#arcGradPurple)" strokeWidth="2" />

                    {/* Germany (500, 145) -> Japan (820, 180) */}
                    <path d="M 500 145 Q 660 80 820 180" fill="none" stroke="url(#arcGradPurple)" strokeWidth="1.5" strokeDasharray="3 2" />

                    {/* USA (240, 190) -> Brazil (340, 340) */}
                    <path d="M 240 190 Q 270 270 340 340" fill="none" stroke="url(#arcGradCyan)" strokeWidth="1.5" />
                </svg>

                {/* COUNTRY HOTSPOT NODES PLACED ON MAP */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {STATIC_COUNTRIES.map((country) => {
                        const isHovered = hoveredCountry?.id === country.id;
                        const isSelected = selectedCountry?.id === country.id;

                        return (
                            <div
                                key={country.id}
                                style={{ left: country.topPos.x, top: country.topPos.y }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                                onMouseEnter={() => setHoveredCountry(country)}
                                onMouseLeave={() => setHoveredCountry(null)}
                                onClick={() => setSelectedCountry(country)}
                            >
                                {/* Glowing Pulsing Aura */}
                                <div className="relative flex items-center justify-center">
                                    <span className="absolute w-7 h-7 rounded-full bg-cyan-400/30 animate-ping" />
                                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f2fe] border-2 border-white group-hover:scale-125 transition" />

                                    {/* Country Label Tag */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-white/95 border border-slate-200/90 backdrop-blur-md shadow-md text-[10px] font-bold text-slate-800 whitespace-nowrap group-hover:border-blue-500 transition">
                                        {country.flag} {country.name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ============================================================ */}
                {/* LIGHT MODE FLOATING GLASS CARDS MATCHING REFERENCE IMAGE */}
                {/* ============================================================ */}

                {/* 1. BOTTOM LEFT CARD (USA / POR Stat Box) */}
                <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-3.5 rounded-2xl shadow-xl w-44 sm:w-48">
                    {/* Top Gradient Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3 p-[1px] border border-slate-300/60">
                        <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full" />
                    </div>

                    {/* Stats Rows */}
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-500 tracking-wider">USA</span>
                            <span className="font-bold text-slate-900 tracking-wide">39.8K</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="font-semibold text-slate-500 tracking-wider">POR</span>
                            <span className="font-bold text-slate-700 tracking-wide">3,068</span>
                        </div>
                    </div>
                </div>

                {/* 2. BOTTOM CENTER DONUT PROGRESS GAUGE ("62") */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-2.5 rounded-2xl shadow-xl w-20 h-20 flex items-center justify-center">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-slate-100"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                strokeWidth="3.5"
                                strokeDasharray="62, 100"
                                strokeLinecap="round"
                                stroke="#2563eb"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-extrabold text-slate-900">62</span>
                        </div>
                    </div>
                </div>

                {/* 3. MIDDLE RIGHT CARD (USA 47% Sparkline Card) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-3 rounded-2xl shadow-xl w-36 sm:w-40">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="w-6 h-1 rounded-full bg-slate-200 inline-block" />
                    </div>

                    {/* Sparkline Curve */}
                    <div className="w-full h-6 mb-1.5">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                            <path
                                d="M 0 25 Q 25 20, 50 15 T 100 5 L 100 30 L 0 30 Z"
                                fill="rgba(37, 99, 235, 0.15)"
                            />
                            <path
                                d="M 0 25 Q 25 20, 50 15 T 100 5"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="font-medium text-slate-500">USA</span>
                        <span className="font-bold text-blue-600 text-xs">47%</span>
                    </div>
                </div>

                {/* 4. HOVER / SELECTION COUNTRY DETAILS CARD */}
                <AnimatePresence>
                    {activeDisplay && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-2xl border border-blue-200/80 p-3.5 rounded-2xl shadow-xl w-52 sm:w-56 text-left"
                        >
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{activeDisplay.flag}</span>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                            {activeDisplay.name}
                                        </h3>
                                        <span className="text-[9px] text-slate-400 font-mono">
                                            ISO: {activeDisplay.code}
                                        </span>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                                    {activeDisplay.percentage}% SHARE
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-2 text-[11px]">
                                <div>
                                    <div className="flex justify-between text-slate-500 mb-1">
                                        <span>Audience Traffic</span>
                                        <span className="text-blue-600 font-bold">{activeDisplay.reach}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`bg-gradient-to-r ${activeDisplay.color} h-full rounded-full transition-all duration-500`}
                                            style={{ width: `${activeDisplay.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                                    <span>Latency: <strong className="text-emerald-600">{activeDisplay.latency}ms</strong></span>
                                    <span>Status: <strong className="text-blue-600">Optimal</strong></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* LIGHT MODE STATIC COUNTRY PROGRESS SECTION */}
            <div className="relative z-20 p-4 bg-slate-50/70 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        Top Geographic Countries & Progress
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400">Live Breakdown</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {STATIC_COUNTRIES.map((country) => (
                        <div
                            key={country.id}
                            onClick={() => setSelectedCountry(country)}
                            className={`p-2.5 rounded-xl border transition cursor-pointer ${selectedCountry.id === country.id
                                ? "bg-white border-blue-500/80 shadow-sm ring-1 ring-blue-500/20"
                                : "bg-white/80 border-slate-200/80 hover:border-slate-300"
                                }`}
                        >
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="flex items-center gap-1.5 text-slate-800 font-semibold text-[11px] truncate">
                                    <span>{country.flag}</span> {country.name}
                                </span>
                                <span className="text-blue-600 font-bold text-[11px]">{country.percentage}%</span>
                            </div>

                            {/* Light Mode Static Progress Bar */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                                <div
                                    className={`bg-gradient-to-r ${country.color} h-full rounded-full`}
                                    style={{ width: `${country.percentage}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1.5">
                                <span>{country.reach} users</span>
                                <span className="text-slate-500">{country.latency}ms</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}