"use client";

import { Sparkles, PlaySquare, Activity, ArrowRight } from "lucide-react";
import { TypingEffect } from "@/components/typing-effect";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";
import { Title } from "@/components/reuseable/title";

export function DominateSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className={`dominate-section ${themeClass}`}>
            {/* Background Glows */}
            <div className={`dominate-glow-blob dominate-glow-top-left ${themeClass}`} />
            <div className={`dominate-glow-blob dominate-glow-bottom-right ${themeClass}`} />

            <div className="dominate-header">
                <Title
                    title="Dominate Every Platform"
                    description="Elite tools designed for high-growth teams who refuse to settle for average performance."
                />

                {/* Bento Grid layout */}
                <div className="dominate-bento-grid">

                    {/* Card 1: AI Content Command */}
                    <div className={`dominate-card dominate-card-wide group ${themeClass}`}>
                        <div className="dominate-card-body">
                            <div className="dominate-icon-wrapper bg-violet-600/10 border-violet-500/20">
                                <div className="dominate-icon-glow opacity-0" />
                                <Sparkles className="text-violet-500 w-5 h-5 relative z-10" />
                            </div>
                            <h3 className={`dominate-card-title ${themeClass}`}>AI Content Command</h3>
                            <p className={`dominate-card-desc mb-6 pr-4 ${themeClass}`}>
                                Our neural architecture doesn't just suggest — it architects. Plan 30 days of high-converting content across 15 platforms in under 3 minutes.
                            </p>
                            <button className={`dominate-action-btn group/btn ${themeClass}`}>
                                Explore Neural Engine
                                <ArrowRight className="dominate-action-btn-icon group-hover/btn:translate-x-1.5" />
                            </button>
                        </div>
                        {/* Mockup Right Side */}
                        <div className={`dominate-mockup-box w-full md:w-[260px] h-[160px] ${themeClass}`}>
                            <div className={`dominate-mockup-skeleton-sm ${themeClass}`}></div>
                            <div className={`dominate-mockup-skeleton-lg ${themeClass}`}></div>
                            <TypingEffect />
                        </div>
                    </div>

                    {/* Card 2: Omni-Publish */}
                    <div className={`dominate-card dominate-card-single group ${themeClass}`}>
                        <div className="dominate-icon-wrapper bg-[#14b8a6]/10 border-[#14b8a6]/20">
                            <div className="dominate-icon-glow opacity-0" />
                            <PlaySquare className="text-[#0d9488] w-5 h-5 relative z-10" />
                        </div>
                        <h3 className={`dominate-card-title mt-auto ${themeClass}`}>Omni-Publish</h3>
                        <p className={`dominate-card-desc ${themeClass}`}>
                            Native resizing and AI-adaptive formatting for TikTok, Reels, and Shorts automatically.
                        </p>
                    </div>

                    {/* Card 3: Deep Analytics */}
                    <div className={`dominate-card dominate-card-single group ${themeClass}`}>
                        <div className="dominate-icon-wrapper bg-blue-500/10 border-blue-500/20">
                            <div className="dominate-icon-glow opacity-0" />
                            <Activity className="text-blue-500 w-5 h-5 relative z-10" />
                        </div>
                        <h3 className={`dominate-card-title mt-auto ${themeClass}`}>Deep Analytics</h3>
                        <p className={`dominate-card-desc ${themeClass}`}>
                            Multi-touch attribution and sentiment analysis across every single connected channel.
                        </p>
                    </div>

                    {/* Card 4: Voice Synthesis */}
                    <div className={`dominate-card dominate-card-wide group ${themeClass}`}>
                        {/* Mockup Left Side */}
                        <div className={`dominate-mockup-box w-full md:w-[260px] p-5 ${themeClass}`}>
                            <div className="flex gap-2 mb-4">
                                <span className={`dominate-voice-badge dominate-voice-badge-pro ${themeClass}`}>PROFESSIONAL</span>
                                <span className={`dominate-voice-badge dominate-voice-badge-luxury ${themeClass}`}>LUXURY</span>
                            </div>
                            <p className={`font-serif italic text-[13px] leading-relaxed ${isLight ? "text-slate-700" : "text-white/70"}`}>
                                "Elevate your lifestyle with the precision of AI-driven curation..."
                            </p>
                        </div>
                        <div className="dominate-card-body pl-0 md:pl-2">
                            <h3 className={`dominate-card-title ${themeClass}`}>Voice Synthesis</h3>
                            <p className={`dominate-card-desc max-w-[280px] ${themeClass}`}>
                                AI that mirrors your brand voice with 99.8% accuracy. Maintains consistency across thousands of posts.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
