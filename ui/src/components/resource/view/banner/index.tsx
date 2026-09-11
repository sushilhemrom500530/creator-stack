"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/mode-theme";
import {
    ArrowLeft,
    Clock,
    Calendar,
    Share2,
    Bookmark,
    Check,
    ChevronRight,
    UserCheck,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import "./index.css";

interface BannerSectionProps {
    resourceId?: string;
}

export default function BannerSection({ resourceId = "1525" }: BannerSectionProps) {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    return (
        <section className={`resource-banner-section ${themeClass}`}>
            {/* Ambient Background Glows */}
            <div className={`resource-banner-glow-left ${themeClass}`} />
            <div className={`resource-banner-glow-right ${themeClass}`} />

            {/* Breadcrumbs & Back Navigation */}
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

            {/* Eyebrow Badge */}
            <div className={`resource-hero-badge ${themeClass}`}>
                <span className="resource-badge-dot" />
                <span>GUIDE #{resourceId} &bull; ONBOARDING &bull; VERIFIED 2026</span>
            </div>

            {/* Title */}
            <h1 className={`resource-banner-title ${themeClass}`}>
                Onboarding Workshop: Architecting Your{" "}
                <span className={`resource-banner-title-gradient ${themeClass}`}>
                    Multi-Channel
                </span>{" "}
                Social Pipeline with AI
            </h1>

            {/* Subtitle */}
            <p className={`resource-banner-subtitle ${themeClass}`}>
                A comprehensive blueprint to connect your primary creator accounts, calibrate a bespoke
                AI voice persona, and automate cross-platform publication with precision engagement analytics.
            </p>

            {/* Author / Metadata / Actions Bar */}
            <div className={`resource-meta-bar ${themeClass}`}>
                {/* Author Card */}
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

                {/* Badges */}
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

                {/* Interactive Share / Bookmark */}
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

            {/* Feature Graphic */}
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
        </section>
    );
}
