"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/mode-theme";
import {
    Sparkles,
    CheckCircle2,
    Layers,
    ShieldCheck,
    Zap,
    AlertTriangle,
    Terminal,
    FileText,
    Check,
    Copy,
    Send,
    Download,
    ExternalLink,
    HelpCircle,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa6";
import "./index.css";

export default function ContentSection() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const [activeSection, setActiveSection] = useState("overview");
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

    // Scrollspy for TOC
    useEffect(() => {
        const handleScroll = () => {
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

    const checklistTasks = [
        { id: "task1", label: "Verify organization admin permissions and user seat allocation" },
        { id: "task2", label: "Connect at least 2 primary social channels via OAuth 2.0" },
        { id: "task3", label: "Define brand voice parameters and tone guardrails in AI Assistant settings" },
        { id: "task4", label: "Generate and schedule your first test multi-channel draft" },
        { id: "task5", label: "Verify delivery receipt and inspect real-time engagement telemetry" },
    ];

    return (
        <section className={`resource-content-section ${themeClass}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left / Primary Content Column (8 cols) */}
                <div className="lg:col-span-8 space-y-10">
                    {/* 1. Executive Summary Box */}
                    <div id="overview" className={`resource-exec-box ${themeClass}`}>
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
                    </div>

                    {/* 2. Prerequisites & Access */}
                    <div id="prerequisites" className={`resource-content-card ${themeClass} scroll-mt-28`}>
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
                    </div>

                    {/* 3. Social OAuth Integration */}
                    <div id="oauth-setup" className={`resource-content-card ${themeClass} scroll-mt-28`}>
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
                    </div>

                    {/* 4. Calibrating AI Brand Voice */}
                    <div id="brand-voice" className={`resource-content-card ${themeClass} scroll-mt-28`}>
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
                    </div>

                    {/* 5. Omni-Channel Scheduling Pipeline */}
                    <div id="scheduling-pipeline" className={`resource-content-card ${themeClass} scroll-mt-28`}>
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
                    </div>

                    {/* 6. Interactive Checklist */}
                    <div id="checklist" className={`resource-content-card ${themeClass} scroll-mt-28`}>
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
                            {checklistTasks.map((task) => {
                                const isChecked = checkedTasks[task.id];
                                return (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`resource-check-item ${isChecked ? "checked" : ""} ${themeClass}`}
                                    >
                                        <div
                                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isChecked
                                                ? "bg-violet-600 border-violet-600 text-white"
                                                : "border-slate-300 dark:border-white/20 bg-white dark:bg-black/20"
                                                }`}
                                        >
                                            {isChecked && <Check size={13} strokeWidth={3} />}
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium ${isChecked ? "line-through opacity-70" : ""}`}>
                                            {task.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reader Feedback Reaction */}
                    <div
                        className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? "bg-slate-50/80 border-slate-200" : "bg-[#100E19] border-white/10"
                            }`}
                    >
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
                <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
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
                    <div
                        className={`p-5 rounded-2xl border text-center ${isLight
                            ? "bg-violet-50/60 border-violet-200 text-slate-800"
                            : "bg-violet-950/20 border-violet-500/20 text-slate-200"
                            }`}
                    >
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
                </aside>
            </div>
        </section>
    );
}
