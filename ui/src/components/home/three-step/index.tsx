"use client";

import { Title } from "@/components/reuseable/title";
import { useTheme } from "@/providers/mode-theme";
import { Check } from "lucide-react";

export function ThreeStepSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";

    const steps = [
        {
            num: "01",
            title: "Unify Assets",
            desc: "Connect your brand ecosystem in minutes. Data ingestion begins instantly across all touchpoints.",
            darkColorClass: "text-violet-400 bg-violet-500/10 border-violet-500/20",
            lightColorClass: "text-violet-700 bg-violet-50 border-violet-200"
        },
        {
            num: "02",
            title: "AI Synthesis",
            desc: "Neural engine processes trends and generates optimal engagement pathways specifically for you.",
            darkColorClass: "text-teal-400 bg-teal-500/10 border-teal-500/20",
            lightColorClass: "text-teal-700 bg-teal-50 border-teal-200"
        },
        {
            num: "03",
            title: "Automated Scale",
            desc: "Deploy content at scale with machine precision while you focus on high-level creative strategy.",
            darkColorClass: "text-violet-400 bg-violet-500/10 border-violet-500/20",
            lightColorClass: "text-violet-700 bg-violet-50 border-violet-200"
        }
    ];

    const glowBase = "absolute w-44 h-44 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-700 pointer-events-none";

    return (
        <section className={`relative w-full py-24 flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${isLight
            ? "bg-gradient-to-b from-white via-slate-50 to-slate-100/70"
            : "bg-gradient-to-b from-[#100e16] via-[#0a0a0c] to-[#09090b]"
            }`}>
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none ${isLight ? "bg-indigo-300/15" : "bg-indigo-600/5"}`} />
            <div className={`absolute bottom-0 left-[-10%] w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none ${isLight ? "bg-violet-300/15" : "bg-violet-600/5"}`} />

            <div className="max-w-5xl w-full mx-auto px-6 relative z-10 flex flex-col items-start lg:px-12">
                <div className="mb-16 max-w-2xl mx-auto w-full">
                    <Title
                        title="Three Steps to Supremacy"
                        description="Our methodology focuses on deep integration and automated scaling."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative rounded-[2rem] p-8 lg:p-10 border transition-all duration-500 group overflow-hidden flex flex-col h-full hover:-translate-y-1 ${isLight
                                ? "bg-white border-slate-200/90 shadow-lg shadow-slate-100 hover:border-violet-300"
                                : "dark-card-bg border-white/5 hover:border-violet-500/30"
                                }`}
                        >
                            {/* Top-Right Violet Glow */}
                            <div className={`absolute  w-36 h-36 blur-2xl rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-125 ${isLight ? "bg-violet-300/30 -right-8 -top-8" : "bg-violet-600/10 -right-10 -top-10"
                                }`} />

                            {/* Bottom-Left Violet Glow (Light Mode Only) */}
                            {isLight && (
                                <div className="absolute -left-8 -bottom-8 w-36 h-36 blur-2xl rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-125 bg-violet-300/25" />
                            )}

                            <span className={`absolute right-6 top-8 text-8xl font-black select-none pointer-events-none transition-transform group-hover:scale-110 duration-500 ${isLight ? "text-violet-900/[0.05] group-hover:text-violet-900/[0.09]" : "text-white/[0.04] group-hover:text-violet-400/[0.08]"}`}>
                                {step.num}
                            </span>

                            <div className={`w-11 h-11 rounded-full border flex items-center justify-center mb-8 relative z-10 [transition:0.3s] ${isLight ? step.lightColorClass : step.darkColorClass}`}>
                                <Check className="w-5 h-5 stroke-[2.5]" />
                            </div>

                            <div className="mt-auto relative z-10">
                                <h3 className={`text-xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>{step.title}</h3>
                                <p className={`text-[13px] lg:text-sm leading-relaxed max-w-[90%] ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
