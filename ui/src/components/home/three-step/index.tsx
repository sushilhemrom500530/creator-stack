"use client";

import { Title } from "@/components/reuseable/title";
import { useTheme } from "@/providers/mode-theme";
import { Check } from "lucide-react";
import "./index.css";

export function ThreeStepSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

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

    return (
        <section className={`three-step-section ${themeClass}`}>
            <div className={`three-step-glow-top ${themeClass}`} />
            <div className={`three-step-glow-bottom ${themeClass}`} />

            <div className="max-w-5xl w-full mx-auto relative z-10 flex flex-col items-start px-4 lg:px-8">
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
                            className={`three-step-card ${themeClass} ${!isLight ? "dark-card-bg" : ""}`}
                        >
                            {/* Top-Right Violet Glow */}
                            <div className={`three-step-glow-tr ${themeClass}`} />

                            {/* Bottom-Left Violet Glow (Light Mode Only) */}
                            {isLight && (
                                <div className="three-step-glow-bl" />
                            )}

                            <span className={`three-step-number ${themeClass}`}>
                                {step.num}
                            </span>

                            <div className={`three-step-icon-badge ${isLight ? step.lightColorClass : step.darkColorClass}`}>
                                <Check className="w-5 h-5 stroke-[2.5]" />
                            </div>

                            <div className="mt-auto relative z-10">
                                <h3 className={`three-step-title ${themeClass}`}>{step.title}</h3>
                                <p className={`three-step-desc ${themeClass}`}>
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
