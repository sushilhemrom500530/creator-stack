"use client";

import { useTheme } from "@/providers/mode-theme";
import "./index.css";
import FeaturesSection from "./features";

export default function Solutions() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <main className={`solutions-page-main ${themeClass}`}>
            {/* Hero Section */}
            <section className="solutions-hero-section">
                <div>
                    {/* Ambient Background Glow */}
                    <div className="solutions-hero-glow">
                        <div className={`solutions-hero-glow-blob ${themeClass}`}></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                        {/* Tagline */}
                        <div className={`solutions-tagline-badge ${themeClass}`}>
                            <span className="solutions-tagline-dot" />
                            <span className={`solutions-tagline-text ${themeClass}`}>
                                The Intelligent Social Layer
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className={`solutions-heading ${themeClass}`}>
                            Solutions for the{' '}
                            <span className={`solutions-gradient-text ${themeClass}`}>
                                Modern Enterprise
                            </span>
                        </h1>

                        {/* Description */}
                        <p className={`solutions-desc ${themeClass}`}>
                            Empower your organization with autonomous social orchestration. From high-volume retail to complex B2B ecosystems, SocialFlow AI scales your presence through cognitive content generation and real-time audience resonance.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button className={`solutions-btn-primary ${themeClass}`}>
                                Request Demo
                            </button>
                            <button className={`solutions-btn-secondary ${themeClass}`}>
                                View Whitepaper
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />
        </main>
    );
}