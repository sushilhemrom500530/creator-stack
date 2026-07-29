"use client";

import { useState } from "react";
import { Title } from "@/components/reuseable/title";
import { ChevronRight, BarChart3 } from "lucide-react";
import { useTheme } from "@/providers/mode-theme";

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { theme } = useTheme();
    const isLight = theme === "light";

    const questions = [
        {
            title: "How does the AI maintain my brand voice?",
            content: "Our proprietary system uses fine-tuned models that ingest your historical content, style guides, and core values to create a persistent 'Voice Vector' that ensures consistency across every generated asset."
        },
        {
            title: "Can I manage multiple agency clients?",
            content: "Yes, the platform includes dedicated workspaces for each client with strictly siloed data, custom style guides, and separate brand profiles for seamless multi-tenant management."
        },
        {
            title: "What level of support is included?",
            content: "All enterprise plans include a dedicated account manager, prioritized feature requests, custom onboarding sessions, and 24/7 technical support."
        },
        {
            title: "Is the content generation traceable?",
            content: "We provide full cryptographic audit logs for every piece of content generated, ensuring compliance, source tracking, and transparent version histories across your organization."
        },
        {
            title: "How secure is our proprietary data?",
            content: "Your data is encrypted at rest and in transit. We maintain strictly separated tenant environments and never train shared models on your private data infrastructure."
        }
    ];

    return (
        <section className={`relative w-full py-24 flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${isLight
            ? "bg-gradient-to-b from-slate-100/70 via-slate-50 to-white"
            : "bg-gradient-to-b from-[#100e16] via-[#0a0a0c] to-[#09090b]"
            }`}>
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none ${isLight ? "bg-indigo-300/15" : "bg-indigo-600/5"
                }`} />
            <div className={`absolute bottom-0 left-[-10%] w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none ${isLight ? "bg-violet-300/15" : "bg-violet-600/5"
                }`} />

            <div className="container w-full mx-auto px-4 lg:px-6 relative z-10 flex flex-col items-start">
                <div className="mb-16 max-w-2xl mx-auto w-full">
                    <Title
                        title="Frequently Asked Questions"
                        description="Everything you need to know about our platform."
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full items-stretch relative">
                    {/* Left Column: Questions */}
                    <div className="w-full md:w-[40%] flex flex-col gap-4">
                        {questions.map((q, idx) => {
                            const isActive = activeIndex === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`flex items-center justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer flex-1 ${isActive
                                        ? isLight
                                            ? "bg-violet-50/90 border-violet-300 shadow-md"
                                            : "bg-[#171520]/80 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                                        : isLight
                                            ? "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            : "bg-[#111018] border-white/5 hover:border-white/10 hover:bg-[#15131d]"
                                        }`}
                                >
                                    <span className={`text-[13px] font-bold ${isActive
                                        ? isLight ? "text-violet-900" : "text-violet-300"
                                        : isLight ? "text-slate-800" : "text-white"
                                        }`}>
                                        {q.title}
                                    </span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive
                                        ? isLight ? "text-violet-600 translate-x-1" : "text-violet-400 translate-x-1"
                                        : isLight ? "text-slate-400" : "text-gray-500"
                                        }`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Details */}
                    <div className={`w-full md:w-[60%] flex flex-col justify-between rounded-3xl p-8 lg:p-10 border h-auto ${isLight ? "bg-white border-slate-200/90" : "bg-[#111018] border-white/5"
                        }`}>
                        <div className="flex flex-col mb-8">
                            <h3 className={`text-xl font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
                                {questions[activeIndex].title}
                            </h3>
                            <p className={`text-[14px] leading-relaxed ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                                {questions[activeIndex].content}
                            </p>
                        </div>

                        <div className={`w-full mt-auto h-[220px] flex-shrink-0 border rounded-2xl flex flex-col items-center justify-center gap-4 group transition-colors ${isLight
                            ? "bg-slate-50 border-slate-200 hover:bg-slate-100"
                            : "bg-[#1a1825]/50 border-white/5 hover:bg-[#1a1825]"
                            }`}>
                            <BarChart3 className={`w-10 h-10 transition-colors ${isLight ? "text-slate-400 group-hover:text-violet-600" : "text-gray-600 group-hover:text-violet-500/50"
                                }`} />
                            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${isLight ? "text-slate-500 group-hover:text-slate-800" : "text-gray-600 group-hover:text-gray-400"
                                }`}>
                                Technical Visualization
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
