"use client";

import React from "react";
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

    return (
        <main className={`resource-view-main ${themeClass}`}>
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
