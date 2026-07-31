"use client";

import { useState } from "react";
import { Title } from "@/components/reuseable/title";
import { ChevronRight, BarChart3 } from "lucide-react";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

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
        <section className={`faq-section ${themeClass}`}>
            <div className={`faq-glow-top ${themeClass}`} />
            <div className={`faq-glow-bottom ${themeClass}`} />

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
                            const stateClass = isActive ? "is-active" : "is-inactive";
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`faq-question-btn ${stateClass} ${themeClass}`}
                                >
                                    <span className={`faq-question-title ${stateClass} ${themeClass}`}>
                                        {q.title}
                                    </span>
                                    <ChevronRight className={`faq-chevron ${stateClass} ${themeClass}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Details */}
                    <div className={`faq-details-card ${themeClass}`}>
                        <div className="flex flex-col mb-8">
                            <h3 className={`faq-details-title ${themeClass}`}>
                                {questions[activeIndex].title}
                            </h3>
                            <p className={`faq-details-content ${themeClass}`}>
                                {questions[activeIndex].content}
                            </p>
                        </div>

                        <div className={`faq-vis-box ${themeClass}`}>
                            <BarChart3 className={`faq-vis-icon ${themeClass}`} />
                            <span className={`faq-vis-text ${themeClass}`}>
                                Technical Visualization
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

