"use client";

import React from "react";
import { useTheme } from "@/providers/mode-theme";
import Card from "@/components/reuseable/card";
import "./index.css";

const GUIDE_CARDS_DATA = [
    {
        id: "onboarding",
        category: "Getting Started",
        title: "Onboarding Workshop",
        description: "Learn how to connect your accounts and configure your first AI-driven content calendar in under 10 minutes.",
        image: "https://images.unsplash.com/photo-1639322537231-2f206e06af84?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Guide 1",
        variant: "purple",
        buttonText: "Read Guide"
    },
    {
        id: "methodology",
        category: "Methodology",
        title: "Audience Analysis",
        description: "Deep dive into the neural networks behind our audience sentiment analysis and how to leverage it for viral reach.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Guide 2",
        variant: "blue",
        buttonText: "Read Guide"
    },
    {
        id: "strategy",
        category: "Strategy",
        title: "Multi-Channel Sync",
        description: "Master the art of cross-platform narrative consistency using SocialFlow's automated tone adjustment algorithms.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        imageAlt: "Guide 3",
        variant: "cyan",
        buttonText: "Read Guide"
    }
];

export default function UserGuideSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className={`user-guide-section ${themeClass}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-2xl">
                    <h2 className={`user-guide-title ${themeClass}`}>User Guides</h2>
                    <p className={`user-guide-sub ${themeClass}`}>
                        Step by step instructions to help you navigate our platform and optimize your social media presence with AI-generated insights.
                    </p>
                </div>
                <button className={`user-guide-action-btn ${themeClass}`}>
                    View All Guides &rarr;
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {GUIDE_CARDS_DATA.map((card) => (
                    <Card
                        key={card.id}
                        category={card.category}
                        title={card.title}
                        description={card.description}
                        image={card.image}
                        imageAlt={card.imageAlt}
                        variant={card.variant}
                        buttonText={card.buttonText}
                    />
                ))}
            </div>
        </section>
    );
}