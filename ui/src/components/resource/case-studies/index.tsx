"use client";

import React from "react";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export default function CaseStudiesSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className={`case-studies-section ${themeClass}`}>
            <div className="text-center mb-16">
                <h2 className={`case-studies-title ${themeClass}`}>Case Studies</h2>
                <p className={`case-studies-sub ${themeClass}`}>
                    See how industry leaders are leveraging SocialFlow AI to transform their digital presence and drive measurable growth.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Case 1 */}
                <div className={`case-studies-card group ${themeClass}`}>
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
                <div className={`case-studies-card group ${themeClass}`}>
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
    );
}
