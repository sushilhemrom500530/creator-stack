import PricingCompareSection from "@/components/pricing/compare";

const PRICING_PLANS = [
    {
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
        buttonClass: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white',
        cardClass: 'bg-[#110D1A]/80 backdrop-blur-xl border border-white/10 rounded-3xl lg:rounded-r-none p-10 flex flex-col hover:border-white/20 transition-all duration-500 relative z-0 h-full lg:h-[90%]',
        checkColor: 'text-[#B983FF]'
    },
    {
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
        buttonClass: 'bg-[#D4B5FF] hover:bg-[#E9D5FF] text-[#2D164E] shadow-[0_0_20px_rgba(212,181,255,0.3)] hover:shadow-[0_0_30px_rgba(212,181,255,0.5)]',
        cardClass: 'bg-gradient-to-b from-[#1E1533] to-[#110D1A] border border-[#B983FF]/40 rounded-3xl p-10 flex flex-col relative z-10 shadow-[0_0_50px_rgba(151,71,255,0.15)] transform lg:scale-105 h-full overflow-hidden',
        checkColor: 'text-[#4DE1C1]'
    },
    {
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
        buttonClass: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white',
        cardClass: 'bg-[#110D1A]/80 backdrop-blur-xl border border-white/10 rounded-3xl lg:rounded-l-none p-10 flex flex-col hover:border-white/20 transition-all duration-500 relative z-0 h-full lg:h-[90%]',
        checkColor: 'text-[#B983FF]'
    }
];

export default function PricingPage() {
    return (
        <main className="bg-[#0a0614] min-h-screen text-white selection:bg-[#9747FF]/30">
            {/* Banner Section */}
            <section className="relative w-full min-h-[45vh] flex flex-col items-center justify-center pt-32 pb-16 px-4 overflow-hidden text-center">
                <div className="relative z-10 w-full max-w-4xl mx-auto">
                    {/* Ambient Background Glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-900/15 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center mt-8">
                        {/* Tagline */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
                            <span className="text-[11px] font-bold tracking-widest text-[#B3A1C9] uppercase">
                                Transparent Pricing
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 font-serif">
                            Simple, Scalable <span className="bg-gradient-to-r from-[#DDB9FF] via-[#B983FF] to-[#9747FF] text-transparent bg-clip-text">Pricing</span>
                        </h1>

                        {/* Description */}
                        <p className="text-[#a19bb0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Choose the plan that's right for your business. All plans include full access during your 14-day free trial.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="relative w-full max-w-7xl mx-auto py-16 px-6 md:px-12 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

                    {PRICING_PLANS.map((plan, index) => (
                        <div key={index} className={plan.cardClass}>
                            {plan.highlight && (
                                <>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
                                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#DDB9FF] via-[#9747FF] to-[#DDB9FF]"></div>
                                </>
                            )}

                            <div className="flex flex-col mb-8 relative">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold font-serif text-white">{plan.name}</h3>
                                    {plan.badge && (
                                        <span className="text-[10px] font-bold tracking-widest text-[#2D164E] bg-[#DDB9FF] px-3 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(221,185,255,0.4)]">
                                            {plan.badge}
                                        </span>
                                    )}
                                </div>
                                <p className={plan.highlight ? "text-[#DDB9FF]/80 text-sm h-10" : "text-[#a19bb0] text-sm h-10"}>
                                    {plan.tagline}
                                </p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1 relative">
                                <span className={plan.highlight ? "text-6xl font-bold font-mono text-white" : "text-5xl font-bold font-mono text-white"}>
                                    {plan.price}
                                </span>
                                {plan.pricePeriod && (
                                    <span className="text-[#a19bb0] font-medium">{plan.pricePeriod}</span>
                                )}
                            </div>

                            <ul className="flex flex-col gap-5 mb-10 flex-1 relative">
                                {plan.features.map((item, i) => (
                                    <li key={i} className={`flex items-start gap-3 ${plan.highlight ? 'text-white' : 'text-[#d1cddb]'}`}>
                                        <svg className={`w-5 h-5 ${plan.checkColor} shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className={plan.highlight ? 'text-sm font-medium' : 'text-sm'}>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`relative w-full py-4 rounded-xl font-bold transition-all duration-300 ${plan.buttonClass}`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}

                </div>
            </section>
            <PricingCompareSection />
        </main>
    );
}
