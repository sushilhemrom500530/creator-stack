"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/mode-theme";
import {
    ArrowLeft,
    Clock,
    Calendar,
    Share2,
    Bookmark,
    Check,
    Copy,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    AlertTriangle,
    Layers,
    ChevronRight,
    Terminal,
    Download,
    ExternalLink,
    HelpCircle,
    ThumbsUp,
    ThumbsDown,
    UserCheck,
    Zap,
    Send,
    FileText
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa6";
import UserGuideCard from "@/components/reuseable/user-guide-card";
import "./index.css";

interface ResourceDetailsProps {
    resourceId?: string;
}

export default function ResourceDetails({ resourceId = "1525" }: ResourceDetailsProps) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    // Reading Progress & Active TOC Section
    const [readingProgress, setReadingProgress] = useState(0);
    const [activeSection, setActiveSection] = useState("overview");

    // Interactive states
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState<"yes" | "no" | null>(null);

    // Interactive Checklist
    const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
        task1: true,
        task2: true,
        task3: false,
        task4: false,
        task5: false,
    });

    const toggleTask = (taskId: string) => {
        setCheckedTasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const completedCount = Object.values(checkedTasks).filter(Boolean).length;
    const totalCount = Object.keys(checkedTasks).length;
    const checklistPercent = Math.round((completedCount / totalCount) * 100);

    // Scroll listener for reading progress & scrollspy
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = (window.scrollY / totalHeight) * 100;
                setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
            }

            const sections = document.querySelectorAll("section[id]");
            const scrollY = window.pageYOffset;

            sections.forEach((current: any) => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 160;
                const sectionId = current.getAttribute("id");

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    setActiveSection(sectionId);
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Copy Guide Link
    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    // Copy Code Snippet
    const sampleConfigCode = `{
  "workspaceId": "ws_alpha_8921",
  "pipeline": "omni_sync_v3",
  "platforms": ["instagram", "linkedin", "x", "youtube_shorts"],
  "aiEngine": {
    "voiceProfile": "thought_leader_vibrant",
    "toneDriftTolerance": 0.05,
    "hashtagStrategy": "dynamic_trend_aligned"
  },
  "schedulingRules": {
    "peakAudienceAutoDetect": true,
    "staggerMinutes": 12,
    "fallbackTimezone": "UTC"
  }
}`;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(sampleConfigCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2500);
    };

    const tocItems = [
        { id: "overview", label: "1. Executive Overview" },
        { id: "prerequisites", label: "2. Prerequisites & Access" },
        { id: "oauth-setup", label: "3. Social OAuth Integration" },
        { id: "brand-voice", label: "4. Calibrating AI Brand Voice" },
        { id: "scheduling-pipeline", label: "5. Omni-Channel Pipeline" },
        { id: "checklist", label: "6. Interactive Launch Checklist" },
    ];

    const relatedGuides = [
        {
            id: "1526",
            category: "Methodology",
            title: "Audience Sentiment Analysis",
            description: "Deep dive into neural networks powering audience sentiment and viral resonance modeling.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
            variant: "blue",
        },
        {
            id: "1527",
            category: "Strategy",
            title: "Cross-Platform Narrative Consistency",
            description: "Master automated tone adjustment algorithms across business-first and creator networks.",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
            variant: "cyan",
        },
        {
            id: "1528",
            category: "Technical",
            title: "REST API & Webhooks Automation",
            description: "Integrate Creator Stack webhooks directly with your headless CMS and marketing pipelines.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            variant: "purple",
        },
    ];

    return (
        <div className={`resource-view-main ${themeClass}`}>
            {/* Dynamic Reading Progress Bar */}
            <div
                className="resource-reading-progress"
                style={{ width: `${readingProgress}%` }}
                aria-hidden="true"
            />

            {/* Background Ambient Glows */}
            <div className={`resource-view-glow-left ${themeClass}`} />
            <div className={`resource-view-glow-right ${themeClass}`} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                {/* Top Navigation & Breadcrumbs */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <nav className={`resource-breadcrumbs ${themeClass}`} aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
                        <ChevronRight size={14} className="opacity-50" />
                        <Link href="/resources" className="hover:text-violet-600 transition-colors">Resources</Link>
                        <ChevronRight size={14} className="opacity-50" />
                        <span className="text-violet-600 dark:text-violet-400 font-bold">Guide #{resourceId}</span>
                    </nav>

                    <Link
                        href="/resources"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Knowledge Center
                    </Link>
                </div>

                {/* Hero Header Area */}
                <header className="mb-10">
                    <div className={`resource-hero-badge ${themeClass}`}>
                        <span className="resource-badge-dot" />
                        <span>GUIDE #{resourceId} &bull; ONBOARDING &bull; VERIFIED 2026</span>
                    </div>

                    <h1 className={`resource-view-title ${themeClass}`}>
                        Onboarding Workshop: Architecting Your{" "}
                        <span className={`resource-view-title-gradient ${themeClass}`}>
                            Multi-Channel
                        </span>{" "}
                        Social Pipeline with AI
                    </h1>

                    <p className={`resource-view-subtitle ${themeClass}`}>
                        A comprehensive blueprint to connect your primary creator accounts, calibrate a bespoke
                        AI voice persona, and automate cross-platform publication with precision engagement analytics.
                    </p>

                    {/* Metadata & Quick Action Bar */}
                    <div className={`resource-meta-bar ${themeClass}`}>
                        {/* Author Profile */}
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-violet-600 to-teal-400 p-0.5 shadow-md">
                                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                                    EC
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold tracking-tight">Dr. Elena Chen</span>
                                    <UserCheck size={14} className="text-[#14B8A6]" />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Head of AI Strategy & Developer Experience
                                </p>
                            </div>
                        </div>

                        {/* Timing Badges */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Clock size={15} className="text-violet-500" />
                                <span>8 min read</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={15} className="text-violet-500" />
                                <span>Updated September 2026</span>
                            </div>
                            <div className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Beginner to Intermediate
                            </div>
                        </div>

                        {/* Share & Bookmark Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopyLink}
                                className={`resource-action-btn ${themeClass}`}
                                title="Copy Shareable Link"
                            >
                                {copiedLink ? (
                                    <>
                                        <Check size={14} className="text-emerald-500" />
                                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 size={14} />
                                        <span>Share</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`resource-action-btn ${themeClass} ${isBookmarked ? "active" : ""}`}
                                title="Bookmark Guide"
                            >
                                <Bookmark size={14} className={isBookmarked ? "fill-white text-white" : ""} />
                                <span>{isBookmarked ? "Saved" : "Bookmark"}</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Feature Media Graphic */}
                <div className={`resource-media-container ${themeClass}`}>
                    <img
                        src="https://images.unsplash.com/photo-1639322537231-2f206e06af84?auto=format&fit=crop&w=1600&q=85"
                        alt="Onboarding Workflow Graphic"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs uppercase font-bold tracking-widest text-violet-300 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                Live Integration Pipeline
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-white text-sm font-semibold">
                            <span className="flex items-center gap-2">
                                <FaInstagram className="text-pink-400" /> Instagram Graph
                            </span>
                            <span className="flex items-center gap-2">
                                <FaLinkedin className="text-blue-400" /> LinkedIn v2
                            </span>
                            <span className="flex items-center gap-2">
                                <FaTwitter className="text-sky-400" /> X API v2
                            </span>
                            <span className="flex items-center gap-2">
                                <FaYoutube className="text-red-400" /> Shorts API
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left / Primary Content Column (8 cols) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* 1. Executive Summary Box */}
                        <section id="overview" className={`resource-exec-box ${themeClass}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                <h2 className="text-lg font-bold tracking-tight">Executive Summary & Target Outcomes</h2>
                            </div>
                            <p className="text-sm leading-relaxed mb-5 opacity-90">
                                By the conclusion of this guided walkthrough, you will have configured an automated
                                omni-channel publishing pipeline that reduces repetitive distribution overhead by up to
                                85%, while increasing multi-platform engagement consistency.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "Connect & authorize Meta, LinkedIn, and X channels seamlessly.",
                                    "Establish your brand voice matrix with fine-tuned tone guardrails.",
                                    "Schedule automated time-zone optimized content dispatches.",
                                    "Set up real-time sentiment alerts and engagement callbacks."
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5 text-xs font-medium">
                                        <CheckCircle2 size={16} className="text-[#14B8A6] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. Prerequisites & Access */}
                        <section id="prerequisites" className={`resource-content-card ${themeClass} scroll-mt-28`}>
                            <h2 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3">
                                <Layers className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                2. Prerequisites & Workspace Access
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed mb-6 text-slate-600 dark:text-slate-300">
                                Before initiating your setup, ensure your user profile possesses the appropriate
                                administrative permissions on both the Creator Stack workspace and destination social platforms.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block mb-1">
                                        Account Roles
                                    </span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Admin or Owner access on Creator Stack organization.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                                    <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-wider block mb-1">
                                        Platform Business Pages
                                    </span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Instagram Professional or Facebook Page Administrator.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-1">
                                        API Tokens
                                    </span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Standard OAuth 2.0 PKCE permissions (no custom keys required).
                                    </p>
                                </div>
                            </div>

                            {/* Pro Tip Box */}
                            <div className={`resource-callout tip ${themeClass}`}>
                                <ShieldCheck className="w-5 h-5 text-[#14B8A6] shrink-0 mt-0.5" />
                                <div className="text-xs sm:text-sm">
                                    <span className="font-bold text-[#14B8A6] uppercase tracking-wider block mb-1">
                                        Zero Credential Storage
                                    </span>
                                    <p className="leading-relaxed">
                                        Creator Stack never accesses or stores your personal account passwords.
                                        All integrations communicate via encrypted, short-lived OAuth 2.0 bearer
                                        tokens compliant with SOC2 Type II and GDPR standards.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Social OAuth Integration */}
                        <section id="oauth-setup" className={`resource-content-card ${themeClass} scroll-mt-28`}>
                            <h2 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                3. Social OAuth Integration Walkthrough
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed mb-6 text-slate-600 dark:text-slate-300">
                                Follow these three sequential steps to link your destination channels to the broadcast queue:
                            </p>

                            <ol className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        1
                                    </span>
                                    <div>
                                        <h3 className="text-base font-bold mb-1">Navigate to Connected Accounts</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Open your dashboard and go to{" "}
                                            <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-xs text-violet-600 dark:text-violet-400">
                                                /user/connected-accounts
                                            </code>
                                            . Click the <strong>&quot;Add Channel&quot;</strong> button in the top right corner.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex gap-4">
                                    <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        2
                                    </span>
                                    <div>
                                        <h3 className="text-base font-bold mb-1">Select Authentication Provider</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Select the platform you wish to connect (Meta/Instagram, LinkedIn, X, TikTok, or YouTube).
                                            A secure authorization dialog will open. Confirm the requested scopes for post scheduling
                                            and read-only engagement analytics.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex gap-4">
                                    <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        3
                                    </span>
                                    <div>
                                        <h3 className="text-base font-bold mb-1">Assign Channel to Content Groups</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Group your connected channels by brand or topic. This enables one-click broadcast
                                            dispatches where a single draft is tailored and queued across all selected channels simultaneously.
                                        </p>
                                    </div>
                                </li>
                            </ol>

                            {/* Warning Box */}
                            <div className={`resource-callout warning ${themeClass}`}>
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-xs sm:text-sm">
                                    <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                                        Token Refresh Policy
                                    </span>
                                    <p className="leading-relaxed">
                                        Facebook and Instagram access tokens expire after 60 days of inactivity.
                                        Creator Stack automatically refreshes tokens in the background every 30 days.
                                        If password changes occur on Meta, you will receive an instant dashboard re-authorization prompt.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Calibrating AI Brand Voice */}
                        <section id="brand-voice" className={`resource-content-card ${themeClass} scroll-mt-28`}>
                            <h2 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3">
                                <Terminal className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                4. Calibrating the Brand Voice Matrix
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed mb-6 text-slate-600 dark:text-slate-300">
                                Rather than generic boilerplate outputs, Creator Stack utilizes a dynamic brand persona
                                specification. You can customize this directly in the UI or export the JSON configuration for team governance.
                            </p>

                            {/* Code Snippet Box */}
                            <div className={`resource-code-box ${themeClass}`}>
                                <div className="resource-code-header">
                                    <span className="flex items-center gap-2">
                                        <FileText size={14} className="text-violet-400" />
                                        pipeline.config.json
                                    </span>
                                    <button
                                        onClick={handleCopyCode}
                                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[11px]"
                                    >
                                        {codeCopied ? (
                                            <>
                                                <Check size={12} className="text-emerald-400" />
                                                <span className="text-emerald-400 font-bold">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                <span>Copy JSON</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-slate-200">
                                    <code>{sampleConfigCode}</code>
                                </pre>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
                                Tip: Adjust <code>toneDriftTolerance</code> between 0.01 (strict compliance) and 0.15 (more creative experimentation).
                            </p>
                        </section>

                        {/* 5. Omni-Channel Scheduling Pipeline */}
                        <section id="scheduling-pipeline" className={`resource-content-card ${themeClass} scroll-mt-28`}>
                            <h2 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3">
                                <Send className="w-6 h-6 text-[#14B8A6]" />
                                5. Omni-Channel Scheduling & Cross-Platform Adaptation
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed mb-6 text-slate-600 dark:text-slate-300">
                                When a post is added to the broadcast queue, the optimization engine applies platform-specific rules before dispatching:
                            </p>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold flex items-center gap-2">
                                            <FaInstagram className="text-pink-500" /> Instagram Feed & Reels
                                        </span>
                                        <span className="text-xs font-mono text-violet-600 dark:text-violet-400 font-semibold">Aspect 1:1 or 4:5</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Auto-extracts first 3 lines as visual hook, generates relevant hashtags in first comment, and checks 1080x1350 resolution limits.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold flex items-center gap-2">
                                            <FaLinkedin className="text-blue-500" /> LinkedIn Professional Feed
                                        </span>
                                        <span className="text-xs font-mono text-violet-600 dark:text-violet-400 font-semibold">Long-form formatted</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Formats line-spacing for mobile readability, inserts professional call-to-action, and strips informal slang.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold flex items-center gap-2">
                                            <FaTwitter className="text-sky-500" /> X (Twitter) Thread Engine
                                        </span>
                                        <span className="text-xs font-mono text-violet-600 dark:text-violet-400 font-semibold">280 char chunking</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Breaks long thoughts into a serialized thread numbered 1/N, placing external links on the final tweet to avoid algorithmic suppression.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 6. Interactive Checklist */}
                        <section id="checklist" className={`resource-content-card ${themeClass} scroll-mt-28`}>
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-serif flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        6. Interactive Launch Checklist
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Check off each milestone as you configure your workspace.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
                                        {completedCount} of {totalCount} completed ({checklistPercent}%)
                                    </span>
                                    <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-white/10 mt-1.5 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-600 to-[#14B8A6] transition-all duration-300"
                                            style={{ width: `${checklistPercent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: "task1", label: "Verify organization admin permissions and user seat allocation" },
                                    { id: "task2", label: "Connect at least 2 primary social channels via OAuth 2.0" },
                                    { id: "task3", label: "Define brand voice parameters and tone guardrails in AI Assistant settings" },
                                    { id: "task4", label: "Generate and schedule your first test multi-channel draft" },
                                    { id: "task5", label: "Verify delivery receipt and inspect real-time engagement telemetry" },
                                ].map((task) => {
                                    const isChecked = checkedTasks[task.id];
                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => toggleTask(task.id)}
                                            className={`resource-check-item ${isChecked ? "checked" : ""} ${themeClass}`}
                                        >
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isChecked
                                                ? "bg-violet-600 border-violet-600 text-white"
                                                : "border-slate-300 dark:border-white/20 bg-white dark:bg-black/20"
                                                }`}>
                                                {isChecked && <Check size={13} strokeWidth={3} />}
                                            </div>
                                            <span className={`text-xs sm:text-sm font-medium ${isChecked ? "line-through opacity-70" : ""}`}>
                                                {task.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Reader Feedback Reaction */}
                        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? "bg-slate-50/80 border-slate-200" : "bg-[#100E19] border-white/10"
                            }`}>
                            <div className="text-center sm:text-left">
                                <h4 className="text-sm font-bold">Was this guide helpful to your workflow?</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Your feedback informs our continuous technical guide updates.
                                </p>
                            </div>

                            {feedbackGiven ? (
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                    <CheckCircle2 size={16} /> Thank you for your feedback!
                                </span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setFeedbackGiven("yes")}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-colors ${isLight
                                            ? "bg-white border-slate-200 hover:border-emerald-300 hover:text-emerald-700 shadow-xs"
                                            : "bg-white/5 border-white/10 hover:border-emerald-500/40 hover:text-emerald-300"
                                            }`}
                                    >
                                        <ThumbsUp size={14} /> Yes, very clear
                                    </button>
                                    <button
                                        onClick={() => setFeedbackGiven("no")}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-colors ${isLight
                                            ? "bg-white border-slate-200 hover:border-rose-300 hover:text-rose-700 shadow-xs"
                                            : "bg-white/5 border-white/10 hover:border-rose-500/40 hover:text-rose-300"
                                            }`}
                                    >
                                        <ThumbsDown size={14} /> Needs more detail
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Next / Previous Guide Navigation */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                            <Link
                                href="/resources/view/1524"
                                className={`resource-nav-card ${themeClass}`}
                            >
                                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
                                    &larr; Previous Guide
                                </span>
                                <h4 className="text-sm font-bold">
                                    API Authentication, Bearer Keys & Webhooks
                                </h4>
                            </Link>

                            <Link
                                href="/resources/view/1526"
                                className={`resource-nav-card text-right ${themeClass}`}
                            >
                                <span className="text-[10px] font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 mb-1">
                                    Next Guide &rarr;
                                </span>
                                <h4 className="text-sm font-bold">
                                    Audience Sentiment Analysis & AI Neural Tuning
                                </h4>
                            </Link>
                        </div>
                    </div>

                    {/* Right Sticky Sidebar (4 cols) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                        {/* Table of Contents Widget */}
                        <div className={`resource-sidebar-card ${themeClass}`}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <FileText size={14} className="text-violet-600 dark:text-violet-400" />
                                On This Page
                            </h3>
                            <nav className="space-y-1.5">
                                {tocItems.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`resource-toc-link ${activeSection === item.id ? "active" : ""} ${themeClass}`}
                                    >
                                        <span>{item.label}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Quick Toolkit & PDF Download */}
                        <div className={`resource-sidebar-card ${themeClass}`}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                Guide Toolkit
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Download the offline deployment cheat sheet or launch the live sandbox testbed.
                            </p>

                            <div className="space-y-2.5">
                                <button
                                    onClick={() => alert("Downloading Creator Stack Onboarding Cheat Sheet (PDF)...")}
                                    className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                                >
                                    <Download size={14} /> Download Cheat Sheet (PDF)
                                </button>

                                <Link
                                    href="/user/dashboard"
                                    className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${isLight
                                        ? "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                        }`}
                                >
                                    <ExternalLink size={14} /> Open Live Workspace
                                </Link>
                            </div>
                        </div>

                        {/* Need Help Box */}
                        <div className={`p-5 rounded-2xl border text-center ${isLight ? "bg-violet-50/60 border-violet-200 text-slate-800" : "bg-violet-950/20 border-violet-500/20 text-slate-200"
                            }`}>
                            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-violet-600 dark:text-violet-400" />
                            <h4 className="text-sm font-bold mb-1">Need Implementation Support?</h4>
                            <p className="text-xs opacity-80 mb-3">
                                Our solution architects and community creators are active 24/7 on Discord.
                            </p>
                            <Link
                                href="/solutions"
                                className="text-xs font-bold text-violet-600 dark:text-violet-300 underline underline-offset-4 hover:opacity-80 transition-opacity"
                            >
                                Contact Creator Strategy Team &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Related Guides Recommendation */}
                <div className="mt-24 pt-12 border-t border-slate-200 dark:border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <span className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400 block mb-1">
                                Recommended Reading
                            </span>
                            <h2 className="text-2xl font-bold font-serif">Related Technical Guides</h2>
                        </div>
                        <Link
                            href="/resources"
                            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 uppercase tracking-wider transition-colors"
                        >
                            Browse All 24 Guides &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedGuides.map((guide) => (
                            <UserGuideCard
                                key={guide.id}
                                id={guide.id}
                                category={guide.category}
                                title={guide.title}
                                description={guide.description}
                                image={guide.image}
                                variant={guide.variant}
                                buttonText="Read Guide"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
