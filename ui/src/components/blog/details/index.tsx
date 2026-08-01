"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '@/providers/mode-theme';
import "./index.css";

interface BlogDetailData {
    id: string;
    category: string;
    categoryVariant: 'violet' | 'teal' | 'indigo' | 'pink';
    title: string;
    subtitle: string;
    date: string;
    readTime: string;
    heroImage: string;
    author: {
        name: string;
        role: string;
        avatar: string;
        bio: string;
    };
    content: {
        takeaways: string[];
        sections: {
            heading: string;
            paragraphs: string[];
            quote?: string;
        }[];
    };
}

const blogDatabase: Record<string, BlogDetailData> = {
    "1": {
        id: "1",
        category: "ALGORITHMIC TRENDS",
        categoryVariant: "violet",
        title: "Mastering the Attention Economy in 2024",
        subtitle: "How SocialFlow AI leverages predictive analytics to capture high-intent engagement windows before they trend.",
        date: "March 14, 2024",
        readTime: "5 min read",
        heroImage: "https://images.unsplash.com/photo-1620825937374-87fc7d62828e?q=80&w=1200&auto=format&fit=crop",
        author: {
            name: "Dr. Helena Vance",
            role: "Head of AI Research",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
            bio: "Dr. Helena Vance leads AI Research at SocialFlow. Her work focuses on autonomous agent architectures and engagement velocity modeling."
        },
        content: {
            takeaways: [
                "Attention spans are shifting from duration to immediate relevance signals.",
                "Predictive timing algorithms increase engagement rate by up to 3.4x over static scheduling.",
                "Algorithmic resonance requires combining automated sentiment analysis with brand tone guardrails."
            ],
            sections: [
                {
                    heading: "The Shift from Passive Reach to High-Intent Resonance",
                    paragraphs: [
                        "In traditional social media management, brands broadcasted content on fixed schedules hoping to catch passing audiences. In 2024, the dynamic has fundamentally inverted. Algorithms now prioritize signals of intent, engagement velocity, and topical resonance over legacy follower counts.",
                        "By deploying predictive analytics models, teams can monitor real-time conversation clusters and identify emerging micro-trends hours before they reach peak saturation."
                    ],
                    quote: "The future of brand authority belongs to systems that anticipate conversation trajectories rather than react to them."
                },
                {
                    heading: "Deploying Autonomous Predictive Engines",
                    paragraphs: [
                        "Our benchmark evaluations across 500+ enterprise accounts demonstrate that posting within the first 15 minutes of a conversation shift yields a 340% increase in organic reach compared to lagging content.",
                        "Integrating SocialFlow AI logic engine enables continuous evaluation of context vector shifts across multi-channel endpoints seamlessly."
                    ]
                }
            ]
        }
    },
    "2": {
        id: "2",
        category: "PRODUCT UPDATES",
        categoryVariant: "teal",
        title: "Introducing Aetheris-2: The New Logic Engine",
        subtitle: "A deep dive into our latest model upgrade that reduces hallucination by 84% in social contexts.",
        date: "March 10, 2024",
        readTime: "8 min read",
        heroImage: "https://images.unsplash.com/photo-1682687982501-1e5898cb89c4?q=80&w=1200&auto=format&fit=crop",
        author: {
            name: "Alex Chen",
            role: "Principal Systems Architect",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
            bio: "Alex is the architect behind Aetheris-2 logic engine, specializing in low-latency transformer inference and brand alignment."
        },
        content: {
            takeaways: [
                "Aetheris-2 introduces constrained decoder passes to eliminate unverified brand claims.",
                "Reduces context generation latency to sub-120 milliseconds globally.",
                "Native multi-modal understanding for simultaneous image, video, and text processing."
            ],
            sections: [
                {
                    heading: "Next-Generation Model Reliability",
                    paragraphs: [
                        "Generative AI models in enterprise social environments must adhere strictly to factual parameters. Aetheris-2 introduces real-time validation layers that score generated responses against verified corporate knowledge items before publication.",
                        "This dual-stage verification loop reduces factual drift and brand voice hallucination by 84% in benchmarking tests."
                    ],
                    quote: "Enterprise safety isn't an afterthought; it is built into the loss function of our generation pipeline."
                }
            ]
        }
    },
    "3": {
        id: "3",
        category: "ENTERPRISE SCALE",
        categoryVariant: "indigo",
        title: "Governing AI Across Global Teams",
        subtitle: "Best practices for maintaining brand consistency while deploying autonomous agents across continents.",
        date: "March 04, 2024",
        readTime: "12 min read",
        heroImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
        author: {
            name: "Sarah Jenkins",
            role: "VP of Enterprise Operations",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
            bio: "Sarah works with Fortune 500 companies to implement governance frameworks for autonomous AI workflows."
        },
        content: {
            takeaways: [
                "Centralized guardrails paired with localized execution teams ensure speed without compliance breach.",
                "Granular role-based access controls (RBAC) prevent unauthorized publishing.",
                "Comprehensive audit trails provide complete visibility into agent decisions."
            ],
            sections: [
                {
                    heading: "Scaling AI Without Sacrificing Brand Integrity",
                    paragraphs: [
                        "Managing brand consistency across regional teams in EMEA, APAC, and the Americas presents significant operational hurdles. When deploying AI tools, the risk of fragmented messaging multiplies exponentially.",
                        "Our governance framework establishes centralized policy boundaries while giving local teams the flexibility to adapt tone to regional cultural nuances."
                    ]
                }
            ]
        }
    },
    "4": {
        id: "4",
        category: "ETHICS & FUTURE",
        categoryVariant: "pink",
        title: "The Trust Protocol: AI Transparency",
        subtitle: "How we are building a more transparent social ecosystem through verifiable AI signatures.",
        date: "February 28, 2024",
        readTime: "6 min read",
        heroImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
        author: {
            name: "Marcus Thorne",
            role: "Lead AI Ethics Fellow",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
            bio: "Marcus researches cryptographic transparency standards for synthetic media and AI content identification."
        },
        content: {
            takeaways: [
                "Verifiable AI signatures provide cryptographic proof of content provenance.",
                "Fostering consumer trust through transparent disclosure boosts engagement rates.",
                "Open standards for ethical AI deployment are crucial for long-term platform health."
            ],
            sections: [
                {
                    heading: "Building Verifiable Trust in the Age of Synthetic Content",
                    paragraphs: [
                        "As synthetic content becomes ubiquitous across digital channels, maintaining consumer trust requires verifiable provenance standards. The Trust Protocol embeds cryptographic metadata directly into AI-generated output.",
                        "This allows consumers and platform verification systems to instantly verify authenticity and original intent."
                    ]
                }
            ]
        }
    }
};

