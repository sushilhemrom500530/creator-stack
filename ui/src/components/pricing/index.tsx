"use client";

import PricingCompareSection from "@/components/pricing/compare";
import { useTheme } from "@/providers/mode-theme";
import "./index.css";

const PRICING_PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        tagline: 'Perfect for small teams getting started with AI-driven social media.',
        price: '$99',
        pricePeriod: '/mo',
        highlight: false,
        features: [
            'Up to 5 Social Profiles',
            '100 AI Content Generations/mo',
            'Basic Analytics Dashboard',
            'Email Support (48h SLA)',
        ],
        buttonText: 'Start Free Trial',
    },
    {
        id: 'professional',
        name: 'Professional',
        badge: 'Most Popular',
        tagline: 'Algorithms scaling for growing businesses needing analytics automation.',
        price: '$299',
        pricePeriod: '/mo',
        highlight: true,
        features: [
            'Up to 20 Social Profiles',
            '500 AI Content Generations/mo',
            'Advanced Analytics & Custom Reports',
            'Priority Support (12h SLA)',
            'REST API Access',
            'Team Collaboration Tools'
        ],
        buttonText: 'Start 14-Day Free Trial',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: 'Tailored solutions for large organizations with unique requirements.',
        price: 'Custom',
        pricePeriod: '',
        highlight: false,
        features: [
            'Unlimited Social Profiles',
            'Unlimited & Custom Content Engine',
            'Dedicated Account Manager',
            '99.9% Uptime SLA Guarantee',
            'Custom Integrations & Webhooks',
        ],
        buttonText: 'Contact Sales',
    }
];

export default function Pricing() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <main className={`pricing-page-main ${themeClass}`}>
            {/* Banner Section */}
            <section className="pricing-banner-section">
                <div className="relative z-10 w-full max-w-4xl mx-auto">
                    {/* Ambient Background Glows */}
                    <div className={`pricing-banner-glow-center ${themeClass}`} />
                    <div className={`pricing-banner-glow-right ${themeClass}`} />

                    <div className="relative z-10 flex flex-col items-center mt-8">
                        {/* Tagline */}
                        <div className={`pricing-tagline-badge ${themeClass}`}>
                            <span className="pricing-tagline-dot" />
                            <span className={`pricing-tagline-text ${themeClass}`}>
                                Transparent Pricing
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className={`pricing-page-heading ${themeClass}`}>
                            Simple, Scalable <span className={`pricing-page-gradient-text ${themeClass}`}>Pricing</span>
                        </h1>

                        {/* Description */}
                        <p className={`pricing-page-desc ${themeClass}`}>
                            Choose the plan that's right for your business. All plans include full access during your 14-day free trial.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="pricing-tiers-section">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

                    {PRICING_PLANS.map((plan) => {
                        const isFeatured = plan.highlight;
                        const cardTypeClass = isFeatured
                            ? "pricing-tier-card-featured"
                            : `pricing-tier-card-standard ${plan.id === 'starter' ? 'is-starter' : 'is-enterprise'}`;

                        return (
                            <div key={plan.id} className={`${cardTypeClass} ${themeClass}`}>
                                {isFeatured && (
                                    <>
                                        <div className={`pricing-tier-featured-glow ${themeClass}`} />
                                        <div className="pricing-tier-featured-topbar" />
                                    </>
                                )}

                                <div className="flex flex-col mb-8 relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`pricing-tier-title ${themeClass}`}>{plan.name}</h3>
                                        {plan.badge && (
                                            <span className={`pricing-tier-badge ${themeClass}`}>
                                                {plan.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`pricing-tier-tagline ${isFeatured ? 'is-featured' : 'is-standard'} ${themeClass}`}>
                                        {plan.tagline}
                                    </p>
                                </div>

                                <div className="mb-8 flex items-baseline gap-1 relative">
                                    <span className={`pricing-tier-price ${isFeatured ? 'is-featured' : 'is-standard'}`}>
                                        {plan.price}
                                    </span>
                                    {plan.pricePeriod && (
                                        <span className={`pricing-tier-price-period ${themeClass}`}>{plan.pricePeriod}</span>
                                    )}
                                </div>

                                <ul className="flex flex-col gap-5 mb-10 flex-1 relative">
                                    {plan.features.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <svg className={`pricing-tier-check-icon ${isFeatured ? 'is-featured' : 'is-standard'} ${themeClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className={`pricing-tier-feature-text ${isFeatured ? 'is-featured' : 'is-standard'} ${themeClass}`}>
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`${isFeatured ? 'pricing-tier-btn-featured' : 'pricing-tier-btn-standard'} ${themeClass}`}>
                                    {plan.buttonText}
                                </button>
                            </div>
                        );
                    })}

                </div>
            </section>
            <PricingCompareSection />
        </main>
    );
}
