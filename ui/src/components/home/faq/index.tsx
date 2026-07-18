"use client";
import { useState } from "react";
import { Title } from "@/components/reuseable/title";
import { ChevronRight, BarChart3 } from "lucide-react";

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(0);

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
        <section className="relative w-full py-24 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#100e16] via-[#0a0a0c] to-[#09090b]">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex flex-col items-start lg:px-12">
                <div className="mb-16 max-w-2xl mx-auto">
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
                                        ? "bg-[#171520]/80 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                                        : "bg-[#111018] border-white/5 hover:border-white/10 hover:bg-[#15131d]"
                                        }`}
                                >
                                    <span className={`text-[13px] font-bold ${isActive ? "text-violet-300" : "text-white"}`}>
                                        {q.title}
                                    </span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-violet-400 translate-x-1" : "text-gray-500"}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Details */}
                    <div className="w-full md:w-[60%] flex flex-col justify-between bg-[#111018] rounded-3xl p-8 lg:p-10 border border-white/5 shadow-2xl h-auto md:h-auto">
                        <div className="flex flex-col mb-8">
                            <h3 className="text-xl font-bold text-white mb-4">
                                {questions[activeIndex].title}
                            </h3>
                            <p className="text-gray-400 text-[14px] leading-relaxed">
                                {questions[activeIndex].content}
                            </p>
                        </div>

                        <div className="w-full mt-auto h-[220px] flex-shrink-0 bg-[#1a1825]/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:bg-[#1a1825] transition-colors">
                            <BarChart3 className="w-10 h-10 text-gray-600 group-hover:text-violet-500/50 transition-colors" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 group-hover:text-gray-400 transition-colors">
                                Technical Visualization
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}