export default function BlogDetails({ blogId }: { blogId: string }) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const [copied, setCopied] = useState(false);

    // Get article data by ID or fallback to post 1
    const article = blogDatabase[blogId] || blogDatabase["1"];

    const tagColorClass = `blog-card-tag-${article.categoryVariant}`;

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={`blog-details-page ${themeClass}`}>
            {/* Ambient Glow */}
            <div className={`blog-details-glow ${themeClass}`}></div>

            <div className="max-w-[1200px] w-full mx-auto relative z-10">

                {/* Back Button */}
                <Link href="/blogs" className={`blog-details-back-link ${themeClass}`}>
                    <ArrowLeft className="w-4 h-4" /> Back to Articles
                </Link>

                {/* Header Section */}
                <div className="max-w-4xl mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className={`blog-card-tag ${tagColorClass} ${themeClass} !mb-0`}>
                            {article.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                            <Calendar className="w-3.5 h-3.5" /> {article.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                            <Clock className="w-3.5 h-3.5" /> {article.readTime}
                        </span>
                    </div>

                    <h1 className={`blog-details-title ${themeClass}`}>
                        {article.title}
                    </h1>

                    <p className={`blog-details-subtitle ${themeClass}`}>
                        {article.subtitle}
                    </p>

                    {/* Author & Share Bar */}
                    <div className={`blog-details-author-bar ${themeClass}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden relative shadow-inner bg-gradient-to-tr from-violet-600 to-indigo-400">
                                <Image
                                    src={article.author.avatar}
                                    alt={article.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>
                                    {article.author.name}
                                </span>
                                <span className={`text-xs font-mono italic ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                                    {article.author.role}
                                </span>
                            </div>
                        </div>

                        {/* Social Share Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyLink}
                                className={`p-2.5 cursor-pointer rounded-full border transition-colors flex items-center gap-2 text-xs font-semibold ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                    }`}
                                title="Copy Link"
                            >
                                {copied ? <Check className="w-4 h-4 text-teal-500" /> : <Share2 className="w-4 h-4" />}
                                <span>{copied ? "Copied!" : "Share"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Hero Image */}
                <div className="w-full h-[350px] md:h-[500px] relative rounded-3xl overflow-hidden border border-white/10 mb-16">
                    <Image
                        src={article.heroImage}
                        alt={article.title}
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? "from-slate-900/30 to-transparent" : "from-[#0a0614]/50 to-transparent"}`} />
                </div>

                {/* 2-Column Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Main Article Body (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col">

                        {/* Key Takeaways Box */}
                        <div className={`blog-details-callout ${themeClass}`}>
                            <div className="flex items-center gap-2 text-violet-500 font-bold text-xs tracking-widest uppercase mb-4">
                                <Sparkles className="w-4 h-4" /> Key Takeaways
                            </div>
                            <ul className="space-y-3">
                                {article.content.takeaways.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm md:text-base leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Article Content Sections */}
                        <div className={`blog-details-prose ${themeClass}`}>
                            {article.content.sections.map((section, idx) => (
                                <div key={idx} className="mb-10">
                                    <h2>{section.heading}</h2>
                                    {section.paragraphs.map((p, pIdx) => (
                                        <p key={pIdx} className="mb-4">{p}</p>
                                    ))}

                                    {section.quote && (
                                        <blockquote className={`my-8 p-6 rounded-2xl border-l-4 border-violet-500 italic text-lg font-serif ${isLight ? "bg-slate-100/80 text-slate-900" : "bg-white/5 text-white"
                                            }`}>
                                            "{section.quote}"
                                        </blockquote>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Author Bio Box */}
                        <div className={`p-8 rounded-3xl border mt-12 flex flex-col md:flex-row items-center gap-6 ${isLight ? "bg-white border-slate-200" : "bg-[#15111F]/80 border-white/10"
                            }`}>
                            <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 bg-gradient-to-tr from-violet-600 to-indigo-400">
                                <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col text-center md:text-left">
                                <span className={`font-bold text-base mb-1 ${isLight ? "text-slate-900" : "text-white"}`}>
                                    Written by {article.author.name}
                                </span>
                                <p className={`text-xs md:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-gray-400"}`}>
                                    {article.author.bio}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Sticky (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="sticky top-32 flex flex-col gap-8">

                            {/* Newsletter Subscription Box */}
                            <div className={`blog-details-sidebar-card ${themeClass}`}>
                                <h3 className={`text-xl font-bold font-serif mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                                    Subscribe to Intelligence Weekly
                                </h3>
                                <p className={`text-xs leading-relaxed mb-6 ${isLight ? "text-slate-600" : "text-[#a19bb0]"}`}>
                                    Get the latest AI strategy whitepapers and benchmarks delivered directly to your inbox.
                                </p>
                                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="work@company.com"
                                        className={`w-full rounded-xl px-4 py-3 text-xs outline-none border transition-colors ${isLight
                                            ? "bg-slate-100 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-violet-600"
                                            : "bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500"
                                            }`}
                                        required
                                    />
                                    <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs tracking-wider uppercase py-3 rounded-xl transition-colors cursor-pointer">
                                        Subscribe
                                    </button>
                                </form>
                            </div>

                            {/* Recommended Reading */}
                            <div className={`blog-details-sidebar-card ${themeClass}`}>
                                <h4 className={`text-sm font-bold tracking-widest uppercase mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
                                    Recommended Reading
                                </h4>
                                <div className="flex flex-col gap-6">
                                    {Object.values(blogDatabase)
                                        .filter((item) => item.id !== article.id)
                                        .slice(0, 2)
                                        .map((rec) => (
                                            <Link key={rec.id} href={`/blogs/view/${rec.id}`} className="group flex flex-col gap-2">
                                                <span className={`text-[9px] font-bold tracking-widest uppercase text-violet-500`}>
                                                    {rec.category}
                                                </span>
                                                <h5 className={`text-sm font-bold leading-snug group-hover:text-violet-500 transition-colors ${isLight ? "text-slate-900" : "text-white"}`}>
                                                    {rec.title}
                                                </h5>
                                                <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                                                    {rec.readTime} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </Link>
                                        ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}