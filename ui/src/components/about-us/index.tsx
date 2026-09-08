"use client";

import { useTheme } from "@/providers/mode-theme";
import Link from "next/link";
import {
    Sparkles,
    TrendingUp,
    Users,
    ShieldCheck,
    Zap,
    Globe,
    ArrowRight,
    Compass,
    Layers,
    Cpu,
    CheckCircle2,
    Award,
    ExternalLink,
    Code2,
    BrainCircuit,
    Workflow,
    Target,
    Activity,
    Lock
} from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import "./index.css";

const STATS = [
    { value: "12.4M+", label: "Posts Orchestrated", change: "+34% YoY" },
    { value: "140+", label: "Global Creator Markets", change: "6 Continents" },
    { value: "99.98%", label: "Real-Time Sync SLA", change: "Enterprise Uptime" },
    { value: "4.6x", label: "Audience Growth Velocity", change: "Avg. Creator Lift" },
];

const CORE_VALUES = [
    {
        title: "Radical Autonomy",
        desc: "We automate repetitive distribution and scheduling so creators can redirect 100% of their cognitive energy toward authentic storytelling.",
        icon: Zap,
        colorClass: "is-violet",
        badge: "Independence",
        lightBg: "bg-violet-100 text-violet-700",
        darkBg: "bg-violet-500/20 text-[#D4B5FF]",
    },
    {
        title: "Architectural Rigor",
        desc: "Our platform is engineered with zero-compromise microservices, sub-second queue pipelines, and end-to-end cryptographic verification.",
        icon: Cpu,
        colorClass: "is-cyan",
        badge: "Reliability",
        lightBg: "bg-cyan-100 text-cyan-700",
        darkBg: "bg-cyan-500/20 text-cyan-400",
    },
    {
        title: "Empathetic Innovation",
        desc: "We co-develop every workflow alongside active creators, digital studios, and media powerhouses who operate on the front lines of culture.",
        icon: Target,
        colorClass: "is-orange",
        badge: "Community First",
        lightBg: "bg-orange-100 text-orange-700",
        darkBg: "bg-orange-500/20 text-[#FF8A65]",
    },
    {
        title: "Auditable Intelligence",
        desc: "We reject black-box algorithms. Our AI provides explainable audience insights, predictive hooks, and transparent engagement loop metrics.",
        icon: BrainCircuit,
        colorClass: "is-emerald",
        badge: "Transparency",
        lightBg: "bg-emerald-100 text-emerald-700",
        darkBg: "bg-emerald-500/20 text-emerald-400",
    },
];

const TECH_PILLARS = [
    {
        title: "Omni-Channel Sync Matrix",
        desc: "Unified ingestion and bi-directional synchronization across Meta, TikTok, YouTube, X, Threads, and LinkedIn with zero payload loss.",
        icon: Workflow,
        metric: "< 85ms Sync Latency",
        tags: ["Distributed Webhooks", "Idempotent Queues", "Rate-limit Balancer"],
    },
    {
        title: "Predictive Neural Engine",
        desc: "Real-time engagement forecasting that pinpoints optimal distribution windows and generates resonant content variations.",
        icon: Sparkles,
        metric: "92.4% Trend Accuracy",
        tags: ["Semantic Clustering", "Audience Topology", "Virality Scoring"],
    },
    {
        title: "Sovereign Security Vault",
        desc: "Strict tenant isolation, OAuth 2.0 PKCE authentication, and encrypted token stores ensuring your creator assets remain impervious.",
        icon: Lock,
        metric: "SOC2 Type II Ready",
        tags: ["Zero-Knowledge Auth", "Role-Based Access", "GDPR & CCPA"],
    },
];

const TEAM_MEMBERS = [
    {
        name: "Maya Lin",
        role: "Co-Founder & CEO",
        bio: "Former product lead at leading developer infrastructure companies. Passionate about empowering digital entrepreneurs worldwide.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
        name: "Alex Vance",
        role: "Co-Founder & CTO",
        bio: "Distributed systems architect with 12+ years optimizing high-concurrency event pipelines and social graph APIs.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
        name: "Elena Rostova",
        role: "VP of Product & Design",
        bio: "Obsessed with creating frictionless editorial interfaces that feel like second nature for high-output creator teams.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
        name: "Marcus Chen",
        role: "Head of AI & Research",
        bio: "PhD in Natural Language Processing. Pioneering transparent audience resonance models and multimodal content generation.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
        name: "Sarah Jenkins",
        role: "VP of Creator Success",
        bio: "Former executive talent strategist managing digital brands with an aggregate reach of over 250M followers.",
        image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
        social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
        name: "David Becker",
        role: "Lead Systems Architect",
        bio: "Specializes in multi-region failover, Kubernetes orchestration, and real-time streaming infrastructure.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        social: { twitter: "#", linkedin: "#", github: "#" },
    },
];

