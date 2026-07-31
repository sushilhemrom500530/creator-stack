"use client";

import React from "react";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export default function ApiDocSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className={`api-docs-section ${themeClass}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className={`api-docs-dev-badge ${themeClass}`}>
                        <span className="text-[10px] font-bold tracking-widest uppercase">Developer Hub</span>
                    </div>
                    <h2 className={`api-docs-title ${themeClass}`}>API Documentation</h2>
                    <p className={`api-docs-desc ${themeClass}`}>
                        Integrate the world's most advanced social intelligence into your own stack. Our RESTful API provides granular access to analytics, generation, and scheduling engines.
                    </p>

                    <div className="flex flex-col gap-4 mb-10 max-w-md">
                        <div className={`api-docs-item ${themeClass}`}>
                            <span className="bg-[#B983FF]/20 text-[#DDB9FF] text-xs font-bold px-3 py-1 rounded font-mono">GET</span>
                            <div>
                                <div className={`api-docs-item-title ${themeClass}`}>Authentication Terminals</div>
                                <div className={`api-docs-item-sub ${themeClass}`}>OAuth 2.0 implementation guide</div>
                            </div>
                        </div>
                        <div className={`api-docs-item ${themeClass}`}>
                            <span className="bg-[#4DE1C1]/20 text-[#4DE1C1] text-xs font-bold px-3 py-1 rounded font-mono">POST</span>
                            <div>
                                <div className={`api-docs-item-title ${themeClass}`}>Webhooks & Real-time Events</div>
                                <div className={`api-docs-item-sub ${themeClass}`}>Listen for mentions and engagement</div>
                            </div>
                        </div>
                    </div>

                    <button className={`api-docs-btn ${themeClass}`}>
                        Explore API Specs
                    </button>
                </div>

                {/* Code window mock */}
                <div className="bg-[#0f0b1a] border border-white/10 rounded-2xl p-6 overflow-hidden relative shadow-2xl text-white">
                    {/* Traffic lights */}
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                        <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">SocialFlow</span> <span className="text-[#FF7B72]">=</span> <span className="text-[#D2A8FF]">require</span>(<span className="text-[#A5D6FF]">"@socialflow/sdk"</span>);

                        <span className="text-[#FF7B72]">async</span> <span className="text-[#FF7B72]">function</span> <span className="text-[#D2A8FF]">analyzeEngagement</span>() {'{'}
                        <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">client</span> <span className="text-[#FF7B72]">=</span> <span className="text-[#FF7B72]">new</span> <span className="text-[#79C0FF]">SocialFlow</span>({'{'}
                        <span className="text-[#C9D1D9]">apiKey</span><span className="text-[#FF7B72]">:</span> <span className="text-[#79C0FF]">process</span>.<span className="text-[#79C0FF]">env</span>.<span className="text-[#79C0FF]">API_KEY</span>
                        {'}'});

                        <span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">stats</span> <span className="text-[#FF7B72]">=</span> <span className="text-[#FF7B72]">await</span> <span className="text-[#79C0FF]">client</span>.<span className="text-[#79C0FF]">analytics</span>.<span className="text-[#D2A8FF]">getMetrics</span>({'{'}
                        <span className="text-[#C9D1D9]">period</span><span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">"last_30d"</span>,
                        <span className="text-[#C9D1D9]">platform</span><span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">"global"</span>
                        {'}'});

                        <span className="text-[#79C0FF]">console</span>.<span className="text-[#D2A8FF]">log</span>(<span className="text-[#A5D6FF]">`Active ROI: ${'{'}</span><span className="text-[#79C0FF]">stats</span>.<span className="text-[#79C0FF]">roi</span><span className="text-[#A5D6FF]">{'}'}`</span>);
                        {'}'}
                    </pre>
                </div>
            </div>
        </section>
    );
}
