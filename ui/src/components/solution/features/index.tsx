"use client";

import { useTheme } from "@/providers/mode-theme";

interface FeatureItem {
    id: string;
    vertical: string;
    colorVariant: "cyan" | "orange" | "purple";
    title: string;
    description: string;
    bulletItems: string[];
    ctaText: string;
    image: string;
    imageAlt: string;
    glowClass: string;
    imagePosition: "left" | "right";
}

const FEATURES_DATA: FeatureItem[] = [
    {
        id: "retail",
        vertical: "Vertical 01 / Retail",
        colorVariant: "cyan",
        title: "E-commerce",
        description: "Convert social engagement into transactional velocity. Our E-commerce solution autonomously manages thousands of SKUs across social channels, generating dynamic shoppable content that adapts to inventory levels and seasonal trends in real-time.",
        bulletItems: [
            "Dynamic Product Catalog Integration",
            "Conversion-Optimized Ad Copywriting",
            "Real-time Inventory Response Engine",
        ],
        ctaText: "Explore Retail Solutions",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        imageAlt: "E-commerce Dashboard",
        glowClass: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
        imagePosition: "right",
    },
    {
        id: "agencies",
        vertical: "Vertical 02 / Partners",
        colorVariant: "orange",
        title: "Agencies",
        description: "Scale your creative throughput without increasing headcount. Our Agency tier provides white-label orchestration tools that allow small teams to manage enterprise-level portfolios with centralized AI-driven content controls and unified reporting.",
        bulletItems: [
            "Multi-Tenant Workspace Architecture",
            "AI Brand Voice Synchronization",
            "Automated Client Performance Reports",
        ],
        ctaText: "View Agency Programs",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Agency Dashboard Monitors",
        glowClass: "bg-orange-500/10 group-hover:bg-orange-500/20",
        imagePosition: "left",
    },
    {
        id: "b2b-tech",
        vertical: "Vertical 03 / Enterprise",
        colorVariant: "purple",
        title: "B2B Tech",
        description: "Navigate the complexity of B2B social selling with surgical precision. We help technology firms establish thought leadership through data-backed content pillars and automated executive advocacy programs that resonate with high-value decision-makers.",
        bulletItems: [
            "Account-Based Social Orchestration",
            "Technical Content Translation Engine",
            "Employee Advocacy Automation",
        ],
        ctaText: "Enterprise Solutions",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Enterprise Tech Network",
        glowClass: "bg-[#B388FF]/10 group-hover:bg-[#B388FF]/20",
        imagePosition: "right",
    },
];

export default function FeaturesSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <section className={`solutions-features-section ${themeClass}`}>
            {FEATURES_DATA.map((feature) => {
                const isImageLeft = feature.imagePosition === "left";

                return (
                    <div key={feature.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Text Container */}
                        <div className={`flex flex-col items-start text-left ${isImageLeft ? 'order-1 lg:order-2' : ''}`}>
                            <span className={`solutions-vertical-badge is-${feature.colorVariant} ${themeClass}`}>
                                {feature.vertical}
                            </span>
                            <h2 className={`solutions-feature-title ${themeClass}`}>
                                {feature.title}
                            </h2>
                            <p className={`solutions-feature-desc ${themeClass}`}>
                                {feature.description}
                            </p>
                            <ul className="flex flex-col gap-4 mb-10">
                                {feature.bulletItems.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full solutions-bullet-dot is-${feature.colorVariant} ${themeClass}`}></div>
                                        <span className={`solutions-feature-item-text ${themeClass}`}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`solutions-feature-cta is-${feature.colorVariant} ${themeClass}`}>
                                {feature.ctaText} <span aria-hidden="true">&rarr;</span>
                            </button>
                        </div>

                        {/* Image Container */}
                        <div className={`solutions-image-card group ${themeClass} ${isImageLeft ? 'order-2 lg:order-1' : ''}`}>
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[80px] transition-all duration-700 ${feature.glowClass}`}></div>
                            <img
                                src={feature.image}
                                alt={feature.imageAlt}
                                className={`solutions-image ${themeClass}`}
                            />
                        </div>
                    </div>
                );
            })}
        </section>
    );
}