"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/providers/mode-theme";
import UserGuideCard from "@/components/reuseable/user-guide-card";
import "./index.css";

const RELATED_GUIDES = [
    {
        id: "1526",
        category: "Methodology",
        title: "Audience Sentiment Analysis",
        description: "Deep dive into neural networks powering audience sentiment and viral resonance modeling.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
        variant: "blue",
    },
    {
        id: "1527",
        category: "Strategy",
        title: "Cross-Platform Narrative Consistency",
        description: "Master automated tone adjustment algorithms across business-first and creator networks.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        variant: "cyan",
    },
    {
        id: "1528",
        category: "Technical",
        title: "REST API & Webhooks Automation",
        description: "Integrate Creator Stack webhooks directly with your headless CMS and marketing pipelines.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        variant: "purple",
    },
];

export default function RelatedGuidesSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className={`resource-related-section ${themeClass}`}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 block mb-1">
                        Recommended Reading
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                        Related Technical Guides
                    </h2>
                </div>
                <Link
                    href="/resources"
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 uppercase tracking-wider transition-colors"
                >
                    Browse All 24 Guides &rarr;
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RELATED_GUIDES.map((guide) => (
                    <UserGuideCard
                        key={guide.id}
                        id={guide.id}
                        category={guide.category}
                        title={guide.title}
                        description={guide.description}
                        image={guide.image}
                        variant={guide.variant}
                        buttonText="Read Guide"
                    />
                ))}
            </div>
        </section>
    );
}
