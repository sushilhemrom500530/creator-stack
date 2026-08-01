"use client";

import { useTheme } from '@/providers/mode-theme';
import { ArrowRight } from 'lucide-react';
import BlogFeatures from '@/components/blog/features';
import "./index.css";

export default function Blogs() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <div className={`blog-page-container ${themeClass}`}>
            <div className="max-w-[1200px] w-full mx-auto flex flex-col items-center relative z-10">

                {/* Header Subtext & Title */}
                <div className="text-center mb-20 max-w-2xl relative w-full flex flex-col items-center justify-center">
                    {/* Ambient Background Glow matching Resources banner glow */}
                    <div className={`blog-banner-glow ${themeClass}`}></div>

                    <div className={`tagline-badge ${themeClass}`}>
                        <span className="tagline-dot" />
                        <span className={`tagline-text ${themeClass}`}>
                            Perspective
                        </span>
                    </div>
                    <h1 className={`blog-header-title ${themeClass}`}>
                        Intelligence Weekly
                    </h1>
                    <p className={`blog-header-desc ${themeClass}`}>
                        Exploring the frontier of generative AI, automated engagement, and the future of digital presence for the world's most innovative brands.
                    </p>
                </div>

                {/* Featured Post Card */}
                <BlogFeatures />

                {/* Recent Insights header */}
                <div className="w-full flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
                    <h2 className={`blog-recent-heading ${themeClass}`}>Recent Insights</h2>
                    <div className="flex gap-2">
                        <button className={`blog-filter-btn-active ${themeClass}`}>
                            ALL POSTS
                        </button>
                        <button className={`blog-filter-btn ${themeClass}`}>
                            STRATEGY
                        </button>
                        <button className={`blog-filter-btn ${themeClass}`}>
                            TECH STACK
                        </button>
                    </div>
                </div>

                {/* 3-Column Grid Layout */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Card 1 */}
                    <div className={`blog-card group ${themeClass}`}>
                        <div className={`blog-card-img-wrap ${themeClass}`}>
                            <img src="https://images.unsplash.com/photo-1620825937374-87fc7d62828e?q=80&w=800&auto=format&fit=crop" alt="Abstract Glass" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className={`blog-card-tag blog-card-tag-violet ${themeClass}`}>ALGORITHMIC TRENDS</span>
                            <h3 className={`blog-card-title ${themeClass}`}>
                                Mastering the Attention Economy in 2024
                            </h3>
                            <p className={`blog-card-desc ${themeClass}`}>
                                How SocialFlow AI leverages predictive analytics to capture high-intent engagement windows before they trend.
                            </p>
                            <div className={`blog-card-footer ${themeClass}`}>
                                <span className={`blog-card-readtime ${themeClass}`}>5 min read</span>
                                <button className={`blog-card-action group/btn ${themeClass}`}>
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className={`blog-card group ${themeClass}`}>
                        <div className={`blog-card-img-wrap ${themeClass}`}>
                            <img src="https://images.unsplash.com/photo-1682687982501-1e5898cb89c4?q=80&w=800&auto=format&fit=crop" alt="Nature Chip" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className={`blog-card-tag blog-card-tag-teal ${themeClass}`}>PRODUCT UPDATES</span>
                            <h3 className={`blog-card-title ${themeClass}`}>
                                Introducing Aetheris-2: The New Logic Engine
                            </h3>
                            <p className={`blog-card-desc ${themeClass}`}>
                                A deep dive into our latest model upgrade that reduces hallucination by 84% in social contexts.
                            </p>
                            <div className={`blog-card-footer ${themeClass}`}>
                                <span className={`blog-card-readtime ${themeClass}`}>8 min read</span>
                                <button className={`blog-card-action group/btn ${themeClass}`}>
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className={`blog-card group ${themeClass}`}>
                        <div className={`blog-card-img-wrap ${themeClass}`}>
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop" alt="Stairs" className="w-full h-full object-cover opacity-80 grayscale group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className={`blog-card-tag blog-card-tag-indigo ${themeClass}`}>ENTERPRISE SCALE</span>
                            <h3 className={`blog-card-title ${themeClass}`}>
                                Governing AI Across Global Teams
                            </h3>
                            <p className={`blog-card-desc ${themeClass}`}>
                                Best practices for maintaining brand consistency while deploying autonomous agents across continents.
                            </p>
                            <div className={`blog-card-footer ${themeClass}`}>
                                <span className={`blog-card-readtime ${themeClass}`}>12 min read</span>
                                <button className={`blog-card-action group/btn ${themeClass}`}>
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className={`blog-card group ${themeClass}`}>
                        <div className={`blog-card-img-wrap ${themeClass}`}>
                            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" alt="AI Human Frame" className="w-full h-full object-cover opacity-80 mix-blend-screen group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col flex-1">
                            <span className={`blog-card-tag blog-card-tag-pink ${themeClass}`}>ETHICS & FUTURE</span>
                            <h3 className={`blog-card-title ${themeClass}`}>
                                The Trust Protocol: AI Transparency
                            </h3>
                            <p className={`blog-card-desc ${themeClass}`}>
                                How we are building a more transparent social ecosystem through verifiable AI signatures.
                            </p>
                            <div className={`blog-card-footer ${themeClass}`}>
                                <span className={`blog-card-readtime ${themeClass}`}>6 min read</span>
                                <button className={`blog-card-action group/btn ${themeClass}`}>
                                    ARTICLE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Block (Spans 2 columns on lg) */}
                    <div className={`blog-sub-block group ${themeClass}`}>
                        <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="blog-sub-title">
                            Stay Ahead of the Curve
                        </h3>
                        <p className={`blog-sub-desc ${themeClass}`}>
                            Get our bi-weekly whitepapers and tactical AI guides delivered strictly to your inbox. No spam.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative z-10">
                            <input
                                type="email"
                                placeholder="work@company.com"
                                className={`blog-sub-input ${themeClass}`}
                            />
                            <button className={`blog-sub-btn ${themeClass}`}>
                                SUBSCRIBE
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}