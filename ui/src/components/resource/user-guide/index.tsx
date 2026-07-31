"use client";

import React from "react";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export default function UserGuideSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className={`user-guide-section ${themeClass}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-2xl">
                    <h2 className={`user-guide-title ${themeClass}`}>User Guides</h2>
                    <p className={`user-guide-sub ${themeClass}`}>
                        Step by step instructions to help you navigate our platform and optimize your social media presence with AI-generated insights.
                    </p>
                </div>
                <button className={`user-guide-action-btn ${themeClass}`}>
                    View All Guides &rarr;
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className={`user-guide-card group ${themeClass}`}>
                    <div className="w-full aspect-[16/10] rounded-xl bg-purple-900/20 mb-6 overflow-hidden relative border border-white/5">
                        <img src="https://images.unsplash.com/photo-1639322537231-2f206e06af84?auto=format&fit=crop&w=600&q=80" alt="Guide 1" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
                    </div>
                    <span className={`user-guide-category ${themeClass}`}>Getting Started</span>
                    <h3 className={`user-guide-card-title ${themeClass}`}>Onboarding Workshop</h3>
                    <p className={`user-guide-card-text ${themeClass}`}>Learn how to connect your accounts and configure your first AI-driven content calendar in under 10 minutes.</p>
                    <button className={`user-guide-link ${themeClass}`}>Read Guide</button>
                </div>

                {/* Card 2 */}
                <div className={`user-guide-card group ${themeClass}`}>
                    <div className="w-full aspect-[16/10] rounded-xl bg-blue-900/20 mb-6 overflow-hidden relative border border-white/5">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Guide 2" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
                    </div>
                    <span className={`user-guide-category ${themeClass}`}>Methodology</span>
                    <h3 className={`user-guide-card-title ${themeClass}`}>Audience Analysis</h3>
                    <p className={`user-guide-card-text ${themeClass}`}>Deep dive into the neural networks behind our audience sentiment analysis and how to leverage it for viral reach.</p>
                    <button className={`user-guide-link ${themeClass}`}>Read Guide</button>
                </div>

                {/* Card 3 */}
                <div className={`user-guide-card group ${themeClass}`}>
                    <div className="w-full aspect-[16/10] rounded-xl bg-cyan-900/20 mb-6 overflow-hidden relative border border-white/5">
                        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" alt="Guide 3" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105" />
                    </div>
                    <span className={`user-guide-category ${themeClass}`}>Strategy</span>
                    <h3 className={`user-guide-card-title ${themeClass}`}>Multi-Channel Sync</h3>
                    <p className={`user-guide-card-text ${themeClass}`}>Master the art of cross-platform narrative consistency using SocialFlow's automated tone adjustment algorithms.</p>
                    <button className={`user-guide-link ${themeClass}`}>Read Guide</button>
                </div>
            </div>
        </section>
    );
}