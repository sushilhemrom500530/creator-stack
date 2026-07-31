"use client";

import React from 'react';
import { useTheme } from '@/providers/mode-theme';
import "./index.css";

interface CompareCell {
    text: string;
    muted?: boolean;
    highlighted?: boolean;
    featured?: boolean;
}

interface CompareRow {
    feature: string;
    starter: CompareCell;
    business: CompareCell;
    enterprise: CompareCell;
}

const COMPARE_DATA: CompareRow[] = [
    {
        feature: 'Monthly AI Tokens',
        starter: { text: '50,000' },
        business: { text: '500,000', featured: true },
        enterprise: { text: 'Unlimited' }
    },
    {
        feature: 'Fine-tuning Access',
        starter: { text: '—', muted: true },
        business: { text: 'Included', highlighted: true },
        enterprise: { text: 'Advanced' }
    },
    {
        feature: 'API Rate Limits',
        starter: { text: '60 RPM' },
        business: { text: '1,200 RPM' },
        enterprise: { text: 'Custom' }
    },
    {
        feature: 'Data Retention',
        starter: { text: '7 Days' },
        business: { text: '30 Days' },
        enterprise: { text: 'Customizable' }
    },
    {
        feature: '24/7 Priority Support',
        starter: { text: '—', muted: true },
        business: { text: '—', muted: true },
        enterprise: { text: 'Included', highlighted: true }
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
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const getCellClass = (cell: CompareCell) => {
        if (cell.highlighted) return `pricing-compare-value-cell is-highlighted ${themeClass}`;
        if (cell.featured) return `pricing-compare-value-cell is-featured ${themeClass}`;
        if (cell.muted) return `pricing-compare-value-cell is-muted ${themeClass}`;
        return `pricing-compare-value-cell is-normal ${themeClass}`;
    };

    return (
        <section className="pricing-compare-section">

            <div className="pricing-compare-header">
                <h2 className={`pricing-compare-title ${themeClass}`}>
                    Compare Features
                </h2>
                <p className={`pricing-compare-desc ${themeClass}`}>
                    Deep dive into our comprehensive feature set.
                </p>
            </div>

            {/* Comparison Table */}
            <div className={`pricing-compare-table-container ${themeClass}`}>
                <div className="pricing-compare-table-wrapper">
                    {/* Header Row */}
                    <div className={`pricing-compare-header-row ${themeClass}`}>
                        <div className={`pricing-compare-th ${themeClass}`}>Features</div>
                        <div className={`pricing-compare-th-col ${themeClass}`}>Starter</div>
                        <div className={`pricing-compare-th-business ${themeClass}`}>Business</div>
                        <div className={`pricing-compare-th-col ${themeClass}`}>Enterprise</div>
                    </div>

                    {/* Data Rows */}
                    {COMPARE_DATA.map((row, index) => {
                        const hasBorder = index !== COMPARE_DATA.length - 1;
                        return (
                            <div
                                key={index}
                                className={`pricing-compare-data-row ${hasBorder ? `has-border ${themeClass}` : ''}`}
                            >
                                <div className={`pricing-compare-feature-cell ${themeClass}`}>{row.feature}</div>
                                <div className={getCellClass(row.starter)}>
                                    {row.starter.text}
                                </div>
                                <div className={getCellClass(row.business)}>
                                    {row.business.text}
                                </div>
                                <div className={getCellClass(row.enterprise)}>
                                    {row.enterprise.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FAQs Layout */}
            <div className="pricing-compare-faq-grid">
                {FAQS.map((faq, index) => (
                    <div key={index} className={`pricing-compare-faq-card ${themeClass}`}>
                        <h4 className={`pricing-compare-faq-question ${themeClass}`}>{faq.question}</h4>
                        <p className={`pricing-compare-faq-answer ${themeClass}`}>{faq.answer}</p>
                    </div>
                ))}
            </div>

        </section>
    );
}