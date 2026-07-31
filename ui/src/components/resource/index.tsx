"use client";

import { useTheme } from '@/providers/mode-theme';
import "./index.css";

import UserGuideSection from '@/components/resource/user-guide';
import ApiDocSection from '@/components/resource/api-docs';
import CaseStudiesSection from '@/components/resource/case-studies';
import NewsletterSection from '@/components/resource/newsletter';

export default function Resources() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <main className={`resources-page-main ${themeClass}`}>
            {/* Banner Section */}
            <section className={`resources-banner-section ${themeClass}`}>
                <div className="relative z-10 w-full">
                    {/* Ambient Background Glow */}
                    <div className={`resources-banner-glow ${themeClass}`}></div>

                    <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
                        {/* Tagline */}
                        <div className={`tagline-badge ${themeClass}`}>
                            <span className="tagline-dot" />
                            <span className={`tagline-text ${themeClass}`}>
                                Knowledge Center
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className={`resources-heading ${themeClass}`}>
                            Resource Hub
                        </h1>

                        {/* Description */}
                        <p className={`resources-desc ${themeClass}`}>
                            Unlock the full potential of SocialFlow AI. Master AI-driven social strategy with our comprehensive guides, technical documentation, and real-world success stories.
                        </p>
                    </div>
                </div>
            </section>

            {/* User Guides */}
            <UserGuideSection />

            {/* API Documentation */}
            <ApiDocSection />

            {/* Case Studies */}
            <CaseStudiesSection />

            {/* Stay Informed Newsletter */}
            <NewsletterSection />
        </main>
    );
}