const MILESTONES = [
    {
        year: "2022",
        title: "The Problem & Founding",
        desc: "Started by creator-engineers tired of jumping across seven different social dashboards with incompatible scheduling limits.",
        tag: "Inception",
    },
    {
        year: "2023",
        title: "V1 Launch & Omni-Sync",
        desc: "Released our unified scheduling engine supporting Instagram, TikTok, YouTube, and X with atomic queue management.",
        tag: "Platform Beta",
    },
    {
        year: "2024",
        title: "Neural Content Engine",
        desc: "Introduced predictive virality loop analysis and automatic format re-framing for multi-platform distribution.",
        tag: "AI Integration",
    },
    {
        year: "2025",
        title: "Enterprise Ecosystem",
        desc: "Surpassed 12M+ posts orchestrated, introducing multi-seat team governance, custom webhook events, and SOC2 compliance.",
        tag: "Global Expansion",
    },
];

export default function AboutUs() {
    const { theme } = useTheme();
    const isLight = theme === "light";
    const themeClass = isLight ? "is-light" : "is-dark";

    return (
        <main className={`about-page-main ${themeClass}`}>
            {/* Hero Section */}
            <section className="about-hero-section">
                {/* Background Ambient Glows */}
                <div className="about-hero-glow">
                    <div className={`about-hero-glow-blob ${themeClass}`} />
                </div>
                <div className={`about-hero-glow-secondary ${themeClass}`} />

                <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                    {/* Eyebrow Pill */}
                    <div className={`about-tagline-badge ${themeClass}`}>
                        <span className="about-tagline-dot" />
                        <span className={`about-tagline-text ${themeClass}`}>
                            About Creator Stack
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className={`about-heading ${themeClass}`}>
                        Architecting the Next Era of{" "}
                        <span className={`about-gradient-text ${themeClass}`}>
                            Social Intelligence
                        </span>
                    </h1>

                    {/* Mission Lead */}
                    <p className={`about-desc ${themeClass}`}>
                        We believe that creators and forward-thinking enterprises deserve intelligent tools that amplify human intuition rather than drown it in fragmented dashboards. We engineered the unified cognitive backbone for modern social orchestration.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/solutions" className={`about-btn-primary ${themeClass}`}>
                            Explore Our Platform
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/pricing" className={`about-btn-secondary ${themeClass}`}>
                            View Pricing Plans
                        </Link>
                    </div>
                </div>
            </section>

            {/* Metrics Strip */}
            <div className="about-stats-container">
                <div className={`about-stats-grid ${themeClass}`}>
                    {STATS.map((stat, idx) => (
                        <div key={idx} className="about-stat-item">
                            <div className={`about-stat-value ${themeClass}`}>
                                {stat.value}
                            </div>
                            <div className={`about-stat-label ${themeClass}`}>
                                {stat.label}
                            </div>
                            <span className="text-[11px] font-semibold text-violet-500 mt-1">
                                {stat.change}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Story & Origin Section */}
            <section className={`about-section ${themeClass}`}>
                <div className="about-story-grid">
                    <div className="about-story-text-col">
                        <div className={`about-tagline-badge ${themeClass} !mb-2 !self-start`}>
                            <span className="about-tagline-dot" />
                            <span className={`about-tagline-text ${themeClass}`}>
                                Origin & Mission
                            </span>
                        </div>
                        <h2 className={`text-3xl md:text-5xl font-bold font-serif tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                            Built for Creators Who Refuse to Compromise
                        </h2>
                        <p className={`about-story-paragraph ${themeClass}`}>
                            The creator economy revolutionized media, but it introduced unprecedented operational friction. Creators and media houses were spending up to 60% of their creative working hours manually reframing media, decoding erratic algorithm updates, and switching between a dozen incompatible platform consoles.
                        </p>
                        <p className={`about-story-paragraph ${themeClass}`}>
                            We asked a fundamental question: <strong className={isLight ? "text-slate-900 font-semibold" : "text-white font-semibold"}>What if your distribution layer operated with the precision and autonomy of a modern financial engine?</strong>
                        </p>
                        <p className={`about-story-paragraph ${themeClass}`}>
                            In 2022, Creator Stack was created to bridge this exact gap. By coupling deep API integrations with predictive neural analysis, we turned unpredictable platform broadcasting into a structured, scalable discipline.
                        </p>

                        <div className={`about-story-highlight ${themeClass}`}>
                            <Compass className="w-6 h-6 text-violet-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-base mb-1">Our Core Commitment</h4>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    Never compromise creator ownership. We don't lock your audience behind walled gardens — we provide the sovereign tools that give you direct, omni-channel reach.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Architecture Graphic Visual */}
                    <div className="about-story-visual-col">
                        <div className={`about-story-card ${themeClass}`}>
                            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-700" : "text-white"}`}>
                                        Creator Stack Engine V2.8
                                    </span>
                                </div>
                                <span className={`text-[11px] px-2.5 py-1 rounded-full font-mono ${isLight ? "bg-slate-100 text-slate-600" : "bg-white/10 text-[#C49BFF]"}`}>
                                    Status: Optimal
                                </span>
                            </div>

                            <div className="space-y-4 font-mono text-xs">
                                <div className={`p-4 rounded-xl border flex items-center justify-between ${isLight ? "bg-slate-50/80 border-slate-200 text-slate-700" : "bg-white/5 border-white/5 text-slate-300"}`}>
                                    <span className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-violet-500" />
                                        Cross-Platform Pipeline
                                    </span>
                                    <span className="text-emerald-500 font-bold">Synchronized</span>
                                </div>

                                <div className={`p-4 rounded-xl border flex items-center justify-between ${isLight ? "bg-slate-50/80 border-slate-200 text-slate-700" : "bg-white/5 border-white/5 text-slate-300"}`}>
                                    <span className="flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-cyan-500" />
                                        Neural Virality Scoring
                                    </span>
                                    <span className="text-cyan-500 font-bold">Active (0.94 Match)</span>
                                </div>

                                <div className={`p-4 rounded-xl border flex items-center justify-between ${isLight ? "bg-slate-50/80 border-slate-200 text-slate-700" : "bg-white/5 border-white/5 text-slate-300"}`}>
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                                        OAuth Token Guardian
                                    </span>
                                    <span className="text-purple-400 font-bold">Secured & Encrypted</span>
                                </div>
                            </div>

                            {/* Connected Social Nodes */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <span className={`text-[11px] uppercase tracking-widest font-bold block mb-3 ${isLight ? "text-slate-500" : "text-[#9c93ab]"}`}>
                                    Integrated Ecosystem
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {["Instagram", "TikTok", "YouTube", "X / Twitter", "LinkedIn", "Threads", "Facebook"].map((platform) => (
                                        <span
                                            key={platform}
                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${isLight
                                                ? "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                                }`}
                                        >
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className={`about-section ${themeClass}`}>
                <div className="about-section-header">
                    <span className={`about-section-eyebrow text-violet-500`}>
                        Our Guiding Principles
                    </span>
                    <h2 className={`about-section-title ${themeClass}`}>
                        The Standards That Guide Every Release
                    </h2>
                    <p className={`about-section-subtitle ${themeClass}`}>
                        These are not decorative slogans. They are the rigorous engineering and ethical benchmarks we use every day to evaluate product decisions.
                    </p>
                </div>

                <div className="about-values-grid">
                    {CORE_VALUES.map((val, idx) => {
                        const IconComponent = val.icon;
                        return (
                            <div key={idx} className={`about-value-card ${themeClass}`}>
                                <div>
                                    <div className={`about-value-icon ${isLight ? val.lightBg : val.darkBg}`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-widest uppercase text-violet-500 mb-2 block">
                                        {val.badge}
                                    </span>
                                    <h3 className={`about-value-title ${themeClass}`}>
                                        {val.title}
                                    </h3>
                                </div>
                                <p className={`about-value-desc ${themeClass} mt-4`}>
                                    {val.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Technical Innovation & Architecture */}
            <section className={`about-section ${themeClass}`}>
                <div className="about-section-header">
                    <span className={`about-section-eyebrow text-cyan-500`}>
                        Platform Engineering
                    </span>
                    <h2 className={`about-section-title ${themeClass}`}>
                        Built for Unrivaled Speed and Precision
                    </h2>
                    <p className={`about-section-subtitle ${themeClass}`}>
                        Beneath our intuitive user experience lies a battle-hardened distributed backend engineered for high-throughput media orchestration.
                    </p>
                </div>

                <div className="about-tech-grid">
                    {TECH_PILLARS.map((tech, idx) => {
                        const Icon = tech.icon;
                        return (
                            <div key={idx} className={`about-tech-card ${themeClass}`}>
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className={`text-xl font-bold font-serif mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
                                        {tech.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-[#a19bb0]"}`}>
                                        {tech.desc}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {tech.tags.map((t, i) => (
                                            <span
                                                key={i}
                                                className={`text-[11px] px-2.5 py-1 rounded-md font-medium ${isLight
                                                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                                                    : "bg-white/5 text-[#C49BFF] border border-white/10"
                                                    }`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className={`about-tech-metric ${themeClass}`}>
                                        <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                                            Benchmark
                                        </span>
                                        <span className="text-xs font-bold text-violet-500">
                                            {tech.metric}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Leadership & Builders */}
            <section className={`about-section ${themeClass}`}>
                <div className="about-section-header">
                    <span className={`about-section-eyebrow text-[#FF8A65]`}>
                        The Collective
                    </span>
                    <h2 className={`about-section-title ${themeClass}`}>
                        Meet the Minds Behind Creator Stack
                    </h2>
                    <p className={`about-section-subtitle ${themeClass}`}>
                        We are a distributed team of engineers, designers, and creator economy strategists united by a shared obsession with craft and high performance.
                    </p>
                </div>

                <div className="about-team-grid">
                    {TEAM_MEMBERS.map((member, idx) => (
                        <div key={idx} className={`about-team-card ${themeClass}`}>
                            <div className={`about-team-avatar-wrapper ${themeClass}`}>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="about-team-avatar"
                                />
                            </div>
                            <h3 className={`about-team-name ${themeClass}`}>
                                {member.name}
                            </h3>
                            <span className={`about-team-role ${themeClass}`}>
                                {member.role}
                            </span>
                            <p className={`about-team-bio ${themeClass}`}>
                                {member.bio}
                            </p>
                            <div className={`about-team-socials ${themeClass}`}>
                                <a href={member.social.twitter} aria-label="Twitter" className={`about-team-social-link ${themeClass}`}>
                                    <FaXTwitter className="w-3.5 h-3.5" />
                                </a>
                                <a href={member.social.linkedin} aria-label="LinkedIn" className={`about-team-social-link ${themeClass}`}>
                                    <FaLinkedin className="w-3.5 h-3.5" />
                                </a>
                                <a href={member.social.github} aria-label="GitHub" className={`about-team-social-link ${themeClass}`}>
                                    <FaGithub className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Milestone Journey */}
            <section className={`about-section ${themeClass}`}>
                <div className="about-section-header">
                    <span className={`about-section-eyebrow text-violet-500`}>
                        Our Path
                    </span>
                    <h2 className={`about-section-title ${themeClass}`}>
                        Key Milestones in Our Evolution
                    </h2>
                    <p className={`about-section-subtitle ${themeClass}`}>
                        From early prototypes testing multi-platform webhook synchronization to an enterprise-grade engine orchestrating millions of posts.
                    </p>
                </div>

                <div className="about-timeline-wrapper">
                    <div className={`about-timeline-line ${themeClass}`} />

                    <div className="space-y-8">
                        {MILESTONES.map((m, idx) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <div
                                    key={idx}
                                    className={`about-timeline-item ${isEven ? "md:flex-row-reverse" : ""}`}
                                >
                                    <div className={`about-timeline-badge ${themeClass}`}>
                                        <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                                    </div>

                                    <div
                                        className={`about-timeline-content ${themeClass} ${isEven ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left"
                                            }`}
                                    >
                                        <div className={`flex items-center gap-3 mb-2 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                                            <span className="text-xl font-bold font-serif text-violet-500">
                                                {m.year}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${isLight ? "bg-violet-100 text-violet-800" : "bg-white/10 text-[#DDB9FF]"}`}>
                                                {m.tag}
                                            </span>
                                        </div>
                                        <h4 className={`text-lg font-bold font-serif mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                                            {m.title}
                                        </h4>
                                        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-[#a19bb0]"}`}>
                                            {m.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta-section">
                <div className={`about-cta-card ${themeClass}`}>
                    <div className="about-cta-glow" />

                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                        <span className="text-xs font-bold tracking-widest uppercase mb-4 text-[#DDB9FF]">
                            Join The Movement
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 tracking-tight">
                            Ready to Elevate Your Social Infrastructure?
                        </h2>
                        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Experience the power of autonomous synchronization, predictive engagement, and unified creator analytics. Start your 14-day free trial today.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/pricing"
                                className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-white text-slate-950 hover:bg-slate-100 transition-all duration-300 shadow-xl cursor-pointer hover:scale-[1.02]"
                            >
                                Start Free 14-Day Trial
                            </Link>
                            <Link
                                href="/solutions"
                                className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                            >
                                Explore Solutions
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
