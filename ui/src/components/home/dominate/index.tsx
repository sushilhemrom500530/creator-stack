"use client";

import { useEffect, useState } from "react";
import { Sparkles, PlaySquare, Activity, ArrowRight } from "lucide-react";

// Typing animation component
const TypingEffect = () => {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const targetText = "Generating viral hook...";

    useEffect(() => {
        let isCancelled = false;

        const animate = async () => {
            while (!isCancelled) {
                // Phase 1: Loading
                setIsLoading(true);
                setText("");
                await new Promise(resolve => setTimeout(resolve, 1500));

                if (isCancelled) break;

                // Phase 2: Typing
                setIsLoading(false);
                for (let i = 1; i <= targetText.length; i++) {
                    if (isCancelled) break;
                    setText(targetText.slice(0, i));
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

                if (isCancelled) break;

                // Phase 3: Pause
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        };

        animate();

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <div className="bg-[#2c2443]/40 border border-[#483a6b] rounded-md px-3 py-2 mt-4 text-xs font-mono text-[#a694d4] flex items-center h-8 relative shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent pointer-events-none" />
            {isLoading ? (
                <div className="flex space-x-1 items-center opacity-80 z-10">
                    <div className="w-1.5 h-1.5 bg-[#a694d4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#a694d4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#a694d4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            ) : (
                <span className="z-10 tracking-wide flex items-center">
                    {text}
                    <span className="animate-pulse ml-[1px] font-bold text-violet-300">|</span>
                </span>
            )}
        </div>
    );
};

export function DominateSection() {
    return (
        <section className="relative w-full bg-[#100e16] py-24 flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
            {/* Background Glows matching Banner */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-[#14b8a6]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1000px] w-full mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* Header Subtext & Title */}
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 text-center tracking-tight">
                    Dominate Every Platform
                </h2>
                <p className="text-gray-400 text-[15px] md:text-[17px] text-center max-w-2xl mb-16 tracking-wide">
                    Elite tools designed for high-growth teams who refuse to settle for average performance.
                </p>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">

                    {/* Card 1: AI Content Command (Spans 2 cols on Desktop) */}
                    <div className="col-span-1 md:col-span-2 bg-[#171520] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg hover:border-white/10 transition-colors group">
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="w-11 h-11 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/20 mb-5 relative group-hover:scale-110 transition-transform">
                                <div className="absolute inset-0 bg-violet-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Sparkles className="text-violet-400 w-5 h-5 relative z-10" />
                            </div>
                            <h3 className="text-white font-bold text-[17px] mb-2">AI Content Command</h3>
                            <p className="text-gray-400 text-[13px] leading-[1.6] mb-6 pr-4">
                                Our neural architecture doesn't just suggest — it architects. Plan 30 days of high-converting content across 15 platforms in under 3 minutes.
                            </p>
                            <button className="text-violet-300 hover:text-violet-100 text-[13px] font-bold flex items-center gap-1.5 group/btn w-fit transition-colors">
                                Explore Neural Engine
                                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                            </button>
                        </div>
                        {/* Mockup Right Side */}
                        <div className="w-full md:w-[260px] h-[160px] bg-[#221f2d]/50 rounded-2xl border border-white/5 p-4 flex flex-col justify-center relative shadow-inner">
                            <div className="w-[60%] h-1.5 bg-gray-500/20 rounded-full mb-2.5"></div>
                            <div className="w-[90%] h-1.5 bg-gray-500/10 rounded-full mb-5"></div>
                            <TypingEffect />
                        </div>
                    </div>

                    {/* Card 2: Omni-Publish (Span 1 col) */}
                    <div className="col-span-1 bg-[#171520] border border-white/5 rounded-3xl p-8 flex flex-col shadow-lg hover:border-white/10 transition-colors group">
                        <div className="w-11 h-11 rounded-xl bg-[#14b8a6]/10 flex items-center justify-center border border-[#14b8a6]/20 mb-5 relative group-hover:scale-110 transition-transform">
                            <div className="absolute inset-0 bg-[#14b8a6]/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <PlaySquare className="text-[#14b8a6] w-5 h-5 relative z-10" />
                        </div>
                        <h3 className="text-white font-bold text-[17px] mb-2 mt-auto">Omni-Publish</h3>
                        <p className="text-gray-400 text-[13px] leading-[1.6]">
                            Native resizing and AI-adaptive formatting for TikTok, Reels, and Shorts automatically.
                        </p>
                    </div>

                    {/* Card 3: Deep Analytics (Span 1 col) */}
                    <div className="col-span-1 bg-[#171520] border border-white/5 rounded-3xl p-8 flex flex-col shadow-lg hover:border-white/10 transition-colors group">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-5 relative group-hover:scale-110 transition-transform">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Activity className="text-blue-400 w-5 h-5 relative z-10" />
                        </div>
                        <h3 className="text-white font-bold text-[17px] mb-2 mt-auto">Deep Analytics</h3>
                        <p className="text-gray-400 text-[13px] leading-[1.6]">
                            Multi-touch attribution and sentiment analysis across every single connected channel.
                        </p>
                    </div>

                    {/* Card 4: Voice Synthesis (Span 2 cols on Desktop) */}
                    <div className="col-span-1 md:col-span-2 bg-[#171520] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg hover:border-white/10 transition-colors">
                        {/* Mockup Left Side */}
                        <div className="w-full md:w-[260px] bg-[#221f2d]/50 rounded-2xl border border-white/5 p-5 shadow-inner">
                            <div className="flex gap-2 mb-4">
                                <span className="text-[8px] font-bold tracking-wider text-gray-400 bg-black/40 px-2 py-1 rounded-sm border border-gray-700/50">PROFESSIONAL</span>
                                <span className="text-[8px] font-bold tracking-wider text-violet-200 bg-violet-900/40 px-2 py-1 rounded-sm border border-violet-500/30">LUXURY</span>
                            </div>
                            <p className="text-white/70 font-serif italic text-[13px] leading-relaxed">
                                "Elevate your lifestyle with the precision of AI-driven curation..."
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col justify-center pl-0 md:pl-2">
                            <h3 className="text-white font-bold text-[17px] mb-2">Voice Synthesis</h3>
                            <p className="text-gray-400 text-[13px] leading-[1.6] max-w-[280px]">
                                AI that mirrors your brand voice with 99.8% accuracy. Maintains consistency across thousands of posts.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}