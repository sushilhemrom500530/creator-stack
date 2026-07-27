"use client";

import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/providers/mode-theme';

export default function PricingSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <section className={`py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center transition-colors duration-300 ${isLight ? "bg-slate-100/80 text-slate-900" : "bg-[#09090b] text-white"
            }`}>
            <div className="text-center mb-16 max-w-2xl">
                <h2 className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${isLight ? "text-violet-600" : "text-violet-400"
                    }`}>
                    Elite Access Plans
                </h2>
                <p className={`text-base font-medium ${isLight ? "text-slate-600" : "text-gray-300"}`}>
                    Simple, transparent, and built to scale with your ambition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 w-full max-w-5xl items-center">
                {/* Starter Plan */}
                <div className={`rounded-[2rem] p-8 lg:p-10 border flex flex-col h-[500px] transition-colors ${isLight ? "bg-white border-slate-200/80 shadow-lg" : "bg-[#111113] border-white/5 hover:border-white/10"
                    }`}>
                    <div className="mb-8">
                        <h3 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${isLight ? "text-slate-500" : "text-gray-400"}`}>Starter</h3>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-5xl font-serif font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>$49</span>
                            <span className={`text-xs ${isLight ? "text-slate-500" : "text-gray-500"}`}>/mo</span>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-6 mb-12 flex-1">
                        {[
                            '10 Accounts',
                            'AI Content Drafts',
                            'Core Analytics'
                        ].map((feature, i) => (
                            <li key={i} className={`flex items-center gap-3 text-sm ${isLight ? "text-slate-700" : "text-gray-300"}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className={`w-full py-4 rounded-xl text-sm font-semibold transition-colors mt-auto border cursor-pointer ${isLight
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200"
                        : "bg-[#1c1c1f] hover:bg-[#252529] text-white border-white/5"
                        }`}>
                        Get Started
                    </button>
                </div>

                {/* Business Plan (Recommended) */}
                <div className={`relative rounded-[2.5rem] p-8 lg:p-10 border flex flex-col h-[540px] transform md:-translate-y-2 shadow-2xl ${isLight
                    ? "bg-slate-900 text-white border-violet-500/40 shadow-violet-500/20"
                    : "bg-black text-white border-purple-500/30 shadow-[0_0_80px_-20px_rgba(168,85,247,0.2)]"
                    }`}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-white text-purple-900 text-[9px] font-bold tracking-widest uppercase py-2 px-5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            Recommended
                        </span>
                    </div>

                    <div className="mb-8 mt-2">
                        <h3 className="text-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Business</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-serif font-semibold">$149</span>
                            <span className="text-gray-400 text-xs">/mo</span>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-6 mb-12 flex-1">
                        {[
                            'Unlimited Accounts',
                            'Full Agentic Co-Pilot',
                            'White-label Reports',
                            'Priority AI Server'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-colors mt-auto shadow-lg cursor-pointer">
                        Scale Now
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className={`rounded-[2rem] p-8 lg:p-10 border flex flex-col h-[500px] transition-colors ${isLight ? "bg-white border-slate-200/80 shadow-lg" : "bg-[#111113] border-white/5 hover:border-white/10"
                    }`}>
                    <div className="mb-4">
                        <h3 className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${isLight ? "text-slate-500" : "text-gray-400"}`}>Enterprise</h3>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-5xl font-serif font-semibold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>Custom</span>
                        </div>
                        <p className={`text-xs mt-6 leading-relaxed max-w-[200px] ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                            Bespoke solutions for global marketing departments and agencies.
                        </p>
                    </div>

                    <ul className="flex flex-col gap-6 mb-12 flex-1 mt-6">
                        {[
                            'Dedicated Account Manager',
                            'Custom AI Training',
                            'API Access'
                        ].map((feature, i) => (
                            <li key={i} className={`flex items-center gap-3 text-sm ${isLight ? "text-slate-700" : "text-gray-300"}`}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button className={`w-full py-4 rounded-xl text-sm font-semibold transition-colors mt-auto border cursor-pointer ${isLight
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200"
                        : "bg-[#1c1c1f] hover:bg-[#252529] text-white border-white/5"
                        }`}>
                        Contact Sales
                    </button>
                </div>
            </div>
        </section>
    );
}
