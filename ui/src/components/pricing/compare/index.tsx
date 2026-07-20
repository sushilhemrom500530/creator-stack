import React from 'react';

const COMPARE_DATA = [
    {
        feature: 'Monthly AI Tokens',
        starter: { text: '50,000', className: 'text-[#d1cddb]' },
        business: { text: '500,000', className: 'text-white font-bold' },
        enterprise: { text: 'Unlimited', className: 'text-[#d1cddb]' }
    },
    {
        feature: 'Fine-tuning Access',
        starter: { text: '—', className: 'text-[#a19bb0]' },
        business: { text: 'Included', className: 'text-[#DDB9FF] font-semibold' },
        enterprise: { text: 'Advanced', className: 'text-[#d1cddb]' }
    },
    {
        feature: 'API Rate Limits',
        starter: { text: '60 RPM', className: 'text-[#d1cddb]' },
        business: { text: '1,200 RPM', className: 'text-[#d1cddb]' },
        enterprise: { text: 'Custom', className: 'text-[#d1cddb]' }
    },
    {
        feature: 'Data Retention',
        starter: { text: '7 Days', className: 'text-[#d1cddb]' },
        business: { text: '30 Days', className: 'text-[#d1cddb]' },
        enterprise: { text: 'Customizable', className: 'text-[#d1cddb]' }
    },
    {
        feature: '24/7 Priority Support',
        starter: { text: '—', className: 'text-[#a19bb0]' },
        business: { text: '—', className: 'text-[#a19bb0]' },
        enterprise: { text: 'Included', className: 'text-[#DDB9FF] font-semibold' }
    },
];

const FAQS = [
    {
        question: 'Can I upgrade or downgrade anytime?',
        answer: 'Yes, you can change your plan at any time from your dashboard. When upgrading, changes are immediate. When downgrading, the change will take effect at the end of your current billing cycle.'
    },
    {
        question: 'Do you offer discounts for non-profits?',
        answer: 'Absolutely. We support open-source and non-profit initiatives with a flat 40% discount on all our annual plans. Please contact our support team with your documentation.'
    }
];

export default function PricingCompareSection() {
    return (
        <section className="relative w-full max-w-7xl mx-auto py-16 px-6 md:px-12 mb-24">

            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Compare Features</h2>
                <p className="text-[#a19bb0] text-sm md:text-base">
                    Deep dive into our comprehensive feature set.
                </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-[#1A1625]/60 border border-white/5 rounded-3xl p-6 md:p-10 mb-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-x-auto overflow-y-hidden text-sm md:text-base">
                <div className="min-w-[600px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4 pb-6 border-b border-white/10 font-bold items-center sticky top-0 bg-[#1A1625]/0">
                        <div className="text-white text-lg">Features</div>
                        <div className="text-white text-lg text-center">Starter</div>
                        <div className="text-[#DDB9FF] text-lg text-center">Business</div>
                        <div className="text-white text-lg text-center">Enterprise</div>
                    </div>

                    {/* Data Rows */}
                    {COMPARE_DATA.map((row, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-4 gap-4 py-8 items-center ${index !== COMPARE_DATA.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                            <div className="font-semibold text-white pl-1">{row.feature}</div>
                            <div className={`text-center ${row.starter.className}`}>{row.starter.text}</div>
                            <div className={`text-center ${row.business.className}`}>{row.business.text}</div>
                            <div className={`text-center ${row.enterprise.className}`}>{row.enterprise.text}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FAQS.map((faq, index) => (
                    <div key={index} className="bg-[#1A1625]/40 border border-white/5 rounded-3xl p-8 hover:bg-[#1A1625]/60 transition-colors">
                        <h4 className="text-[#DDB9FF] font-bold text-lg mb-4">{faq.question}</h4>
                        <p className="text-[#a19bb0] text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                ))}
            </div>

        </section>
    );
}