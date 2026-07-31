"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useTheme } from "@/providers/mode-theme";
import { Title } from "@/components/reuseable/title";
import "./index.css";

export default function PricingSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const isYearly = billingCycle === "yearly";

    const starterPrice = isYearly ? "$39" : "$49";
    const businessPrice = isYearly ? "$119" : "$149";

    return (
        <section className={`pricing-section ${themeClass}`}>
            {/* Background Glows */}
            <div className={`pricing-glow-top ${themeClass}`} />
            <div className={`pricing-glow-bottom ${themeClass}`} />

            <div className="relative z-10 flex flex-col items-center max-w-5xl w-full mx-auto px-4 lg:px-8">
                <Title
                    title="Flexible Plans for Every Team"
                    description="Simple, transparent pricing built to scale with your content ambition."
                />

                {/* Billing Cycle Toggle */}
                <div className={`pricing-toggle-container ${themeClass}`}>
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`pricing-toggle-btn ${billingCycle === "monthly" ? "is-active" : `is-inactive ${themeClass}`}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`pricing-toggle-btn flex items-center gap-2 ${billingCycle === "yearly" ? "is-active" : `is-inactive ${themeClass}`}`}
                    >
                        Annual
                        <span className="pricing-save-badge">
                            Save 20%
                        </span>
                    </button>
                </div>

                {/* Pricing Grid */}
                <div className="pricing-grid">

                    {/* Starter Plan */}
                    <div className={`pricing-card pricing-card-standard ${themeClass}`}>
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className={`pricing-plan-title ${themeClass}`}>
                                    Starter
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-8">
                                <span className={`pricing-price-text ${themeClass}`}>
                                    {starterPrice}
                                </span>
                                <span className={`pricing-price-period ${themeClass}`}>
                                    /month
                                </span>
                            </div>

                            <ul className="flex flex-col gap-4 mb-8">
                                {[
                                    "10 Accounts Connection",
                                    "AI Content Draft Generator",
                                    "Core Engagement Analytics",
                                    "Standard Support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`pricing-check-standard ${themeClass}`}>
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        <span className={`pricing-feature-text-standard ${themeClass}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className={`pricing-btn-standard ${themeClass}`}>
                            Get Started
                        </button>
                    </div>

                    {/* Business Plan (Featured / Popular) */}
                    <div className={`pricing-card pricing-card-featured ${themeClass}`}>
                        {/* Top-Right Glow Overlay inside card */}
                        <div className={`pricing-card-featured-glow ${themeClass}`} />

                        <div>
                            {/* Card Header with Integrated Badge */}
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <span className="text-[11px] font-bold font-mono tracking-[0.2em] uppercase text-violet-600 dark:text-violet-400">
                                    Business
                                </span>
                                <span className="pricing-badge-popular">
                                    <Sparkles className="w-3 h-3 fill-current" /> Most Popular
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-8 relative z-10">
                                <span className={`pricing-price-text ${themeClass}`}>
                                    {businessPrice}
                                </span>
                                <span className={`pricing-price-period ${themeClass}`}>
                                    /month
                                </span>
                            </div>

                            <ul className="flex flex-col gap-4 mb-8 relative z-10">
                                {[
                                    "Unlimited Accounts",
                                    "Full Agentic Co-Pilot",
                                    "White-label PDF Reports",
                                    "Priority AI Server Access",
                                    "Automated Scheduling Engine"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className="pricing-check-featured">
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        <span className={`pricing-feature-text-featured ${themeClass}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="pricing-btn-featured">
                            Start Free Trial
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className={`pricing-card pricing-card-standard ${themeClass}`}>
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className={`pricing-plan-title ${themeClass}`}>
                                    Enterprise
                                </span>
                            </div>

                            <div className="flex items-baseline gap-1.5 mb-2">
                                <span className={`pricing-price-text ${themeClass}`}>
                                    Custom
                                </span>
                            </div>
                            <p className={`pricing-enterprise-desc ${themeClass}`}>
                                Tailored infrastructure & SLAs for large organizations.
                            </p>

                            <ul className="flex flex-col gap-4 mb-8">
                                {[
                                    "Dedicated Account Manager",
                                    "Custom AI Model Fine-Tuning",
                                    "Full REST & Webhook API Access",
                                    "99.9% Uptime Guarantee SLA"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`pricing-check-standard ${themeClass}`}>
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                        </div>
                                        <span className={`pricing-feature-text-standard ${themeClass}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className={`pricing-btn-standard ${themeClass}`}>
                            Contact Sales
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
