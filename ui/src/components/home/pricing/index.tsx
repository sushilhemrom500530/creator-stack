"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useTheme } from "@/providers/mode-theme";
import { Title } from "@/components/reuseable/title";

export default function PricingSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const isYearly = billingCycle === "yearly";

    const starterPrice = isYearly ? "$39" : "$49";
    const businessPrice = isYearly ? "$119" : "$149";

    return (
        <section className={`py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center relative overflow-hidden transition-colors duration-300 ${isLight ? "bg-slate-50/60 text-slate-900" : "bg-nural text-white"
            }`}>
            {/* Background Glows matching Banner/ThreeStep */}
            <div className={`absolute top-[10%] right-[-10%] w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none ${isLight ? "bg-violet-300/20" : "bg-violet-600/10"
                }`} />
            <div className={`absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none ${isLight ? "bg-indigo-300/20" : "bg-indigo-600/10"
                }`} />

            <div className="relative z-10 flex flex-col items-center max-w-5xl w-full mx-auto  px-4 lg:px-8">
                <Title
                    title="Flexible Plans for Every Team"
                    description="Simple, transparent pricing built to scale with your content ambition."
                />

                {/* Billing Cycle Toggle */}
                <div className={`flex items-center gap-3 mt-10 p-1.5 rounded-full border backdrop-blur-md transition-colors ${isLight
                    ? "bg-slate-200/60 border-slate-300/60"
                    : "bg-white/5 border-white/10"
                    }`}>
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${billingCycle === "monthly"
                            ? "bg-violet-600 text-white shadow-md"
                            : isLight ? "text-slate-600 hover:text-slate-900" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${billingCycle === "yearly"
                            ? "bg-violet-600 text-white shadow-md"
                            : isLight ? "text-slate-600 hover:text-slate-900" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Annual
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-600 dark:text-teal-300 font-extrabold border border-teal-400/30">
                            Save 20%
                        </span>
                    </button>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-5 w-full items-stretch mt-16">

                    {/* Starter Plan */}
                    <div className={`relative rounded-[2rem] p-8 lg:p-9 border flex flex-col justify-between transition-all duration-300 ${isLight
                        ? "bg-white/90 border-slate-200/90 shadow-lg shadow-slate-200/40 hover:border-violet-300"
                        : "bg-[#14121e]/80 border-white/[0.06] shadow-xl hover:border-white/20"
                        }`}>
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className={`text-[11px] font-bold font-mono tracking-[0.2em] uppercase ${isLight ? "text-slate-500" : "text-gray-400"
                                    }`}>
                                    Starter
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-8">
                                <span className={`text-5xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"
                                    }`}>
                                    {starterPrice}
                                </span>
                                <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-gray-400"
                                    }`}>
                                    /month
                                </span>
                            </div>

                            <ul className="flex flex-col gap-4 mb-8">
                                {[
                                    "10 Accounts Connection",
                                    "AI Content Draft Generator",
                                    "Core Engagement Analytics",
                                    "Standard Support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${isLight ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                                            }`}>
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        <span className={isLight ? "text-slate-700 font-medium" : "text-gray-300 font-medium"}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className={`w-full py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${isLight
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                            : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                            }`}>
                            Get Started
                        </button>
                    </div>

                    {/* Business Plan (Featured / Popular) */}
                    <div className={`relative rounded-[2rem] p-8 lg:p-9 border flex flex-col justify-between transition-all duration-300 md:-translate-y-3 ${isLight
                        ? "bg-white border-2 border-violet-500/80 shadow-[0_20px_50px_rgba(124,58,237,0.15)] hover:border-violet-600"
                        : "bg-[#171524] border-2 border-violet-500/60 shadow-[0_20px_50px_rgba(124,58,237,0.22)] hover:border-violet-500/80"
                        }`}>
                        {/* Top-Right Glow Overlay inside card */}
                        <div className={`absolute -right-10 -top-10 w-44 h-44 blur-3xl rounded-full pointer-events-none ${isLight ? "bg-violet-400/20" : "bg-violet-600/20"
                            }`} />

                        <div>
                            {/* Card Header with Integrated Badge */}
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <span className="text-[11px] font-bold font-mono tracking-[0.2em] uppercase text-violet-600 dark:text-violet-400">
                                    Business
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30">
                                    <Sparkles className="w-3 h-3 fill-current" /> Most Popular
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-8 relative z-10">
                                <span className={`text-5xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"
                                    }`}>
                                    {businessPrice}
                                </span>
                                <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-gray-400"
                                    }`}>
                                    /month
                                </span>
                            </div>

                            <ul className="flex flex-col gap-4 mb-8 relative z-10">
                                {[
                                    "Unlimited Accounts",
                                    "Full Agentic Co-Pilot",
                                    "White-label PDF Reports",
                                    "Priority AI Server Access",
                                    "Automated Scheduling Engine"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-violet-600 text-white shadow-sm">
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        <span className={`font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(124,58,237,0.35)] cursor-pointer flex items-center justify-center gap-2 relative z-10">
                            Start Free Trial
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className={`relative rounded-[2rem] p-8 lg:p-9 border flex flex-col justify-between transition-all duration-300 ${isLight
                        ? "bg-white/90 border-slate-200/90 shadow-lg shadow-slate-200/40 hover:border-violet-300"
                        : "bg-[#14121e]/80 border-white/[0.06] shadow-xl hover:border-white/20"
                        }`}>
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className={`text-[11px] font-bold font-mono tracking-[0.2em] uppercase ${isLight ? "text-slate-500" : "text-gray-400"
                                    }`}>
                                    Enterprise
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-2">
                                <span className={`text-5xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"
                                    }`}>
                                    Custom
                                </span>
                            </div>
                            <p className={`text-xs mb-8 leading-relaxed ${isLight ? "text-slate-500" : "text-gray-400"
                                }`}>
                                Tailored infrastructure & SLAs for large organizations.
                            </p>

                            <ul className="flex flex-col gap-4 mb-8">
                                {[
                                    "Dedicated Account Manager",
                                    "Custom AI Model Fine-Tuning",
                                    "Full REST & Webhook API Access",
                                    "99.9% Uptime Guarantee SLA"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${isLight ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                                            }`}>
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        <span className={isLight ? "text-slate-700 font-medium" : "text-gray-300 font-medium"}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className={`w-full py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${isLight
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                            : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                            }`}>
                            Contact Sales
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
