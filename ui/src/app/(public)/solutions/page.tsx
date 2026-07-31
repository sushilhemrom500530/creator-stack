"use client";

import React from "react";
import { useTheme } from "@/providers/mode-theme";
import "./page.css";

export default function SolutionsPage() {
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
            <section className={`solutions-features-section ${themeClass}`}>
                {/* Feature 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-start text-left">
                        <span className={`solutions-vertical-badge is-cyan ${themeClass}`}>
                            Vertical 01 / Retail
                        </span>
                        <h2 className={`solutions-feature-title ${themeClass}`}>
                            E-commerce
                        </h2>
                        <p className={`solutions-feature-desc ${themeClass}`}>
                            Convert social engagement into transactional velocity. Our E-commerce
                            solution autonomously manages thousands of SKUs across social channels,
                            generating dynamic shoppable content that adapts to inventory levels and
                            seasonal trends in real-time.
                        </p>
                        <ul className="flex flex-col gap-4 mb-10">
                            {[
                                'Dynamic Product Catalog Integration',
                                'Conversion-Optimized Ad Copywriting',
                                'Real-time Inventory Response Engine',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full solutions-bullet-dot is-cyan ${themeClass}`}></div>
                                    <span className={`solutions-feature-item-text ${themeClass}`}>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`solutions-feature-cta is-cyan ${themeClass}`}>
                            Explore Retail Solutions <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                    {/* Image */}
                    <div className={`solutions-image-card group ${themeClass}`}>
                        {/* Mock Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                            alt="E-commerce Dashboard"
                            className={`solutions-image ${themeClass}`}
                        />
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image - Left on desktop */}
                    <div className={`solutions-image-card group ${themeClass} order-2 lg:order-1`}>
                        {/* Mock Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-all duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
                            alt="Agency Dashboard Monitors"
                            className={`solutions-image ${themeClass}`}
                        />
                    </div>
                    <div className="flex flex-col items-start text-left order-1 lg:order-2">
                        <span className={`solutions-vertical-badge is-orange ${themeClass}`}>
                            Vertical 02 / Partners
                        </span>
                        <h2 className={`solutions-feature-title ${themeClass}`}>
                            Agencies
                        </h2>
                        <p className={`solutions-feature-desc ${themeClass}`}>
                            Scale your creative throughput without increasing headcount. Our Agency
                            tier provides white-label orchestration tools that allow small teams to
                            manage enterprise-level portfolios with centralized AI-driven content
                            controls and unified reporting.
                        </p>
                        <ul className="flex flex-col gap-4 mb-10">
                            {[
                                'Multi-Tenant Workspace Architecture',
                                'AI Brand Voice Synchronization',
                                'Automated Client Performance Reports',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full solutions-bullet-dot is-orange ${themeClass}`}></div>
                                    <span className={`solutions-feature-item-text ${themeClass}`}>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`solutions-feature-cta is-orange ${themeClass}`}>
                            View Agency Programs <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-start text-left">
                        <span className={`solutions-vertical-badge is-purple ${themeClass}`}>
                            Vertical 03 / Enterprise
                        </span>
                        <h2 className={`solutions-feature-title ${themeClass}`}>
                            B2B Tech
                        </h2>
                        <p className={`solutions-feature-desc ${themeClass}`}>
                            Navigate the complexity of B2B social selling with surgical precision. We
                            help technology firms establish thought leadership through data-backed
                            content pillars and automated executive advocacy programs that resonate
                            with high-value decision-makers.
                        </p>
                        <ul className="flex flex-col gap-4 mb-10">
                            {[
                                'Account-Based Social Orchestration',
                                'Technical Content Translation Engine',
                                'Employee Advocacy Automation',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full solutions-bullet-dot is-purple ${themeClass}`}></div>
                                    <span className={`solutions-feature-item-text ${themeClass}`}>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`solutions-feature-cta is-purple ${themeClass}`}>
                            Enterprise Solutions <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                    {/* Image */}
                    <div className={`solutions-image-card group ${themeClass}`}>
                        {/* Mock Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#B388FF]/10 rounded-full blur-[80px] group-hover:bg-[#B388FF]/20 transition-all duration-700"></div>
                        <img
                            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
                            alt="Enterprise Tech Network"
                            className={`solutions-image ${themeClass}`}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}