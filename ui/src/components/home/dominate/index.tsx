"use client";

import { Sparkles, PlaySquare, Activity, ArrowRight } from "lucide-react";
import { TypingEffect } from "@/components/typing-effect";
import { useTheme } from "@/providers/mode-theme";

export function DominateSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <section className={`relative w-full py-24 flex flex-col items-center justify-center overflow-hidden border-t transition-colors duration-300 ${isLight ? "bg-white border-slate-200/80" : "bg-[#100e16] border-white/5"
            }`}>
            {/* Background Glows matching Banner */}
            <div className={`absolute top-[20%] left-[-10%] w-[500px] h-[500px] blur-[130px] rounded-full pointer-events-none ${isLight ? "bg-violet-300/20" : "bg-violet-600/10"
                }`} />
            <div className={`absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none ${isLight ? "bg-teal-300/20" : "bg-[#14b8a6]/10"
                }`} />

            <div className="max-w-[1000px] w-full mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* Header Subtext & Title */}
                <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-6 text-center tracking-tight ${isLight ? "text-slate-900" : "text-white"
                    }`}>
                    Dominate Every Platform
                </h2>
                <p className={`text-[15px] md:text-[17px] text-center max-w-2xl mb-16 tracking-wide ${isLight ? "text-slate-600" : "text-gray-400"
                    }`}>
                    Elite tools designed for high-growth teams who refuse to settle for average performance.
                </p>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">

                    {/* Card 1: AI Content Command (Spans 2 cols on Desktop) */}
                    <div className={`col-span-1 md:col-span-2 border rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg transition-colors group ${isLight
                            ? "bg-slate-50/90 border-slate-200/90 hover:border-violet-300 shadow-slate-100"
                            : "bg-[#171520] border-white/5 hover:border-white/10"
                        }`}>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="w-11 h-11 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/20 mb-5 relative group-hover:scale-110 transition-transform">
                                <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Sparkles className="text-violet-500 w-5 h-5 relative z-10" />
                            </div>
                            <h3 className={`font-bold text-[17px] mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>AI Content Command</h3>
                            <p className={`text-[13px] leading-[1.6] mb-6 pr-4 ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                                Our neural architecture doesn't just suggest — it architects. Plan 30 days of high-converting content across 15 platforms in under 3 minutes.
                            </p>
                            <button className={`text-[13px] font-bold flex items-center gap-1.5 group/btn w-fit transition-colors ${isLight ? "text-violet-700 hover:text-violet-900" : "text-violet-300 hover:text-violet-100"
                                }`}>
                                Explore Neural Engine
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                            </button>
                        </div>
                        {/* Mockup Right Side */}
                        <div className={`w-full md:w-[260px] h-[160px] rounded-2xl border p-4 flex flex-col justify-center relative shadow-inner ${isLight ? "bg-white border-slate-200" : "bg-[#221f2d]/50 border-white/5"
                            }`}>
                            <div className={`w-[60%] h-1.5 rounded-full mb-2.5 ${isLight ? "bg-slate-300" : "bg-gray-500/20"}`}></div>
                            <div className={`w-[90%] h-1.5 rounded-full mb-5 ${isLight ? "bg-slate-200" : "bg-gray-500/10"}`}></div>
                            <TypingEffect />
                        </div>
                    </div>

                    {/* Card 2: Omni-Publish (Span 1 col) */}
                    <div className={`col-span-1 border rounded-3xl p-8 flex flex-col shadow-lg transition-colors group ${isLight
                            ? "bg-slate-50/90 border-slate-200/90 hover:border-violet-300 shadow-slate-100"
                            : "bg-[#171520] border-white/5 hover:border-white/10"
                        }`}>
                        <div className="w-11 h-11 rounded-xl bg-[#14b8a6]/10 flex items-center justify-center border border-[#14b8a6]/20 mb-5 relative group-hover:scale-110 transition-transform">
                            <div className="absolute inset-0 bg-[#14b8a6]/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <PlaySquare className="text-[#0d9488] w-5 h-5 relative z-10" />
                        </div>
                        <h3 className={`font-bold text-[17px] mb-2 mt-auto ${isLight ? "text-slate-900" : "text-white"}`}>Omni-Publish</h3>
                        <p className={`text-[13px] leading-[1.6] ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                            Native resizing and AI-adaptive formatting for TikTok, Reels, and Shorts automatically.
                        </p>
                    </div>

                    {/* Card 3: Deep Analytics (Span 1 col) */}
                    <div className={`col-span-1 border rounded-3xl p-8 flex flex-col shadow-lg transition-colors group ${isLight
                            ? "bg-slate-50/90 border-slate-200/90 hover:border-violet-300 shadow-slate-100"
                            : "bg-[#171520] border-white/5 hover:border-white/10"
                        }`}>
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-5 relative group-hover:scale-110 transition-transform">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Activity className="text-blue-500 w-5 h-5 relative z-10" />
                        </div>
                        <h3 className={`font-bold text-[17px] mb-2 mt-auto ${isLight ? "text-slate-900" : "text-white"}`}>Deep Analytics</h3>
                        <p className={`text-[13px] leading-[1.6] ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                            Multi-touch attribution and sentiment analysis across every single connected channel.
                        </p>
                    </div>

                    {/* Card 4: Voice Synthesis (Span 2 cols on Desktop) */}
                    <div className={`col-span-1 md:col-span-2 border rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg transition-colors ${isLight
                            ? "bg-slate-50/90 border-slate-200/90 hover:border-violet-300 shadow-slate-100"
                            : "bg-[#171520] border-white/5 hover:border-white/10"
                        }`}>
                        {/* Mockup Left Side */}
                        <div className={`w-full md:w-[260px] rounded-2xl border p-5 shadow-inner ${isLight ? "bg-white border-slate-200" : "bg-[#221f2d]/50 border-white/5"
                            }`}>
                            <div className="flex gap-2 mb-4">
                                <span className={`text-[8px] font-bold tracking-wider px-2 py-1 rounded-sm border ${isLight ? "bg-slate-100 text-slate-700 border-slate-300" : "text-gray-400 bg-black/40 border-gray-700/50"
                                    }`}>PROFESSIONAL</span>
                                <span className={`text-[8px] font-bold tracking-wider px-2 py-1 rounded-sm border ${isLight ? "bg-violet-100 text-violet-800 border-violet-200" : "text-violet-200 bg-violet-900/40 border-violet-500/30"
                                    }`}>LUXURY</span>
                            </div>
                            <p className={`font-serif italic text-[13px] leading-relaxed ${isLight ? "text-slate-700" : "text-white/70"
                                }`}>
                                "Elevate your lifestyle with the precision of AI-driven curation..."
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col justify-center pl-0 md:pl-2">
                            <h3 className={`font-bold text-[17px] mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Voice Synthesis</h3>
                            <p className={`text-[13px] leading-[1.6] max-w-[280px] ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                                AI that mirrors your brand voice with 99.8% accuracy. Maintains consistency across thousands of posts.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
