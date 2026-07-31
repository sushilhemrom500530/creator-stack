"use client";

import React from 'react';
import { useTheme } from '@/providers/mode-theme';
import "./page.css";
import UserGuideSection from '@/components/resource/user-guide';

export default function ResourcesPage() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <main className={`resources-page-main ${themeClass}`}>
            {/* Banner Section */}
            <section className={`resources-banner-section ${themeClass}`}>
                <div className="relative z-10 w-full">
                    {/* Ambient Background Glow */}
                    <div className={`resources-banner-glow ${themeClass}`}></div>

                    <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
                        {/* Tagline */}
                        <div className={`tagline-badge ${themeClass}`}>
                            <span className="tagline-dot" />
                            <span className={`tagline-text ${themeClass}`}>
                                Knowledge Center
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className={`resources-heading ${themeClass}`}>
                            Resource Hub
                        </h1>

                        {/* Description */}
                        <p className={`resources-desc ${themeClass}`}>
                            Unlock the full potential of SocialFlow AI. Master AI-driven social strategy with our comprehensive guides, technical documentation, and real-world success stories.
                        </p>
                    </div>
                </div>
            </section>

            {/* User Guides */}
            <UserGuideSection />

            {/* API Documentation */}
            <section className={`resources-section ${themeClass}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className={`resources-dev-badge ${themeClass}`}>
                            <span className="text-[10px] font-bold tracking-widest uppercase">Developer Hub</span>
                        </div>
                        <h2 className={`resources-section-title ${themeClass} md:text-4xl mb-6`}>API Documentation</h2>
                        <p className={`resources-desc ${themeClass} text-lg max-w-lg mb-10 mx-0`}>
                            Integrate the world's most advanced social intelligence into your own stack. Our RESTful API provides granular access to analytics, generation, and scheduling engines.
                        </p>

                        <div className="flex flex-col gap-4 mb-10 max-w-md">
                            <div className={`resources-api-item ${themeClass}`}>
                                <span className="bg-[#B983FF]/20 text-[#DDB9FF] text-xs font-bold px-3 py-1 rounded font-mono">GET</span>
                                <div>
                                    <div className={`resources-api-item-title ${themeClass}`}>Authentication Terminals</div>
                                    <div className={`resources-api-item-sub ${themeClass}`}>OAuth 2.0 implementation guide</div>
                                </div>
                            </div>
                            <div className={`resources-api-item ${themeClass}`}>
                                <span className="bg-[#4DE1C1]/20 text-[#4DE1C1] text-xs font-bold px-3 py-1 rounded font-mono">POST</span>
                                <div>
                                    <div className={`resources-api-item-title ${themeClass}`}>Webhooks & Real-time Events</div>
                                    <div className={`resources-api-item-sub ${themeClass}`}>Listen for mentions and engagement</div>
                                </div>
                            </div>
                        </div>

                        <button className={`resources-api-btn ${themeClass}`}>
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

            {/* Case Studies */}
            <section className={`resources-section ${themeClass}`}>
                <div className="text-center mb-16">
                    <h2 className={`resources-section-title ${themeClass} md:text-4xl mb-4`}>Case Studies</h2>
                    <p className={`resources-section-sub ${themeClass} max-w-2xl mx-auto`}>
                        See how industry leaders are leveraging SocialFlow AI to transform their digital presence and drive measurable growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Case 1 */}
                    <div className={`resources-case-card group ${themeClass}`}>
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                            alt="City building"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" : "bg-gradient-to-t from-[#0a0614] via-[#0a0614]/60 to-transparent"}`}></div>

                        <div className="absolute bottom-0 w-full p-8 md:p-12 flex flex-col justify-end h-full">
                            <span className="text-[10px] font-bold tracking-widest text-[#4DE1C1] uppercase mb-4">Enterprise</span>
                            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white">Lumina Global</h3>
                            <p className="text-[#a19bb0] text-sm md:text-base leading-relaxed mb-10 max-w-md">
                                How an e-commerce giant scaled their social content by 400% while reducing overhead by 40% using our AI core.
                            </p>

                            <div className="flex gap-10">
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">400%</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">Growth</div>
                                </div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">12M+</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">Impressions</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Case 2 */}
                    <div className={`resources-case-card group ${themeClass}`}>
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80"
                            alt="Office space"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" : "bg-gradient-to-t from-[#0a0614] via-[#0a0614]/70 to-transparent"}`}></div>

                        <div className="absolute bottom-0 w-full p-8 md:p-12 flex flex-col justify-end h-full">
                            <span className="text-[10px] font-bold tracking-widest text-[#B983FF] uppercase mb-4">Agency</span>
                            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-white">Vivid Media</h3>
                            <p className="text-[#a19bb0] text-sm md:text-base leading-relaxed mb-10 max-w-md">
                                Transforming boutique agency workflows with predictive engagement modeling and automated client reporting.
                            </p>

                            <div className="flex gap-10">
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">3.5x</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">ROI Bounce</div>
                                </div>
                                <div>
                                    <div className="text-4xl md:text-5xl font-bold font-mono text-white mb-2">98%</div>
                                    <div className="text-[10px] text-[#a19bb0] tracking-widest uppercase">Accuracy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stay Informed Newsletter */}
            <section className="resources-newsletter-section">
                <div className={`resources-newsletter-card ${themeClass}`}>
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className={`resources-newsletter-title ${themeClass}`}>Stay Informed</h2>
                        <p className={`resources-newsletter-desc ${themeClass}`}>
                            Receive weekly insights on AI trends, social strategy, and platform updates delivered straight to your inbox.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
                            <input
                                type="email"
                                placeholder="Email address"
                                className={`resources-newsletter-input ${themeClass}`}
                                required
                            />
                            <button className={`resources-newsletter-btn ${themeClass}`}>
                                Subscribe
                            </button>
                        </form>

                        <p className={`text-[11px] uppercase tracking-widest ${isLight ? "text-slate-400" : "text-[#a19bb0]/50"}`}>
                            Join 20,000+ professionals. No spam, ever.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}