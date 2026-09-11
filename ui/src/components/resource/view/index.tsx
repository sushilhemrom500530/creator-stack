"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/providers/mode-theme";
import BannerSection from "./banner";
import ContentSection from "./content";
import RelatedGuidesSection from "./related";
import NewsletterSection from "@/components/resource/newsletter";
import "./index.css";

interface ResourceDetailsProps {
    resourceId?: string;
}

export default function ResourceDetails({ resourceId = "1525" }: ResourceDetailsProps) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const [readingProgress, setReadingProgress] = useState(0);

    // Reading progress listener
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = (window.scrollY / totalHeight) * 100;
                setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className={`resource-view-main ${themeClass}`}>
            {/* Dynamic Reading Progress Bar */}
            <div
                className="resource-reading-progress"
                style={{ width: `${readingProgress}%` }}
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                {/* 1. Banner / Hero Section */}
                <BannerSection resourceId={resourceId} />

                {/* 2. Main Guide Content & Sidebar */}
                <ContentSection />

                {/* 3. Related Technical Guides */}
                <RelatedGuidesSection />

                {/* 4. Common Newsletter Section */}
                <NewsletterSection />
            </div>
        </main>
    );
}
